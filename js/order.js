/* ===========================
   JAVA BUZZ - ORDER MODAL JS
   =========================== */

// Inline menu data — no fetch needed, no async race conditions
var ORDER_MENU = [
  { id: 1, name: 'Signature Espresso', description: 'Rich, bold, notes of dark chocolate and hazelnut.', price: 3.50, category: 'coffee', image: 'images/menu-espresso.jpg', popular: true },
  { id: 2, name: 'Lavender Oat Latte', description: 'Espresso with lavender syrup and oat milk.', price: 6.00, category: 'coffee', image: 'images/menu-latte.jpg', popular: true },
  { id: 3, name: 'Classic Cappuccino', description: 'Equal parts espresso, steamed milk, and microfoam.', price: 5.00, category: 'coffee', image: 'images/menu-cappuccino.jpg', popular: false },
  { id: 4, name: 'Cold Brew Reserve', description: '24-hour cold brew, naturally sweet, low acid.', price: 6.50, category: 'coffee', image: 'images/menu-cold-brew.jpg', popular: true },
  { id: 5, name: 'Caramel Macchiato', description: 'Vanilla milk, bold espresso, artisan caramel drizzle.', price: 6.25, category: 'coffee', image: 'images/menu-caramel-macchiato.jpg', popular: false },
  { id: 6, name: 'Flat White', description: 'Double ristretto with velvety microfoam milk.', price: 5.50, category: 'coffee', image: 'images/menu-flat-white.jpg', popular: false },
  { id: 7, name: 'Ethiopian Pour-Over', description: 'Yirgacheffe beans — blueberry and jasmine notes.', price: 7.00, category: 'coffee', image: 'images/menu-pour-over.jpg', popular: true },
  { id: 8, name: 'Matcha Latte', description: 'Ceremonial matcha whisked with steamed oat milk.', price: 6.00, category: 'tea', image: 'images/menu-matcha.jpg', popular: true },
  { id: 9, name: 'Jasmine Green Tea', description: 'Loose-leaf jasmine green tea, light and aromatic.', price: 4.50, category: 'tea', image: 'images/menu-jasmine-tea.jpg', popular: false },
  { id: 10, name: 'Chai Spice Latte', description: 'Masala chai with cinnamon, cardamom, and ginger.', price: 5.75, category: 'tea', image: 'images/menu-chai.jpg', popular: true },
  { id: 11, name: 'Butter Croissant', description: 'Flaky golden croissant, baked fresh every morning.', price: 4.00, category: 'pastries', image: 'images/menu-croissant.jpg', popular: true },
  { id: 12, name: 'Cardamom Knot', description: 'Pull-apart cardamom and brown sugar knot bun.', price: 4.50, category: 'pastries', image: 'images/menu-cardamom-knot.jpg', popular: false },
  { id: 13, name: 'Blueberry Scone', description: 'Crumbly scone with fresh blueberries and vanilla glaze.', price: 3.75, category: 'pastries', image: 'images/menu-scone.jpg', popular: false },
  { id: 14, name: 'Dark Chocolate Brownie', description: '70% dark chocolate, dense and fudgy.', price: 4.25, category: 'pastries', image: 'images/menu-brownie.jpg', popular: true },
  { id: 15, name: 'Avocado Toast', description: 'Sourdough, smashed avo, chili flakes, lemon zest.', price: 8.50, category: 'snacks', image: 'images/menu-avocado-toast.jpg', popular: true },
  { id: 16, name: 'Granola Parfait', description: 'Greek yogurt, house granola, seasonal berries, honey.', price: 7.00, category: 'snacks', image: 'images/menu-granola.jpg', popular: false },
  { id: 17, name: 'Cheese & Charcuterie Board', description: 'Artisan cheeses, cured meats, olives, and crackers.', price: 14.00, category: 'snacks', image: 'images/menu-charcuterie.jpg', popular: false }
];

// State
var orderItems = {};
var orderFilter = 'all';
var orderStep = 1;

