const appState = {
  units: [
    { id: "centro", name: "Unidade Centro", city: "Recife", wait: "25 a 35 min" },
    { id: "boa-viagem", name: "Unidade Boa Viagem", city: "Recife", wait: "30 a 45 min" },
    { id: "olinda", name: "Unidade Olinda", city: "Olinda", wait: "35 a 50 min" }
  ],
  products: [
    {
      id: "sanduba-carne-sol",
      name: "Sanduba de Carne de Sol",
      category: "Sanduiches",
      price: 24.9,
      art: "sanduba",
      description: "Pao macio, carne de sol desfiada, queijo coalho e creme de macaxeira."
    },
    {
      id: "baiao-cremoso",
      name: "Baiao Cremoso",
      category: "Pratos",
      price: 29.9,
      art: "baiao",
      description: "Arroz, feijao verde, queijo coalho, cheiro-verde e manteiga da terra."
    },
    {
      id: "suco-caju",
      name: "Suco de Caju",
      category: "Bebidas",
      price: 8.9,
      art: "suco",
      description: "Suco natural gelado, preparado com polpa de caju e pouco acucar."
    },
    {
      id: "tapioca-queijo",
      name: "Tapioca de Queijo Coalho",
      category: "Lanches",
      price: 16.9,
      art: "tapioca",
      description: "Tapioca fina recheada com queijo coalho tostado e oregano."
    }
  ]
};

function money(value) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function getCart() {
  return JSON.parse(localStorage.getItem("raizes_cart") || "[]");
}

function setCart(cart) {
  localStorage.setItem("raizes_cart", JSON.stringify(cart));
  updateCartCount();
}

function addToCart(productId, qty = 1) {
  const cart = getCart();
  const item = cart.find((entry) => entry.id === productId);
  if (item) {
    item.qty += qty;
  } else {
    cart.push({ id: productId, qty });
  }
  setCart(cart);
}

function getCartItems() {
  return getCart()
    .map((entry) => {
      const product = appState.products.find((item) => item.id === entry.id);
      return product ? { ...product, qty: entry.qty } : null;
    })
    .filter(Boolean);
}

function cartTotal() {
  return getCartItems().reduce((sum, item) => sum + item.price * item.qty, 0);
}

function updateCartCount() {
  const count = getCart().reduce((sum, item) => sum + item.qty, 0);
  document.querySelectorAll("[data-cart-count]").forEach((node) => {
    node.textContent = count;
  });
}

function selectUnit(unitId) {
  localStorage.setItem("raizes_unit", unitId);
}

function getSelectedUnit() {
  const id = localStorage.getItem("raizes_unit") || "centro";
  return appState.units.find((unit) => unit.id === id) || appState.units[0];
}

function renderUnitCards() {
  const target = document.querySelector("[data-units]");
  if (!target) return;

  target.innerHTML = appState.units.map((unit) => `
    <article class="card">
      <span class="tag green">${unit.city}</span>
      <h3>${unit.name}</h3>
      <p>Tempo medio de preparo: ${unit.wait}</p>
      <button class="btn btn-primary" data-select-unit="${unit.id}">Escolher unidade</button>
    </article>
  `).join("");

  target.querySelectorAll("[data-select-unit]").forEach((button) => {
    button.addEventListener("click", () => {
      selectUnit(button.dataset.selectUnit);
      window.location.href = "cardapio.html";
    });
  });
}

function renderMenu() {
  const target = document.querySelector("[data-menu]");
  if (!target) return;

  target.innerHTML = appState.products.map((product) => `
    <article class="card product-card">
      <div class="food-art ${product.art}" role="img" aria-label="${product.name}"></div>
      <div class="product-body">
        <span class="tag">${product.category}</span>
        <h3>${product.name}</h3>
        <p>${product.description}</p>
        <div class="actions">
          <strong class="price">${money(product.price)}</strong>
          <a class="btn btn-secondary" href="produto.html?id=${product.id}">Detalhes</a>
          <button class="btn btn-primary" data-add="${product.id}">Adicionar</button>
        </div>
      </div>
    </article>
  `).join("");

  target.querySelectorAll("[data-add]").forEach((button) => {
    button.addEventListener("click", () => addToCart(button.dataset.add));
  });
}

function renderProductDetail() {
  const target = document.querySelector("[data-product-detail]");
  if (!target) return;

  const params = new URLSearchParams(window.location.search);
  const product = appState.products.find((item) => item.id === params.get("id")) || appState.products[0];

  target.innerHTML = `
    <div class="card product-card">
      <div class="food-art ${product.art}" style="height: 320px" role="img" aria-label="${product.name}"></div>
    </div>
    <div class="card">
      <span class="tag">${product.category}</span>
      <h1>${product.name}</h1>
      <p class="lead">${product.description}</p>
      <p>Unidade selecionada: <strong>${getSelectedUnit().name}</strong></p>
      <strong class="price">${money(product.price)}</strong>
      <div class="actions" style="margin-top: 18px">
        <button class="btn btn-primary" data-add="${product.id}">Adicionar ao carrinho</button>
        <a class="btn btn-ghost" href="cardapio.html">Voltar ao cardapio</a>
      </div>
    </div>
  `;

  target.querySelector("[data-add]").addEventListener("click", () => addToCart(product.id));
}

function handleLogin() {
  const form = document.querySelector("[data-login-form]");
  if (!form) return;

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const role = new FormData(form).get("role");
    localStorage.setItem("raizes_role", role);
    window.location.href = role === "cliente" ? "unidades.html" : "dashboard.html";
  });
}

function markActiveNav() {
  const current = window.location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".nav a").forEach((link) => {
    if (link.getAttribute("href") === current) {
      link.classList.add("active");
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  updateCartCount();
  renderUnitCards();
  renderMenu();
  renderProductDetail();
  handleLogin();
  markActiveNav();
});
