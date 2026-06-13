function renderOrderStatus() {
  const target = document.querySelector("[data-order-status]");
  if (!target) return;

  const order = JSON.parse(localStorage.getItem("raizes_order") || "null");
  if (!order) {
    target.innerHTML = `
      <div class="card">
        <h2>Nenhum pedido ativo</h2>
        <p>Finalize uma compra para acompanhar o status do pedido.</p>
        <a class="btn btn-primary" href="cardapio.html">Ir ao cardapio</a>
      </div>
    `;
    return;
  }

  target.innerHTML = `
    <section class="card">
      <span class="tag green">Pedido #${order.id}</span>
      <h2>Pedido em preparo</h2>
      <p>Unidade: <strong>${order.unit}</strong></p>
      <p>Total: <strong>${money(order.total)}</strong></p>
      <div class="status-steps">
        <div class="status-step done"><span class="status-dot">1</span><div><h3>Recebido</h3><p>Seu pedido foi registrado no sistema.</p></div></div>
        <div class="status-step done"><span class="status-dot">2</span><div><h3>Em preparo</h3><p>A cozinha esta preparando os itens.</p></div></div>
        <div class="status-step"><span class="status-dot">3</span><div><h3>Pronto para retirada</h3><p>Aguardando confirmacao da unidade.</p></div></div>
      </div>
    </section>
    <section class="card">
      <h3>Itens</h3>
      ${order.items.map((item) => `<div class="order-line"><span>${item.qty}x ${item.name}</span><strong>${money(item.price * item.qty)}</strong></div>`).join("")}
    </section>
  `;
}

document.addEventListener("DOMContentLoaded", renderOrderStatus);
