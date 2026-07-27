const PRODUCTS = [
  {
    id: 1,
    name: "Bloom Noir",
    family: "Floral Oriental",
    tagline: "A dark rose wrapped in oud and musk",
    notes: "Top: Rose, Bergamot — Heart: Oud, Jasmine — Base: Musk, Amber",
    price: 120,
    tint: "#A8425A",
    badge: "Bestseller",
    description: "Bloom Noir is a seductive floral oriental that opens with the brightness of rose and bergamot, deepening into rich oud and jasmine before settling into a warm, skin-like musk."
  },
  {
    id: 2,
    name: "Sea Drift",
    family: "Fresh Aquatic",
    tagline: "Ocean air and cedar on a summer morning",
    notes: "Top: Citrus, Sea Salt — Heart: Driftwood, Aquatic — Base: Cedarwood, Vetiver",
    price: 95,
    tint: "#4C7C8C",
    badge: "",
    description: "Sea Drift captures the feeling of standing at the ocean's edge — a burst of citrus and sea salt that dries down into smooth cedarwood and vetiver."
  },
  {
    id: 3,
    name: "Velvet Ember",
    family: "Warm Woody",
    tagline: "Vanilla and sandalwood by firelight",
    notes: "Top: Cardamom, Spice — Heart: Sandalwood, Vanilla — Base: Amber, Tonka Bean",
    price: 140,
    tint: "#A8642E",
    badge: "Bestseller",
    description: "Velvet Ember is a deeply comforting fragrance. Warm spices open the scent before melting into creamy sandalwood and vanilla, finished with a rich amber and tonka base."
  },
  {
    id: 4,
    name: "Garden Reverie",
    family: "Green Floral",
    tagline: "Dewy petals in a sunlit garden",
    notes: "Top: Green Leaves, Peach — Heart: Peony, Lily — Base: White Musk, Green Tea",
    price: 85,
    tint: "#6E8F5C",
    badge: "",
    description: "Garden Reverie is a light, airy floral that feels like wandering through a garden at dawn. Fresh green notes and peach lead into blooming peony and lily on a clean musky base."
  },
  {
    id: 5,
    name: "Midnight Oud",
    family: "Dark Oriental",
    tagline: "Oud, leather and incense after dark",
    notes: "Top: Saffron, Incense — Heart: Oud, Leather — Base: Patchouli, Dark Musk",
    price: 200,
    tint: "#3D3348",
    badge: "Limited Edition",
    description: "Midnight Oud is an intense, luxurious fragrance for those who want to leave a lasting impression. Saffron and incense open dramatically before giving way to rich oud and leather."
  },
  {
    id: 6,
    name: "Citrus Matin",
    family: "Fresh Citrus",
    tagline: "Bright bergamot and lemon at sunrise",
    notes: "Top: Bergamot, Lemon, Grapefruit — Heart: Neroli, Green Tea — Base: Vetiver, Musk",
    price: 75,
    tint: "#C9962E",
    badge: "",
    description: "Citrus Matin is the perfect morning fragrance — uplifting, clean and effortless. A burst of bergamot and lemon opens brightly before settling into a clean vetiver and musk base."
  }
];

// ── Top / Heart / Base mini note trio for product cards ────
function notesTrio(p) {
  const parts = { top: '', heart: '', base: '' };
  p.notes.split('—').forEach(seg => {
    seg = seg.trim();
    if (/^top:/i.test(seg)) parts.top = seg.replace(/^top:\s*/i, '');
    else if (/^heart:/i.test(seg)) parts.heart = seg.replace(/^heart:\s*/i, '');
    else if (/^base:/i.test(seg)) parts.base = seg.replace(/^base:\s*/i, '');
  });
  return `
    <div class="notes-trio">
      <div><div class="nt-label">Top</div><div class="nt-value">${parts.top}</div></div>
      <div><div class="nt-label">Heart</div><div class="nt-value">${parts.heart}</div></div>
      <div><div class="nt-label">Base</div><div class="nt-value">${parts.base}</div></div>
    </div>`;
}

