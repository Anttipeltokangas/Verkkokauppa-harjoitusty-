const API_BASE = "https://fakestoreapi.com";

async function getAllCarts() {
  const res = await fetch(`${API_BASE}/carts`);
  if (!res.ok) throw new Error("Virhe haettaessa ostoskoreja");
  return await res.json();
}

async function getCart(id) {
  const res = await fetch(`${API_BASE}/carts/${id}`);
  if (!res.ok) throw new Error("Virhe haettaessa ostoskoria");
  return await res.json();
}

async function getAllProducts() {
  const res = await fetch(`${API_BASE}/products`);
  if (!res.ok) throw new Error("Virhe haettaessa tuotteita");
  return await res.json();
}

async function getProduct(id) {
  const res = await fetch(`${API_BASE}/products/${id}`);
  if (!res.ok) throw new Error("Virhe haettaessa tuotetta");
  return await res.json();
}
