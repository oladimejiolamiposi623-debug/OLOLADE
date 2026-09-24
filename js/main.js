/**
 * LADE LUXURY TRENDZ — MAIN INTERACTIVE APPLICATION LOGIC
 * Navigation, Quick View Modal, Bag Drawer, Currency Switcher, Toasts & Forms
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Sticky Navigation Scroll Effect
  const header = document.querySelector('.site-header');
  if (header) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 40) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    });
  }

  // 2. Mobile Menu Drawer
  const hamburgerBtn = document.querySelector('.hamburger-btn');
  const mobileDrawer = document.querySelector('.mobile-nav-drawer');

  if (hamburgerBtn && mobileDrawer) {
    hamburgerBtn.addEventListener('click', () => {
      hamburgerBtn.classList.toggle('active');
      mobileDrawer.classList.toggle('open');
      document.body.style.overflow = mobileDrawer.classList.contains('open') ? 'hidden' : '';
    });

    // Close mobile menu when clicking any link
    const mobileLinks = mobileDrawer.querySelectorAll('.mobile-nav-link');
    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        hamburgerBtn.classList.remove('active');
        mobileDrawer.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  // 3. Currency State (NGN ₦ and USD $)
  let currentCurrency = 'NGN';
  const exchangeRate = 1500; // 1 USD = 1,500 NGN

  function formatPrice(ngnPrice) {
    if (currentCurrency === 'NGN') {
      return `₦${ngnPrice.toLocaleString('en-NG')}`;
    } else {
      const usd = Math.round(ngnPrice / exchangeRate);
      return `$${usd.toLocaleString('en-US')}`;
    }
  }

  function updateAllPrices() {
    document.querySelectorAll('[data-price-ngn]').forEach(el => {
      const ngn = parseInt(el.getAttribute('data-price-ngn'), 10);
      el.textContent = formatPrice(ngn);
    });
  }

  // Currency toggle buttons
  const currencyBtns = document.querySelectorAll('.currency-toggle-btn');
  currencyBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      currentCurrency = currentCurrency === 'NGN' ? 'USD' : 'NGN';
      currencyBtns.forEach(b => b.textContent = currentCurrency);
      updateAllPrices();
      showToast(`Currency switched to ${currentCurrency}`);
    });
  });

  // 4. Shopping Bag Drawer State
  const bagDrawer = document.querySelector('.bag-drawer');
  const bagBackdrop = document.querySelector('.bag-backdrop');
  const bagOpenBtns = document.querySelectorAll('.open-bag-btn');
  const bagCloseBtn = document.querySelector('.bag-close-btn');
  const bagBadge = document.querySelector('.bag-badge-count');
  const bagItemsContainer = document.querySelector('.bag-drawer-items');
  const bagSubtotalEl = document.querySelector('.bag-subtotal-val');

  let cart = [
    {
      id: 'lade-item-1',
      title: 'Embroidered Silk Gala Gown',
      priceNgn: 450000,
      image: 'assets/images/prod-dress.jpg',
      size: 'Custom Fit'
    }
  ];

  function renderBag() {
    if (!bagItemsContainer) return;

    if (cart.length === 0) {
      bagItemsContainer.innerHTML = `
        <div style="text-align: center; padding: 40px 10px; color: var(--color-warm-beige);">
          <p style="font-family: var(--font-serif); font-size: 1.2rem; margin-bottom: 8px;">Your Bag is Empty</p>
          <p style="font-size: 0.85rem; opacity: 0.8;">Explore our signature selection to curate your luxury wardrobe.</p>
        </div>
      `;
      if (bagSubtotalEl) bagSubtotalEl.textContent = formatPrice(0);
      if (bagBadge) bagBadge.textContent = '0';
      return;
    }

    bagItemsContainer.innerHTML = '';
    let totalNgn = 0;

    cart.forEach((item, index) => {
      totalNgn += item.priceNgn;
      const itemEl = document.createElement('div');
      itemEl.className = 'bag-item-card';
      itemEl.innerHTML = `
        <img src="${item.image}" alt="${item.title}" class="bag-item-thumb">
        <div class="bag-item-info">
          <div class="bag-item-title">${item.title}</div>
          <div style="font-size: 0.75rem; color: var(--color-warm-beige); opacity: 0.8;">Size: ${item.size}</div>
          <div class="bag-item-price" data-price-ngn="${item.priceNgn}">${formatPrice(item.priceNgn)}</div>
          <button class="bag-remove-btn" data-index="${index}">Remove</button>
        </div>
      `;
      bagItemsContainer.appendChild(itemEl);
    });

    if (bagSubtotalEl) bagSubtotalEl.textContent = formatPrice(totalNgn);
    if (bagBadge) bagBadge.textContent = String(cart.length);

    // Bind remove buttons
    bagItemsContainer.querySelectorAll('.bag-remove-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const index = parseInt(e.target.getAttribute('data-index'), 10);
        const removed = cart.splice(index, 1);
        renderBag();
        showToast(`Removed from bag`);
      });
    });
  }

  function openBag() {
    if (bagDrawer) bagDrawer.classList.add('active');
    if (bagBackdrop) bagBackdrop.classList.add('active');
  }

  function closeBag() {
    if (bagDrawer) bagDrawer.classList.remove('active');
    if (bagBackdrop) bagBackdrop.classList.remove('active');
  }

  bagOpenBtns.forEach(btn => btn.addEventListener('click', openBag));
  if (bagCloseBtn) bagCloseBtn.addEventListener('click', closeBag);
  if (bagBackdrop) bagBackdrop.addEventListener('click', closeBag);

  // Initialize Bag
  renderBag();

  // 5. Add to Bag Action
  document.querySelectorAll('.add-bag-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const card = btn.closest('.product-card');
      if (!card) return;

      const title = card.querySelector('.product-name')?.textContent || 'Luxury Piece';
      const priceNgn = parseInt(card.querySelector('[data-price-ngn]')?.getAttribute('data-price-ngn') || '250000', 10);
      const img = card.querySelector('.product-image-box img')?.getAttribute('src') || 'assets/images/prod-dress.jpg';

      cart.push({
        id: 'lade-item-' + Date.now(),
        title: title,
        priceNgn: priceNgn,
        image: img,
        size: 'Standard / Custom'
      });

      renderBag();
      showToast(`Added "${title}" to your Luxury Bag`);
      openBag();
    });
  });

  // 6. Quick View Modal
  const quickViewModal = document.querySelector('#quickViewModal');
  const modalCloseBtn = quickViewModal?.querySelector('.modal-close-btn');

  document.querySelectorAll('.quick-view-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const card = btn.closest('.product-card');
      if (!card || !quickViewModal) return;

      const title = card.querySelector('.product-name')?.textContent || 'Lade Luxury Piece';
      const priceNgn = parseInt(card.querySelector('[data-price-ngn]')?.getAttribute('data-price-ngn') || '250000', 10);
      const category = card.querySelector('.product-tag')?.textContent || 'Exclusive';
      const imgSrc = card.querySelector('.product-image-box img')?.getAttribute('src') || '';

      const modalImg = quickViewModal.querySelector('.modal-product-img');
      const modalTitle = quickViewModal.querySelector('.modal-product-title');
      const modalCategory = quickViewModal.querySelector('.modal-product-category');
      const modalPrice = quickViewModal.querySelector('.modal-product-price');

      if (modalImg) modalImg.src = imgSrc;
      if (modalTitle) modalTitle.textContent = title;
      if (modalCategory) modalCategory.textContent = category;
      if (modalPrice) {
        modalPrice.setAttribute('data-price-ngn', priceNgn);
        modalPrice.textContent = formatPrice(priceNgn);
      }

      quickViewModal.classList.add('active');
    });
  });

  if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', () => {
      quickViewModal.classList.remove('active');
    });
  }

  if (quickViewModal) {
    quickViewModal.addEventListener('click', (e) => {
      if (e.target === quickViewModal) {
        quickViewModal.classList.remove('active');
      }
    });
  }

  // 7. Toast Notification Utility
  const toastEl = document.querySelector('.luxury-toast');
  let toastTimer = null;

  window.showToast = function(message) {
    if (!toastEl) return;
    const msgSpan = toastEl.querySelector('.toast-msg');
    if (msgSpan) msgSpan.textContent = message;

    toastEl.classList.add('active');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toastEl.classList.remove('active');
    }, 3800);
  };

  // 8. Newsletter Forms
  const newsletterForms = document.querySelectorAll('.footer-newsletter-form');
  newsletterForms.forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = form.querySelector('input[type="email"]');
      if (input && input.value.trim() !== '') {
        showToast('Welcome to the LADE Circle. You are now subscribed.');
        input.value = '';
      }
    });
  });

  // 9. Contact & Booking Forms
  const contactForm = document.querySelector('#ladeContactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const nameInput = contactForm.querySelector('input[name="fullName"]');
      const name = nameInput ? nameInput.value : 'Guest';
      showToast(`Thank you, ${name}. Your consultation inquiry has been received.`);
      contactForm.reset();
    });
  }

  // 10. Bag Checkout / WhatsApp Concierge Inquiry
  const checkoutBtn = document.querySelector('.bag-checkout-btn');
  if (checkoutBtn) {
    checkoutBtn.addEventListener('click', () => {
      if (cart.length === 0) {
        showToast('Your bag is currently empty.');
        return;
      }
      const itemsList = cart.map(i => `${i.title} (${formatPrice(i.priceNgn)})`).join(', ');
      const msg = encodeURIComponent(`Hello Lade Luxury Trendz, I would like to inquire about ordering the following pieces: ${itemsList}`);
      window.open(`https://wa.me/2340000000000?text=${msg}`, '_blank');
    });
  }
});