// ── Bottle illustration (replaces emoji placeholders) ──────
// Renders a small, elegant flacon silhouette tinted to the fragrance's
// family colour, with a consistent gold cap so every product reads as
// part of one collection.
function bottleSVG(p, opts = {}) {
  const size = opts.size || 100;
  const gid = 'bottle-glass-' + p.id + '-' + Math.random().toString(36).slice(2, 7);
  const gid2 = 'bottle-shine-' + p.id + '-' + Math.random().toString(36).slice(2, 7);
  return `
  <svg class="bottle-svg" viewBox="0 0 100 150" width="${size}" height="${size * 1.5}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${p.name} bottle">
    <defs>
      <linearGradient id="${gid}" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="${p.tint}" stop-opacity="0.9"/>
        <stop offset="55%" stop-color="${p.tint}" stop-opacity="0.62"/>
        <stop offset="100%" stop-color="${p.tint}" stop-opacity="0.85"/>
      </linearGradient>
      <linearGradient id="${gid2}" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#fff" stop-opacity="0.55"/>
        <stop offset="100%" stop-color="#fff" stop-opacity="0"/>
      </linearGradient>
    </defs>
    <ellipse cx="50" cy="139" rx="26" ry="5" fill="${p.tint}" opacity="0.14"/>
    <rect x="40" y="10" width="20" height="12" rx="3" fill="#C9A84C"/>
    <rect x="40" y="10" width="20" height="4" rx="2" fill="#E4CA84"/>
    <rect x="46" y="21" width="8" height="10" fill="#B0A898"/>
    <path d="M28 39 Q28 31 38 31 H62 Q72 31 72 39 V122 Q72 136 60 136 H40 Q28 136 28 122 Z"
          fill="url(#${gid})" stroke="#1C1A17" stroke-opacity="0.14" stroke-width="1"/>
    <path d="M32 40 Q32 34 39 34 H45 V128 Q39 128 34 122 Z" fill="url(#${gid2})"/>
    <rect x="34" y="82" width="32" height="26" rx="1.5" fill="#FAF8F4" fill-opacity="0.92"/>
    <line x1="38" y1="91" x2="62" y2="91" stroke="${p.tint}" stroke-width="1.1"/>
    <line x1="38" y1="97" x2="54" y2="97" stroke="${p.tint}" stroke-width="1.1" opacity="0.6"/>
    <circle cx="50" cy="66" r="1.6" fill="#C9A84C"/>
  </svg>`;
}

// ── Mobile navigation ───────────────────────────────────────
function initMobileNav() {
  const nav = document.querySelector('.navbar');
  const links = document.querySelector('.nav-links');
  if (!nav || !links || document.querySelector('.nav-burger')) return;
  const burger = document.createElement('button');
  burger.className = 'nav-burger';
  burger.setAttribute('aria-label', 'Toggle menu');
  burger.innerHTML = '<span></span><span></span><span></span>';
  nav.insertBefore(burger, nav.querySelector('.nav-actions'));
  burger.addEventListener('click', () => {
    links.classList.toggle('open');
    burger.classList.toggle('open');
  });
  links.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    links.classList.remove('open');
    burger.classList.remove('open');
  }));
}
document.addEventListener('DOMContentLoaded', initMobileNav);

// ── Lightweight formatter for AI replies (bold + line breaks) ──
function formatAIText(text) {
  const escaped = text
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  return escaped
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\n/g, '<br>');
}

// ── Cart logic ──────────────────────────────────────────────
function getCart() {
  try { return JSON.parse(localStorage.getItem('pf_cart') || '[]'); }
  catch { return []; }
}

function saveCart(cart) {
  localStorage.setItem('pf_cart', JSON.stringify(cart));
  updateCartCount();
}

function addToCart(productId, qty = 1) {
  const cart = getCart();
  const existing = cart.find(i => i.id === productId);
  if (existing) {
    existing.qty += qty;
  } else {
    cart.push({ id: productId, qty });
  }
  saveCart(cart);
  showToast('Added to cart!');
}

function removeFromCart(productId) {
  saveCart(getCart().filter(i => i.id !== productId));
}

function getCartTotal() {
  return getCart().reduce((total, item) => {
    const product = PRODUCTS.find(p => p.id === item.id);
    return total + (product ? product.price * item.qty : 0);
  }, 0);
}

function updateCartCount() {
  const count = getCart().reduce((n, i) => n + i.qty, 0);
  document.querySelectorAll('#cartCount').forEach(el => el.textContent = count);
}

function showToast(msg) {
  const t = document.createElement('div');
  t.className = 'toast';
  t.textContent = msg;
  document.body.appendChild(t);
  setTimeout(() => t.classList.add('show'), 10);
  setTimeout(() => { t.classList.remove('show'); setTimeout(() => t.remove(), 300); }, 2500);
}