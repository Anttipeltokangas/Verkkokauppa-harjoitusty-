$(document).ready(function() {
  $("#year").text(new Date().getFullYear());

  if ($("title").text().includes("Tuotteet")) {
    const container = $("#productContainer");
    const favKey = "suosikit";
    const cartKey = "ostoskorini";
    let suosikit = JSON.parse(localStorage.getItem(favKey) || "[]");
    let ostoskori = JSON.parse(localStorage.getItem(cartKey) || "[]");
    let naytaVainSuosikit = false;

    async function loadProducts() {
      try {
        const products = await getAllProducts();
        render(products);

        $("#search").on("input", function() {
          const query = $(this).val().toLowerCase();
          const filtered = products.filter(p => p.title.toLowerCase().includes(query));
          render(filtered);
        });

        $("#toggleFavorites").on("click", function() {
          naytaVainSuosikit = !naytaVainSuosikit;
          $(this).text(naytaVainSuosikit ? "Näytä kaikki tuotteet" : "Näytä vain suosikit");
          const visible = naytaVainSuosikit
            ? products.filter(p => suosikit.includes(p.id))
            : products;
          render(visible);
        });
      } catch (err) {
        container.html("<p>Virhe haettaessa tuotteita.</p>");
      }
    }

    function näytäIlmoitus(teksti) {
      const ilmoitus = $("<div class='toast-ilmoitus'></div>").text(teksti);
      $("body").append(ilmoitus);
      ilmoitus.fadeIn(300);
      setTimeout(() => {
        ilmoitus.fadeOut(500, () => ilmoitus.remove());
      }, 2000);
    }

    function render(products) {
      container.empty();
      if (!products.length) {
        container.html("<p>Ei tuotteita.</p>");
        return;
      }

      products.forEach(p => {
        const onSuosikki = suosikit.includes(p.id);
        const starColor = onSuosikki ? "gold" : "lightgray";
        const cardClass = onSuosikki ? "product-card suosikki" : "product-card";
        container.append(`
          <div class='${cardClass}'>
            <img src='${p.image}' alt='${p.title}'>
            <h4>${p.title}</h4>
            <p>${p.category}</p>
            <p><strong>${p.price} €</strong></p>
            <button class='fav-btn' data-id='${p.id}' style='color:${starColor};font-size:20px;'>⭐</button>
            <button class='add-cart-btn' data-id='${p.id}' data-title='${p.title}' data-price='${p.price}' data-image='${p.image}'>🛒 Lisää koriin</button>
          </div>
        `);
      });

      $(".fav-btn").off("click").on("click", function() {
        const id = parseInt($(this).data("id"));
        if (suosikit.includes(id)) {
          suosikit = suosikit.filter(x => x !== id);
        } else {
          suosikit.push(id);
        }
        localStorage.setItem(favKey, JSON.stringify(suosikit));
        render(products);
      });

      $(".add-cart-btn").off("click").on("click", function() {
        const id = parseInt($(this).data("id"));
        const title = $(this).data("title");
        const price = parseFloat($(this).data("price"));
        const image = $(this).data("image");

        const existing = ostoskori.find(item => item.id === id);
        if (existing) {
          existing.quantity += 1;
        } else {
          ostoskori.push({ id, title, price, image, quantity: 1 });
        }

        localStorage.setItem(cartKey, JSON.stringify(ostoskori));
        näytäIlmoitus(`${title} lisättiin ostoskoriin`);
      });
    }

    loadProducts();
  }

  if ($("title").text().includes("Ostoskori")) {
    const container = $("#cartContainer");
    const totalEl = $("#cartTotal");
    const cartKey = "ostoskorini";
    let ostoskori = JSON.parse(localStorage.getItem(cartKey) || "[]");

    function renderCart() {
      container.empty();
      if (!ostoskori.length) {
        container.html("<p>Ostoskorisi on tyhjä.</p>");
        totalEl.text("");
        return;
      }

      let total = 0;
      ostoskori.forEach(item => {
        total += item.price * item.quantity;
        container.append(`
          <div class='cart'>
            <img src='${item.image}' alt='${item.title}' style='width:80px;height:80px;object-fit:contain;float:left;margin-right:10px;'>
            <h4>${item.title}</h4>
            <p>Määrä: ${item.quantity}</p>
            <p>Hinta: ${(item.price * item.quantity).toFixed(2)} €</p>
            <button class='remove-btn' data-id='${item.id}'>Poista</button>
            <div style='clear:both;'></div>
          </div>
        `);
      });

      totalEl.html(`<h3>Yhteensä: ${total.toFixed(2)} €</h3>`);

      $(".remove-btn").off("click").on("click", function() {
        const id = parseInt($(this).data("id"));
        ostoskori = ostoskori.filter(item => item.id !== id);
        localStorage.setItem(cartKey, JSON.stringify(ostoskori));
        renderCart();
      });
    }

    renderCart();
  }

  if ($("title").text().includes("Tietoa")) {
    $("#contactForm").on("submit", function(e) {
      e.preventDefault();
      const name = $("#name").val().trim();
      const email = $("#email").val().trim();
      const msg = $("#message").val().trim();
      if (!name || !email || !msg) {
        $("#formStatus").text("Täytä kaikki kentät.").css("color", "red");
        return;
      }
      $("#formStatus").text("Kiitos viestistä! (Demo)").css("color", "green");
      this.reset();
    });
  }
});
