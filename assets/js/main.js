/**
 * Caffè Veloura - Luxury European Specialty Café
 * Interactive Script
 */

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initStickyHeader();
  initNavigation();
  initMenuFilters();
  initBrewingSelector();
  initTestimonialCarousel();
  initReservationForm();
  initCart();
  initBackToTop();
  initScrollAnimations();
});

/* ==========================================================================
   1. Theme Management (Light / Dark Mode)
   ========================================================================== */
function initTheme() {
  const themeToggles = document.querySelectorAll('.theme-toggle-btn');
  const html = document.documentElement;

  // Retrieve saved preference or check system preference
  const savedTheme = localStorage.getItem('veloura-theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
    html.classList.add('dark');
    updateThemeIcons(true);
  } else {
    html.classList.remove('dark');
    updateThemeIcons(false);
  }

  themeToggles.forEach(btn => {
    btn.addEventListener('click', () => {
      const isDark = html.classList.toggle('dark');
      localStorage.setItem('veloura-theme', isDark ? 'dark' : 'light');
      updateThemeIcons(isDark);
    });
  });
}

function updateThemeIcons(isDark) {
  const sunIcons = document.querySelectorAll('.theme-sun-icon');
  const moonIcons = document.querySelectorAll('.theme-moon-icon');

  sunIcons.forEach(icon => {
    icon.classList.toggle('hidden', !isDark);
  });
  moonIcons.forEach(icon => {
    icon.classList.toggle('hidden', isDark);
  });
}

/* ==========================================================================
   2. Sticky Header & Active Nav Highlighting
   ========================================================================== */
function initStickyHeader() {
  const header = document.getElementById('main-header');
  if (!header) return;

  const handleScroll = () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled', 'shadow-md');
      header.classList.remove('py-4');
      header.classList.add('py-2.5');
    } else {
      header.classList.remove('scrolled', 'shadow-md');
      header.classList.add('py-4');
      header.classList.remove('py-2.5');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();
}

function initNavigation() {
  // Mobile & tablet drawer controls
  const mobileToggle = document.getElementById('mobile-menu-toggle');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileBackdrop = document.getElementById('mobile-menu-backdrop');
  const mobileClose = document.getElementById('mobile-menu-close');
  const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

  const openMobileMenu = () => {
    if (!mobileMenu) return;
    mobileMenu.classList.remove('translate-x-full');
    mobileBackdrop?.classList.remove('opacity-0', 'pointer-events-none');
    mobileToggle?.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  };

  const closeMobileMenu = () => {
    if (!mobileMenu) return;
    mobileMenu.classList.add('translate-x-full');
    mobileBackdrop?.classList.add('opacity-0', 'pointer-events-none');
    mobileToggle?.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  };

  mobileToggle?.addEventListener('click', openMobileMenu);
  mobileClose?.addEventListener('click', closeMobileMenu);
  mobileBackdrop?.addEventListener('click', closeMobileMenu);

  // Close drawer on Escape key press
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileMenu && !mobileMenu.classList.contains('translate-x-full')) {
      closeMobileMenu();
    }
  });

  // Close mobile nav when clicking internal links
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      closeMobileMenu();
    });
  });

  // Active section scroll spy for both desktop and mobile/tablet drawer
  const sections = document.querySelectorAll('section[id]');
  const desktopNavLinks = document.querySelectorAll('.nav-link');

  const highlightNav = () => {
    const scrollY = window.pageYOffset;
    let currentId = '';

    sections.forEach(section => {
      const sectionHeight = section.offsetHeight;
      const sectionTop = section.offsetTop - 120;
      const sectionId = section.getAttribute('id');

      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        currentId = sectionId;
      }
    });

    desktopNavLinks.forEach(link => {
      link.classList.remove('active-nav', 'text-[#C3A36B]');
      if (link.getAttribute('href') === `#${currentId}`) {
        link.classList.add('active-nav', 'text-[#C3A36B]');
      }
    });

    mobileNavLinks.forEach(link => {
      const isMatch = link.getAttribute('href') === `#${currentId}`;
      link.classList.toggle('active-mobile-nav', isMatch);
    });
  };

  window.addEventListener('scroll', highlightNav, { passive: true });
  highlightNav();
}

