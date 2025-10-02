$(document).ready(function() {
  $("#year").text(new Date().getFullYear());

  if ($("title").text().includes("Ostoskorit")) {
    const container = $("#cartContainer");
    const loadingEl = $("#loading");
    const errorEl = $("#error");

    function showLoading(on) {
      loadingEl.toggle(on);
    }

    function showError(msg) {
      errorEl.text(msg || "");
    }

    function formatCurrency(value) {
      return new Intl.NumberFormat("fi-FI", { style: "currency", currency: "EUR" }).format(value);
    }

    async function fetchSingleCart(id = 1) {
      showError("");
      showLoading(true);
      try {
        const cart = await getCart(id);
        const detailPromises = cart.products.map(p =>
          getProduct(p.productId).then(prod => ({
            title: prod.title,
            price: prod.price,
            quantity: p.quantity
          }))
        );
        const details = await Promise.all(detailPromises);
        let html = `<div class='cart'><h3>Ostoskori #${cart.id}</h3>`;
        details.forEach(d => {
          html += `<div>${d.title} — ${d.quantity} kpl — ${formatCurrency(d.price)}</div>`;
        });
        html += "</div>";
        container.html(html);
      } catch (err) {
        showError("Virhe: " + err.message);
      } finally {
        showLoading(false);
      }
    }

    async function fetchAllCarts() {
      showError("");
      showLoading(true);
      try {
        const carts = await getAllCarts();
        container.empty();
        for (const cart of carts) {
          const detailPromises = cart.products.map(p =>
            getProduct(p.productId).then(prod => ({
              title: prod.title,
              price: prod.price,
              quantity: p.quantity
            }))
          );
          const details = await Promise.all(detailPromises);
          let html = `<div class='cart'><h3>Ostoskori #${cart.id}</h3>`;
          details.forEach(d => {
            html += `<div>${d.title} — ${d.quantity} kpl — ${formatCurrency(d.price)}</div>`;
          });
          html += "</div>";
          container.append(html);
        }
      } catch (err) {
        showError("Virhe: " + err.message);
      } finally {
        showLoading(false);
      }
    }

    $("#btnSingle").on("click", () => fetchSingleCart(1));
    $("#btnAll").on("click", fetchAllCarts);
  }

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
            <button class='favorite-btn' data-id='${p.id}' style='color:${starColor}'>★</button>
          </div>
        `);
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
