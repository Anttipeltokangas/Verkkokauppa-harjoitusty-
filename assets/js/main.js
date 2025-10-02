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

        $("#showFavorites").click(function() {
          const favorites = JSON.parse(localStorage.getItem("favorites")) || [];
          const favoriteIds = favorites.map(f => f.id);
          const filtered = products.filter(p => favoriteIds.includes(p.id));
          render(filtered);
        });

        $("#showAll").click(function() {
          render(products);
        });
      } catch (err) {
        container.html("<p>Virhe haettaessa tuotteita.</p>");
      }
    }

    function render(products) {
      container.empty();
      const favorites = JSON.parse(localStorage.getItem("favorites")) || [];
      const favoriteIds = favorites.map(f => f.id);

      products.forEach(p => {
        const isFavorite = favoriteIds.includes(p.id);
        const starColor = isFavorite ? "gold" : "lightgray";

        container.append(`
          <div class='product-card'>
            <img src='${p.image}' alt='${p.title}'>
            <h4>${p.title}</h4>
            <p>${p.category}</p>
            <p><strong>${p.price} €</strong></p>
            <button class='add-cart' data-id='${p.id}' data-title='${p.title}' data-price='${p.price}'>Lisää koriin</button>
            <button class='favorite-btn' data-id='${p.id}' style='color:${starColor}; font-size:20px;'>★</button>
          </div>
        `);
      });

      $(".add-cart").click(function() {
        const id = $(this).data("id");
        const title = $(this).data("title");
        const price = $(this).data("price");

        let cart = JSON.parse(localStorage.getItem("cart")) || [];
        const existing = cart.find(item => item.id === id);

        if (existing) {
          existing.quantity++;
        } else {
          cart.push({ id, title, price, quantity: 1 });
        }

        localStorage.setItem("cart", JSON.stringify(cart));
      });

      $(".favorite-btn").click(function() {
        const id = parseInt($(this).data("id"));
        let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
        const exists = favorites.some(f => f.id === id);

        if (exists) {
          favorites = favorites.filter(f => f.id !== id);
        } else {
          const product = products.find(p => p.id === id);
          if (product) favorites.push({ id: product.id, title: product.title });
        }

        localStorage.setItem("favorites", JSON.stringify(favorites));
        render(products);
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
