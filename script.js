const hamburger = document.getElementById('hamburger')

const navMenu = document.getElementById('nav-menu')

hamburger.addEventListener('click' , () => {
    hamburger.classList.toggle('active')
    navMenu.classList.toggle('active')

});

// Open modal
  document.querySelectorAll('[data-modal-target]').forEach(btn => {
    btn.addEventListener('click', () => {
      const modal = document.getElementById(btn.dataset.modalTarget);
      modal?.classList.remove('hidden');
      document.body.style.overflow = 'hidden'; // lock background scroll
    });
  });
 
  // Close modal via close button
  document.querySelectorAll('[data-modal-close]').forEach(btn => {
    btn.addEventListener('click', () => closeModal(btn.closest('[id^="modal"]')));
  });
 
  // Close modal by clicking the dark backdrop
  document.querySelectorAll('[id^="modal"]').forEach(modal => {
    modal.addEventListener('click', e => {
      if (e.target === modal) closeModal(modal);
    });
  });
 
  // Close modal with Escape key
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      document.querySelectorAll('[id^="modal"]:not(.hidden)').forEach(closeModal);
    }
  });
 
  function closeModal(modal) {
    if (!modal) return;
    modal.classList.add('hidden');
    document.body.style.overflow = '';
  }

/* =========================================================
   ADD TO CART
   Everything below is injected purely from JS — no HTML/CSS
   files are touched. Styles are added via a <style> tag,
   buttons/icons/panel are created and inserted with DOM APIs.
========================================================= */