// -----------------------------------------------
// Open modal
// -----------------------------------------------
function openOrderModal() {
  // Build modal if it doesn't exist yet
  if (!document.getElementById('order-modal')) {
    buildOrderModal();
  }
  // Reset state
  orderItems = {};
  orderFilter = 'all';

  // Reset filter buttons
  document.querySelectorAll('.order-filter-btn').forEach(function (b) {
    b.classList.toggle('active', b.dataset.cat === 'all');
  });

  goToOrderStep(1);
  renderOrderItems();
  updateOrderFooter();

  var modal = document.getElementById('order-modal');
  modal.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeOrderModal() {
  var modal = document.getElementById('order-modal');
  if (modal) modal.classList.remove('open');
  document.body.style.overflow = '';
}

// -----------------------------------------------
// Build DOM
// -----------------------------------------------
function buildOrderModal() {
  var el = document.createElement('div');
  el.id = 'order-modal';
  el.className = 'order-modal-overlay';
  el.setAttribute('role', 'dialog');
  el.setAttribute('aria-modal', 'true');
  el.innerHTML = [
    '<div class="order-modal">',
    '  <div class="order-modal-header">',
    '    <div class="order-modal-header-left">',
    '      <div class="order-modal-logo">&#9749;</div>',
    '      <div>',
    '        <h2>Order Now</h2>',
    '        <p class="order-modal-sub">Java Buzz &middot; Manhattan, NYC</p>',
    '      </div>',
    '    </div>',
    '    <button class="order-modal-close" id="order-modal-close" aria-label="Close">&times;</button>',
    '  </div>',
    '  <div class="order-steps-bar">',
    '    <div class="order-step-item active" data-step="1"><div class="order-step-circle">1</div><span>Choose Items</span></div>',
    '    <div class="order-step-line"></div>',
    '    <div class="order-step-item" data-step="2"><div class="order-step-circle">2</div><span>Your Details</span></div>',
    '    <div class="order-step-line"></div>',
    '    <div class="order-step-item" data-step="3"><div class="order-step-circle">3</div><span>Confirmation</span></div>',
    '  </div>',
    '  <div class="order-modal-body">',
    '    <div class="order-step-panel" id="order-step-1">',
    '      <div class="order-filter-bar">',
    '        <button class="order-filter-btn active" data-cat="all">All</button>',
    '        <button class="order-filter-btn" data-cat="coffee">&#9749; Coffee</button>',
    '        <button class="order-filter-btn" data-cat="tea">&#127861; Tea</button>',
    '        <button class="order-filter-btn" data-cat="pastries">&#129360; Pastries</button>',
    '        <button class="order-filter-btn" data-cat="snacks">&#129361; Snacks</button>',
    '      </div>',
    '      <div class="order-items-grid" id="order-items-grid"></div>',
    '    </div>',
    '    <div class="order-step-panel hidden" id="order-step-2">',
    '      <div class="order-summary-mini" id="order-summary-mini"></div>',
    '      <div class="order-details-form" id="order-details-form">',
    '        <div class="order-form-row">',
    '          <div class="order-form-group"><label for="od-name">Full Name <span class="req">*</span></label><input type="text" id="od-name" placeholder="e.g. John Doe" autocomplete="name"></div>',
    '          <div class="order-form-group"><label for="od-phone">Phone <span class="req">*</span></label><input type="tel" id="od-phone" placeholder="e.g. (212) 555-0100" autocomplete="tel"></div>',
    '        </div>',
    '        <div class="order-form-group"><label for="od-email">Email Address <span class="req">*</span></label><input type="email" id="od-email" placeholder="e.g. you@example.com" autocomplete="email"></div>',
    '        <div class="order-form-row">',
    '          <div class="order-form-group"><label for="od-type">Order Type</label><select id="od-type"><option value="pickup">&#127939; Pickup In-Store</option><option value="dine">&#129681; Dine In</option></select></div>',
    '          <div class="order-form-group"><label for="od-time">Pickup / Arrival Time <span class="req">*</span></label><input type="time" id="od-time"></div>',
    '        </div>',
    '        <div class="order-form-group"><label for="od-notes">Special Instructions</label><textarea id="od-notes" rows="3" placeholder="e.g. extra oat milk, no sugar..."></textarea></div>',
    '      </div>',
    '    </div>',
    '    <div class="order-step-panel hidden" id="order-step-3">',
    '      <div class="order-confirm-anim">',
    '        <div class="order-confirm-circle"><span class="order-confirm-check">&#10003;</span></div>',
    '        <h3 class="order-confirm-title">Order Placed! &#9749;</h3>',
    '        <p class="order-confirm-msg">Thank you, <span id="order-confirm-name"></span>! Your order will be ready shortly. Confirmation sent to <span id="order-confirm-email"></span>.</p>',
    '      </div>',
    '      <div class="order-confirm-receipt" id="order-confirm-receipt"></div>',
    '      <div class="order-confirm-info">',
    '        <div class="order-confirm-info-item"><span>&#128205;</span><span>123 Brew St, Manhattan, NYC</span></div>',
    '        <div class="order-confirm-info-item"><span>&#128222;</span><span>(212) 555-BUZZ</span></div>',
    '      </div>',
    '    </div>',
    '  </div>',
    '  <div class="order-modal-footer" id="order-modal-footer">',
    '    <div class="order-cart-summary"><span id="order-mini-count">0 items</span><span id="order-mini-total">$0.00</span></div>',
    '    <div class="order-footer-btns">',
    '      <button class="order-btn-secondary hidden" id="order-btn-back">&larr; Back</button>',
    '      <button class="order-btn-primary" id="order-btn-next" disabled>Select Items to Continue &rarr;</button>',
    '    </div>',
    '  </div>',
    '</div>'
  ].join('');

  document.body.appendChild(el);

  // Bind all events
  el.addEventListener('click', function (e) {
    if (e.target === el) closeOrderModal();
  });

  document.getElementById('order-modal-close').addEventListener('click', closeOrderModal);

  // Filter buttons
  el.querySelectorAll('.order-filter-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      el.querySelectorAll('.order-filter-btn').forEach(function (b) { b.classList.remove('active'); });
      btn.classList.add('active');
      orderFilter = btn.dataset.cat;
      renderOrderItems();
    });
  });

  // Item grid — delegated qty buttons
  document.getElementById('order-items-grid').addEventListener('click', function (e) {
    var btn = e.target.closest('.order-qty-btn');
    if (!btn) return;
    var id = parseInt(btn.dataset.id, 10);
    if (btn.classList.contains('plus')) {
      orderItems[id] = (orderItems[id] || 0) + 1;
    } else if (btn.classList.contains('minus')) {
      orderItems[id] = (orderItems[id] || 1) - 1;
      if (orderItems[id] <= 0) delete orderItems[id];
    }
    renderOrderItems();
    updateOrderFooter();
  });

  // Next / Place order
  document.getElementById('order-btn-next').addEventListener('click', function () {
    if (orderStep === 1) {
      goToOrderStep(2);
    } else if (orderStep === 2) {
      if (validateOrderForm()) {
        goToOrderStep(3);
      } else {
        window.showToast && window.showToast('Please fill in all required fields.');
      }
    }
  });

  // Back
  document.getElementById('order-btn-back').addEventListener('click', function () {
    if (orderStep === 2) goToOrderStep(1);
  });
}

