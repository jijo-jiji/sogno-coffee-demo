// Sogno Coffee ordering app

(function () {
  const DELIVERY_FEE = 5.00;
  const SST_RATE = 0.06;
  const MAX_QTY = 20;

  const PAYMENTS = [
    { id: 'duitnow', label: 'DuitNow QR', abbr: 'QR', color: '#E8336D' },
    { id: 'tng', label: "Touch 'n Go eWallet", abbr: 'TNG', color: '#1E5BC6' },
    { id: 'card', label: 'Credit / debit card', abbr: 'CARD', color: '#1D1517' },
    { id: 'fpx', label: 'FPX online banking', abbr: 'FPX', color: '#0B7A5A' },
    { id: 'counter', label: 'Pay at counter', abbr: 'RM', color: '#8A6A3F', pickupOnly: true }
  ];

  const state = {
    outlet: SOGNO_OUTLETS[0],
    mode: 'pickup',
    query: '',
    cart: [],
    voucherCode: null,
    payment: 'duitnow',
    item: null,
    selections: {},
    qty: 1,
    activeCat: SOGNO_CATEGORIES[0].id,
    railLockUntil: 0,
    orders: [],
    viewingOrder: null
  };

  const $ = (id) => document.getElementById(id);
  const menuById = Object.fromEntries(SOGNO_MENU.map((i) => [i.id, i]));
  const money = (n) => `RM ${n.toFixed(2)}`;
  const round2 = (n) => Math.round(n * 100) / 100;
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  const els = {
    app: $('app'),
    list: $('list'),
    rail: $('rail'),
    search: $('searchInput'),
    searchClear: $('searchClear'),
    cartBar: $('cartBar'),
    orderBar: $('orderBar'),
    ordersSheet: $('ordersSheet'),
    toast: $('toast'),
    itemSheet: $('itemSheet'),
    outletSheet: $('outletSheet'),
    cartSheet: $('cartSheet'),
    orderSheet: $('orderSheet')
  };

  /* ---------- Sheets ---------- */
  let sheetZ = 40;
  const sheetStack = [];

  function openSheet(sheet) {
    if (!sheet.hidden) return;
    sheet.style.zIndex = ++sheetZ;
    sheet.hidden = false;
    sheetStack.push({ sheet, focus: document.activeElement });
    const focusTarget = sheet.querySelector('[data-close], button, input');
    if (focusTarget) focusTarget.focus({ preventScroll: true });
  }

  function closeSheet(sheet) {
    if (sheet.hidden) return;
    sheet.hidden = true;
    const idx = sheetStack.findIndex((s) => s.sheet === sheet);
    if (idx > -1) {
      const [entry] = sheetStack.splice(idx, 1);
      if (entry.focus && document.contains(entry.focus)) entry.focus.focus({ preventScroll: true });
    }
    if (sheet === els.orderSheet) state.viewingOrder = null;
  }

  document.querySelectorAll('.sheet').forEach((sheet) => {
    sheet.addEventListener('click', (e) => {
      if (e.target === sheet && sheet !== els.orderSheet) closeSheet(sheet);
      if (e.target.closest('[data-close]')) closeSheet(sheet);
    });
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && sheetStack.length) closeSheet(sheetStack[sheetStack.length - 1].sheet);
  });

  /* ---------- Toast ---------- */
  let toastTimer;
  function toast(msg) {
    els.toast.textContent = msg;
    els.toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => els.toast.classList.remove('show'), 1800);
  }

  /* ---------- Header ---------- */
  function renderHeader() {
    const o = state.outlet;
    $('outletKicker').textContent = state.mode === 'pickup' ? 'Pickup from' : 'Delivering from';
    $('outletName').textContent = o.name;
    $('outletMeta').textContent = state.mode === 'pickup'
      ? `Ready in ${o.pickupTime}`
      : `Delivery in ${o.deliveryTime}`;

    document.querySelectorAll('.mode-btn').forEach((b) => {
      const on = b.dataset.mode === state.mode;
      b.classList.toggle('is-active', on);
      b.setAttribute('aria-pressed', on);
    });
  }

  document.querySelectorAll('.mode-btn').forEach((b) => {
    b.addEventListener('click', () => {
      if (state.mode === b.dataset.mode) return;
      state.mode = b.dataset.mode;
      if (state.mode === 'delivery' && state.payment === 'counter') state.payment = 'duitnow';
      renderHeader();
      if (!els.cartSheet.hidden) renderCart();
    });
  });

  $('outletBtn').addEventListener('click', () => {
    renderOutlets();
    openSheet(els.outletSheet);
  });

  /* ---------- Loyalty ---------- */
  function renderClub() {
    const { stamps, goal, reward } = SOGNO_CLUB;
    $('clubText').textContent = `${goal - stamps} more for a free ${reward}`;
    $('clubCount').innerHTML = `${stamps}<small>/${goal}</small>`;
    $('clubCount').setAttribute('aria-label', `${stamps} of ${goal} stamps`);
    $('clubBar').style.width = `${(stamps / goal) * 100}%`;
  }

  /* ---------- Menu ---------- */
  function matches(item) {
    if (!state.query) return true;
    const q = state.query.toLowerCase();
    return item.name.toLowerCase().includes(q) || item.description.toLowerCase().includes(q);
  }

  function qtyInCart(itemId) {
    return state.cart.filter((l) => l.itemId === itemId).reduce((s, l) => s + l.qty, 0);
  }

  function renderRail() {
    els.rail.innerHTML = SOGNO_CATEGORIES.map((c) => {
      const hasMatch = SOGNO_MENU.some((i) => i.categoryId === c.id && matches(i));
      return `
        <button type="button" class="rail-btn ${c.id === state.activeCat ? 'is-active' : ''} ${hasMatch ? '' : 'is-empty'}" data-cat="${c.id}" ${hasMatch ? '' : 'disabled'}>${esc(c.name)}</button>`;
    }).join('');
  }

  function productHtml(item) {
    const qty = qtyInCart(item.id);
    return `
      <button type="button" class="product" data-id="${item.id}">
        <img class="product-img" src="${item.image}" alt="" loading="lazy">
        <span class="product-body">
          ${item.badge ? `<span class="product-badge">${esc(item.badge)}</span>` : ''}
          <span class="product-name">${esc(item.name)}</span>
          <span class="product-desc">${esc(item.description)}</span>
          <span class="product-foot">
            <span class="product-price">${money(item.price)}</span>
            <span class="add-btn" aria-hidden="true">
              <svg class="ic ic-sm"><use href="#i-plus"/></svg>
              ${qty ? `<span class="qty-dot">${qty}</span>` : ''}
            </span>
          </span>
        </span>
      </button>`;
  }

  function renderList() {
    const sections = SOGNO_CATEGORIES.map((c) => {
      const items = SOGNO_MENU.filter((i) => i.categoryId === c.id && matches(i));
      if (!items.length) return '';
      return `
        <section class="list-section" id="sec-${c.id}" data-cat="${c.id}">
          <h2>${esc(c.name)}</h2>
          ${items.map(productHtml).join('')}
        </section>`;
    }).join('');

    els.list.innerHTML = sections || `
      <div class="empty">
        <strong>No results for "${esc(state.query)}"</strong>
        Try another name, like latte or croissant.
      </div>`;

    if (sections) {
      const spacer = document.createElement('div');
      spacer.className = 'list-spacer';
      els.list.appendChild(spacer);
      sizeSpacer();
    }
  }

  // Lets the last category scroll all the way to the top of the list.
  function sizeSpacer() {
    const spacer = els.list.querySelector('.list-spacer');
    const sections = els.list.querySelectorAll('.list-section');
    if (!spacer || !sections.length) return;
    const last = sections[sections.length - 1];
    spacer.style.height = `${Math.max(0, els.list.clientHeight - last.offsetHeight - 16)}px`;
  }

  function setActiveCat(catId) {
    if (state.activeCat === catId) return;
    state.activeCat = catId;
    els.rail.querySelectorAll('.rail-btn').forEach((b) => b.classList.toggle('is-active', b.dataset.cat === catId));
    const btn = els.rail.querySelector(`[data-cat="${catId}"]`);
    if (btn) els.rail.scrollTo({ left: btn.offsetLeft - (els.rail.clientWidth - btn.offsetWidth) / 2, behavior: 'smooth' });
  }

  els.rail.addEventListener('click', (e) => {
    const btn = e.target.closest('.rail-btn');
    if (!btn || btn.disabled) return;
    const sec = $(`sec-${btn.dataset.cat}`);
    if (!sec) return;
    state.railLockUntil = Date.now() + 700;
    setActiveCat(btn.dataset.cat);
    els.list.scrollTo({ top: sec.offsetTop });
  });

  els.list.addEventListener('scroll', () => {
    if (Date.now() < state.railLockUntil) return;
    const top = els.list.scrollTop + 24;
    let current = null;
    els.list.querySelectorAll('.list-section').forEach((sec) => {
      if (sec.offsetTop <= top) current = sec.dataset.cat;
    });
    if (!current) {
      const first = els.list.querySelector('.list-section');
      current = first && first.dataset.cat;
    }
    if (current) setActiveCat(current);
  }, { passive: true });

  els.list.addEventListener('click', (e) => {
    const card = e.target.closest('.product');
    if (card) openItem(menuById[card.dataset.id]);
  });

  els.search.addEventListener('input', () => {
    state.query = els.search.value.trim();
    els.searchClear.hidden = !els.search.value;
    renderRail();
    renderList();
    els.list.scrollTop = 0;
    const first = els.list.querySelector('.list-section');
    if (first) { state.activeCat = null; setActiveCat(first.dataset.cat); }
  });

  els.searchClear.addEventListener('click', () => {
    els.search.value = '';
    els.search.dispatchEvent(new Event('input'));
    els.search.focus();
  });

  window.addEventListener('resize', sizeSpacer);

  /* ---------- Item sheet ---------- */
  function itemGroups(item) {
    return SOGNO_OPTION_GROUPS.filter((g) => item.options && item.options[g.key]);
  }

  function unitPrice(item, selections) {
    return round2(itemGroups(item).reduce((sum, g) => {
      const choice = item.options[g.key].find((c) => c.label === selections[g.key]);
      return sum + (choice && choice.price ? choice.price : 0);
    }, item.price));
  }

  function openItem(item) {
    if (!item) return;
    state.item = item;
    state.qty = 1;
    state.selections = {};
    itemGroups(item).forEach((g) => { state.selections[g.key] = item.options[g.key][0].label; });

    $('itemImage').src = item.image;
    $('itemImage').alt = item.name;
    $('itemName').textContent = item.name;
    $('itemPrice').textContent = money(item.price);
    $('itemDesc').textContent = item.description;

    $('itemOptions').innerHTML = itemGroups(item).map((g) => `
      <div class="opt-group" role="radiogroup" aria-label="${esc(g.label)}">
        <div class="opt-title"><h3>${esc(g.label)}</h3><span class="opt-req">Required</span></div>
        ${item.options[g.key].map((c) => `
          <button type="button" class="radio-row" role="radio" data-group="${g.key}" data-label="${esc(c.label)}" aria-checked="${state.selections[g.key] === c.label}">
            <span class="radio"></span>
            <span class="radio-label">${esc(c.label)}</span>
            ${c.price ? `<span class="radio-extra">+ ${money(c.price)}</span>` : ''}
          </button>`).join('')}
      </div>`).join('');

    els.itemSheet.querySelector('.sheet-scroll').scrollTop = 0;
    renderItemFooter();
    openSheet(els.itemSheet);
  }

  $('itemOptions').addEventListener('click', (e) => {
    const row = e.target.closest('.radio-row');
    if (!row) return;
    state.selections[row.dataset.group] = row.dataset.label;
    row.parentElement.querySelectorAll('.radio-row').forEach((r) => r.setAttribute('aria-checked', r === row));
    renderItemFooter();
  });

  function renderItemFooter() {
    $('qtyValue').textContent = state.qty;
    $('qtyMinus').disabled = state.qty <= 1;
    $('qtyPlus').disabled = state.qty >= MAX_QTY;
    $('addToCartPrice').textContent = money(unitPrice(state.item, state.selections) * state.qty);
  }

  $('qtyMinus').addEventListener('click', () => { state.qty = Math.max(1, state.qty - 1); renderItemFooter(); });
  $('qtyPlus').addEventListener('click', () => { state.qty = Math.min(MAX_QTY, state.qty + 1); renderItemFooter(); });

  $('addToCart').addEventListener('click', () => {
    const item = state.item;
    const selections = { ...state.selections };
    const key = `${item.id}|${itemGroups(item).map((g) => selections[g.key]).join('|')}`;
    const existing = state.cart.find((l) => l.key === key);
    if (existing) {
      existing.qty = Math.min(MAX_QTY, existing.qty + state.qty);
    } else {
      state.cart.push({ key, itemId: item.id, selections, unitPrice: unitPrice(item, selections), qty: state.qty });
    }
    closeSheet(els.itemSheet);
    cartChanged(true);
    toast(`Added ${state.qty} × ${item.name}`);
  });

  /* ---------- Cart ---------- */
  function cartCount() { return state.cart.reduce((s, l) => s + l.qty, 0); }
  function subtotal() { return round2(state.cart.reduce((s, l) => s + l.unitPrice * l.qty, 0)); }

  function selectionText(line) {
    const item = menuById[line.itemId];
    return itemGroups(item).map((g) => line.selections[g.key]).join(', ');
  }

  function cartChanged(bump) {
    const count = cartCount();
    els.cartBar.hidden = count === 0;
    els.app.classList.toggle('has-cart', count > 0);
    $('cartBarCount').textContent = count;
    $('cartBarTotal').textContent = money(subtotal());
    if (bump && count) {
      els.cartBar.classList.remove('bump');
      void els.cartBar.offsetWidth;
      els.cartBar.classList.add('bump');
    }
    const scroll = els.list.scrollTop;
    renderList();
    els.list.scrollTop = scroll;
    if (!els.cartSheet.hidden) {
      if (count === 0) closeSheet(els.cartSheet);
      else renderCart();
    }
  }

  els.cartBar.addEventListener('click', () => {
    renderCart();
    els.cartSheet.querySelector('.sheet-scroll').scrollTop = 0;
    openSheet(els.cartSheet);
  });

  function voucherStatus(v, sub) {
    if (v.type === 'delivery' && state.mode !== 'delivery') {
      return { ok: false, reason: 'Delivery only', message: `${v.code} only works on delivery orders.` };
    }
    if (sub < v.minSpend) {
      return { ok: false, reason: `Spend ${money(v.minSpend - sub)} more`, message: `Spend ${money(v.minSpend - sub)} more to use ${v.code}.` };
    }
    return { ok: true };
  }

  function totals() {
    const sub = subtotal();
    const deliveryFee = state.mode === 'delivery' ? DELIVERY_FEE : 0;
    const v = SOGNO_VOUCHERS.find((x) => x.code === state.voucherCode);
    let itemDiscount = 0;
    let deliveryDiscount = 0;
    if (v && voucherStatus(v, sub).ok) {
      if (v.type === 'percent') itemDiscount = round2(sub * v.value);
      if (v.type === 'delivery') deliveryDiscount = Math.min(v.value, deliveryFee);
    }
    const taxable = sub - itemDiscount;
    const tax = round2(taxable * SST_RATE);
    const total = round2(taxable + tax + deliveryFee - deliveryDiscount);
    return { sub, deliveryFee, itemDiscount, deliveryDiscount, tax, total, voucher: v };
  }

  // A voucher message survives the render that follows it, then clears on the next change.
  let voucherMsgRenders = 0;
  function setVoucherMsg(text, kind) {
    const el = $('voucherMsg');
    el.hidden = !text;
    el.textContent = text || '';
    el.className = `voucher-msg ${kind || ''}`;
    voucherMsgRenders = 0;
  }

  function applyVoucher(code) {
    const v = SOGNO_VOUCHERS.find((x) => x.code === code);
    if (!v) { setVoucherMsg(code ? `"${code}" is not a valid code.` : 'Enter a voucher code.', 'err'); return; }
    const status = voucherStatus(v, subtotal());
    if (!status.ok) { setVoucherMsg(status.message, 'err'); return; }
    state.voucherCode = v.code;
    $('voucherInput').value = '';
    setVoucherMsg(`${v.code} applied. ${v.label}.`, 'ok');
    renderCart();
  }

  $('voucherForm').addEventListener('submit', (e) => {
    e.preventDefault();
    applyVoucher($('voucherInput').value.trim().toUpperCase());
  });

  $('voucherList').addEventListener('click', (e) => {
    const btn = e.target.closest('.voucher');
    if (!btn) return;
    if (btn.dataset.code === state.voucherCode) {
      state.voucherCode = null;
      setVoucherMsg('', '');
      renderCart();
    } else {
      applyVoucher(btn.dataset.code);
    }
  });

  $('paymentList').addEventListener('click', (e) => {
    const row = e.target.closest('.radio-row');
    if (!row) return;
    state.payment = row.dataset.id;
    renderCart();
  });

  $('cartLines').addEventListener('click', (e) => {
    const btn = e.target.closest('[data-step]');
    if (!btn) return;
    const line = state.cart.find((l) => l.key === btn.dataset.key);
    if (!line) return;
    line.qty += Number(btn.dataset.step);
    if (line.qty <= 0) state.cart = state.cart.filter((l) => l !== line);
    line.qty = Math.min(MAX_QTY, line.qty);
    cartChanged(false);
  });

  $('fulfilCard').addEventListener('click', () => {
    renderOutlets();
    openSheet(els.outletSheet);
  });

  function renderCart() {
    const o = state.outlet;
    const pickup = state.mode === 'pickup';
    $('fulfilIconUse').setAttribute('href', pickup ? '#i-store' : '#i-bike');
    $('fulfilTitle').textContent = pickup ? `Pickup at ${o.name}` : `Delivery from ${o.name}`;
    $('fulfilMeta').textContent = pickup ? `Ready in ${o.pickupTime}` : `Arrives in ${o.deliveryTime}`;

    $('cartLines').innerHTML = state.cart.map((l) => {
      const item = menuById[l.itemId];
      return `
        <div class="line">
          <img class="line-img" src="${item.image}" alt="">
          <div class="line-body">
            <div class="line-name">${esc(item.name)}</div>
            <div class="line-opts">${esc(selectionText(l))}</div>
            <div class="line-foot">
              <span class="line-price">${money(l.unitPrice * l.qty)}</span>
              <div class="stepper stepper-sm">
                <button type="button" data-step="-1" data-key="${esc(l.key)}" aria-label="${l.qty === 1 ? 'Remove' : 'Decrease'} ${esc(item.name)}"><svg class="ic ic-sm"><use href="#i-minus"/></svg></button>
                <span>${l.qty}</span>
                <button type="button" data-step="1" data-key="${esc(l.key)}" aria-label="Increase ${esc(item.name)}" ${l.qty >= MAX_QTY ? 'disabled' : ''}><svg class="ic ic-sm"><use href="#i-plus"/></svg></button>
              </div>
            </div>
          </div>
        </div>`;
    }).join('');

    if (++voucherMsgRenders > 1) setVoucherMsg('', '');

    // Drop a voucher that no longer qualifies (cart shrank or order type changed).
    const sub = subtotal();
    const applied = SOGNO_VOUCHERS.find((v) => v.code === state.voucherCode);
    if (applied && !voucherStatus(applied, sub).ok) {
      state.voucherCode = null;
      setVoucherMsg(`${applied.code} removed. ${voucherStatus(applied, sub).message}`, 'err');
      voucherMsgRenders = 1;
    }

    $('voucherList').innerHTML = SOGNO_VOUCHERS.map((v) => {
      const status = voucherStatus(v, sub);
      const isApplied = v.code === state.voucherCode;
      const stateText = isApplied ? 'Remove' : status.ok ? 'Apply' : status.reason;
      return `
        <button type="button" class="voucher ${isApplied ? 'is-applied' : ''} ${!isApplied && !status.ok ? 'is-locked' : ''}" data-code="${v.code}">
          <svg class="ic"><use href="${isApplied ? '#i-check' : '#i-tag'}"/></svg>
          <span class="voucher-body">
            <span class="voucher-code">${v.code}</span>
            <span class="voucher-desc">${esc(v.label)} · min. spend ${money(v.minSpend)}</span>
          </span>
          <span class="voucher-state">${stateText}</span>
        </button>`;
    }).join('');

    $('paymentList').innerHTML = PAYMENTS.filter((p) => pickup || !p.pickupOnly).map((p) => `
      <button type="button" class="radio-row" role="radio" data-id="${p.id}" aria-checked="${state.payment === p.id}">
        <span class="radio"></span>
        <span class="pay-icon" style="background:${p.color}">${p.abbr}</span>
        <span class="radio-label">${esc(p.label)}</span>
      </button>`).join('');

    const t = totals();
    $('sumSubtotal').textContent = money(t.sub);
    $('sumDiscountRow').hidden = !(t.itemDiscount || t.deliveryDiscount);
    $('sumDiscountLabel').textContent = t.voucher ? `Voucher (${t.voucher.code})` : 'Voucher';
    $('sumDiscount').textContent = `- ${money(t.itemDiscount + t.deliveryDiscount)}`;
    $('sumDeliveryRow').hidden = !t.deliveryFee;
    $('sumDelivery').textContent = money(t.deliveryFee);
    $('sumTax').textContent = money(t.tax);
    $('sumTotal').textContent = money(t.total);
    $('placeOrder').disabled = state.cart.length === 0;
    $('placeOrder').textContent = state.payment === 'counter' ? 'Place order' : `Pay ${money(t.total)}`;
  }

  /* ---------- Outlets ---------- */
  function renderOutlets() {
    $('outletList').innerHTML = SOGNO_OUTLETS.map((o) => `
      <button type="button" class="outlet-row radio-row" role="radio" data-id="${o.id}" aria-checked="${o.id === state.outlet.id}">
        <span class="radio"></span>
        <span class="radio-label">
          <span class="outlet-row-name">${esc(o.name)}</span>
          <span class="outlet-row-addr">${esc(o.address)}</span>
          <span class="outlet-row-meta">${esc(o.region)} · Pickup in ${esc(o.pickupTime)}</span>
        </span>
      </button>`).join('');
  }

  $('outletList').addEventListener('click', (e) => {
    const row = e.target.closest('.outlet-row');
    if (!row) return;
    state.outlet = SOGNO_OUTLETS.find((o) => o.id === row.dataset.id);
    renderHeader();
    if (!els.cartSheet.hidden) renderCart();
    closeSheet(els.outletSheet);
    toast(`Ordering from ${state.outlet.name}`);
  });

  /* ---------- Orders ---------- */
  // Demo timeline: how long after placing an order each step is reached.
  const STEP_AFTER_MS = [0, 5000, 10000];
  const ORDERS_KEY = 'sogno.orders';

  function loadOrders() {
    try {
      const saved = JSON.parse(localStorage.getItem(ORDERS_KEY) || '[]');
      return Array.isArray(saved) ? saved.filter((o) => o && o.no && Array.isArray(o.lines) && o.lines.every((l) => menuById[l.itemId])) : [];
    } catch (e) {
      return [];
    }
  }

  function saveOrders() {
    state.orders = state.orders.filter((o, i) => !o.completed || i < 10);
    try { localStorage.setItem(ORDERS_KEY, JSON.stringify(state.orders)); } catch (e) { /* storage unavailable */ }
  }

  state.orders = loadOrders();

  const outletById = (id) => SOGNO_OUTLETS.find((o) => o.id === id) || SOGNO_OUTLETS[0];
  const paymentById = (id) => PAYMENTS.find((p) => p.id === id) || PAYMENTS[0];
  const timeText = (ms) => new Date(ms).toLocaleTimeString('en-MY', { hour: 'numeric', minute: '2-digit' });

  function orderStep(order) {
    const elapsed = Date.now() - order.placedAt;
    return STEP_AFTER_MS.reduce((step, after, i) => (elapsed >= after ? i : step), 0);
  }

  function stepLabels(order) {
    return order.mode === 'pickup'
      ? ['Received', 'Preparing', 'Ready for pickup']
      : ['Received', 'Preparing', 'On the way'];
  }

  function orderStatusText(order) {
    const step = orderStep(order);
    if (step === 0) return 'Order received';
    if (step === 1) return 'Preparing your order';
    return order.mode === 'pickup' ? 'Ready for pickup' : 'Your order is on the way';
  }

  const activeOrders = () => state.orders.filter((o) => !o.completed);

  function renderOrderBar() {
    const active = activeOrders();
    els.orderBar.hidden = active.length === 0;
    els.app.classList.toggle('has-order', active.length > 0);
    if (!active.length) return;
    const latest = active[0];
    const outlet = outletById(latest.outletId);
    const ready = orderStep(latest) === 2;
    els.orderBar.classList.toggle('is-ready', ready);
    $('orderBarTitle').textContent = active.length > 1 ? `${active.length} current orders` : orderStatusText(latest);
    $('orderBarMeta').textContent = active.length > 1
      ? `Latest: #${latest.no} · ${orderStatusText(latest)}`
      : `#${latest.no} · ${latest.mode === 'pickup' ? 'Pickup at' : 'Delivery from'} ${outlet.name}`;
  }

  els.orderBar.addEventListener('click', () => {
    const active = activeOrders();
    if (active.length === 1) {
      showOrder(active[0]);
    } else if (active.length > 1) {
      renderOrdersList();
      openSheet(els.ordersSheet);
    }
  });

  function renderOrdersList() {
    $('ordersList').innerHTML = activeOrders().map((o) => `
      <button type="button" class="orders-row" data-no="${esc(o.no)}">
        <span class="orders-row-body">
          <strong>#${esc(o.no)} · ${esc(orderStatusText(o))}</strong>
          <span>${o.mode === 'pickup' ? 'Pickup at' : 'Delivery from'} ${esc(outletById(o.outletId).name)} · ${timeText(o.placedAt)} · ${money(o.total)}</span>
        </span>
        <svg class="ic"><use href="#i-chevron-right"/></svg>
      </button>`).join('');
  }

  $('ordersList').addEventListener('click', (e) => {
    const row = e.target.closest('.orders-row');
    if (!row) return;
    const order = state.orders.find((o) => o.no === row.dataset.no);
    closeSheet(els.ordersSheet);
    if (order) showOrder(order);
  });

  // Keeps the order bar and an open status screen in sync with the timeline.
  setInterval(() => {
    if (!activeOrders().length) return;
    renderOrderBar();
    if (!els.ordersSheet.hidden) renderOrdersList();
    if (!els.orderSheet.hidden && state.viewingOrder) renderOrderProgress(state.viewingOrder);
  }, 1000);

  $('placeOrder').addEventListener('click', () => {
    if (!state.cart.length) return;
    const t = totals();
    const order = {
      no: `SG-${Math.floor(1000 + Math.random() * 9000)}`,
      mode: state.mode,
      outletId: state.outlet.id,
      lines: state.cart.map((l) => ({ ...l })),
      total: t.total,
      paymentId: state.payment,
      placedAt: Date.now(),
      completed: false
    };
    state.orders.unshift(order);
    saveOrders();

    state.cart = [];
    state.voucherCode = null;
    setVoucherMsg('', '');
    closeSheet(els.cartSheet);
    cartChanged(false);
    renderOrderBar();
    showOrder(order);
  });

  function renderOrderProgress(order) {
    const step = orderStep(order);
    const labels = stepLabels(order);
    $('orderProgress').innerHTML = labels.map((label, i) => `
      <li class="${i < step ? 'done' : ''} ${i === step ? 'current' : ''}">${label}<span class="progress-time">${i <= step ? timeText(order.placedAt + STEP_AFTER_MS[i]) : '&nbsp;'}</span></li>`).join('');
    const ready = step === 2;
    $('orderCollected').hidden = !ready;
    $('orderCollected').textContent = order.mode === 'pickup' ? 'I\'ve collected it' : 'I\'ve received it';
  }

  function showOrder(order) {
    state.viewingOrder = order;
    const pickup = order.mode === 'pickup';
    const outlet = outletById(order.outletId);
    $('orderNo').textContent = `Order #${order.no}`;
    $('orderWhere').textContent = pickup
      ? `Pickup at ${outlet.name} · placed ${timeText(order.placedAt)}`
      : `Delivery from ${outlet.name} · placed ${timeText(order.placedAt)}`;
    renderOrderProgress(order);

    $('qrCard').hidden = !pickup;
    if (pickup) $('qrBox').innerHTML = qrSvg(order.no);

    $('orderLines').innerHTML = order.lines.map((l) => {
      const item = menuById[l.itemId];
      return `
        <div class="line">
          <img class="line-img" src="${item.image}" alt="">
          <div class="line-body">
            <div class="line-name">${l.qty} × ${esc(item.name)}</div>
            <div class="line-opts">${esc(selectionText(l))}</div>
          </div>
          <div class="line-price">${money(l.unitPrice * l.qty)}</div>
        </div>`;
    }).join('');

    const payment = paymentById(order.paymentId);
    const payAtCounter = payment.id === 'counter';
    $('orderTitle').textContent = payAtCounter ? 'Order placed' : 'Payment successful';
    $('orderPaidLabel').textContent = payAtCounter ? 'To pay at counter' : `Paid with ${payment.label}`;
    $('orderPaid').textContent = money(order.total);

    els.orderSheet.querySelector('.sheet-scroll').scrollTop = 0;
    openSheet(els.orderSheet);
  }

  $('orderDone').addEventListener('click', () => {
    closeSheet(els.orderSheet);
    if (activeOrders().length && !sessionFlags.orderBarHintShown) {
      sessionFlags.orderBarHintShown = true;
      toast('Track your order from the bar at the bottom');
    }
  });

  $('orderCollected').addEventListener('click', () => {
    const order = state.viewingOrder;
    if (order) {
      order.completed = true;
      saveOrders();
    }
    closeSheet(els.orderSheet);
    renderOrderBar();
    toast('Enjoy! See you again soon');
  });

  const sessionFlags = {};

  // Decorative pickup code (not a scannable QR), stable per order number.
  function qrSvg(seed) {
    const n = 25;
    let h = 2166136261;
    for (const ch of seed) h = Math.imul(h ^ ch.charCodeAt(0), 16777619);
    const rand = () => {
      h = Math.imul(h ^ (h >>> 15), 2246822507);
      h = Math.imul(h ^ (h >>> 13), 3266489909);
      return ((h ^= h >>> 16) >>> 0) / 4294967296;
    };
    const inFinder = (x, y) => [[0, 0], [n - 7, 0], [0, n - 7]].find(([fx, fy]) => x >= fx - 1 && x <= fx + 7 && y >= fy - 1 && y <= fy + 7);
    let d = '';
    for (let y = 0; y < n; y++) {
      for (let x = 0; x < n; x++) {
        let on;
        const f = inFinder(x, y);
        if (f) {
          const lx = x - f[0], ly = y - f[1];
          const inside = lx >= 0 && lx <= 6 && ly >= 0 && ly <= 6;
          on = inside && (lx === 0 || lx === 6 || ly === 0 || ly === 6 || (lx >= 2 && lx <= 4 && ly >= 2 && ly <= 4));
        } else if (x === 6 || y === 6) {
          on = (x + y) % 2 === 0;
        } else {
          on = rand() < 0.48;
        }
        if (on) d += `M${x} ${y}h1v1h-1z`;
      }
    }
    return `<svg viewBox="-1 -1 ${n + 2} ${n + 2}" role="img" aria-label="Pickup code"><rect x="-1" y="-1" width="${n + 2}" height="${n + 2}" fill="#fff"/><path d="${d}" fill="#1D1517"/></svg>`;
  }

  /* ---------- Deep links (#item=<id>) and messages from the website ---------- */
  function openFromHash() {
    const m = location.hash.match(/^#item=([\w-]+)$/);
    if (!m || !menuById[m[1]]) return;
    history.replaceState(null, '', location.pathname + location.search);
    openItem(menuById[m[1]]);
  }

  window.addEventListener('hashchange', openFromHash);
  window.addEventListener('message', (e) => {
    if (e.source !== window.parent || !e.data || e.data.type !== 'sogno:open-item') return;
    const item = menuById[e.data.id];
    if (!item) return;
    sheetStack.slice().reverse().forEach(({ sheet }) => closeSheet(sheet));
    openItem(item);
  });

  /* ---------- Init ---------- */
  renderHeader();
  renderClub();
  renderRail();
  renderList();
  cartChanged(false);
  renderOrderBar();
  openFromHash();
})();