/* ==========================================================================
   3. Interactive Digital Menu Filter
   ========================================================================== */
function initMenuFilters() {
  const filterButtons = document.querySelectorAll('.menu-filter-btn');
  const menuItems = document.querySelectorAll('.menu-item-card');

  if (!filterButtons.length || !menuItems.length) return;

  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      const targetCategory = button.getAttribute('data-category');

      // Update active state of buttons
      filterButtons.forEach(btn => {
        btn.classList.remove('active-filter', 'bg-[#C3A36B]', 'text-[#F5EFE5]', 'dark:text-[#1F1412]');
        btn.classList.add('border-[#C3A36B]/40', 'text-[#30211D]', 'dark:text-[#F5EFE5]');
      });

      button.classList.add('active-filter', 'bg-[#C3A36B]', 'text-[#F5EFE5]', 'dark:text-[#1F1412]');
      button.classList.remove('border-[#C3A36B]/40');

      // Filter items with smooth transition
      menuItems.forEach(item => {
        const itemCategory = item.getAttribute('data-category');
        if (targetCategory === 'all' || itemCategory === targetCategory) {
          item.classList.remove('hidden');
          setTimeout(() => {
            item.classList.remove('opacity-0', 'scale-95');
            item.classList.add('opacity-100', 'scale-100');
          }, 20);
        } else {
          item.classList.add('opacity-0', 'scale-95');
          item.classList.remove('opacity-100', 'scale-100');
          setTimeout(() => {
            item.classList.add('hidden');
          }, 300);
        }
      });
    });
  });
}

/* ==========================================================================
   4. The Art of Brewing Interactive Selector
   ========================================================================== */
const brewingData = {
  pourover: {
    title: 'Precision Pour-Over Extraction',
    subtitle: 'V60 & Chemex Single-Origin Ritual',
    description: 'A delicate manual extraction that unveils the subtle floral notes, delicate citrus brightness, and distinct terroir of our Ethiopian and Geisha beans. Water is poured in concentric spirals at a precise 92°C with a spiral flow rate.',
    origin: 'Single-Origin Yirgacheffe & Gesha Village',
    ratio: '1:16 Coffee-to-Water',
    temp: '92°C / 197.6°F',
    time: '3 min 15 sec',
    flavorNotes: 'Bergamot, Jasmine Blossom, White Peach & Meyer Lemon',
    image: 'https://images.unsplash.com/photo-1517256064527-09c73fc73e38?auto=format&fit=crop&w=1200&q=85',
    imageAlt: 'Barista performing specialty pour-over coffee extraction with gooseneck kettle'
  },
  espresso: {
    title: 'Bespoke Espresso Extraction',
    subtitle: '9-Bar High-Pressure Artistry',
    description: 'The foundation of European café culture. Our custom three-group La Marzocco extracts 19 grams of finely ground Arabica heirloom beans under 9 bars of pressure, creating a dense hazelnut tiger-striped crema with luscious chocolate undertones.',
    origin: 'Veloura Heritage Reserve (Brazil, Colombia & Guatemala)',
    ratio: '1:2 Brew Ratio (19g in, 38g out)',
    temp: '93.5°C / 200°F',
    time: '28 - 30 sec',
    flavorNotes: 'Dark Cacao, Caramelized Fig, Roasted Hazelnut & Honey',
    image: 'https://images.unsplash.com/photo-1511920170033-f8396924c348?auto=format&fit=crop&w=1200&q=85',
    imageAlt: 'Rich espresso flowing from commercial portafilter with rich hazelnut crema'
  },
  frenchpress: {
    title: 'Artisanal French Press Immersion',
    subtitle: 'Full-Bodied European Classic',
    description: 'Complete immersion brewing retains the natural aromatic coffee oils that paper filters absorb. Coarsely ground beans steep quietly in hot spring water before a slow, calculated plunge delivers a deep, velvet texture and lingering finish.',
    origin: 'Sumatra Mandheling & Rwanda Bourbon',
    ratio: '1:15 Coffee-to-Water',
    temp: '94°C / 201.2°F',
    time: '4 min 00 sec',
    flavorNotes: 'Molasses, Dark Forest Blackberry, Nutmeg & Cedarwood',
    image: 'https://images.unsplash.com/photo-1518832553480-cd0e625ed3e6?auto=format&fit=crop&w=1200&q=85',
    imageAlt: 'Freshly pressed French press coffee surrounded by roasted beans'
  }
};

