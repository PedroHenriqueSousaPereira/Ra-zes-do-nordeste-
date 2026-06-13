function renderCart() {
  const list = document.querySelector("[data-cart-list]");
  const summary = document.querySelector("[data-cart-summary]");
  if (!list || !summary) return;

  const items = getCartItems();
  if (!items.length) {
    list.innerHTML = '<div class="notice">Seu carrinho esta vazio. Volte ao cardapio para adicionar produtos.</div>';
    summary.innerHTML = `
      <h3>Resumo</h3>
      <p>Nenhum item selecionado.</p>
      <a class="btn btn-primary" href="cardapio.html">Ver cardapio</a>
    `;
    return;
  }

  list.innerHTML = items.map((item) => `
    <article class="cart-line">
      <div>
        <h3>${item.name}</h3>
        <p>${money(item.price)} cada</p>
      </div>
      <div class="qty-controls">
        <button data-dec="${item.id}" aria-label="Diminuir quantidade">-</button>
        <strong>${item.qty}</strong>
        <button data-inc="${item.id}" aria-label="Aumentar quantidade">+</button>
      </div>
    </article>
  `).join("");

  summary.innerHTML = `
    <h3>Resumo</h3>
    <p>Unidade: <strong>${getSelectedUnit().name}</strong></p>
    <p>Total de itens: <strong>${items.reduce((sum, item) => sum + item.qty, 0)}</strong></p>
    <p class="price">${money(cartTotal())}</p>
    <a class="btn btn-primary" href="checkout.html">Finalizar pedido</a>
  `;

  list.querySelectorAll("[data-inc]").forEach((button) => {
    button.addEventListener("click", () => {
      addToCart(button.dataset.inc);
      renderCart();
    });
  });

  list.querySelectorAll("[data-dec]").forEach((button) => {
    button.addEventListener("click", () => {
      const cart = getCart();
      const item = cart.find((entry) => entry.id === button.dataset.dec);
      if (!item) return;
      item.qty -= 1;
      setCart(cart.filter((entry) => entry.qty > 0));
      renderCart();
    });
  });
}

function handleCheckout() {
  const form = document.querySelector("[data-checkout-form]");
  const summary = document.querySelector("[data-checkout-summary]");
  if (!form || !summary) return;

  const items = getCartItems();
  summary.innerHTML = items.length
    ? items.map((item) => `<div class="order-line"><span>${item.qty}x ${item.name}</span><strong>${money(item.price * item.qty)}</strong></div>`).join("") + `<p class="price">Total: ${money(cartTotal())}</p>`
    : '<div class="notice">Adicione produtos antes de finalizar.</div>';

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!getCartItems().length) {
      window.location.href = "cardapio.html";
      return;
    }

    const order = {
      id: Math.floor(1000 + Math.random() * 9000),
      items: getCartItems(),
      total: cartTotal(),
      unit: getSelectedUnit().name,
      createdAt: new Date().toISOString(),
      status: "preparo"
    };

    localStorage.setItem("raizes_order", JSON.stringify(order));
    setCart([]);
    window.location.href = "pedido.html";
  });
}

document.addEventListener("DOMContentLoaded", () => {
  renderCart();
  handleCheckout();
});