(function () {
  const CART_KEY = 'neonest_cart';

  /* ---------- styles (injected once) ---------- */
  const style = document.createElement('style');
  style.textContent = `
    .nn-cart-btn{
      position:relative;
      display:flex;
      align-items:center;
      justify-content:center;
      background:transparent;
      border:2px solid #F9FAFB;
      color:#F9FAFB;
      border-radius:0.4rem;
      width:42px;
      height:42px;
      margin-left:1rem;
      cursor:pointer;
      font-size:1.1rem;
      transition:.2s ease;
    }
    .nn-cart-btn:hover{ background:#F9FAFB22; }
    .nn-cart-count{
      position:absolute;
      top:-6px;
      right:-6px;
      background:#10B981;
      color:#fff;
      font-size:.7rem;
      font-weight:700;
      min-width:18px;
      height:18px;
      border-radius:50%;
      display:flex;
      align-items:center;
      justify-content:center;
      padding:0 3px;
      font-family:"Source Sans 3", sans-serif;
    }
    .nn-add-btn{
      background:#1F2937;
      color:#F9FAFB;
      border:none;
      padding:0.5rem 0.9rem;
      border-radius:8px;
      font-weight:600;
      cursor:pointer;
      display:flex;
      align-items:center;
      gap:.4rem;
      font-family:"Source Sans 3", sans-serif;
      transition:background-color .2s ease, transform .15s ease;
    }
    .nn-add-btn:hover{ background:#374151; }
    .nn-add-btn.nn-added{ background:#10B981; }
    .nn-modal-add-btn{
      display:flex;
      align-items:center;
      justify-content:center;
      gap:.5rem;
      width:100%;
      margin-top:1rem;
      background:#10B981;
      color:#fff;
      border:none;
      padding:0.75rem 1rem;
      border-radius:8px;
      font-weight:600;
      cursor:pointer;
      font-family:"Source Sans 3", sans-serif;
      transition:background-color .2s ease;
    }
    .nn-modal-add-btn:hover{ background:#059669; }

    .nn-cart-panel{
      position:fixed;
      top:0;
      right:-380px;
      width:340px;
      max-width:90vw;
      height:100%;
      background:#F9FAFB;
      box-shadow:-10px 0 30px rgba(0,0,0,.2);
      z-index:1000000;
      transition:right .3s ease;
      display:flex;
      flex-direction:column;
      font-family:"Outfit", sans-serif;
    }
    .nn-cart-panel.open{ right:0; }
    .nn-cart-header{
      display:flex;
      align-items:center;
      justify-content:space-between;
      padding:1rem 1.25rem;
      border-bottom:1px solid #E5E7EB;
    }
    .nn-cart-header h3{
      font-family:"Source Sans 3", sans-serif;
      color:#1F2937;
      font-weight:600;
      font-size:1.15rem;
    }
    .nn-cart-close{
      background:#10B981;
      color:#fff;
      border:none;
      border-radius:50%;
      width:28px;
      height:28px;
      cursor:pointer;
      font-size:1rem;
    }
    .nn-cart-items{
      flex:1;
      overflow-y:auto;
      padding:0.5rem 1.25rem;
    }
    .nn-cart-empty{
      color:#9CA3AF;
      text-align:center;
      margin-top:2rem;
      font-size:.95rem;
    }
    .nn-cart-item{
      display:flex;
      justify-content:space-between;
      align-items:center;
      gap:.5rem;
      padding:0.75rem 0;
      border-bottom:1px solid #E5E7EB;
    }
    .nn-cart-item-name{
      color:#1F2937;
      font-size:.9rem;
      font-weight:600;
      margin-bottom:.25rem;
    }
    .nn-cart-item-price{
      color:#10B981;
      font-size:.85rem;
      font-family:'Courier New', monospace;
    }
    .nn-qty-ctrl{
      display:flex;
      align-items:center;
      gap:.4rem;
    }
    .nn-qty-ctrl button{
      width:24px;
      height:24px;
      border-radius:6px;
      border:1px solid #E5E7EB;
      background:#fff;
      cursor:pointer;
      font-weight:700;
      color:#1F2937;
    }
    .nn-cart-remove{
      background:none;
      border:none;
      color:#9CA3AF;
      cursor:pointer;
      font-size:.85rem;
      margin-left:.5rem;
    }
    .nn-cart-remove:hover{ color:#DC2626; }
    .nn-cart-footer{
      padding:1rem 1.25rem 1.25rem;
      border-top:1px solid #E5E7EB;
    }
    .nn-cart-total{
      display:flex;
      justify-content:space-between;
      color:#1F2937;
      font-weight:700;
      margin-bottom:0.75rem;
      font-size:1.05rem;
    }
    .nn-cart-checkout{
      width:100%;
      background:#10B981;
      color:#fff;
      border:none;
      padding:0.75rem;
      border-radius:8px;
      font-weight:600;
      cursor:pointer;
    }
    .nn-cart-checkout:hover{ background:#059669; }
    .nn-cart-overlay{
      position:fixed;
      inset:0;
      background:rgba(15,23,42,.4);
      z-index:999999;
      opacity:0;
      pointer-events:none;
      transition:opacity .3s ease;
    }
    .nn-cart-overlay.open{
      opacity:1;
      pointer-events:auto;
    }
    .nn-toast{
      position:fixed;
      bottom:24px;
      left:50%;
      transform:translateX(-50%) translateY(20px);
      background:#1F2937;
      color:#fff;
      padding:.75rem 1.25rem;
      border-radius:8px;
      font-family:"Outfit", sans-serif;
      font-size:.9rem;
      z-index:1000001;
      opacity:0;
      transition:.25s ease;
      pointer-events:none;
    }
    .nn-toast.show{
      opacity:1;
      transform:translateX(-50%) translateY(0);
    }
  `;
  document.head.appendChild(style);

  /* ---------- cart state ---------- */
  function getCart() {
    try {
      return JSON.parse(localStorage.getItem(CART_KEY)) || [];
    } catch (e) {
      return [];
    }
  }

  function saveCart(cart) {
    try {
      localStorage.setItem(CART_KEY, JSON.stringify(cart));
    } catch (e) { /* storage unavailable, ignore */ }
    renderCart();
  }

  function parsePrice(text) {
    const n = parseFloat(String(text).replace(/[^0-9.]/g, ''));
    return isNaN(n) ? 0 : n;
  }

  function addToCart(name, price, imgSrc) {
    const cart = getCart();
    const existing = cart.find(i => i.name === name);
    if (existing) {
      existing.qty += 1;
    } else {
      cart.push({ name, price, img: imgSrc || '', qty: 1 });
    }
    saveCart(cart);
    showToast(`${name} added to cart`);
    openCartPanel();
  }

  function changeQty(name, delta) {
    const cart = getCart();
    const item = cart.find(i => i.name === name);
    if (!item) return;
    item.qty += delta;
    const updated = item.qty <= 0 ? cart.filter(i => i.name !== name) : cart;
    saveCart(updated);
  }

  function removeFromCart(name) {
    saveCart(getCart().filter(i => i.name !== name));
  }

  /* ---------- toast ---------- */
  let toastTimer;
  function showToast(msg) {
    let toast = document.querySelector('.nn-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.className = 'nn-toast';
      document.body.appendChild(toast);
    }
    toast.textContent = msg;
    requestAnimationFrame(() => toast.classList.add('show'));
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('show'), 2000);
  }

  /* ---------- cart icon in navbar ---------- */
  const navBar = document.querySelector('.nav-bar');
  const cartBtn = document.createElement('button');
  cartBtn.className = 'nn-cart-btn';
  cartBtn.setAttribute('aria-label', 'Open cart');
  cartBtn.innerHTML = `<i class="fa-solid fa-cart-shopping"></i><span class="nn-cart-count" style="display:none;">0</span>`;
  if (navBar) navBar.appendChild(cartBtn);
  cartBtn.addEventListener('click', () => toggleCartPanel());

  /* ---------- cart panel + overlay ---------- */
  const overlay = document.createElement('div');
  overlay.className = 'nn-cart-overlay';
  document.body.appendChild(overlay);

  const panel = document.createElement('div');
  panel.className = 'nn-cart-panel';
  panel.innerHTML = `
    <div class="nn-cart-header">
      <h3>Your Cart</h3>
      <button class="nn-cart-close" aria-label="Close cart">&times;</button>
    </div>
    <div class="nn-cart-items"></div>
    <div class="nn-cart-footer">
      <div class="nn-cart-total"><span>Total</span><span class="nn-cart-total-amount">$0.00</span></div>
      <button class="nn-cart-checkout">Checkout</button>
    </div>
  `;
  document.body.appendChild(panel);

  panel.querySelector('.nn-cart-close').addEventListener('click', closeCartPanel);
  overlay.addEventListener('click', closeCartPanel);
  panel.querySelector('.nn-cart-checkout').addEventListener('click', () => {
    const cart = getCart();
    if (!cart.length) return;
    showToast('Checkout is not connected yet — this is a demo cart.');
  });

  function openCartPanel() {
    panel.classList.add('open');
    overlay.classList.add('open');
  }
  function closeCartPanel() {
    panel.classList.remove('open');
    overlay.classList.remove('open');
  }
  function toggleCartPanel() {
    panel.classList.contains('open') ? closeCartPanel() : openCartPanel();
  }

  function renderCart() {
    const cart = getCart();
    const itemsCtn = panel.querySelector('.nn-cart-items');
    const totalEl = panel.querySelector('.nn-cart-total-amount');
    const countEl = cartBtn.querySelector('.nn-cart-count');

    const totalQty = cart.reduce((sum, i) => sum + i.qty, 0);
    const totalPrice = cart.reduce((sum, i) => sum + i.qty * i.price, 0);

    countEl.textContent = totalQty;
    countEl.style.display = totalQty > 0 ? 'flex' : 'none';
    totalEl.textContent = `$${totalPrice.toFixed(2)}`;

    if (!cart.length) {
      itemsCtn.innerHTML = `<p class="nn-cart-empty">Your cart is empty.</p>`;
      return;
    }

    itemsCtn.innerHTML = '';
    cart.forEach(item => {
      const row = document.createElement('div');
      row.className = 'nn-cart-item';
      row.innerHTML = `
        <div>
          <div class="nn-cart-item-name">${item.name}</div>
          <div class="nn-cart-item-price">$${item.price.toFixed(2)} each</div>
        </div>
        <div class="nn-qty-ctrl">
          <button class="nn-qty-minus" aria-label="Decrease quantity">−</button>
          <span>${item.qty}</span>
          <button class="nn-qty-plus" aria-label="Increase quantity">+</button>
          <button class="nn-cart-remove" aria-label="Remove item"><i class="fa-solid fa-trash"></i></button>
        </div>
      `;
      row.querySelector('.nn-qty-minus').addEventListener('click', () => changeQty(item.name, -1));
      row.querySelector('.nn-qty-plus').addEventListener('click', () => changeQty(item.name, 1));
      row.querySelector('.nn-cart-remove').addEventListener('click', () => removeFromCart(item.name));
      itemsCtn.appendChild(row);
    });
  }

  /* ---------- inject "Add to Cart" buttons into product cards ---------- */
  document.querySelectorAll('.product').forEach(product => {
    const nameEl = product.querySelector('h3');
    const priceEl = product.querySelector('.price');
    const footer = product.querySelector('.product-footer');
    const imgEl = product.querySelector('.product-img img');
    if (!nameEl || !priceEl || !footer) return;

    const name = nameEl.textContent.trim();
    const price = parsePrice(priceEl.textContent);
    const imgSrc = imgEl ? imgEl.src : '';

    const addBtn = document.createElement('button');
    addBtn.className = 'nn-add-btn';
    addBtn.innerHTML = `<i class="fa-solid fa-cart-plus"></i> Add`;
    addBtn.addEventListener('click', () => {
      addToCart(name, price, imgSrc);
      addBtn.classList.add('nn-added');
      addBtn.innerHTML = `<i class="fa-solid fa-check"></i> Added`;
      setTimeout(() => {
        addBtn.classList.remove('nn-added');
        addBtn.innerHTML = `<i class="fa-solid fa-cart-plus"></i> Add`;
      }, 1200);
    });
    footer.appendChild(addBtn);
  });

  /* ---------- inject "Add to Cart" button into each modal ---------- */
  document.querySelectorAll('[id^="modal"]').forEach(modal => {
    const content = modal.querySelector('.modal-content');
    const nameEl = content?.querySelector('h1');
    const priceEl = content?.querySelector('.price2');
    const imgEl = content?.querySelector('img');
    if (!content || !nameEl || !priceEl) return;

    const name = nameEl.textContent.trim();
    const price = parsePrice(priceEl.textContent);
    const imgSrc = imgEl ? imgEl.src : '';

    const modalAddBtn = document.createElement('button');
    modalAddBtn.className = 'nn-modal-add-btn';
    modalAddBtn.innerHTML = `<i class="fa-solid fa-cart-plus"></i> Add to Cart`;
    modalAddBtn.addEventListener('click', () => addToCart(name, price, imgSrc));
    priceEl.insertAdjacentElement('afterend', modalAddBtn);
  });

  /* ---------- initial render ---------- */
  renderCart();
})();

const footerYear = document.getElementById('footer-year');
if (footerYear) footerYear.textContent = new Date().getFullYear();