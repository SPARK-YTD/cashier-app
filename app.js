/******************************
 * نظام الكاشير – خذلك بريك
 ******************************/

/* ========= الأصناف ========= */
const items = [
  { id: 1, name: "برجر دجاج", price: 0.600, category: "food" },
  { id: 2, name: "برجر لحم",  price: 0.700, category: "food" },
  { id: 3, name: "باستا كبير",     price: 1.500, category: "food" },
  { id: 4, name: "باستا متوسط",     price: 1.000, category: "food" },
  { id: 5, name: "باستا صغير",     price: 0.500, category: "food" },
  { id: 6, name: "كشري كبير",     price: 1.500, category: "food" },
  { id: 7, name: "كشري متوسط",     price: 1.000, category: "food" },
  { id: 8, name: "كشري صغير",     price: 0.500, category: "food" },
  { id: 9, name: "ساندويش جبن",     price: 0.150, category: "food" },
  { id: 10, name: "ساندويش بيض جبن",     price: 0.250, category: "food" },

  { id: 11, name: "عصير ورد",      price: 0.200, category: "drinks" },
  { id: 12, name: "عصير فيمتو",     price: 0.200, category: "drinks" },
  { id: 13, name: "السي كولا",      price: 0.200, category: "drinks" },
  { id: 14, name: "شاي حليب كبير",     price: 0.200, category: "drinks" },
  { id: 15, name: "شاي حليب صغير ",     price: 0.100, category: "drinks" },
  { id: 16, name: "شاي كبير",     price: 0.200, category: "drinks" },
  { id: 17, name: "شاي صغير ",     price: 0.100, category: "drinks" },
  { id: 18, name: "كرك كراميل كبير",     price: 0.200, category: "drinks" },
  { id: 19, name: "كرك كراميل صغير",     price: 0.100, category: "drinks" },
  { id: 20, name: "كوفي",     price: 0.200, category: "drinks" },

  { id: 21, name: "بطاطس",     price: 0.300, category: "sides" },
  { id: 22, name: "نخج صغير",     price: 0.100, category: "sides" },
  { id: 23, name: "نخج متوسط",     price: 0.200, category: "sides" },
  { id: 24, name: "باقلا صغير",     price: 0.100, category: "sides" },
  { id: 25, name: "باقلا متوسط ",     price: 0.200, category: "sides" },
  { id: 26, name: "اندومي",     price: 0.350, category: "sides" },
  { id: 27, name: "ذرة مشوي",     price: 0.500, category: "sides" },
  { id: 28, name: "كوب ذرة",       price: 0.300, category: "sides" },
  { id: 29, name: "كوب ذرة",       price: 0.500, category: "sides" }
  
];

/* ========= الحالة ========= */
let cart = [];
let activeOrders = JSON.parse(localStorage.getItem("activeOrders")) || [];
let dailyOrders  = JSON.parse(localStorage.getItem("dailyOrders")) || [];

/* ========= تشغيل ========= */
document.addEventListener("DOMContentLoaded", () => {
  renderItems("food");
  renderCart();
  renderActiveOrders();

  document.getElementById("paid").addEventListener("input", calculateChange);
});

/* ========= تبديل الأقسام (مطابق لـ HTML) ========= */
function filterCategory(category, btn) {
  // تفعيل الزر
  document.querySelectorAll(".cat").forEach(b =>
    b.classList.remove("active")
  );
  btn.classList.add("active");

  // عرض الأصناف
  renderItems(category);
}

/* ========= عرض الأصناف ========= */
function renderItems(category) {
  const container = document.getElementById("items");
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
      <strong>${item.name}</strong><br>
      <span>${item.price.toFixed(3)} د.ب</span>
    `;
    div.onclick = () => addToCart(item);
    container.appendChild(div);
  });
}

/* ========= الفاتورة ========= */
function addToCart(item) {
  const found = cart.find(i => i.id === item.id);
  if (found) found.qty++;
  else cart.push({ ...item, qty: 1 });
  renderCart();
}

function renderCart() {
  const tbody = document.getElementById("cart");
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

/* ======== إتمام الطلب ======== */
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

  // أضف للطلبات الجارية فقط
  activeOrders.push(order);
  localStorage.setItem("activeOrders", JSON.stringify(activeOrders));

  // تفريغ الفاتورة
  cart = [];
  renderCart();
  renderActiveOrders();
}




/* ========= الطلبات الجارية ========= */
function renderActiveOrders() {
  const box = document.getElementById("activeOrders");
  if (!box) return;

  box.innerHTML = "";

  activeOrders.forEach(order => {
    const div = document.createElement("div");
    div.className = "order-box";
    div.innerHTML = `
      <strong>طلب #${order.id}</strong><br>
      الإجمالي: ${order.total.toFixed(3)} د.ب<br>
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

  // إضافة الطلب للتقرير اليومي
  dailyOrders.push(order);

  // حذف الطلب من الطلبات الجارية
  activeOrders = activeOrders.filter(o => o.id !== id);

  // حفظ التحديثات
  localStorage.setItem("activeOrders", JSON.stringify(activeOrders));
  localStorage.setItem("dailyOrders", JSON.stringify(dailyOrders));

  // 🔴 الحل الأساسي
  cart = [];          // تفريغ الفاتورة
  renderCart();       // إعادة رسم الفاتورة
  renderActiveOrders();
}



function cancelOrder(id) {
  activeOrders = activeOrders.filter(o => o.id !== id);
  localStorage.setItem("activeOrders", JSON.stringify(activeOrders));

  cart = [];          // تفريغ الفاتورة
  renderCart();
  renderActiveOrders();
}

/* ========= حساب الباقي ========= */
function calculateChange() {
  const paidInput = document.getElementById("paid");
  const totalText = document.getElementById("total").textContent;

  const paid = parseFloat(paidInput.value) || 0;
  const total = parseFloat(totalText) || 0;

  const changeEl = document.getElementById("change");
  const change = paid - total;

  if (change >= 0 && paid > 0) {
    changeEl.textContent = change.toFixed(3) + " د.ب";
  } else {
    changeEl.textContent = "—";
  }
}

/* ========= إقفال اليوم ========= */
function closeDay() {
  const pass = prompt("أدخل كلمة المرور لإقفال اليوم:");
  if (pass !== "1234") {
    alert("كلمة المرور غير صحيحة");
    return;
  }
  window.location.href = "report.html";
}
