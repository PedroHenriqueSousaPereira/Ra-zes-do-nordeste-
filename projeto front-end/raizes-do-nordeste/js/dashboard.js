const dashboardData = {
  salesToday: 3240.5,
  ordersToday: 128,
  averageTicket: 25.31,
  stockAlerts: 4,
  reports: [
    ["Unidade Centro", "R$ 12.430,00", "482 pedidos", "8,6"],
    ["Unidade Boa Viagem", "R$ 10.850,00", "421 pedidos", "8,2"],
    ["Unidade Olinda", "R$ 8.940,00", "359 pedidos", "8,0"]
  ],
  stock: [
    ["Carne de sol", "18 kg", "OK"],
    ["Queijo coalho", "8 kg", "Atencao"],
    ["Polpa de caju", "32 un.", "OK"],
    ["Goma de tapioca", "5 kg", "Critico"]
  ]
};

function renderDashboard() {
  const target = document.querySelector("[data-dashboard]");
  if (!target) return;

  target.innerHTML = `
    <article class="card metric"><span>Vendas de hoje</span><strong>${money(dashboardData.salesToday)}</strong></article>
    <article class="card metric"><span>Pedidos de hoje</span><strong>${dashboardData.ordersToday}</strong></article>
    <article class="card metric"><span>Ticket medio</span><strong>${money(dashboardData.averageTicket)}</strong></article>
    <article class="card metric"><span>Alertas de estoque</span><strong>${dashboardData.stockAlerts}</strong></article>
  `;
}

function renderReports() {
  const target = document.querySelector("[data-reports]");
  if (!target) return;

  target.innerHTML = dashboardData.reports.map((row) => `
    <tr>
      <td>${row[0]}</td>
      <td>${row[1]}</td>
      <td>${row[2]}</td>
      <td>${row[3]}</td>
    </tr>
  `).join("");
}

function renderStock() {
  const target = document.querySelector("[data-stock]");
  if (!target) return;

  target.innerHTML = dashboardData.stock.map((item) => {
    const tagClass = item[2] === "OK" ? "green" : item[2] === "Critico" ? "danger" : "";
    return `
      <article class="stock-line">
        <div>
          <h3>${item[0]}</h3>
          <p>Quantidade atual: ${item[1]}</p>
        </div>
        <span class="tag ${tagClass}">${item[2]}</span>
      </article>
    `;
  }).join("");
}

document.addEventListener("DOMContentLoaded", () => {
  renderDashboard();
  renderReports();
  renderStock();
});