function initBrewingSelector() {
  const brewTabs = document.querySelectorAll('.brew-tab-btn');
  const brewImage = document.getElementById('brew-image');
  const brewTitle = document.getElementById('brew-title');
  const brewSubtitle = document.getElementById('brew-subtitle');
  const brewDescription = document.getElementById('brew-description');
  const brewOrigin = document.getElementById('brew-origin');
  const brewRatio = document.getElementById('brew-ratio');
  const brewTemp = document.getElementById('brew-temp');
  const brewTime = document.getElementById('brew-time');
  const brewFlavors = document.getElementById('brew-flavors');

  if (!brewTabs.length || !brewTitle) return;

  brewTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const method = tab.getAttribute('data-method');
      const data = brewingData[method];
      if (!data) return;

      // Update tab styles
      brewTabs.forEach(t => {
        t.classList.remove('active-brew-tab', 'border-gold', 'bg-gold/10', 'text-gold');
        t.classList.add('border-transparent', 'text-espresso/80', 'dark:text-ivory/70');
      });

      tab.classList.add('active-brew-tab', 'border-gold', 'bg-gold/10', 'text-gold');
      tab.classList.remove('border-transparent', 'text-espresso/80', 'dark:text-ivory/70');

      // Animate content swap
      const detailsContainer = document.getElementById('brew-details-container');
      if (detailsContainer) {
        detailsContainer.style.opacity = '0.3';
        detailsContainer.style.transform = 'translateY(8px)';
      }
      if (brewImage) {
        brewImage.style.opacity = '0.4';
      }

      setTimeout(() => {
        if (brewTitle) brewTitle.textContent = data.title;
        if (brewSubtitle) brewSubtitle.textContent = data.subtitle;
        if (brewDescription) brewDescription.textContent = data.description;
        if (brewOrigin) brewOrigin.textContent = data.origin;
        if (brewRatio) brewRatio.textContent = data.ratio;
        if (brewTemp) brewTemp.textContent = data.temp;
        if (brewTime) brewTime.textContent = data.time;
        if (brewFlavors) brewFlavors.textContent = data.flavorNotes;
        if (brewImage) {
          brewImage.src = data.image;
          brewImage.alt = data.imageAlt;
        }

        if (detailsContainer) {
          detailsContainer.style.opacity = '1';
          detailsContainer.style.transform = 'translateY(0)';
          detailsContainer.style.transition = 'all 0.4s ease';
        }
        if (brewImage) {
          brewImage.style.opacity = '1';
          brewImage.style.transition = 'opacity 0.4s ease';
        }
      }, 200);
    });
  });
}

/* ==========================================================================
   5. Guest Reviews & Testimonials Carousel
   ========================================================================== */
function initTestimonialCarousel() {
  const slides = document.querySelectorAll('.testimonial-slide');
  const prevBtn = document.getElementById('prev-testimonial');
  const nextBtn = document.getElementById('next-testimonial');
  const dots = document.querySelectorAll('.testimonial-dot');

  if (!slides.length) return;

  let currentIndex = 0;
  let autoplayInterval;

  const showSlide = (index) => {
    if (index < 0) {
      currentIndex = slides.length - 1;
    } else if (index >= slides.length) {
      currentIndex = 0;
    } else {
      currentIndex = index;
    }

    slides.forEach((slide, idx) => {
      if (idx === currentIndex) {
        slide.classList.remove('hidden', 'opacity-0');
        slide.classList.add('opacity-100');
      } else {
        slide.classList.add('hidden', 'opacity-0');
        slide.classList.remove('opacity-100');
      }
    });

    dots.forEach((dot, idx) => {
      if (idx === currentIndex) {
        dot.classList.add('w-8', 'bg-[#C3A36B]');
        dot.classList.remove('w-2.5', 'bg-[#C3A36B]/30');
      } else {
        dot.classList.remove('w-8', 'bg-[#C3A36B]');
        dot.classList.add('w-2.5', 'bg-[#C3A36B]/30');
      }
    });
  };

  const nextSlide = () => showSlide(currentIndex + 1);
  const prevSlide = () => showSlide(currentIndex - 1);

  nextBtn?.addEventListener('click', () => {
    nextSlide();
    resetAutoplay();
  });

  prevBtn?.addEventListener('click', () => {
    prevSlide();
    resetAutoplay();
  });

  dots.forEach((dot, idx) => {
    dot.addEventListener('click', () => {
      showSlide(idx);
      resetAutoplay();
    });
  });

  const startAutoplay = () => {
    autoplayInterval = setInterval(nextSlide, 7000);
  };

  const resetAutoplay = () => {
    clearInterval(autoplayInterval);
    startAutoplay();
  };

  startAutoplay();
}

