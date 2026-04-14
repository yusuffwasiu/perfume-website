const PRODUCTS = [
  {
    id: 1,
    name: "Bloom Noir",
    family: "Floral Oriental",
    tagline: "A dark rose wrapped in oud and musk",
    notes: "Top: Rose, Bergamot — Heart: Oud, Jasmine — Base: Musk, Amber",
    price: 120,
    emoji: "🌹",
    description: "Bloom Noir is a seductive floral oriental that opens with the brightness of rose and bergamot, deepening into rich oud and jasmine before settling into a warm, skin-like musk."
  },
  {
    id: 2,
    name: "Sea Drift",
    family: "Fresh Aquatic",
    tagline: "Ocean air and cedar on a summer morning",
    notes: "Top: Citrus, Sea Salt — Heart: Driftwood, Aquatic — Base: Cedarwood, Vetiver",
    price: 95,
    emoji: "🌊",
    description: "Sea Drift captures the feeling of standing at the ocean's edge — a burst of citrus and sea salt that dries down into smooth cedarwood and vetiver."
  },
  {
    id: 3,
    name: "Velvet Ember",
    family: "Warm Woody",
    tagline: "Vanilla and sandalwood by firelight",
    notes: "Top: Cardamom, Spice — Heart: Sandalwood, Vanilla — Base: Amber, Tonka Bean",
    price: 140,
    emoji: "🕯️",
    description: "Velvet Ember is a deeply comforting fragrance. Warm spices open the scent before melting into creamy sandalwood and vanilla, finished with a rich amber and tonka base."
  },
  {
    id: 4,
    name: "Garden Reverie",
    family: "Green Floral",
    tagline: "Dewy petals in a sunlit garden",
    notes: "Top: Green Leaves, Peach — Heart: Peony, Lily — Base: White Musk, Green Tea",
    price: 85,
    emoji: "🌸",
    description: "Garden Reverie is a light, airy floral that feels like wandering through a garden at dawn. Fresh green notes and peach lead into blooming peony and lily on a clean musky base."
  },
  {
    id: 5,
    name: "Midnight Oud",
    family: "Dark Oriental",
    tagline: "Oud, leather and incense after dark",
    notes: "Top: Saffron, Incense — Heart: Oud, Leather — Base: Patchouli, Dark Musk",
    price: 200,
    emoji: "🖤",
    description: "Midnight Oud is an intense, luxurious fragrance for those who want to leave a lasting impression. Saffron and incense open dramatically before giving way to rich oud and leather."
  },
  {
    id: 6,
    name: "Citrus Matin",
    family: "Fresh Citrus",
    tagline: "Bright bergamot and lemon at sunrise",
    notes: "Top: Bergamot, Lemon, Grapefruit — Heart: Neroli, Green Tea — Base: Vetiver, Musk",
    price: 75,
    emoji: "🍋",
    description: "Citrus Matin is the perfect morning fragrance — uplifting, clean and effortless. A burst of bergamot and lemon opens brightly before settling into a clean vetiver and musk base."
  }
];

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