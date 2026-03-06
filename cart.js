// Shopping cart page interactivity

let cart = JSON.parse(localStorage.getItem("cart")) || [];

function renderCart() {
	const cartItemsList = document.getElementById("cart-items");

	if (cart.length === 0) {
		cartItemsList.innerHTML =
			'<li class="empty-cart"><p>Your cart is empty</p></li>';
		document.getElementById("checkout").disabled = true;
		document.querySelector("#cart-subtotal").innerHTML = "$0.00";
		document.querySelector("#cart-total").innerHTML = "$0.00";
		return;
	}

	cartItemsList.innerHTML = "";
	cart.forEach((item, index) => {
		const li = document.createElement("li");
		li.className = "cart-item";
		li.innerHTML = `
      <img src="${item.image}" alt="${item.name}" />
      <div class="item-info">
        <h3>${item.name}</h3>
        <p>Colour: ${item.color.charAt(0).toUpperCase() + item.color.slice(1)}</p>
        <p class="item-price">$${item.price.toFixed(2)}</p>
      </div>
      <button class="remove-item" data-index="${index}" aria-label="Remove item">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="3 6 5 6 21 6"></polyline>
          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
          <line x1="10" y1="11" x2="10" y2="17"></line>
          <line x1="14" y1="11" x2="14" y2="17"></line>
        </svg>
      </button>
    `;
		cartItemsList.appendChild(li);
	});

	document.getElementById("checkout").disabled = false;
	updateTotal();
}

function updateTotal() {
	const subtotal = cart.reduce(
		(sum, item) => sum + item.price * item.quantity,
		0,
	);
	const total = subtotal;
	document.querySelector("#cart-subtotal").innerHTML =
		`$${subtotal.toFixed(2)}`;
	document.querySelector("#cart-total").innerHTML = `$${total.toFixed(2)}`;
}

function removeItem(event) {
	const button = event.target.closest(".remove-item");
	if (!button) {
		return;
	}
	const index = parseInt(button.dataset.index);
	cart.splice(index, 1);
	localStorage.setItem("cart", JSON.stringify(cart));
	renderCart();
}

document.addEventListener("DOMContentLoaded", () => {
	renderCart();
	document.getElementById("cart-items").addEventListener("click", removeItem);
});