/* ==========================================================================
   6. Table Reservation Form & Validation
   ========================================================================== */
function initReservationForm() {
  const form = document.getElementById('reservation-form');
  const dateInput = document.getElementById('res-date');
  const successModal = document.getElementById('reservation-success-modal');
  const closeModalBtn = document.getElementById('close-reservation-modal');
  const modalSummary = document.getElementById('modal-booking-summary');

  if (!form) return;

  // Set minimum date to today (prevent past reservations)
  if (dateInput) {
    const today = new Date().toISOString().split('T')[0];
    dateInput.min = today;
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('res-name');
    const email = document.getElementById('res-email');
    const phone = document.getElementById('res-phone');
    const date = document.getElementById('res-date');
    const time = document.getElementById('res-time');
    const guests = document.getElementById('res-guests');
    const requests = document.getElementById('res-requests');

    let isValid = true;

    // Helper for validation states
    const checkField = (field, condition) => {
      const errorMsg = field.parentElement.querySelector('.form-error-msg');
      if (!condition) {
        field.classList.add('border-red-500', 'focus:border-red-500');
        field.classList.remove('border-[#C3A36B]/40');
        if (errorMsg) errorMsg.classList.remove('hidden');
        isValid = false;
      } else {
        field.classList.remove('border-red-500', 'focus:border-red-500');
        field.classList.add('border-[#C3A36B]/40');
        if (errorMsg) errorMsg.classList.add('hidden');
      }
    };

    // Name validation
    checkField(name, name.value.trim().length >= 2);

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    checkField(email, emailRegex.test(email.value.trim()));

    // Phone validation (min 8 digits)
    const phoneRegex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
    checkField(phone, phoneRegex.test(phone.value.trim().replace(/\s+/g, '')));

    // Date validation (must not be past date)
    const todayStr = new Date().toISOString().split('T')[0];
    checkField(date, date.value !== '' && date.value >= todayStr);

    // Time validation
    checkField(time, time.value !== '');

    // Guests validation
    checkField(guests, guests.value !== '');

    if (isValid) {
      // Build summary
      const refCode = 'CV-' + Math.floor(100000 + Math.random() * 900000);
      const formattedDate = new Date(date.value).toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });

      if (modalSummary) {
        modalSummary.innerHTML = `
          <div class="space-y-2 text-sm leading-relaxed">
            <p><strong class="text-[#30211D] dark:text-[#F5EFE5]">Guest Name:</strong> ${escapeHtml(name.value.trim())}</p>
            <p><strong class="text-[#30211D] dark:text-[#F5EFE5]">Date & Time:</strong> ${formattedDate} at ${escapeHtml(time.value)}</p>
            <p><strong class="text-[#30211D] dark:text-[#F5EFE5]">Party Size:</strong> ${escapeHtml(guests.value)} Guests</p>
            <p><strong class="text-[#30211D] dark:text-[#F5EFE5]">Contact:</strong> ${escapeHtml(email.value.trim())} | ${escapeHtml(phone.value.trim())}</p>
            ${requests.value.trim() ? `<p><strong class="text-[#30211D] dark:text-[#F5EFE5]">Special Note:</strong> <em>${escapeHtml(requests.value.trim())}</em></p>` : ''}
            <div class="pt-3 border-t border-[#C3A36B]/30 flex items-center justify-between">
              <span class="text-xs uppercase tracking-wider text-[#C3A36B]">Reservation Ref</span>
              <span class="font-mono text-xs font-semibold text-[#30211D] dark:text-[#F5EFE5] bg-[#C3A36B]/15 px-2.5 py-1 rounded">${refCode}</span>
            </div>
          </div>
        `;
      }

      // Show modal
      if (successModal) {
        successModal.classList.remove('hidden');
        successModal.classList.add('flex');
        document.body.style.overflow = 'hidden';
      }

      // Reset form
      form.reset();
      if (dateInput) {
        dateInput.min = todayStr;
      }
    }
  });

  // Modal dismiss
  const closeModal = () => {
    if (successModal) {
      successModal.classList.add('hidden');
      successModal.classList.remove('flex');
      document.body.style.overflow = '';
    }
  };

  closeModalBtn?.addEventListener('click', closeModal);
  successModal?.addEventListener('click', (e) => {
    if (e.target === successModal) closeModal();
  });
}

