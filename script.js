let currentUser = "";
let items = JSON.parse(localStorage.getItem("items")) || [];
const market = document.getElementById("market");
const sellerList = document.getElementById("sellerList");
// Login
function login() {
  currentUser = document.getElementById("usernameInput").value;
  document.getElementById("welcomeMsg").innerText = `Welcome ${currentUser}`;
}
// Add item
function addItem() {
  if (!currentUser) return alert("Login first");
  const imageFile = document.getElementById("itemImage").files[0];
  const reader = new FileReader();
  reader.onload = () => {
    const item = {
      name: itemName.value,
      price: itemPrice.value,
      location: itemLocation.value,
      category: itemCategory.value,
      desc: itemDesc.value,
      seller: currentUser,
      image: reader.result,
      messages: []
    };
    items.push(item);
    localStorage.setItem("items", JSON.stringify(items));
    renderMarket(items);
    renderSellers();
  };
  if (imageFile) reader.readAsDataURL(imageFile);
}
// Render market
function renderMarket(list) {
  market.innerHTML = "";
  list.forEach((item, index) => {
    market.innerHTML += `
      <div class="card">
        <img src="${item.image}">
        <h3>${item.name}</h3>
        <p>₹ ${item.price}</p>
        <p>${item.category}</p>
        <p>${item.location}</p>
        <p>${item.desc}</p>
        <p><strong>Seller:</strong> ${item.seller}</p>
        <button onclick="contactSeller(${index})">Message Seller</button>
      </div>
    `;
  });
}
// Sellers list
function renderSellers() {
  sellerList.innerHTML = "";
  [...new Set(items.map(i => i.seller))].forEach(seller => {
    const li = document.createElement("li");
    li.innerText = seller;
    li.onclick = () => filterSeller(seller);
    sellerList.appendChild(li);
  });
}
// Filter seller
function filterSeller(name) {
  renderMarket(items.filter(i => i.seller === name));
}
// Search
function searchItems() {
  const q = searchInput.value.toLowerCase();
  renderMarket(items.filter(i =>
    i.name.toLowerCase().includes(q) ||
    i.seller.toLowerCase().includes(q) ||
    i.location.toLowerCase().includes(q)
  ));
}
// Chat
function contactSeller(index) {
  const msg = prompt("Enter message:");
  if (msg) {
    items[index].messages.push({ from: currentUser, text: msg });
    localStorage.setItem("items", JSON.stringify(items));
    alert("Message sent!");
  }
}
renderMarket(items);
renderSellers();