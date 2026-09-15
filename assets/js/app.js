// Sogno Coffee - ZUS Benchmark Mobile Application Logic
// Enhanced with Tasting Profiles & Frictionless Pickup/Delivery Flow

document.addEventListener('DOMContentLoaded', () => {
  // State
  let currentOutlet = SOGNO_OUTLETS[0];
  let currentOrderType = 'pickup'; // 'pickup' or 'delivery'
  let currentCategory = 'all';
  let cart = [];
  let appliedVoucher = null;
  let activeCustomizingItem = null;
  let customQty = 1;
  let selectedOptions = {};

  // Elements
  const outletModal = document.getElementById('appOutletModal');
  const selectedStoreName = document.getElementById('appSelectedStoreName');
  const storeTimeSub = document.getElementById('appStoreTimeSub');
  const togglePickup = document.getElementById('appTogglePickup');
  const toggleDelivery = document.getElementById('appToggleDelivery');
  const searchInput = document.getElementById('appSearchInput');
  const categoryNav = document.getElementById('appCategoryNavPills');
  const productsContainer = document.getElementById('appProductsContainer');
  const floatingCart = document.getElementById('appFloatingCart');
  const cartCount = document.getElementById('appCartCount');
  const cartTotal = document.getElementById('appCartTotal');
  const cartTypeLabel = document.getElementById('appCartOrderTypeLabel');
  const customModal = document.getElementById('appCustomModal');
  const checkoutModal = document.getElementById('appCheckoutModal');
  const trackingModal = document.getElementById('appTrackingModal');

  // Initialize
  initOutletUI();
  renderCategories();
  renderProducts();
  updateCartBar();

  // 1. Outlet Switcher Logic
  function initOutletUI() {
    if (selectedStoreName) selectedStoreName.textContent = `${currentOutlet.name} ▾`;
    if (storeTimeSub) {
      storeTimeSub.textContent = currentOrderType === 'pickup'
        ? `Ready in ${currentOutlet.pickupTime} • Self-Pickup (${currentOutlet.distance})`
        : `Est. ${currentOutlet.deliveryTime} • Delivery to Location`;
    }
    if (cartTypeLabel) {
      cartTypeLabel.textContent = currentOrderType === 'pickup' ? 'Self-Pickup' : 'Delivery';
    }

    const outletOptionsList = document.getElementById('appOutletListOptions');
    if (outletOptionsList) {
      outletOptionsList.innerHTML = SOGNO_OUTLETS.map(o => `
        <div class="outlet-modal-card ${o.id === currentOutlet.id ? 'active' : ''}" data-id="${o.id}">
          <div>
            <div style="font-weight:800;font-size:14px;color:var(--sogno-maroon-deep);">${o.name}</div>
            <p style="font-size:11px;color:#666;margin:2px 0;">${o.address}</p>
            <span style="font-size:10px;font-weight:700;color:var(--sogno-gold);">${o.tag} • ${o.hours} (${o.distance})</span>
          </div>
          <button style="background:var(--sogno-maroon);color:#fff;border:none;padding:6px 14px;border-radius:20px;font-size:11px;font-weight:800;cursor:pointer;">Select</button>
        </div>
      `).join('');

      outletOptionsList.querySelectorAll('.outlet-modal-card').forEach(card => {
        card.addEventListener('click', () => {
          const id = card.dataset.id;
          currentOutlet = SOGNO_OUTLETS.find(o => o.id === id);
          initOutletUI();
          closeModal(outletModal);
        });
      });
    }
  }

  const storeTrigger = document.getElementById('appStoreDropdownTrigger');
  if (storeTrigger) storeTrigger.addEventListener('click', () => openModal(outletModal));

  // 2. Pickup vs Delivery Toggle
  if (togglePickup && toggleDelivery) {
    togglePickup.addEventListener('click', () => {
      currentOrderType = 'pickup';
      togglePickup.classList.add('active');
      toggleDelivery.classList.remove('active');
      initOutletUI();
      updateCheckoutReviewTotals();
    });
    toggleDelivery.addEventListener('click', () => {
      currentOrderType = 'delivery';
      toggleDelivery.classList.add('active');
      togglePickup.classList.remove('active');
      initOutletUI();
      updateCheckoutReviewTotals();
    });
  }

  // 3. Category Nav Rendering
  function renderCategories() {
    if (!categoryNav) return;
    let html = `
      <div class="app-cat-pill active" data-cat="all">
        <span>✨ All Menu</span>
      </div>
    `;
    SOGNO_CATEGORIES.forEach(cat => {
      html += `
        <div class="app-cat-pill" data-cat="${cat.id}">
          <span>${cat.icon} ${cat.name}</span>
        </div>
      `;
    });
    categoryNav.innerHTML = html;

    categoryNav.querySelectorAll('.app-cat-pill').forEach(pill => {
      pill.addEventListener('click', () => {
        categoryNav.querySelectorAll('.app-cat-pill').forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        currentCategory = pill.dataset.cat;
        renderProducts();
      });
    });
  }

  // 4. Products Rendering (ZUS Benchmark Cards with Tasting Notes)
  function renderProducts() {
    if (!productsContainer) return;
    const query = searchInput ? searchInput.value.toLowerCase().trim() : '';
    let filtered = SOGNO_MENU;

    if (currentCategory !== 'all') {
      filtered = filtered.filter(i => i.categoryId === currentCategory);
    }
    if (query) {
      filtered = filtered.filter(i => 
        i.name.toLowerCase().includes(query) ||
        i.description.toLowerCase().includes(query) ||
        i.categoryName.toLowerCase().includes(query)
      );
    }

    if (filtered.length === 0) {
      productsContainer.innerHTML = `
        <div style="text-align:center;padding:40px 20px;color:#999;">
          <p style="font-size:26px;">☕</p>
          <p style="font-size:13px;font-weight:700;margin-top:8px;">No items match "${query}"</p>
        </div>
      `;
      return;
    }

    if (currentCategory === 'all' && !query) {
      let fullHtml = '';
      SOGNO_CATEGORIES.forEach(cat => {
        const catItems = filtered.filter(i => i.categoryId === cat.id);
        if (catItems.length > 0) {
          fullHtml += `
            <div class="app-menu-section" id="sec-${cat.id}">
              <div class="app-section-title">
                <h3>${cat.icon} ${cat.name}</h3>
                <span>${cat.tag}</span>
              </div>
              <div class="app-items-col">
                ${catItems.map(item => buildAppProductCard(item)).join('')}
              </div>
            </div>
          `;
        }
      });
      productsContainer.innerHTML = fullHtml;
    } else {
      productsContainer.innerHTML = `
        <div class="app-menu-section">
          <div class="app-items-col">
            ${filtered.map(item => buildAppProductCard(item)).join('')}
          </div>
        </div>
      `;
    }

    // Attach click to open customization modal
    productsContainer.querySelectorAll('.app-product-card').forEach(card => {
      card.addEventListener('click', () => {
        const itemId = card.dataset.id;
        const item = SOGNO_MENU.find(i => i.id === itemId);
        if (item) openCustomizationSheet(item);
      });
    });
  }

  function buildAppProductCard(item) {
    let imgBlock = '';
    if (item.image) {
      imgBlock = `<img src="${item.image}" alt="${item.name}" loading="lazy" />`;
    } else {
      const sym = item.type === 'pastry' ? '🥐' : (item.categoryId === 'frappe' ? '🥤' : (item.categoryId === 'milk-series' ? '🥛' : '☕'));
      imgBlock = `
        <div class="culinary-placeholder">
          <span class="icon-sym">${sym}</span>
          <span class="source-lbl">Sogno Kitchen</span>
        </div>
      `;
    }

    return `
      <div class="app-product-card" data-id="${item.id}">
        <div class="app-card-img-wrap">
          ${imgBlock}
          ${item.badge ? `<span class="app-item-badge">${item.badge}</span>` : ''}
        </div>
        <div class="app-card-info">
          <div class="app-card-title-row">
            <h4>${item.name}</h4>
            <p class="app-card-desc">${item.description}</p>
            ${item.tastingNotes ? `
              <div class="app-card-tasting-notes">
                ${item.tastingNotes.slice(0, 2).map(n => `<span class="tasting-chip">${n}</span>`).join('')}
              </div>
            ` : ''}
          </div>
          <div class="app-card-bottom">
            <span class="app-card-price">${item.formattedPrice}</span>
            <button class="app-card-add-circle" aria-label="Add ${item.name}">+</button>
          </div>
        </div>
      </div>
    `;
  }

  if (searchInput) {
    searchInput.addEventListener('input', () => renderProducts());
  }

  // 5. Customization Bottom Sheet Logic
  function openCustomizationSheet(item) {
    activeCustomizingItem = item;
    customQty = 1;
    selectedOptions = {
      temp: item.options?.temp ? item.options.temp[0] : null,
      sweetness: item.options?.sweetness ? item.options.sweetness[0] : null,
      milk: item.options?.milk ? item.options.milk[0] : null,
      serving: item.options?.serving ? item.options.serving[0] : null,
      bean: item.options?.bean ? item.options.bean[0] : null
    };

    document.getElementById('customSheetItemName').textContent = item.name;
    document.getElementById('customSheetItemDesc').textContent = item.description;
    document.getElementById('customSheetItemPrice').textContent = item.formattedPrice;
    document.getElementById('customStepQty').textContent = customQty;

    const body = document.getElementById('customSheetOptionsBody');
    let optsHtml = '';

    if (item.options?.temp) {
      optsHtml += buildCustomGroup('Temperature', 'temp', item.options.temp);
    }
    if (item.options?.sweetness) {
      optsHtml += buildCustomGroup('Sweetness Level', 'sweetness', item.options.sweetness);
    }
    if (item.options?.milk) {
      optsHtml += buildCustomGroup('Milk Selection', 'milk', item.options.milk);
    }
    if (item.options?.bean) {
      optsHtml += buildCustomGroup('Espresso Roast', 'bean', item.options.bean);
    }
    if (item.options?.serving) {
      optsHtml += buildCustomGroup('Pastry Preparation', 'serving', item.options.serving);
    }

    body.innerHTML = optsHtml;

    body.querySelectorAll('.custom-option-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        const group = chip.dataset.group;
        const val = chip.dataset.val;
        selectedOptions[group] = val;
        chip.parentElement.querySelectorAll('.custom-option-chip').forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        recalculateCustomTotal();
      });
    });

    recalculateCustomTotal();
    openModal(customModal);
  }

  window.openCustomizationFromExternal = function(item) {
    openCustomizationSheet(item);
  };

  function buildCustomGroup(title, key, choices) {
    return `
      <div class="custom-group-block">
        <h5>${title}</h5>
        <div class="custom-pills-row">
          ${choices.map((ch, idx) => `
            <button type="button" class="custom-option-chip ${idx === 0 ? 'active' : ''}" data-group="${key}" data-val="${ch}">
              ${ch}
            </button>
          `).join('')}
        </div>
      </div>
    `;
  }

  function recalculateCustomTotal() {
    if (!activeCustomizingItem) return;
    let extra = 0;
    if (selectedOptions.milk && selectedOptions.milk.includes('+RM 3.00')) extra += 3.00;
    if (selectedOptions.milk && selectedOptions.milk.includes('+RM 2.00')) extra += 2.00;
    if (selectedOptions.bean && selectedOptions.bean.includes('+RM 2.50')) extra += 2.50;

    const unit = activeCustomizingItem.price + extra;
    const finalTotal = unit * customQty;
    document.getElementById('customFooterPrice').textContent = `• RM ${finalTotal.toFixed(2)}`;
  }

  const minusBtn = document.getElementById('customStepMinus');
  const plusBtn = document.getElementById('customStepPlus');
  if (minusBtn && plusBtn) {
    minusBtn.addEventListener('click', () => {
      if (customQty > 1) {
        customQty--;
        document.getElementById('customStepQty').textContent = customQty;
        recalculateCustomTotal();
      }
    });
    plusBtn.addEventListener('click', () => {
      customQty++;
      document.getElementById('customStepQty').textContent = customQty;
      recalculateCustomTotal();
    });
  }

  const confirmAddBtn = document.getElementById('btnConfirmAddToBag');
  if (confirmAddBtn) {
    confirmAddBtn.addEventListener('click', () => {
      if (!activeCustomizingItem) return;

      let extra = 0;
      if (selectedOptions.milk && selectedOptions.milk.includes('+RM 3.00')) extra += 3.00;
      if (selectedOptions.milk && selectedOptions.milk.includes('+RM 2.00')) extra += 2.00;
      if (selectedOptions.bean && selectedOptions.bean.includes('+RM 2.50')) extra += 2.50;

      const unitPrice = activeCustomizingItem.price + extra;
      const notes = Object.values(selectedOptions).filter(Boolean).join(', ');

      cart.push({
        id: Date.now().toString(),
        name: activeCustomizingItem.name,
        unitPrice: unitPrice,
        qty: customQty,
        notes: notes,
        total: unitPrice * customQty
      });

      updateCartBar();
      closeModal(customModal);
    });
  }

  // 6. Floating Cart Bar
  function updateCartBar() {
    const totalQty = cart.reduce((sum, i) => sum + i.qty, 0);
    const subtotal = cart.reduce((sum, i) => sum + i.total, 0);

    if (totalQty > 0) {
      floatingCart.style.display = 'flex';
      cartCount.textContent = totalQty;
      cartTotal.textContent = `RM ${subtotal.toFixed(2)}`;
      cartTypeLabel.textContent = currentOrderType === 'pickup' ? 'Self-Pickup' : 'Delivery';
    } else {
      floatingCart.style.display = 'none';
    }
  }

  if (floatingCart) {
    floatingCart.addEventListener('click', () => {
      renderCheckoutItems();
      updateCheckoutReviewTotals();
      openModal(checkoutModal);
    });
  }

  // 7. Checkout Review Bag
  function renderCheckoutItems() {
    const list = document.getElementById('checkoutItemsContainer');
    if (!list) return;

    if (cart.length === 0) {
      list.innerHTML = `<p style="text-align:center;color:#888;padding:24px;">Your bag is currently empty.</p>`;
      return;
    }

    list.innerHTML = cart.map(item => `
      <div style="display:flex;justify-content:space-between;align-items:center;padding:12px 0;border-bottom:1px solid #EFEFEF;">
        <div>
          <h5 style="font-size:14px;font-weight:800;color:var(--sogno-maroon-deep);">${item.qty}x ${item.name}</h5>
          <p style="font-size:11px;color:#777;margin-top:2px;">${item.notes || 'Standard Preparation'}</p>
        </div>
        <div style="display:flex;align-items:center;gap:12px;">
          <span style="font-family:var(--font-mono);font-size:14px;font-weight:800;color:var(--sogno-maroon);">RM ${item.total.toFixed(2)}</span>
          <button class="remove-cart-item-btn" data-id="${item.id}" style="background:transparent;border:none;color:#DC2626;font-size:16px;cursor:pointer;">✕</button>
        </div>
      </div>
    `).join('');

    list.querySelectorAll('.remove-cart-item-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = btn.dataset.id;
        cart = cart.filter(i => i.id !== id);
        updateCartBar();
        renderCheckoutItems();
        updateCheckoutReviewTotals();
        if (cart.length === 0) closeModal(checkoutModal);
      });
    });
  }

  function updateCheckoutReviewTotals() {
    const subtotal = cart.reduce((sum, i) => sum + i.total, 0);
    const tax = subtotal * 0.06;
    const delivery = (currentOrderType === 'delivery' && subtotal > 0) ? 5.00 : 0.00;

    let discount = 0;
    if (appliedVoucher) {
      discount = appliedVoucher.type === 'flat' ? appliedVoucher.discount : subtotal * appliedVoucher.discount;
    }

    const grandTotal = Math.max(0, subtotal + tax + delivery - discount);

    const subEl = document.getElementById('coSubtotalVal');
    const taxEl = document.getElementById('coTaxVal');
    const delEl = document.getElementById('coDeliveryVal');
    const discEl = document.getElementById('coDiscountVal');
    const totEl = document.getElementById('coFinalTotalVal');

    if (subEl) subEl.textContent = `RM ${subtotal.toFixed(2)}`;
    if (taxEl) taxEl.textContent = `RM ${tax.toFixed(2)}`;
    if (delEl) delEl.textContent = delivery > 0 ? `RM ${delivery.toFixed(2)}` : 'FREE';
    if (discEl) discEl.textContent = discount > 0 ? `- RM ${discount.toFixed(2)}` : 'RM 0.00';
    if (totEl) totEl.textContent = `RM ${grandTotal.toFixed(2)}`;
  }

  // Voucher Application
  const applyVoucherBtn = document.getElementById('appApplyVoucherBtn');
  const voucherInput = document.getElementById('appVoucherInput');
  const voucherFeedback = document.getElementById('appVoucherFeedback');

  if (applyVoucherBtn && voucherInput) {
    applyVoucherBtn.addEventListener('click', () => {
      const code = voucherInput.value.toUpperCase().trim();
      const match = SOGNO_VOUCHERS.find(v => v.code === code);
      if (match) {
        appliedVoucher = match;
        voucherFeedback.style.display = 'block';
        voucherFeedback.style.color = '#166534';
        voucherFeedback.textContent = `✓ Active: ${match.label}`;
        updateCheckoutReviewTotals();
      } else {
        voucherFeedback.style.display = 'block';
        voucherFeedback.style.color = '#DC2626';
        voucherFeedback.textContent = `Invalid code. Try "SOGNO20" for 20% off!`;
      }
    });
  }

  // Final Order Placement
  const placeOrderFinal = document.getElementById('btnPlaceOrderFinal');
  if (placeOrderFinal) {
    placeOrderFinal.addEventListener('click', () => {
      if (cart.length === 0) return;

      const rnd = Math.floor(1000 + Math.random() * 9000);
      const code = `SG-${rnd}`;
      const codeEl = document.getElementById('appTrackingCode');
      const outletLabel = document.getElementById('appTrackingOutletLabel');

      if (codeEl) codeEl.textContent = `Order #${code}`;
      if (outletLabel) outletLabel.textContent = `${currentOutlet.name} (${currentOrderType === 'pickup' ? 'Self-Pickup' : 'Delivery'})`;

      closeModal(checkoutModal);
      cart = [];
      appliedVoucher = null;
      updateCartBar();
      openModal(trackingModal);

      setTimeout(() => {
        const step2 = document.getElementById('stepBakerActive');
        if (step2) {
          step2.classList.add('active');
          const circle = step2.querySelector('.step-circle');
          if (circle) {
            circle.style.background = 'var(--sogno-maroon)';
            circle.style.color = '#fff';
          }
          const span = step2.querySelector('span');
          if (span) span.style.color = 'var(--sogno-maroon)';
        }
      }, 3000);
    });
  }

  // Modal Helpers
  function openModal(el) {
    if (el) el.classList.add('active');
  }

  function closeModal(el) {
    if (el) el.classList.remove('active');
  }

  document.querySelectorAll('.close-sheet-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const parent = btn.closest('.app-sheet-backdrop');
      if (parent) closeModal(parent);
    });
  });

  document.querySelectorAll('.app-sheet-backdrop').forEach(bg => {
    bg.addEventListener('click', (e) => {
      if (e.target === bg) closeModal(bg);
    });
  });
});
