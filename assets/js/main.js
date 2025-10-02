$(function () {
  $("#year").text(new Date().getFullYear());

  function fmtEUR(n) {
    return new Intl.NumberFormat("fi-FI", { style: "currency", currency: "EUR" }).format(n);
  }

  function getFavorites() {
    return JSON.parse(localStorage.getItem("favorites") || "[]");
  }
  function setFavorites(arr) {
    localStorage.setItem("favorites", JSON.stringify(arr));
  }

  function getCartLS() {
    return JSON.parse(localStorage.getItem("cart") || "[]");
  }
  function setCartLS(arr) {
    localStorage.setItem("cart", JSON.stringify(arr));
  }

  if ($("#productContainer").length) {
    const container = $("#productContainer");
    let allProducts = [];

    function render(list) {
      const favs = getFavorites();
      const favIds = favs.map(f => f.id);
      container.empty();

      list.forEach(p => {
        const isFav = favIds.includes(p.id);
        const starColor = isFav ? "gold" : "lightgray";

        const html = `
          <div class="product-card">
            <img src="${p.image}" alt="${p.title}">
            <h4>${p.title}</h4>
            <p>${p.category}</p>
            <p><strong>${fmtEUR(p.price)}</strong></p>
            <button class="add-cart" 
                    data-id="${p.id}" 
                    data-title="${p.title}" 
                    data-price="${p.price}" 
                    data-image="${p.image}">
              Lisää koriin
            </button>
            <button class="favorite-btn" 
                    data-id="${p.id}" 
                    style="font-size:20px; border:none; background:transparent; cursor:pointer; color:${starColor}">
              ★
            </button>
            <div class="added-msg" style="display:none; color:green; font-size:0.9rem; margin-top:5px;">Tuote lisätty koriin ✅</div>
          </div>
        `;
        container.append(html);
      });
    }

    async function load() {
      try {
        allProducts = await getAllProducts();
        render(allProducts);

        $("#search").on("input", function () {
          const q = $(this).val().toLowerCase();
          const filtered = allProducts.filter(p => p.title.toLowerCase().includes(q));
          render(filtered);
        });

        $("#showFavorites").on("click", function () {
          const favIds = getFavorites().map(f => f.id);
          const onlyFavs = allProducts.filter(p => favIds.includes(p.id));
          render(onlyFavs);
        });

        $("#showAll").on("click", function () {
          render(allProducts);
        });

        container.on("click", ".favorite-btn", function () {
          const id = Number($(this).data("id"));
          let favs = getFavorites();
          const i = favs.findIndex(f => f.id === id);
          if (i >= 0) {
            favs.splice(i, 1);
          } else {
            const prod = allProducts.find(p => p.id === id);
            if (prod) favs.push({ id: prod.id, title: prod.title });
          }
          setFavorites(favs);
          const q = $("#search").val()?.toLowerCase() || "";
          const current = q ? allProducts.filter(p => p.title.toLowerCase().includes(q)) : allProducts;
          render(current);
        });

        container.on("click", ".add-cart", function () {
          const id = Number($(this).data("id"));
          const title = String($(this).data("title"));
          const price = Number($(this).data("price"));
          const image = String($(this).data("image"));

          let cart = getCartLS();
          const found = cart.find(i => i.id === id);
          if (found) found.quantity += 1;
          else cart.push({ id, title, price, image, quantity: 1 });
          setCartLS(cart);

          const msg = $(this).siblings(".added-msg");
          msg.fadeIn(200);
          setTimeout(() => msg.fadeOut(500), 1500);
        });

      } catch (e) {
        container.html("<p>Virhe tuotteiden latauksessa.</p>");
      }
    }

    load();
  }

  if ($("#cartContainer").length) {
    const container = $("#cartContainer");
    const totalEl = $("#totalPrice");

    function renderCart() {
      const cart = getCartLS();
      container.empty();
      if (cart.length === 0) {
        container.html("<p>Ostoskori on tyhjä.</p>");
        if (totalEl.length) totalEl.text(fmtEUR(0));
        return;
      }
      let total = 0;
      cart.forEach(item => {
        total += item.price * item.quantity;
        const html = `
          <div class="cart">
            <img src="${item.image}" alt="${item.title}" 
                 style="width:60px; height:60px; object-fit:contain; vertical-align:middle; margin-right:10px;">
            <strong>${item.title}</strong><br>
            ${item.quantity} kpl × ${fmtEUR(item.price)}
          </div>
        `;
        container.append(html);
      });
      if (totalEl.length) totalEl.text(fmtEUR(total));
    }

    renderCart();
  }

  if ($("#contactForm").length) {
    $("#contactForm").on("submit", function (e) {
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