function escapeHtml(text) {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return text.replace(/[&<>"']/g, m => map[m]);
}

/* ==========================================================================
   7. Back to Top Button
   ========================================================================== */
function initBackToTop() {
  const backToTopBtn = document.getElementById('back-to-top');
  if (!backToTopBtn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      backToTopBtn.classList.remove('opacity-0', 'pointer-events-none', 'translate-y-4');
      backToTopBtn.classList.add('opacity-100', 'translate-y-0');
    } else {
      backToTopBtn.classList.add('opacity-0', 'pointer-events-none', 'translate-y-4');
      backToTopBtn.classList.remove('opacity-100', 'translate-y-0');
    }
  }, { passive: true });

  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

/* ==========================================================================
   8. Scroll Reveal Observer
   ========================================================================== */
function initScrollAnimations() {
  const revealElements = document.querySelectorAll('.reveal-on-scroll');
  if (!revealElements.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  });

  revealElements.forEach(el => observer.observe(el));
}

/* ==========================================================================
   9. Luxury Shopping Cart System
   ========================================================================== */
function initCart() {
  const cartToggleBtn = document.getElementById('cart-drawer-toggle');
  const cartDrawer = document.getElementById('cart-drawer');
  const cartBackdrop = document.getElementById('cart-drawer-backdrop');
  const cartCloseBtn = document.getElementById('cart-drawer-close');
  const cartBadge = document.getElementById('cart-badge');
  const cartItemsList = document.getElementById('cart-items-list');
  const cartSubtotalEl = document.getElementById('cart-subtotal');
  const cartTotalEl = document.getElementById('cart-total');
  const cartEmptyState = document.getElementById('cart-empty-state');
  const cartFooter = document.getElementById('cart-footer');
  const checkoutBtn = document.getElementById('cart-checkout-btn');
  const checkoutModal = document.getElementById('checkout-success-modal');
  const closeCheckoutModalBtn = document.getElementById('close-checkout-modal');
  const checkoutSummaryEl = document.getElementById('checkout-order-summary');
  const cartToast = document.getElementById('cart-toast');

  const mobileCartToggleBtn = document.getElementById('mobile-cart-toggle');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileMenuBackdrop = document.getElementById('mobile-menu-backdrop');
  const mobileCartBadges = document.querySelectorAll('.mobile-cart-badge-count');

  // Load cart from localStorage
  const getCart = () => {
    try {
      const data = localStorage.getItem('veloura_cart');
      return data ? JSON.parse(data) : [];
    } catch (e) {
      return [];
    }
  };

  const saveCart = (cart) => {
    try {
      localStorage.setItem('veloura_cart', JSON.stringify(cart));
    } catch (e) {}
    updateBadge(cart);
    renderCart(cart);
  };

  const updateBadge = (cart = getCart()) => {
    const totalCount = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
    if (cartBadge) {
      cartBadge.textContent = totalCount;
      cartBadge.classList.remove('badge-pop');
      void cartBadge.offsetWidth; // trigger reflow
      cartBadge.classList.add('badge-pop');
    }
    mobileCartBadges.forEach(badge => {
      badge.textContent = totalCount;
    });
  };

  const openDrawer = () => {
    if (!cartDrawer) return;
    renderCart();
    cartDrawer.classList.remove('translate-x-full');
    cartBackdrop?.classList.remove('opacity-0', 'pointer-events-none');
    document.body.style.overflow = 'hidden';
  };

  const closeDrawer = () => {
    if (!cartDrawer) return;
    cartDrawer.classList.add('translate-x-full');
    cartBackdrop?.classList.add('opacity-0', 'pointer-events-none');
    document.body.style.overflow = '';
  };

  cartToggleBtn?.addEventListener('click', openDrawer);
  mobileCartToggleBtn?.addEventListener('click', () => {
    // Close mobile nav drawer first if open
    mobileMenu?.classList.add('translate-x-full');
    mobileMenuBackdrop?.classList.add('opacity-0', 'pointer-events-none');
    openDrawer();
  });
  cartCloseBtn?.addEventListener('click', closeDrawer);
  cartBackdrop?.addEventListener('click', closeDrawer);

  const renderCart = (cart = getCart()) => {
    if (!cartItemsList) return;

    if (cart.length === 0) {
      cartItemsList.innerHTML = '';
      cartEmptyState?.classList.remove('hidden');
      cartFooter?.classList.add('hidden');
      return;
    }

    cartEmptyState?.classList.add('hidden');
    cartFooter?.classList.remove('hidden');

    let subtotal = 0;
    cartItemsList.innerHTML = cart.map(item => {
      const itemTotal = item.price * item.quantity;
      subtotal += itemTotal;
      return `
        <div class="flex items-center gap-4 py-4 border-b border-gold/15 last:border-b-0" data-item-id="${item.id}">
          <img src="${item.image || 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=150&q=80'}" 
               alt="${escapeHtml(item.name)}" 
               class="w-16 h-16 rounded object-cover border border-gold/25 shrink-0 bg-espresso">
          <div class="flex-1 min-w-0">
            <h4 class="font-serif text-base font-medium text-espresso dark:text-ivory truncate">${escapeHtml(item.name)}</h4>
            <span class="text-xs text-gold font-medium block">€${Number(item.price).toFixed(2)}</span>
            <div class="flex items-center gap-2 mt-2">
              <button type="button" class="cart-qty-btn cart-qty-minus w-6 h-6 rounded border border-gold/30 hover:border-gold hover:bg-gold/10 text-espresso dark:text-ivory flex items-center justify-center text-xs font-semibold" data-id="${item.id}">-</button>
              <span class="text-xs font-semibold px-2 text-espresso dark:text-ivory">${item.quantity}</span>
              <button type="button" class="cart-qty-btn cart-qty-plus w-6 h-6 rounded border border-gold/30 hover:border-gold hover:bg-gold/10 text-espresso dark:text-ivory flex items-center justify-center text-xs font-semibold" data-id="${item.id}">+</button>
            </div>
          </div>
          <div class="flex flex-col items-end justify-between self-stretch shrink-0">
            <button type="button" class="cart-item-remove text-espresso/40 dark:text-ivory/40 hover:text-red-500 transition-colors p-1" data-id="${item.id}" aria-label="Remove item">
              <svg class="w-4 h-4 stroke-current" fill="none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
            </button>
            <span class="font-serif text-sm font-semibold text-espresso dark:text-ivory">€${itemTotal.toFixed(2)}</span>
          </div>
        </div>
      `;
    }).join('');

    if (cartSubtotalEl) cartSubtotalEl.textContent = `€${subtotal.toFixed(2)}`;
    if (cartTotalEl) cartTotalEl.textContent = `€${subtotal.toFixed(2)}`;

    // Quantity button listeners
    cartItemsList.querySelectorAll('.cart-qty-minus').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        updateItemQuantity(id, -1);
      });
    });

    cartItemsList.querySelectorAll('.cart-qty-plus').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        updateItemQuantity(id, 1);
      });
    });

    cartItemsList.querySelectorAll('.cart-item-remove').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        removeItem(id);
      });
    });
  };

  const updateItemQuantity = (id, delta) => {
    let cart = getCart();
    const item = cart.find(i => i.id === id);
    if (!item) return;

    item.quantity += delta;
    if (item.quantity <= 0) {
      cart = cart.filter(i => i.id !== id);
    }
    saveCart(cart);
  };

  const removeItem = (id) => {
    let cart = getCart();
    cart = cart.filter(i => i.id !== id);
    saveCart(cart);
  };

  const addItemToCart = (itemData) => {
    let cart = getCart();
    const existing = cart.find(i => i.id === itemData.id);
    if (existing) {
      existing.quantity += 1;
    } else {
      cart.push({
        id: itemData.id,
        name: itemData.name,
        price: parseFloat(itemData.price),
        image: itemData.image || '',
        quantity: 1
      });
    }
    saveCart(cart);
    showToastNotification(itemData);
  };

  const showToastNotification = (item) => {
    if (!cartToast) return;
    const toastTitle = document.getElementById('toast-item-name');
    if (toastTitle) toastTitle.textContent = item.name;

    cartToast.classList.remove('toast-slide-out');
    cartToast.classList.add('toast-slide-in');

    clearTimeout(cartToast._timeout);
    cartToast._timeout = setTimeout(() => {
      cartToast.classList.remove('toast-slide-in');
      cartToast.classList.add('toast-slide-out');
    }, 3500);
  };

  // Toast "View Cart" button
  const toastViewCartBtn = document.getElementById('toast-view-cart');
  toastViewCartBtn?.addEventListener('click', () => {
    cartToast?.classList.remove('toast-slide-in');
    cartToast?.classList.add('toast-slide-out');
    openDrawer();
  });

  // Delegated event listener for all .add-to-cart-btn across the page
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('.add-to-cart-btn');
    if (!btn) return;

    e.preventDefault();
    const id = btn.getAttribute('data-id') || btn.getAttribute('data-name');
    const name = btn.getAttribute('data-name');
    const price = btn.getAttribute('data-price') || '0';
    const image = btn.getAttribute('data-image') || '';

    addItemToCart({ id, name, price, image });

    // Button feedback animation
    const originalText = btn.innerHTML;
    btn.classList.add('bg-gold', 'text-espresso-deep');
    btn.innerHTML = `
      <svg class="w-3.5 h-3.5 stroke-current" fill="none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/></svg>
      <span>Added</span>
    `;
    setTimeout(() => {
      btn.innerHTML = originalText;
      btn.classList.remove('bg-gold', 'text-espresso-deep');
    }, 1500);
  });

  // Checkout handling
  checkoutBtn?.addEventListener('click', () => {
    const cart = getCart();
    if (cart.length === 0) return;

    const orderRef = 'VO-' + Math.floor(100000 + Math.random() * 900000);
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    if (checkoutSummaryEl) {
      checkoutSummaryEl.innerHTML = `
        <div class="space-y-3 text-xs leading-relaxed">
          <div class="flex items-center justify-between pb-2 border-b border-gold/20">
            <span class="font-semibold text-espresso dark:text-ivory">Order Reference:</span>
            <span class="font-mono font-bold text-gold">${orderRef}</span>
          </div>
          <div class="max-h-40 overflow-y-auto space-y-1.5 pr-1">
            ${cart.map(i => `
              <div class="flex items-center justify-between text-espresso/80 dark:text-ivory/80">
                <span>${i.quantity}x ${escapeHtml(i.name)}</span>
                <span class="font-serif">€${(i.price * i.quantity).toFixed(2)}</span>
              </div>
            `).join('')}
          </div>
          <div class="pt-2 border-t border-gold/30 flex items-center justify-between font-serif text-base font-semibold text-espresso dark:text-ivory">
            <span>Total Amount:</span>
            <span class="text-gold">€${total.toFixed(2)}</span>
          </div>
        </div>
      `;
    }

    closeDrawer();

    // Show checkout modal
    if (checkoutModal) {
      checkoutModal.classList.remove('hidden');
      checkoutModal.classList.add('flex');
      document.body.style.overflow = 'hidden';
    }

    // Clear cart on demo order completion
    saveCart([]);
  });

  const closeCheckoutModal = () => {
    if (checkoutModal) {
      checkoutModal.classList.add('hidden');
      checkoutModal.classList.remove('flex');
      document.body.style.overflow = '';
    }
  };

  closeCheckoutModalBtn?.addEventListener('click', closeCheckoutModal);
  checkoutModal?.addEventListener('click', (e) => {
    if (e.target === checkoutModal) closeCheckoutModal();
  });

  // Initialize badge on page load
  updateBadge();
}
