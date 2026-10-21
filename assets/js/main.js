"use strict";
const productsUrl = './src/data/product.json?v=20261019-5';
const products = [];
let activeCategory = 'All items';
let activeSearch = '';
let activeSort = 'Popular';
let activeView = 'shop';
let cartItems = readStoredCart();
let favorites = readStoredFavorites();
let toastTimer = 0;
function readStoredCart() {
    try {
        const stored = JSON.parse(localStorage.getItem('greenmarket-cart') ?? '{}');
        if (!stored || typeof stored !== 'object' || Array.isArray(stored))
            return {};
        return Object.fromEntries(Object.entries(stored)
            .map(([id, quantity]) => [Number(id), Number(quantity)])
            .filter(([id, quantity]) => Number.isInteger(id) && id > 0 && Number.isInteger(quantity) && quantity > 0));
    }
    catch {
        return {};
    }
}
function readStoredFavorites() {
    try {
        const stored = JSON.parse(localStorage.getItem('greenmarket-favorites') ?? '[]');
        if (!Array.isArray(stored))
            return new Set();
        return new Set(stored.map(Number).filter(id => Number.isInteger(id) && id > 0));
    }
    catch {
        return new Set();
    }
}
function escapeHtml(value) {
    return value.replace(/[&<>"']/g, character => ({
        '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
    })[character] ?? character);
}
function money(amount) {
    return `$${amount.toFixed(2)}`;
}
function productCard(product) {
    const isFavorite = favorites.has(product.id);
    return `<article class="product-card">
    <div class="product-photo"><img src="${escapeHtml(product.image)}" alt="${escapeHtml(product.name)}" loading="lazy" data-product-image />
      ${product.discount > 0 ? `<span class="sale-pill">-${product.discount}%</span>` : ''}
      <button class="heart${isFavorite ? ' saved' : ''}" type="button" aria-label="${isFavorite ? 'Remove' : 'Save'} ${escapeHtml(product.name)} ${isFavorite ? 'from' : 'to'} favorites" aria-pressed="${isFavorite}" data-action="heart" data-product-id="${product.id}">${isFavorite ? '♥' : '♡'}</button>
    </div>
    <div class="product-info"><span class="product-category">${escapeHtml(product.category)}</span>
      <h3>${escapeHtml(product.name)}</h3><div class="rating">★★★★★ <span>(${product.reviews})</span></div>
      <div class="product-buy"><div><b>${money(product.price)}</b>${product.originalPrice > product.price ? `<del>${money(product.originalPrice)}</del>` : ''}</div>
      <button class="add-button" type="button" aria-label="Add ${escapeHtml(product.name)} to basket" data-action="add" data-product-id="${product.id}">+</button></div>
    </div>
  </article>`;
}
function currentProducts() {
    let result = products.filter(product => {
        if (activeView === 'favorites' && !favorites.has(product.id))
            return false;
        const categoryMatches = activeCategory === 'All items' || product.category.toLowerCase() === activeCategory.toLowerCase();
        const searchMatches = `${product.name} ${product.category} ${product.description}`.toLowerCase().includes(activeSearch.toLowerCase());
        return categoryMatches && searchMatches;
    });
    if (activeSort === 'Price: low to high')
        result = result.sort((a, b) => a.price - b.price);
    if (activeSort === 'Top rated')
        result = result.sort((a, b) => b.rating - a.rating);
    return result;
}
function updateShop() {
    const grid = document.querySelector('[data-product-grid="shop"]');
    if (!grid)
        return;
    const result = currentProducts();
    grid.innerHTML = result.length
        ? result.map(productCard).join('')
        : `<div class="empty-state"><span>${activeView === 'favorites' ? '♡' : '🌱'}</span><h2>${activeView === 'favorites' ? 'No saved favourites yet.' : 'Nothing on this shelf just yet.'}</h2><p>${activeView === 'favorites' ? 'Tap the heart on a product to keep it close.' : 'Try another search or choose a different aisle.'}</p><button class="text-link" type="button" data-action="clear-filters">${activeView === 'favorites' ? 'Browse the market ↗' : 'Show everything ↗'}</button></div>`;
    const count = document.querySelector('[data-result-count]');
    if (count)
        count.textContent = String(result.length);
    document.querySelectorAll('[data-filter]').forEach(button => {
        button.classList.toggle('selected', button.dataset.filter === activeCategory);
    });
    const search = document.querySelector('[name="search"]');
    if (search && search.value !== activeSearch)
        search.value = activeSearch;
    const sort = document.querySelector('[data-sort]');
    if (sort)
        sort.value = activeSort;
    const favoritesButton = document.querySelector('[data-action="toggle-favorites"]');
    if (favoritesButton) {
        favoritesButton.classList.toggle('selected', activeView === 'favorites');
        favoritesButton.setAttribute('aria-pressed', String(activeView === 'favorites'));
        favoritesButton.innerHTML = `${activeView === 'favorites' ? '← Shop' : '♡ Saved'} <span data-favorite-count>${favorites.size}</span>`;
    }
    updateFavoriteCounts();
}
function updateProductGrids() {
    document.querySelectorAll('[data-product-grid="featured"]').forEach(grid => {
        const featured = products.filter(product => product.isFeatured).slice(0, 4);
        grid.innerHTML = featured.map(productCard).join('');
    });
    updateShop();
    updateCartCount();
}
function updateCartCount() {
    const itemCount = Object.values(cartItems).reduce((total, quantity) => total + quantity, 0);
    document.querySelectorAll('[data-cart-count]').forEach(element => {
        element.textContent = itemCount.toString().padStart(2, '0');
    });
    localStorage.setItem('greenmarket-cart', JSON.stringify(cartItems));
    updateCartPanel();
}
function updateFavoriteCounts() {
    document.querySelectorAll('[data-favorite-count]').forEach(element => {
        element.textContent = String(favorites.size);
    });
}
function updateCartPanel() {
    const list = document.querySelector('[data-cart-items]');
    const total = document.querySelector('[data-cart-total]');
    if (!list || !total)
        return;
    const lines = Object.entries(cartItems)
        .map(([id, quantity]) => ({ product: products.find(item => item.id === Number(id)), quantity }))
        .filter((line) => Boolean(line.product));
    if (!lines.length) {
        list.innerHTML = '<div class="cart-empty"><span>🧺</span><h3>Your basket is waiting.</h3><p>Add a few good things from the market.</p></div>';
        total.textContent = money(0);
        return;
    }
    list.innerHTML = lines.map(({ product, quantity }) => `<article class="cart-item">
    <img src="${escapeHtml(product.image)}" alt="" />
    <div class="cart-item-info"><h3>${escapeHtml(product.name)}</h3><span>${money(product.price)} each</span>
      <div class="cart-item-controls"><button type="button" aria-label="Decrease ${escapeHtml(product.name)} quantity" data-action="decrease-cart" data-product-id="${product.id}">−</button><span>${quantity}</span><button type="button" aria-label="Increase ${escapeHtml(product.name)} quantity" data-action="increase-cart" data-product-id="${product.id}">+</button><button class="cart-remove" type="button" data-action="remove-cart" data-product-id="${product.id}">Remove</button></div>
    </div><b class="cart-line-total">${money(product.price * quantity)}</b>
  </article>`).join('');
    total.textContent = money(lines.reduce((sum, line) => sum + line.product.price * line.quantity, 0));
}
function openCart() {
    const drawer = document.querySelector('[data-cart-drawer]');
    if (!drawer)
        return;
    drawer.hidden = false;
    document.body.classList.add('cart-open');
    document.querySelector('[data-action="close-cart"]')?.focus();
}
function closeCart() {
    const drawer = document.querySelector('[data-cart-drawer]');
    if (!drawer)
        return;
    drawer.hidden = true;
    document.body.classList.remove('cart-open');
    const url = new URL(location.href);
    if (url.searchParams.get('view') === 'cart') {
        url.searchParams.delete('view');
        history.replaceState({}, '', `${url.pathname}${url.search}${url.hash}`);
    }
}
function initScrollMotion() {
    if (!('IntersectionObserver' in window) || window.matchMedia('(prefers-reduced-motion: reduce)').matches)
        return;
    const targets = document.querySelectorAll('main > section, .page-wrap > *');
    if (!targets.length)
        return;
    document.documentElement.classList.add('motion-ready');
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (!entry.isIntersecting)
                return;
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
        });
    }, { threshold: 0.12, rootMargin: '0px 0px -35px 0px' });
    targets.forEach((target, index) => {
        target.dataset.reveal = '';
        target.style.transitionDelay = `${Math.min(index % 4, 3) * 70}ms`;
        observer.observe(target);
    });
}
function showToast(message) {
    const toast = document.querySelector('#toast');
    if (!toast)
        return;
    toast.innerHTML = `<span>✓</span>${escapeHtml(message)}`;
    toast.classList.add('toast-visible');
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => toast.classList.remove('toast-visible'), 2400);
}
function updateQueryString() {
    const params = new URLSearchParams();
    if (activeView === 'favorites')
        params.set('view', 'favorites');
    if (activeCategory !== 'All items')
        params.set('category', activeCategory);
    if (activeSearch)
        params.set('search', activeSearch);
    if (activeSort !== 'Popular')
        params.set('sort', activeSort);
    const query = params.toString();
    history.replaceState({}, '', `${location.pathname}${query ? `?${query}` : ''}`);
}
function initShop() {
    const params = new URLSearchParams(location.search);
    activeView = params.get('view') === 'favorites' ? 'favorites' : 'shop';
    activeCategory = params.get('category') ?? 'All items';
    activeSearch = params.get('search') ?? '';
    activeSort = params.get('sort') ?? 'Popular';
    updateShop();
    if (params.get('view') === 'cart')
        openCart();
}
document.documentElement.classList.toggle('dark', localStorage.getItem('greenmarket-theme') === 'dark');
updateCartCount();
updateFavoriteCounts();
initScrollMotion();
document.addEventListener('error', event => {
    const target = event.target;
    if (!(target instanceof HTMLImageElement) || !target.hasAttribute('data-product-image'))
        return;
    if (target.dataset.fallbackApplied)
        return;
    target.dataset.fallbackApplied = 'true';
    target.src = './assets/healty-vegatable.png';
    target.alt = `${target.alt} (market produce image)`;
}, true);
document.addEventListener('click', event => {
    const target = event.target;
    if (!(target instanceof Element))
        return;
    const action = target.closest('[data-action]');
    if (action?.dataset.action === 'theme') {
        document.documentElement.classList.toggle('dark');
        localStorage.setItem('greenmarket-theme', document.documentElement.classList.contains('dark') ? 'dark' : 'light');
        action.textContent = document.documentElement.classList.contains('dark') ? '☼' : '◐';
    }
    else if (action?.dataset.action === 'search') {
        window.location.href = './shop.html?search=';
    }
    else if (action?.dataset.action === 'focus-search') {
        document.querySelector('[name="search"]')?.focus();
    }
    else if (action?.dataset.action === 'add') {
        const product = products.find(item => item.id === Number(action.dataset.productId));
        if (product) {
            const quantity = cartItems[product.id] ?? 0;
            if (!product.inStock || quantity >= product.stock) {
                showToast(`${product.name} is currently out of stock`);
                return;
            }
            cartItems[product.id] = quantity + 1;
            updateCartCount();
            showToast(`${product.name} added to your basket`);
        }
    }
    else if (action?.dataset.action === 'heart') {
        const productId = Number(action.dataset.productId);
        if (favorites.has(productId)) {
            favorites.delete(productId);
            showToast('Removed from your favorites');
        }
        else {
            favorites.add(productId);
            showToast('Saved to your favorites');
        }
        localStorage.setItem('greenmarket-favorites', JSON.stringify([...favorites]));
        if (activeView === 'favorites')
            updateShop();
        else
            action.closest('.product-card')?.querySelector('[data-action="heart"]')?.replaceWith(createFavoriteButton(productId));
        updateFavoriteCounts();
    }
    else if (action?.dataset.action === 'toggle-favorites') {
        activeView = activeView === 'favorites' ? 'shop' : 'favorites';
        activeCategory = 'All items';
        activeSearch = '';
        activeSort = 'Popular';
        updateQueryString();
        updateShop();
    }
    else if (action?.dataset.action === 'open-cart') {
        openCart();
    }
    else if (action?.dataset.action === 'close-cart' || (action?.dataset.action === 'cart-backdrop' && target === action)) {
        closeCart();
    }
    else if (action?.dataset.action === 'increase-cart' || action?.dataset.action === 'decrease-cart' || action?.dataset.action === 'remove-cart') {
        const productId = Number(action.dataset.productId);
        const product = products.find(item => item.id === productId);
        const quantity = cartItems[productId] ?? 0;
        if (action.dataset.action === 'remove-cart' || (action.dataset.action === 'decrease-cart' && quantity <= 1)) {
            delete cartItems[productId];
        }
        else if (action.dataset.action === 'decrease-cart') {
            cartItems[productId] = quantity - 1;
        }
        else if (product && quantity < product.stock) {
            cartItems[productId] = quantity + 1;
        }
        else {
            showToast(`Only ${product?.stock ?? 0} available`);
        }
        updateCartCount();
    }
    else if (action?.dataset.action === 'clear-filters') {
        activeView = 'shop';
        activeCategory = 'All items';
        activeSearch = '';
        activeSort = 'Popular';
        updateQueryString();
        updateShop();
    }
    const filter = target.closest('[data-filter]');
    if (filter) {
        activeCategory = filter.dataset.filter ?? 'All items';
        updateQueryString();
        updateShop();
    }
});
function createFavoriteButton(productId) {
    const product = products.find(item => item.id === productId);
    const isFavorite = favorites.has(productId);
    const button = document.createElement('button');
    button.className = `heart${isFavorite ? ' saved' : ''}`;
    button.type = 'button';
    button.setAttribute('aria-label', `${isFavorite ? 'Remove' : 'Save'} ${product?.name ?? 'product'} ${isFavorite ? 'from' : 'to'} favorites`);
    button.setAttribute('aria-pressed', String(isFavorite));
    button.dataset.action = 'heart';
    button.dataset.productId = String(productId);
    button.textContent = isFavorite ? '♥' : '♡';
    return button;
}
document.addEventListener('keydown', event => {
    if (event.key === 'Escape')
        closeCart();
});
document.addEventListener('change', event => {
    const target = event.target;
    if (target instanceof HTMLSelectElement && target.matches('[data-sort]')) {
        activeSort = target.value;
        updateQueryString();
        updateShop();
    }
});
document.addEventListener('submit', event => {
    const form = event.target;
    if (!(form instanceof HTMLFormElement))
        return;
    if (form.dataset.form === 'shop-search') {
        event.preventDefault();
        const data = new FormData(form);
        activeSearch = String(data.get('search') ?? '').trim();
        updateQueryString();
        updateShop();
    }
    else if (form.dataset.form === 'contact') {
        event.preventDefault();
        form.innerHTML = `<div class="form-success"><span>✳</span><h3>Thanks for stopping by.</h3><p>Your note is with our team. We’ll be in touch soon.</p></div>`;
    }
    else if (form.dataset.form === 'newsletter') {
        event.preventDefault();
        form.innerHTML = `<span class="newsletter-confirmation">Thanks for joining our list ✳</span>`;
    }
});
fetch(productsUrl)
    .then(response => {
    if (!response.ok)
        throw new Error(`Could not load product data (${response.status}).`);
    return response.json();
})
    .then(data => {
    products.push(...data);
    updateProductGrids();
    initShop();
})
    .catch(() => {
    document.querySelectorAll('[data-product-grid]').forEach(grid => {
        grid.innerHTML = `<div class="empty-state"><span>🌱</span><h2>The market is taking a little break.</h2><p>Please refresh to load today’s good things.</p></div>`;
    });
});
