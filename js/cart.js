/* ===========================
   JAVA BUZZ - CART SYSTEM JS
   =========================== */

const Cart = (() => {
    let items = JSON.parse(localStorage.getItem('javabuzz-cart') || '[]');

    const save = () => localStorage.setItem('javabuzz-cart', JSON.stringify(items));

    const add = (item) => {
        const existing = items.find(i => i.id === item.id);
        if (existing) {
            existing.qty += 1;
        } else {
            items.push({ ...item, qty: 1 });
        }
        save();
        updateUI();
        showCartBadgeAnimation();
        window.showToast && showToast(`☕ ${item.name} added to cart!`);
    };

    const remove = (id) => {
        items = items.filter(i => i.id !== id);
        save();
        updateUI();
    };

    const updateQty = (id, delta) => {
        const item = items.find(i => i.id === id);
        if (!item) return;
        item.qty += delta;
        if (item.qty <= 0) remove(id);
        else { save(); updateUI(); }
    };

    const clear = () => {
        items = [];
        save();
        updateUI();
    };

    const getTotal = () => items.reduce((sum, i) => sum + i.price * i.qty, 0);
    const getCount = () => items.reduce((sum, i) => sum + i.qty, 0);
    const getItems = () => items;

    return { add, remove, updateQty, clear, getTotal, getCount, getItems };
})();

// -----------------------------------------------
// Cart UI
// -----------------------------------------------
function updateUI() {
    updateBadge();
    renderCartPanel();
}

function updateBadge() {
    const badge = document.querySelector('.cart-badge');
    if (!badge) return;
    const count = Cart.getCount();
    badge.textContent = count;
    badge.style.display = count > 0 ? 'flex' : 'none';
}

function showCartBadgeAnimation() {
    const icon = document.querySelector('.cart-nav-btn');
    if (!icon) return;
    icon.classList.add('cart-bounce');
    setTimeout(() => icon.classList.remove('cart-bounce'), 400);
}

function renderCartPanel() {
    const body = document.getElementById('cart-panel-body');
    const footer = document.getElementById('cart-panel-footer');
    if (!body || !footer) return;

    const items = Cart.getItems();

    if (items.length === 0) {
        body.innerHTML = `
      <div class="cart-empty">
        <span class="cart-empty-icon">☕</span>
        <p>Your cart is empty</p>
        <small>Add items from the menu to get started.</small>
        <a href="menu.html" class="btn btn-primary btn-sm" style="margin-top:16px;">Browse Menu</a>
      </div>
    `;
        footer.innerHTML = '';
        return;
    }

    body.innerHTML = items.map(item => `
    <div class="cart-item" id="cart-item-${item.id}">
      <img src="${item.image}" alt="${item.name}" class="cart-item-img" onerror="this.src='images/page-hero-bg.jpg'">
      <div class="cart-item-info">
        <div class="cart-item-name">${item.name}</div>
        <div class="cart-item-price">$${(item.price * item.qty).toFixed(2)}</div>
        <div class="cart-item-controls">
          <button class="cart-qty-btn" onclick="Cart.updateQty(${item.id}, -1)" aria-label="Decrease">−</button>
          <span class="cart-item-qty">${item.qty}</span>
          <button class="cart-qty-btn" onclick="Cart.updateQty(${item.id}, 1)" aria-label="Increase">+</button>
          <button class="cart-remove-btn" onclick="Cart.remove(${item.id})" aria-label="Remove item">🗑</button>
        </div>
      </div>
    </div>
  `).join('');

    const total = Cart.getTotal();
    const count = Cart.getCount();
    footer.innerHTML = `
    <div class="cart-summary">
      <div class="cart-summary-row">
        <span>Subtotal (${count} item${count > 1 ? 's' : ''})</span>
        <span>$${total.toFixed(2)}</span>
      </div>
      <div class="cart-summary-row cart-summary-tax">
        <span>Tax (8%)</span>
        <span>$${(total * 0.08).toFixed(2)}</span>
      </div>
      <div class="cart-summary-row cart-total-row">
        <span>Total</span>
        <span>$${(total * 1.08).toFixed(2)}</span>
      </div>
    </div>
    <button class="btn btn-primary" style="width:100%;justify-content:center;margin-top:16px;" onclick="handleCheckout()">
      Checkout — $${(total * 1.08).toFixed(2)} →
    </button>
    <button class="cart-clear-btn" onclick="Cart.clear()">Clear Cart</button>
  `;
}

function handleCheckout() {
    closeCart();
    setTimeout(() => {
        window.showToast && showToast('✅ Order placed! We\'ll have it ready when you arrive. ☕');
        Cart.clear();
    }, 300);
}

// -----------------------------------------------
// Cart Panel open/close
// -----------------------------------------------
function openCart() {
    const panel = document.getElementById('cart-panel');
    const overlay = document.getElementById('cart-overlay');
    if (panel) panel.classList.add('open');
    if (overlay) overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
    renderCartPanel();
}

function closeCart() {
    const panel = document.getElementById('cart-panel');
    const overlay = document.getElementById('cart-overlay');
    if (panel) panel.classList.remove('open');
    if (overlay) overlay.classList.remove('open');
    document.body.style.overflow = '';
}

// -----------------------------------------------
// Init
// -----------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
    // Cart button in navbar
    const cartBtn = document.querySelector('.cart-nav-btn');
    if (cartBtn) cartBtn.addEventListener('click', openCart);

    // Cart overlay click to close
    const overlay = document.getElementById('cart-overlay');
    if (overlay) overlay.addEventListener('click', closeCart);

    // Close button
    const closeBtn = document.getElementById('cart-close-btn');
    if (closeBtn) closeBtn.addEventListener('click', closeCart);

    // ESC key
    document.addEventListener('keydown', e => {
        if (e.key === 'Escape') closeCart();
    });

    // Init UI
    updateUI();
});

// Expose Cart globally
window.Cart = Cart;
window.openCart = openCart;
window.closeCart = closeCart;
