$(document).ready(function() {
  $("#year").text(new Date().getFullYear());

  // Ostoskorisivu (carts.html)
  if ($("title").text().includes("Ostoskorit")) {
    const container = $("#cartContainer");
    const totalEl = $("#totalPrice");

    function renderCart() {
      const cart = JSON.parse(localStorage.getItem("cart")) || [];
      container.empty();

      if (cart.length === 0) {
        container.html("<p>Ostoskori on tyhjä.</p>");
        totalEl.text("0 €");
        return;
      }

      let total = 0;
      cart.forEach(item => {
        total += item.price * item.quantity;
        container.append(`
          <div class='cart'>
            <h4>${item.title}</h4>
            <p>${item.quantity} kpl × ${item.price} €</p>
          </div>
        `);
      });

      totalEl.text(total.toFixed(2) + " €");
    }

    renderCart();
  }

  // Tuotesivu (products.html)
  if ($("title").text().includes("Tuotteet")) {
    const container = $("#productContainer");

    async function loadProducts() {
      try {
        const products = await getAllProducts();
        render(products);

        $("#search").on("input", function() {
          const query = $(this).val().toLowerCase();
          const filtered = products.filter(p => p.title.toLowerCase().includes(query));
          render(filtered);
        });
      } catch {
        container.html("<p>Virhe tuotteiden latauksessa.</p>");
      }
    }

    function render(products) {
      const favorites = JSON.parse(localStorage.getItem("favorites")) || [];
      container.empty();

      products.forEach(p => {
        const isFavorite = favorites.some(f => f.id === p.id);
        const starColor = isFavorite ? "gold" : "gray";

        container.append(`
          <div class='product-card'>
            <img src='${p.image}' alt='${p.title}'>
            <h4>${p.title}</h4>
            <p>${p.category}</p>
            <p><strong>${p.price} €</strong></p>
            <button class='add-cart' data-id='${p.id}' data-title='${p.title}' data-price='${p.price}'>Lisää koriin</button>
            <span class='favorite' data-id='${p.id}' style='cursor:pointer; font-size:22px; color:${starColor}'>★</span>
          </div>
        `);
      });

      $(".add-cart").click(function() {
        const id = $(this).data("id");
        const title = $(this).data("title");
        const price = $(this).data("price");

        let cart = JSON.parse(localStorage.getItem("cart")) || [];
        const existing = cart.find(item => item.id === id);

        if (existing) existing.quantity++;
        else cart.push({ id, title, price, quantity: 1 });

        localStorage.setItem("cart", JSON.stringify(cart));
      });

      $(".favorite").click(function() {
        const id = $(this).data("id");
        const favorites = JSON.parse(localStorage.getItem("favorites")) || [];
        const index = favorites.findIndex(f => f.id === id);

        if (index > -1) favorites.splice(index, 1);
        else {
          const product = products.find(p => p.id === id);
          favorites.push({ id: product.id, title: product.title });
        }

        localStorage.setItem("favorites", JSON.stringify(favorites));
        render(products); // Päivitä värit heti
      });
    }

    loadProducts();
  }

  // Tietoa-sivu (about.html)
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

      $("#formStatus").text("Kiitos viestistä! (Tämä on demo)").css("color", "green");
      this.reset();
    });
  }
});
