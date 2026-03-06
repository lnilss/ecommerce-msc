// Product page interactivity

let cart = JSON.parse(localStorage.getItem("cart")) || [];
let selectedColor = "black";
let isDropdownOpen = false;
let isZoomed = false;
let zoomStartX = 0;
let zoomStartY = 0;
let currentPanX = 0;
let currentPanY = 0;

// DOM element references
let addToCartBtn;
let colorBtns;
let cartBtn;
let cartDropdown;
let dropdownClose;
let dropdownViewCartBtn;
let dropdownItems;
let productImageContainer;
let productImage;
let zoomBtn;

// Initialize on page load
document.addEventListener("DOMContentLoaded", () => {
	// Get DOM references
	addToCartBtn = document.getElementById("add-to-cart");
	colorBtns = document.querySelectorAll(".color-btn");
	cartBtn = document.getElementById("cart-btn");
	cartDropdown = document.getElementById("cart-dropdown");
	dropdownClose = document.getElementById("dropdown-close");
	dropdownViewCartBtn = document.getElementById("dropdown-view-cart");
	dropdownItems = document.getElementById("dropdown-items");
	productImageContainer = document.getElementById("product-image-container");
	productImage = document.getElementById("product-image");
	zoomBtn = document.getElementById("zoom-btn");

	// Zoom and pan functionality
	zoomBtn.addEventListener("click", toggleZoom);
	productImageContainer.addEventListener("mousedown", startPan);
	productImageContainer.addEventListener("mousemove", pan);
	productImageContainer.addEventListener("mouseup", endPan);
	productImageContainer.addEventListener("mouseleave", endPan);

	// Colour selection
	colorBtns.forEach((btn) => {
		btn.addEventListener("click", (e) => {
			colorBtns.forEach((b) => b.classList.remove("active"));
			e.target.classList.add("active");
			selectedColor = e.target.dataset.color;
		});
	});

	// Cart button click - toggle dropdown
	cartBtn.addEventListener("click", (e) => {
		e.stopPropagation();
		isDropdownOpen = !isDropdownOpen;
		cartDropdown.classList.toggle("active", isDropdownOpen);
		updateDropdownDisplay();
	});

	// Close dropdown when clicking outside
	document.addEventListener("click", () => {
		if (isDropdownOpen) {
			isDropdownOpen = false;
			cartDropdown.classList.remove("active");
		}
	});

	// Prevent dropdown from closing when clicking inside it
	cartDropdown.addEventListener("click", (e) => {
		e.stopPropagation();
	});

	// Close button in dropdown
	dropdownClose.addEventListener("click", () => {
		isDropdownOpen = false;
		cartDropdown.classList.remove("active");
	});

	// View cart from dropdown
	dropdownViewCartBtn.addEventListener("click", () => {
		window.location.href = "open-cart.html";
	});

	// Add to cart functionality
	addToCartBtn.addEventListener("click", (e) => {
		e.stopPropagation();
		if (addToCartBtn.disabled) return;

		// Trigger cart animation on button and header icon
		addToCartBtn.classList.add("cart-animation");
		cartBtn.classList.add("cart-animation");
		setTimeout(() => {
			addToCartBtn.classList.remove("cart-animation");
			cartBtn.classList.remove("cart-animation");
		}, 300);

		const product = {
			id: "ergonomique-chair-black",
			name: "Ergonomique Office Chair",
			price: 199.99,
			color: "black",
			quantity: 1,
			image: "images/ergonomique-31.png",
		};

		const existingItem = cart.find((item) => item.id === product.id);
		if (!existingItem) {
			cart.push(product);
			localStorage.setItem("cart", JSON.stringify(cart));
			updateCartState();
			updateDropdownDisplay();
			showCartDropdown();
		}
	});

	updateCartState();
	updateDropdownDisplay();
});