// -----------------------------------------------
// Render item cards
// -----------------------------------------------
function renderOrderItems() {
  var grid = document.getElementById('order-items-grid');
  if (!grid) return;
  var list = orderFilter === 'all' ? ORDER_MENU : ORDER_MENU.filter(function (m) { return m.category === orderFilter; });
  grid.innerHTML = list.map(function (item) {
    var qty = orderItems[item.id] || 0;
    return [
      '<div class="order-item-card' + (qty > 0 ? ' selected' : '') + '">',
      item.popular ? '<div class="order-item-badge">&#11088; Popular</div>' : '',
      '<div class="order-item-img-wrap"><img src="' + item.image + '" alt="' + item.name + '" class="order-item-img" onerror="this.src=\'images/hero-bg.jpg\'"></div>',
      '<div class="order-item-info">',
      '<div class="order-item-name">' + item.name + '</div>',
      '<div class="order-item-desc">' + item.description + '</div>',
      '<div class="order-item-bottom">',
      '<div class="order-item-price">$' + item.price.toFixed(2) + '</div>',
      '<div class="order-item-qty-ctrl">',
      qty > 0 ? '<button class="order-qty-btn minus" data-id="' + item.id + '" aria-label="Remove one">&minus;</button><span class="order-qty-num">' + qty + '</span>' : '',
      '<button class="order-qty-btn plus" data-id="' + item.id + '" aria-label="Add one">&plus;</button>',
      '</div></div></div></div>'
    ].join('');
  }).join('');
}

