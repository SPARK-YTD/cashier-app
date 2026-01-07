/*********************************
 * Get-Break | Daily Close Report
 *********************************/

document.addEventListener("DOMContentLoaded", () => {

  /* ===== وقت الإقفال ===== */
  const closeTimeEl = document.getElementById("closeTime");
  if (closeTimeEl) {
    closeTimeEl.textContent =
      "🕒 وقت الإقفال: " + new Date().toLocaleString("ar-BH");
  }

  /* ===== جلب الطلبات المكتملة ===== */
  const orders =
    JSON.parse(localStorage.getItem("dailyOrders")) || [];

  const ordersCountEl = document.getElementById("ordersCount");
  const totalSalesEl  = document.getElementById("totalSales");
  const itemsReportEl = document.getElementById("itemsReport");
  const topItemEl     = document.getElementById("topItem");

  /* ===== لو ما فيه طلبات ===== */
  if (orders.length === 0) {
    ordersCountEl.textContent = "0";
    totalSalesEl.textContent = "0.000 د.ب";
    if (itemsReportEl) {
      itemsReportEl.innerHTML =
        "<tr><td colspan='3'>لا توجد بيانات</td></tr>";
    }
    if (topItemEl) topItemEl.textContent = "—";
    return;
  }

  /* ===== حساب البيانات ===== */
  let totalSales = 0;
  const itemsMap = {};

  orders.forEach(order => {
    totalSales += order.total;

    order.items.forEach(item => {
      if (!itemsMap[item.name]) {
        itemsMap[item.name] = {
          qty: 0,
          total: 0
        };
      }
      itemsMap[item.name].qty += item.qty;
      itemsMap[item.name].total += item.qty * item.price;
    });
  });

  /* ===== عرض الملخص ===== */
  ordersCountEl.textContent = orders.length;
  totalSalesEl.textContent =
    totalSales.toFixed(3) + " د.ب";

  /* ===== حساب أكثر صنف مبيعًا ===== */
  let topItemName = "—";
  let topQty = 0;

  Object.keys(itemsMap).forEach(name => {
    if (itemsMap[name].qty > topQty) {
      topQty = itemsMap[name].qty;
      topItemName = name;
    }
  });

  if (topItemEl) {
    topItemEl.textContent = topItemName;
  }

  /* ===== عرض جدول الأصناف ===== */
  itemsReportEl.innerHTML = "";

  Object.keys(itemsMap).forEach(name => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${name}</td>
      <td>${itemsMap[name].qty}</td>
      <td>${itemsMap[name].total.toFixed(3)} د.ب</td>
    `;
    itemsReportEl.appendChild(tr);
  });
});

/* ===== أزرار ===== */

function goBack() {
  window.location.href = "index.html";
}

function newDay() {
  if (!confirm("هل تريد بدء يوم جديد؟ سيتم مسح التقرير.")) return;

  localStorage.removeItem("dailyOrders");
  localStorage.removeItem("activeOrders");

  alert("تم بدء يوم جديد");
  window.location.href = "index.html";
}

function downloadPDF() {
  window.print();
}