// Update dropdown display
function updateDropdownDisplay() {
	const subtotalEl = document.getElementById("dropdown-subtotal");

	if (cart.length === 0) {
		dropdownItems.innerHTML =
			'<div class="dropdown-empty"><p>Your cart is empty</p></div>';
		if (subtotalEl) subtotalEl.textContent = "$0.00";
		return;
	}

	dropdownItems.innerHTML = "";
	cart.forEach((item, index) => {
		const div = document.createElement("div");
		div.className = "dropdown-item";
		div.innerHTML = `
      <div class="dropdown-item-image">
        <img src="images/ergonomique-31.png" alt="${item.name}" />
      </div>
      <div class="dropdown-item-info">
        <h4>${item.name}</h4>
        <p>Colour: ${item.color.charAt(0).toUpperCase() + item.color.slice(1)}</p>
        <p class="dropdown-item-price">$${item.price.toFixed(2)}</p>
      </div>
      <button class="dropdown-remove" data-index="${index}" aria-label="Remove">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="3 6 5 6 21 6"></polyline>
          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
          <line x1="10" y1="11" x2="10" y2="17"></line>
          <line x1="14" y1="11" x2="14" y2="17"></line>
        </svg>
      </button>
    `;
		dropdownItems.appendChild(div);
	});

	// update subtotal
	if (subtotalEl) {
		subtotalEl.textContent = `$${calculateCartTotal().toFixed(2)}`;
	}

	// Add remove listeners
	document.querySelectorAll(".dropdown-remove").forEach((btn) => {
		btn.addEventListener("click", (e) => {
			e.stopPropagation();
			const index = parseInt(e.currentTarget.dataset.index);
			cart.splice(index, 1);
			localStorage.setItem("cart", JSON.stringify(cart));
			updateCartState();
			updateDropdownDisplay();
		});
	});
}

// Show cart dropdown
function showCartDropdown() {
	isDropdownOpen = true;
	cartDropdown.classList.add("active");
	updateDropdownDisplay();
}

// Calculate cart total
function calculateCartTotal() {
	return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

// Update cart state
function updateCartState() {
	const cartItem = cart.find((item) => item.id === "ergonomique-chair-black");
	if (cartItem) {
		// Item already in cart - disable button
		addToCartBtn.disabled = true;
		addToCartBtn.classList.add("added");
		addToCartBtn.querySelector(".btn-text").textContent = "Added to Cart";
	} else {
		// Item not in cart - enable button
		addToCartBtn.disabled = false;
		addToCartBtn.classList.remove("added");
		addToCartBtn.querySelector(".btn-text").textContent = "Add to Cart";
	}
	updateCartCount();
}

// Add to cart functionality
// (Already handled inside DOMContentLoaded)

// Update cart button with count
function updateCartCount() {
	const count = cart.reduce((sum, item) => sum + item.quantity, 0);
	const badge =
		cartBtn.querySelector(".badge") || document.createElement("span");
	badge.className = "badge";
	badge.textContent = count;
	badge.style.cssText =
		"position: absolute; top: -8px; right: -8px; background: #00a63e; color: white; border-radius: 50%; width: 20px; height: 20px; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: bold;";
	if (!cartBtn.querySelector(".badge")) {
		cartBtn.appendChild(badge);
	}
	if (count === 0 && badge.parentNode) {
		badge.remove();
	}
}

// Zoom and pan functions
function toggleZoom() {
	isZoomed = !isZoomed;
	if (isZoomed) {
		productImage.classList.add("zoomed-in");
		productImageContainer.classList.add("zoomed");
		currentPanX = 0;
		currentPanY = 0;
		zoomBtn.innerHTML = `
			<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
				<circle cx="11" cy="11" r="8"></circle>
				<path d="m21 21-4.35-4.35"></path>
				<line x1="8" y1="11" x2="14" y2="11"></line>
			</svg>
		`;
	} else {
		productImage.classList.remove("zoomed-in");
		productImageContainer.classList.remove("zoomed");
		currentPanX = 0;
		currentPanY = 0;
		productImage.style.transform = "scale(1)";
		zoomBtn.innerHTML = `
			<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
				<circle cx="11" cy="11" r="8"></circle>
				<path d="m21 21-4.35-4.35"></path>
				<line x1="11" y1="8" x2="11" y2="14"></line>
				<line x1="8" y1="11" x2="14" y2="11"></line>
			</svg>
		`;
	}
}

function startPan(e) {
	if (!isZoomed) return;
	productImageContainer.classList.add("zoomed");
}

function pan(e) {
	if (!isZoomed) return;

	const rect = productImageContainer.getBoundingClientRect();
	const x = e.clientX - rect.left;
	const y = e.clientY - rect.top;

	const percentX = (x / rect.width) * 100;
	const percentY = (y / rect.height) * 100;

	// For 4x scale zoom, calculate pan to allow full image exploration
	// Range is from -150 to 150 pixels (1.5x the container)
	const panX = (percentX - 50) * (rect.width * 0.03);
	const panY = (percentY - 50) * (rect.height * 0.03);

	productImage.style.transform = `scale(4) translate(${-panX}px, ${-panY}px)`;
}

function endPan() {
	if (!isZoomed) {
		productImageContainer.classList.remove("zoomed");
	}
}