// -----------------------------------------------
// Footer mini summary
// -----------------------------------------------
function updateOrderFooter() {
  var count = 0, total = 0;
  Object.keys(orderItems).forEach(function (id) {
    var qty = orderItems[id];
    var item = ORDER_MENU.find(function (m) { return m.id === parseInt(id, 10); });
    if (item) { count += qty; total += item.price * qty; }
  });
  var countEl = document.getElementById('order-mini-count');
  var totalEl = document.getElementById('order-mini-total');
  var nextBtn = document.getElementById('order-btn-next');
  if (countEl) countEl.textContent = count + ' item' + (count !== 1 ? 's' : '');
  if (totalEl) totalEl.textContent = '$' + total.toFixed(2);
  if (nextBtn && orderStep === 1) {
    if (count > 0) {
      nextBtn.disabled = false;
      nextBtn.textContent = 'Review Order ($' + total.toFixed(2) + ') \u2192';
    } else {
      nextBtn.disabled = true;
      nextBtn.textContent = 'Select Items to Continue \u2192';
    }
  }
}

// -----------------------------------------------
// Step navigation
// -----------------------------------------------
function goToOrderStep(step) {
  orderStep = step;
  document.querySelectorAll('.order-step-panel').forEach(function (p) { p.classList.add('hidden'); });
  var panel = document.getElementById('order-step-' + step);
  if (panel) panel.classList.remove('hidden');

  document.querySelectorAll('.order-step-item').forEach(function (el) {
    var s = parseInt(el.dataset.step, 10);
    el.classList.toggle('active', s === step);
    el.classList.toggle('done', s < step);
  });

  var backBtn = document.getElementById('order-btn-back');
  var nextBtn = document.getElementById('order-btn-next');
  var footer = document.getElementById('order-modal-footer');

  if (step === 1) {
    if (backBtn) backBtn.classList.add('hidden');
    if (nextBtn) nextBtn.classList.remove('hidden');
    if (footer) footer.classList.remove('step3');
    updateOrderFooter();
  } else if (step === 2) {
    renderOrderSummaryMini();
    if (backBtn) backBtn.classList.remove('hidden');
    if (nextBtn) { nextBtn.textContent = 'Place Order \u2615'; nextBtn.disabled = false; nextBtn.classList.remove('hidden'); }
    if (footer) footer.classList.remove('step3');
  } else if (step === 3) {
    if (backBtn) backBtn.classList.add('hidden');
    if (nextBtn) nextBtn.classList.add('hidden');
    if (footer) footer.classList.add('step3');
    renderOrderConfirmation();
  }
}

// -----------------------------------------------
// Step 2 summary
// -----------------------------------------------
function renderOrderSummaryMini() {
  var el = document.getElementById('order-summary-mini');
  if (!el) return;
  var subtotal = getOrderSubtotal();
  var tax = subtotal * 0.08;
  var lines = Object.keys(orderItems).map(function (id) {
    var qty = orderItems[id];
    var item = ORDER_MENU.find(function (m) { return m.id === parseInt(id, 10); });
    return item ? '<div class="osm-item"><span>' + item.name + ' &times;' + qty + '</span><span>$' + (item.price * qty).toFixed(2) + '</span></div>' : '';
  }).join('');
  el.innerHTML = '<div class="osm-title">Your Order</div>' + lines +
    '<div class="osm-divider"></div>' +
    '<div class="osm-item osm-tax"><span>Tax (8%)</span><span>$' + tax.toFixed(2) + '</span></div>' +
    '<div class="osm-item osm-total"><span>Total</span><span>$' + (subtotal + tax).toFixed(2) + '</span></div>';
}

