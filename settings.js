/*********************************
 * Get-Break | Items Admin
 *********************************/

const PASSWORD = "1234"; // غيرها لاحقًا

let items = JSON.parse(localStorage.getItem("items")) || [];

/* ===== تسجيل الدخول ===== */
function login() {
  const pass = document.getElementById("adminPass").value;
  if (pass !== PASSWORD) {
    alert("كلمة المرور غير صحيحة");
    return;
  }

  document.getElementById("loginBox").style.display = "none";
  document.getElementById("adminPanel").style.display = "block";
  renderItems();
}

/* ===== إضافة صنف ===== */
function addItem() {
  const name = document.getElementById("itemName").value.trim();
  const price = parseFloat(document.getElementById("itemPrice").value);
  const category = document.getElementById("itemCategory").value;

  if (!name || isNaN(price)) {
    alert("أدخل الاسم والسعر");
    return;
  }

  const item = {
    id: Date.now(),
    name,
    price,
    category
  };

  items.push(item);
  localStorage.setItem("items", JSON.stringify(items));

  document.getElementById("itemName").value = "";
  document.getElementById("itemPrice").value = "";

  renderItems();
}

/* ===== عرض الأصناف ===== */
function renderItems() {
  const box = document.getElementById("itemsList");
  box.innerHTML = "";

  if (items.length === 0) {
    box.innerHTML = "<p>لا توجد أصناف</p>";
    return;
  }

  items.forEach(item => {
    const div = document.createElement("div");
    div.className = "order-box";
    div.innerHTML = `
      <strong>${item.name}</strong><br>
      ${item.price.toFixed(3)} د.ب — ${item.category}
      <br>
      <button onclick="deleteItem(${item.id})">🗑 حذف</button>
    `;
    box.appendChild(div);
  });
}

/* ===== حذف صنف ===== */
function deleteItem(id) {
  if (!confirm("حذف الصنف؟")) return;
  items = items.filter(i => i.id !== id);
  localStorage.setItem("items", JSON.stringify(items));
  renderItems();
}

/* ===== رجوع ===== */
function goBack() {
  window.location.href = "index.html";
}
