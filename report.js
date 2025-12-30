// ================== تحميل بيانات اليوم ==================
const dailyOrders = JSON.parse(localStorage.getItem("dailyOrders")) || [];

const summaryDiv = document.getElementById("summary");
const itemsBody = document.getElementById("itemsReport");

// ================== إعدادات عامة ==================
const closeTime = new Date();
const closeTimeText = closeTime.toLocaleString("ar-BH");

// رقم الوردية (رقم بسيط حسب اليوم)
const shiftNumber =
  localStorage.getItem("shiftNumber") ||
  Math.floor(Date.now() / 1000);

localStorage.setItem("shiftNumber", shiftNumber);

// ================== إذا ما فيه بيانات ==================
if (dailyOrders.length === 0) {
  summaryDiv.innerHTML = "<p>لا توجد بيانات لليوم</p>";
} else {
  buildReport();
}

// ================== بناء التقرير ==================
function buildReport() {
  let totalSales = 0;
  let totalOrders = dailyOrders.length;
  let itemStats = {};

  // ====== تجميع البيانات ======
  dailyOrders.forEach(order => {
    totalSales += order.total;

    order.items.forEach(item => {
      if (!itemStats[item.name]) {
        itemStats[item.name] = {
          qty: 0,
          total: 0
        };
      }
      itemStats[item.name].qty += item.qty;
      itemStats[item.name].total += item.qty * item.price;
    });
  });

  const avgOrder = totalSales / totalOrders;

  // ====== ترتيب الأصناف (الأكثر مبيعاً) ======
  const sortedItems = Object.entries(itemStats).sort(
    (a, b) => b[1].qty - a[1].qty
  );

  const topItem = sortedItems.length ? sortedItems[0][0] : "-";

  // ====== حساب الأرباح (تقديري) ======
  // مثال: نفترض تكلفة 40% من سعر البيع
  const costRate = 0.4;
  const totalCost = totalSales * costRate;
  const netProfit = totalSales - totalCost;

  // ================== عرض الملخص ==================
  summaryDiv.innerHTML = `
    <p>🕒 تاريخ ووقت الإقفال: <strong>${closeTimeText}</strong></p>
    <p>🧾 رقم الوردية: <strong>${shiftNumber}</strong></p>
    <hr>
    <p>📦 عدد الطلبات: <strong>${totalOrders}</strong></p>
    <p>💰 إجمالي المبيعات: <strong>${totalSales.toFixed(3)} د.ب</strong></p>
    <p>📊 متوسط الطلب: <strong>${avgOrder.toFixed(3)} د.ب</strong></p>
    <p>🏆 الأكثر مبيعاً: <strong>${topItem}</strong></p>
    <p>💸 صافي الأرباح (تقديري): 
      <strong>${netProfit.toFixed(3)} د.ب</strong>
    </p>
    <hr>
  `;

  // ================== عرض تفاصيل الأصناف ==================
  itemsBody.innerHTML = "";

  sortedItems.forEach(([name, data]) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${name}</td>
      <td>${data.qty}</td>
      <td>${data.total.toFixed(3)} د.ب</td>
    `;
    itemsBody.appendChild(row);
  });
}

// ================== أزرار ==================
function goBack() {
  window.location.href = "index.html";
}

function newDay() {
  if (confirm("هل أنت متأكد من بدء يوم جديد؟")) {
    localStorage.removeItem("dailyOrders");
    localStorage.removeItem("activeOrders");
    localStorage.removeItem("shiftNumber");
    window.location.href = "index.html";
  }
}

// ================== تحميل PDF ==================
function downloadPDF() {
  window.print();
}
