/* ===========================
   JAVA BUZZ - MENU JS
   =========================== */

document.addEventListener('DOMContentLoaded', async () => {
    const menuGrid = document.getElementById('menu-grid');
    const filterTabs = document.querySelectorAll('.filter-tab');
    let allItems = [];

    if (!menuGrid) return;

    // Fetch menu data
    try {
        const res = await fetch('./data/menu.json');
        allItems = await res.json();
        renderMenu(allItems);
    } catch (err) {
        menuGrid.innerHTML = '<p style="text-align:center;color:#8B7355;padding:40px">Could not load menu data.</p>';
        return;
    }

    // Render menu cards
    function renderMenu(items) {
        menuGrid.innerHTML = '';
        if (items.length === 0) {
            menuGrid.innerHTML = '<div class="no-results"><span>😔</span>No items found.</div>';
            return;
        }
        items.forEach((item, i) => {
            const card = document.createElement('div');
            card.className = 'menu-card animate-on-scroll';
            card.dataset.delay = i * 60;
            card.innerHTML = `
        <div class="menu-card-img-wrap">
          <img class="menu-card-img" src="${item.image}" alt="${item.name}" loading="lazy" onerror="this.src='images/page-hero-bg.jpg'">
          ${item.popular ? '<span class="menu-card-popular-badge">⭐ Popular</span>' : ''}
        </div>
        <div class="menu-card-body">
          <span class="menu-card-category">${item.category}</span>
          <h3 class="menu-card-name">${item.name}</h3>
          <p class="menu-card-desc">${item.description}</p>
          <div class="menu-card-footer">
            <span class="menu-card-price">$${item.price.toFixed(2)}</span>
            <button class="menu-card-add" onclick="handleAddToOrder(${item.id})" aria-label="Add ${item.name} to order" title="Add to order">+</button>
          </div>
        </div>
      `;
            menuGrid.appendChild(card);
        });

        // Trigger animations
        setTimeout(() => {
            menuGrid.querySelectorAll('.animate-on-scroll').forEach((el, i) => {
                setTimeout(() => el.classList.add('visible'), i * 60);
            });
        }, 50);
    }

    // Filter tabs
    filterTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            filterTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            const cat = tab.dataset.filter;
            const filtered = cat === 'all' ? allItems : allItems.filter(item => item.category === cat);
            renderMenu(filtered);
        });
    });

    // Add to order handler
    window.handleAddToOrder = function (id) {
        const item = allItems.find(i => i.id === id);
        if (item && window.Cart) {
            Cart.add(item);
        } else {
            window.showToast && showToast(`☕ ${item ? item.name : 'Item'} added to your order!`);
        }
    };
});
