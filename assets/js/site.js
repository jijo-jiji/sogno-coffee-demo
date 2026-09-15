// Sogno Coffee website + demo view switcher

(function () {
  const $ = (id) => document.getElementById(id);
  const money = (n) => `RM ${n.toFixed(2)}`;
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const catName = Object.fromEntries(SOGNO_CATEGORIES.map((c) => [c.id, c.name]));
  const menuById = Object.fromEntries(SOGNO_MENU.map((i) => [i.id, i]));

  /* ---------- Views ---------- */
  const views = ['site', 'app', 'pitch'];
  const frame = $('appFrame');
  let frameReady = false;
  let pendingItem = null;

  frame.addEventListener('load', () => {
    if (!frame.getAttribute('src')) return;
    frameReady = true;
    if (pendingItem) { sendItem(pendingItem); pendingItem = null; }
  });

  function showView(name, { scroll = true } = {}) {
    if (!views.includes(name)) name = 'site';
    views.forEach((v) => { $(`view-${v}`).hidden = v !== name; });
    document.querySelectorAll('.tab').forEach((t) => t.setAttribute('aria-selected', t.dataset.view === name));
    if (name === 'app' && !frame.getAttribute('src')) frame.setAttribute('src', frame.dataset.src);
    if (history.replaceState) history.replaceState(null, '', name === 'site' ? location.pathname : `#${name}`);
    if (scroll) window.scrollTo({ top: 0 });
  }

  function sendItem(id) {
    frame.contentWindow.postMessage({ type: 'sogno:open-item', id }, '*');
  }

  function orderItem(id) {
    showView('app');
    if (frameReady) sendItem(id);
    else pendingItem = id;
  }

  document.querySelectorAll('.tab').forEach((t) => t.addEventListener('click', () => showView(t.dataset.view)));
  document.addEventListener('click', (e) => {
    const link = e.target.closest('[data-view-link]');
    if (link) { e.preventDefault(); showView(link.dataset.viewLink); }
    const order = e.target.closest('[data-order]');
    if (order) orderItem(order.dataset.order);
  });

  /* ---------- Pastry case ---------- */
  $('sigList').innerHTML = ['jumbo-croissant', 'red-velvet-croissant', 'kunafa-pistachio'].map((id) => {
    const item = menuById[id];
    return `
      <div class="sig">
        <img src="${item.image}" alt="">
        <div>
          <div class="sig-name">${esc(item.name)}</div>
          <div class="sig-desc">${esc(item.description)}</div>
        </div>
        <div class="sig-price">${money(item.price)}</div>
      </div>`;
  }).join('');

  /* ---------- Menu ---------- */
  let menuFilter = 'all';

  function renderChips() {
    const chips = [{ id: 'all', name: 'All' }, ...SOGNO_CATEGORIES];
    $('menuChips').innerHTML = chips.map((c) => `
      <button type="button" class="chip" data-cat="${c.id}" aria-pressed="${c.id === menuFilter}">${esc(c.name)}</button>`).join('');
  }

  function renderMenu() {
    const items = SOGNO_MENU.filter((i) => menuFilter === 'all' || i.categoryId === menuFilter);
    $('menuGrid').innerHTML = items.map((item) => `
      <article class="menu-card">
        <img src="${item.image}" alt="${esc(item.name)}" loading="lazy">
        <div class="menu-card-body">
          <span class="menu-card-cat">${esc(catName[item.categoryId])}</span>
          <h3>${esc(item.name)}</h3>
          <p>${esc(item.description)}</p>
          <div class="menu-card-foot">
            <span class="menu-card-price">${money(item.price)}</span>
            <button type="button" class="btn btn-ghost btn-sm" data-order="${item.id}">Order</button>
          </div>
        </div>
      </article>`).join('');
  }

  $('menuChips').addEventListener('click', (e) => {
    const chip = e.target.closest('.chip');
    if (!chip) return;
    menuFilter = chip.dataset.cat;
    renderChips();
    renderMenu();
  });

  /* ---------- Outlets ---------- */
  let outletFilter = 'all';
  const regions = [...new Set(SOGNO_OUTLETS.map((o) => o.region))];

  function renderOutlets() {
    $('outletChips').innerHTML = ['all', ...regions].map((r) => `
      <button type="button" class="chip" data-region="${esc(r)}" aria-pressed="${r === outletFilter}">${r === 'all' ? 'All outlets' : esc(r)}</button>`).join('');

    $('outletGrid').innerHTML = SOGNO_OUTLETS
      .filter((o) => outletFilter === 'all' || o.region === outletFilter)
      .map((o) => `
        <article class="outlet">
          <img class="outlet-photo" src="${o.image}" alt="Sogno Coffee ${esc(o.name)}" loading="lazy">
          <div class="outlet-body">
            <span class="outlet-region">${esc(o.region)}</span>
            <h3>${esc(o.name)}</h3>
            <p>${esc(o.address)}</p>
            <a class="outlet-directions" href="${sognoMapsUrl(o)}" target="_blank" rel="noopener">
              <svg class="ic"><use href="#i-pin"/></svg> Get directions
            </a>
          </div>
        </article>`).join('');
  }

  $('outletChips').addEventListener('click', (e) => {
    const chip = e.target.closest('.chip');
    if (!chip) return;
    outletFilter = chip.dataset.region;
    renderOutlets();
  });

  renderOutlets();

  /* ---------- Photo checklist ---------- */
  const PHOTO_SOURCES = {
    'dark-chocolate-mocha-frappe': { stand: 'Mocha Latte Frappe' },
    'strawberry-dream-milk': { stand: 'Strawberry Yogurt Velvet' },
    'pistachio-cream-milk': { stand: 'Pistachio Latte (shows coffee)' },
    'jumbo-croissant': { crop: true }
  };

  $('checklistBody').innerHTML = SOGNO_MENU.map((item) => {
    const src = PHOTO_SOURCES[item.id] || {};
    let source = '<span class="status status-ok">Listing photo</span>';
    let next = 'Optional: own close-up';
    if (src.stand) {
      source = '<span class="status status-warn">Stand-in</span>';
      next = `Reshoot. Currently shows ${esc(src.stand)}`;
    } else if (src.crop) {
      source = '<span class="status status-warn">Low-res crop</span>';
      next = 'Reshoot. Cropped from the display case photo';
    }
    return `
      <tr>
        <td><img src="${item.image}" alt=""></td>
        <td><strong>${esc(item.name)}</strong></td>
        <td>${esc(catName[item.categoryId])}</td>
        <td class="price">${money(item.price)}</td>
        <td>${source}</td>
        <td>${next}</td>
      </tr>`;
  }).join('');

  renderChips();
  renderMenu();
  showView(location.hash.replace('#', ''), { scroll: false });
})();
