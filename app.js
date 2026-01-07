/*********************************
 * Get-Break | Cashier System
 *********************************/

/* ========= DATA ========= */
let items = JSON.parse(localStorage.getItem("items")) || [
  { id: 1, name: "برجر لحم", price: 2.0, category: "food" },
  { id: 2, name: "برجر دجاج", price: 1.8, category: "food" },
  { id: 3, name: "بيبسي", price: 0.5, category: "drinks" },
  { id: 4, name: "بطاطس", price: 0.7, category: "sides" }
];

let cart = [];
let activeOrders = JSON.parse(localStorage.getItem("activeOrders")) || [];
let dailyOrders  = JSON.parse(localStorage.getItem("dailyOrders")) || [];

/* ========= INIT ========= */
document.addEventListener("DOMContentLoaded", () => {
  renderItems("food");
  renderCart();
  renderActiveOrders();

  const paid = document.getElementById("paid");
  if (paid) paid.addEventListener("input", calculateChange);
});

/* ========= CATEGORIES ========= */
function filterCategory(category, btn) {
  document.querySelectorAll(".cat").forEach(b =>
    b.classList.remove("active")
  );
  btn.classList.add("active");
  renderItems(category);
}

/* ========= ITEMS ========= */
function renderItems(category) {
  const container = document.getElementById("items");
  if (!container) return;

  container.innerHTML = "";

  const filtered = items.filter(i => i.category === category);

  if (filtered.length === 0) {
    container.innerHTML = "<p>لا توجد أصناف</p>";
    return;
  }

  filtered.forEach(item => {
    const div = document.createElement("div");
    div.className = "item";
    div.innerHTML = `
      <strong>${item.name}</strong>
      <span>${item.price.toFixed(3)} د.ب</span>
    `;
    div.onclick = () => addToCart(item);
    container.appendChild(div);
  });
}

/* ========= CART ========= */
function addToCart(item) {
  const found = cart.find(i => i.id === item.id);
  if (found) found.qty++;
  else cart.push({ ...item, qty: 1 });
  renderCart();
}

function renderCart() {
  const tbody = document.getElementById("cart");
  if (!tbody) return;

  tbody.innerHTML = "";
  let total = 0;

  cart.forEach((item, index) => {
    const sum = item.qty * item.price;
    total += sum;

    tbody.innerHTML += `
      <tr>
        <td>${item.name}</td>
        <td>
          <button onclick="changeQty(${index},-1)">-</button>
          ${item.qty}
          <button onclick="changeQty(${index},1)">+</button>
        </td>
        <td>${sum.toFixed(3)} د.ب</td>
        <td><button onclick="removeItem(${index})">🗑</button></td>
      </tr>
    `;
  });

  document.getElementById("total").textContent =
    total.toFixed(3) + " د.ب";

  calculateChange();
}

function changeQty(index, delta) {
  cart[index].qty += delta;
  if (cart[index].qty <= 0) cart.splice(index, 1);
  renderCart();
}

function removeItem(index) {
  cart.splice(index, 1);
  renderCart();
}

/* ========= PAYMENT ========= */
function calculateChange() {
  const paid = parseFloat(document.getElementById("paid").value) || 0;
  const total =
    parseFloat(document.getElementById("total").textContent) || 0;

  const change = paid - total;
  document.getElementById("change").textContent =
    change >= 0 && paid > 0 ? change.toFixed(3) + " د.ب" : "—";
}

/* ========= ORDERS ========= */
function completeOrder() {
  if (cart.length === 0) {
    alert("الفاتورة فارغة");
    return;
  }

  const order = {
    id: Date.now(),
    items: JSON.parse(JSON.stringify(cart)),
    total: cart.reduce((s, i) => s + i.price * i.qty, 0),
    time: new Date().toLocaleTimeString("ar-BH"),
    status: "جاري"
  };

  activeOrders.push(order);
  localStorage.setItem("activeOrders", JSON.stringify(activeOrders));

  cart = [];
  renderCart();
  renderActiveOrders();
}

function renderActiveOrders() {
  const box = document.getElementById("activeOrders");
  if (!box) return;

  box.innerHTML = "";

  activeOrders.forEach(order => {
    const div = document.createElement("div");
    div.className = "order-box";
    div.innerHTML = `
      <strong>طلب #${order.id}</strong><br>
      ${order.total.toFixed(3)} د.ب<br>
      <button onclick="viewOrder(${order.id})">عرض</button>
      <button onclick="markCompleted(${order.id})">مكتمل</button>
      <button onclick="cancelOrder(${order.id})">إلغاء</button>
    `;
    box.appendChild(div);
  });
}

function viewOrder(id) {
  const order = activeOrders.find(o => o.id === id);
  if (!order) return;
  cart = JSON.parse(JSON.stringify(order.items));
  renderCart();
}

function markCompleted(id) {
  const order = activeOrders.find(o => o.id === id);
  if (!order) return;

  dailyOrders.push(order);
  activeOrders = activeOrders.filter(o => o.id !== id);

  localStorage.setItem("activeOrders", JSON.stringify(activeOrders));
  localStorage.setItem("dailyOrders", JSON.stringify(dailyOrders));

  cart = [];
  renderCart();
  renderActiveOrders();
}

function cancelOrder(id) {
  activeOrders = activeOrders.filter(o => o.id !== id);
  localStorage.setItem("activeOrders", JSON.stringify(activeOrders));
  renderActiveOrders();
}

/* ========= DAY CLOSE ========= */
function closeDay() {
  const pass = prompt("أدخل كلمة المرور لإقفال اليوم:");
  if (pass !== "1234") {
    alert("كلمة المرور غير صحيحة");
    return;
  }
  window.location.href = "report.html";
}

function goToSettings() {
  window.location.href = "settings.html";
}
