// ---------- DỮ LIỆU ----------
const products = [
  { id: 1, name: "Bánh tráng trộn", price: 15000, image: "images/banhtrangtron.jfif" },
  { id: 2, name: "Trà sữa trân châu", price: 30000, image: "images/trasua.jfif" },
  { id: 3, name: "Bắp xào tôm khô", price: 20000, image: "images/bapxao.jfif" },
  { id: 4, name: "Khoai tây chiên", price: 25000, image: "images/khoaitaychien.jfif" },
  { id: 5, name: "Cá viên chiên", price: 20000, image: "images/cavienchien.jfif" },
  { id: 6, name: "Phô mai que", price: 25000, image: "images/phomaique.jpg" },
  { id: 7, name: "Gà rán mini", price: 35000, image: "images/garan.jpg" },
  { id: 8, name: "Xúc xích nướng", price: 20000, image: "images/xucxich.jpg" },
  { id: 9, name: "Nem chua rán", price: 25000, image: "images/nemchua.jpg" },
  { id: 10, name: "Trà đào cam sả", price: 28000, image: "images/tradao.jpg" },
  { id: 11, name: "Sữa tươi trân châu đường đen", price: 32000, image: "images/suatrua.jpg" },
  { id: 12, name: "Chè khúc bạch", price: 25000, image: "images/chekhuubach.jpg" },
  { id: 13, name: "Bánh flan", price: 12000, image: "images/banhflan.jpg" },
  { id: 14, name: "Bánh chuối chiên", price: 10000, image: "images/chuoi.jpg" },
  { id: 15, name: "Bánh tiêu", price: 5000, image: "images/banhtieu.jpg" },
  { id: 16, name: "Bánh gạo cay", price: 18000, image: "images/banhgao.jpg" },
  { id: 17, name: "Tào phớ", price: 15000, image: "images/taopho.jpg" },
  { id: 18, name: "Chân gà sả tắc", price: 40000, image: "images/changa.jpg" },
  { id: 19, name: "Khô gà lá chanh", price: 35000, image: "images/khoga.jpg" },
  { id: 20, name: "Sữa chua dẻo", price: 15000, image: "images/suachuadeo.jpg" },
  { id: 21, name: "Trà tắc", price: 15000, image: "images/tratac.jpg" },
  { id: 22, name: "Cà phê sữa", price: 15000, image: "images/caphesua.jpg" },
  { id: 23, name: "Cà phê muối", price: 22000, image: "images/caphemo.jpg" }
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
      <img src="${p.image}" alt="${p.name}" style="width: 100%; height: 150px; object-fit: cover; border-radius: 8px;">
      <h3>${p.name}</h3>
      <p>${p.price.toLocaleString()}₫</p>
      <button onclick="addToCart(${p.id})">Thêm vào giỏ</button>
    `;
    list.appendChild(div);
  });

  updateCount();
}

// ---------- GIỎ HÀNG ----------
function addToCart(id) {
  const sp = products.find(p => p.id === id);
  const item = cart.find(i => i.id === id);
  if (item) item.qty++;
  else cart.push({ ...sp, qty: 1 });

  localStorage.setItem("cart", JSON.stringify(cart));
  updateCount();
}

function updateCount() {
  const count = cart.reduce((sum, i) => sum + i.qty, 0);
  const cc = document.getElementById("cart-count");
  if (cc) cc.textContent = count;
}

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

  const t = document.getElementById("total");
  if (t) t.textContent = total.toLocaleString() + "₫";
  const tq = document.getElementById("total-qty");
  if (tq) tq.textContent = totalQty;
  const ti = document.getElementById("total-items");
  if (ti) ti.textContent = cart.length;
}

function removeItem(id) {
  cart = cart.filter(i => i.id !== id);
  localStorage.setItem("cart", JSON.stringify(cart));
  renderCart();
  updateCount();
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
