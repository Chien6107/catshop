// ---------- DỮ LIỆU ----------
const products = [
  { id: 1, name: "Áo thun", price: 120000 },
  { id: 2, name: "Quần jeans", price: 250000 },
  { id: 3, name: "Giày thể thao", price: 450000 },
  { id: 4, name: "Mũ lưỡi trai", price: 90000 }
];

let cart = JSON.parse(localStorage.getItem("cart")) || [];

// ---------- ĐĂNG NHẬP & ĐĂNG XUẤT ----------
function checkLogin() {
  if (!localStorage.getItem("loggedIn")) {
    alert("Bạn phải đăng nhập trước!");
    window.location.href = "login.html";
  }
}

function logout() {
  localStorage.removeItem("loggedIn");
  window.location.href = "login.html";
}

// ---------- SẢN PHẨM ----------
function renderProducts() {
  const list = document.getElementById("product-list");
  if (!list) return;

  list.innerHTML = "";
  products.forEach(p => {
    const div = document.createElement("div");
    div.className = "product";
    div.innerHTML = `
      <h3>${p.name}</h3>
      <p>${p.price.toLocaleString()}₫</p>
      <button onclick="addToCart(${p.id})">Thêm vào giỏ</button>
    `;
    list.appendChild(div);
  });

  updateCount();
}

function addToCart(id) {
  const sp = products.find(p => p.id === id);
  const item = cart.find(i => i.id === id);
  if (item) item.qty++;
  else cart.push({ ...sp, qty: 1 });

  localStorage.setItem("cart", JSON.stringify(cart));
  updateCount();
}

// ---------- GIỎ HÀNG ----------
function renderCart() {
  const container = document.getElementById("cart-container");
  if (!container) return;

  let html = "";
  let total = 0;
  let totalQty = 0;

  cart.forEach(item => {
    const itemTotal = item.qty * item.price;
    total += itemTotal;
    totalQty += item.qty;

    html += `
      <div>
        ${item.name} x${item.qty} = ${itemTotal.toLocaleString()}₫ 
        <button onclick="removeItem(${item.id})">❌</button>
      </div>
    `;
  });

  container.innerHTML = html;

  if (document.getElementById("total")) {
    document.getElementById("total").textContent = total.toLocaleString() + "₫";
  }
  if (document.getElementById("total-qty")) {
    document.getElementById("total-qty").textContent = totalQty;
  }
  if (document.getElementById("total-items")) {
    document.getElementById("total-items").textContent = cart.length;
  }
}

function removeItem(id) {
  cart = cart.filter(i => i.id !== id);
  localStorage.setItem("cart", JSON.stringify(cart));
  renderCart();
  updateCount();
}

function updateCount() {
  const count = cart.reduce((sum, i) => sum + i.qty, 0);
  const cc = document.getElementById("cart-count");
  if (cc) cc.textContent = count;
}

// ---------- THANH TOÁN ----------
function checkout() {
  if (cart.length === 0) {
    alert("Giỏ hàng đang trống!");
    return;
  }
  window.location.href = "thanhtoan.html";
}

function handlePayment(event) {
  event.preventDefault();

  const total = cart.reduce((sum, i) => sum + i.qty * i.price, 0);
  const order = {
    id: Date.now(),
    date: new Date().toLocaleString(),
    items: [...cart],
    total: total
  };

  const orders = JSON.parse(localStorage.getItem("orders")) || [];
  orders.push(order);
  localStorage.setItem("orders", JSON.stringify(orders));

  localStorage.setItem("latestOrderId", order.id);

  cart = [];
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCount();

  window.location.href = "hoadon.html";
}

// ---------- HÓA ĐƠN ----------
function renderInvoice() {
  const orderId = localStorage.getItem("latestOrderId");
  if (!orderId) return;

  const orders = JSON.parse(localStorage.getItem("orders")) || [];
  const order = orders.find(o => o.id == orderId);
  if (!order) return;

  document.getElementById("order-id").textContent = order.id;
  document.getElementById("order-date").textContent = order.date;
  document.getElementById("order-total").textContent = order.total.toLocaleString() + "₫";

  const list = document.getElementById("order-items");
  list.innerHTML = "";
  order.items.forEach(item => {
    const li = document.createElement("li");
    li.textContent = `${item.name} x${item.qty} = ${(item.qty * item.price).toLocaleString()}₫`;
    list.appendChild(li);
  });
}

function printInvoiceFromCart() {
  if (cart.length === 0) {
    alert("Không có sản phẩm trong giỏ hàng!");
    return;
  }

  let content = `HÓA ĐƠN TẠM THỜI\n\n`;
  cart.forEach(item => {
    content += `- ${item.name} x${item.qty} = ${(item.qty * item.price).toLocaleString()}₫\n`;
  });
  content += `\nTỔNG TIỀN: ${cart.reduce((sum, i) => sum + i.qty * i.price, 0).toLocaleString()}₫`;

  const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "hoadon_tam.txt";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// ---------- DOANH THU ----------
function renderRevenueReport() {
  const orders = JSON.parse(localStorage.getItem("orders")) || [];
  let totalOrders = orders.length;
  let totalProducts = 0;
  let totalRevenue = 0;

  const orderList = document.getElementById("order-list");
  if (!orderList) return;

  orderList.innerHTML = "";
  orders.forEach(order => {
    let itemList = "";
    order.items.forEach(item => {
      totalProducts += item.qty;
      itemList += `<li>${item.name} x${item.qty} = ${(item.qty * item.price).toLocaleString()}₫</li>`;
    });

    totalRevenue += order.total;

    const div = document.createElement("div");
    div.className = "order";
    div.innerHTML = `
      <h3>Đơn #${order.id} - ${order.date}</h3>
      <ul>${itemList}</ul>
      <p><strong>Tổng:</strong> ${order.total.toLocaleString()}₫</p>
      <hr>
    `;
    orderList.appendChild(div);
  });

  document.getElementById("total-orders").textContent = totalOrders;
  document.getElementById("total-products").textContent = totalProducts;
  document.getElementById("total-revenue").textContent = totalRevenue.toLocaleString() + "₫";
}

// ---------- KHỞI ĐỘNG ----------
window.onload = () => {
  checkLogin();
  renderProducts();
  renderCart();
  renderInvoice();
  renderRevenueReport();
};
