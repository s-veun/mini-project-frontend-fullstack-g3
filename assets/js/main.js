"use strict";
const productsUrl = './src/data/product.json?v=20261019-5';
const products = [];
let activeCategory = 'All items';
let activeSearch = '';
let activeSort = 'Popular';
let cartCount = Number(localStorage.getItem('greenmarket-cart') ?? '0');
let toastTimer = 0;
function escapeHtml(value) {
    return value.replace(/[&<>"']/g, character => ({
        '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
    })[character] ?? character);
}
function money(amount) {
    return `$${amount.toFixed(2)}`;
}
function productCard(product) {
    return `<article class="product-card">
    <div class="product-photo"><img src="${escapeHtml(product.image)}" alt="${escapeHtml(product.name)}" loading="lazy" data-product-image />
      ${product.discount > 0 ? `<span class="sale-pill">-${product.discount}%</span>` : ''}
      <button class="heart" type="button" aria-label="Save ${escapeHtml(product.name)}" data-action="heart">♡</button>
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
        : `<div class="empty-state"><span>🌱</span><h2>Nothing on this shelf just yet.</h2><p>Try another search or choose a different aisle.</p><button class="text-link" type="button" data-action="clear-filters">Show everything ↗</button></div>`;
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
}
function updateProductGrids() {
    document.querySelectorAll('[data-product-grid="featured"]').forEach(grid => {
        const featured = products.filter(product => product.isFeatured).slice(0, 4);
        grid.innerHTML = featured.map(productCard).join('');
    });
    updateShop();
}
function updateCartCount() {
    document.querySelectorAll('[data-cart-count]').forEach(element => {
        element.textContent = cartCount.toString().padStart(2, '0');
    });
    localStorage.setItem('greenmarket-cart', String(cartCount));
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
    activeCategory = params.get('category') ?? 'All items';
    activeSearch = params.get('search') ?? '';
    activeSort = params.get('sort') ?? 'Popular';
    updateShop();
}
document.documentElement.classList.toggle('dark', localStorage.getItem('greenmarket-theme') === 'dark');
updateCartCount();
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
            cartCount++;
            updateCartCount();
            showToast(`${product.name} added to your basket`);
        }
    }
    else if (action?.dataset.action === 'heart') {
        action.classList.toggle('saved');
    }
    else if (action?.dataset.action === 'clear-filters') {
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