// -----------------------------------------------
// Step 3 confirmation
// -----------------------------------------------
function renderOrderConfirmation() {
  var name = (document.getElementById('od-name') || {}).value || 'Guest';
  var email = (document.getElementById('od-email') || {}).value || '';
  var time = (document.getElementById('od-time') || {}).value || '';
  var type = (document.getElementById('od-type') || {}).value || 'pickup';
  var notes = (document.getElementById('od-notes') || {}).value || '';

  var nameEl = document.getElementById('order-confirm-name');
  var emailEl = document.getElementById('order-confirm-email');
  if (nameEl) nameEl.textContent = name.split(' ')[0];
  if (emailEl) emailEl.textContent = email;

  var subtotal = getOrderSubtotal();
  var tax = subtotal * 0.08;
  var total = subtotal + tax;

  var itemLines = Object.keys(orderItems).map(function (id) {
    var qty = orderItems[id];
    var item = ORDER_MENU.find(function (m) { return m.id === parseInt(id, 10); });
    return item ? '<div class="receipt-item"><span class="receipt-item-name">' + item.name + ' <em>&times;' + qty + '</em></span><span class="receipt-item-price">$' + (item.price * qty).toFixed(2) + '</span></div>' : '';
  }).join('');

  var receipt = document.getElementById('order-confirm-receipt');
  if (receipt) {
    receipt.innerHTML = [
      '<div class="receipt-card">',
      '<div class="receipt-meta">',
      '<div class="receipt-meta-item"><span class="receipt-meta-label">Order Type</span><span class="receipt-meta-val">' + (type === 'pickup' ? '&#127939; Pickup' : '&#129681; Dine In') + '</span></div>',
      '<div class="receipt-meta-item"><span class="receipt-meta-label">Time</span><span class="receipt-meta-val">' + (time || 'ASAP') + '</span></div>',
      '</div>',
      '<div class="receipt-items">' + itemLines + '</div>',
      '<div class="receipt-divider"></div>',
      '<div class="receipt-totals">',
      '<div class="receipt-row"><span>Subtotal</span><span>$' + subtotal.toFixed(2) + '</span></div>',
      '<div class="receipt-row"><span>Tax (8%)</span><span>$' + tax.toFixed(2) + '</span></div>',
      '<div class="receipt-row receipt-row-total"><span>Total</span><span>$' + total.toFixed(2) + '</span></div>',
      '</div>',
      notes ? '<div class="receipt-notes"><strong>Notes:</strong> ' + notes + '</div>' : '',
      '</div>'
    ].join('');
  }
}

function getOrderSubtotal() {
  return Object.keys(orderItems).reduce(function (sum, id) {
    var qty = orderItems[id];
    var item = ORDER_MENU.find(function (m) { return m.id === parseInt(id, 10); });
    return sum + (item ? item.price * qty : 0);
  }, 0);
}

// -----------------------------------------------
// Form validation
// -----------------------------------------------
function validateOrderForm() {
  var fields = ['od-name', 'od-phone', 'od-email', 'od-time'];
  var valid = true;
  fields.forEach(function (id) {
    var el = document.getElementById(id);
    if (!el) return;
    if (!el.value.trim()) {
      el.classList.add('input-error');
      valid = false;
    } else {
      el.classList.remove('input-error');
    }
  });
  var emailEl = document.getElementById('od-email');
  if (emailEl && emailEl.value && !emailEl.value.includes('@')) {
    emailEl.classList.add('input-error');
    valid = false;
  }
  return valid;
}

// -----------------------------------------------
// Init — attach to all Order Now triggers
// -----------------------------------------------
document.addEventListener('DOMContentLoaded', function () {
  document.querySelectorAll('[data-order-modal]').forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      e.preventDefault();
      openOrderModal();
    });
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeOrderModal();
  });
});

// Expose globally
window.openOrderModal = openOrderModal;
window.closeOrderModal = closeOrderModal;
