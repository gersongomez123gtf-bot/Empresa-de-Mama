/**
 * script.js - Lógica de la tienda de costura
 */

// ==========================================
// 1. CONFIGURACIÓN Y DATOS
// ==========================================

const WHATSAPP_NUMBER = "50363092236"; // Reemplazar con número real

const products = [
    {
        id: 1,
        name: "Hilo de poliéster 1000 m",
        category: "Hilos",
        description: "Hilo resistente y brillante, ideal para costuras generales.",
        price: 2.50,
        availability: true,
        image: "https://via.placeholder.com/300?text=Hilo+Poliester"
    },
    {
        id: 2,
        name: "Hilo de algodón",
        category: "Hilos",
        description: "Hilo natural, perfecto para bordados y telas orgánicas.",
        price: 3.00,
        availability: true,
        image: "https://via.placeholder.com/300?text=Hilo+Algodon"
    },
    {
        id: 3,
        name: "Agujas universales (10 unidades)",
        category: "Agujas",
        description: "Agujas de alta calidad para todo tipo de telas.",
        price: 1.50,
        availability: true,
        image: "https://via.placeholder.com/300?text=Agujas+Univ"
    },
    {
        id: 4,
        name: "Agujas para cuero y mezclilla",
        category: "Agujas",
        description: "Punta reforzada para atravesar materiales gruesos.",
        price: 2.00,
        availability: true,
        image: "https://via.placeholder.com/300?text=Agujas+Cuero"
    },
    {
        id: 5,
        name: "Tela de algodón blanco (metro)",
        category: "Telas",
        description: "Tela fresca, 100% algodón, ideal para camisas.",
        price: 8.00,
        availability: true,
        image: "https://via.placeholder.com/300?text=Tela+Algodon"
    },
    {
        id: 6,
        name: "Tela estampada floral (metro)",
        category: "Telas",
        description: "Diseños modernos y coloridos para vestidos.",
        price: 12.00,
        availability: true,
        image: "https://via.placeholder.com/300?text=Tela+Estampada"
    },
    {
        id: 7,
        name: "Bobinas metálicas",
        category: "Repuestos",
        description: "Set de 10 bobinas compatibles con máquinas industriales.",
        price: 4.50,
        availability: true,
        image: "https://via.placeholder.com/300?text=Bobinas"
    },
    {
        id: 8,
        name: "Prensatelas para cremalleras",
        category: "Accesorios",
        description: "Facilita la costura de cierres invisibles.",
        price: 5.00,
        availability: true,
        image: "https://via.placeholder.com/300?text=Prensatelas"
    },
    {
        id: 9,
        name: "Correas para máquina de coser",
        category: "Repuestos",
        description: "Correa dentada de alta resistencia.",
        price: 6.00,
        availability: true,
        image: "https://via.placeholder.com/300?text=Correas"
    },
    {
        id: 10,
        name: "Canillas plásticas (set x 5)",
        category: "Accesorios",
        description: "Canillas estándar para máquinas familiares.",
        price: 1.20,
        availability: true,
        image: "https://via.placeholder.com/300?text=Canillas"
    },
    {
        id: 11,
        name: "Aceite lubricante para máquina",
        category: "Herramientas",
        description: "Limpia y lubrica los engranajes internos.",
        price: 3.50,
        availability: true,
        image: "https://via.placeholder.com/300?text=Aceite"
    },
    {
        id: 12,
        name: "Destornilladores de precisión",
        category: "Herramientas",
        description: "Set necesario para ajustar tensiones y agujas.",
        price: 7.00,
        availability: true,
        image: "https://via.placeholder.com/300?text=Destornilladores"
    },
    {
        id: 13,
        name: "Tijeras profesionales de sastre",
        category: "Herramientas",
        description: "Corte limpio y preciso en cualquier tela.",
        price: 15.00,
        availability: true,
        image: "https://via.placeholder.com/300?text=Tijeras"
    },
];

// ==========================================
// 2. ESTADO DEL CARRITO
// ==========================================

let cart = JSON.parse(localStorage.getItem('costura_cart')) || [];

function saveCart() {
    localStorage.setItem('costura_cart', JSON.stringify(cart));
    updateCartBadge();
}

function updateCartBadge() {
    const badge = document.querySelector('.cart-count');
    if (badge) {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        badge.textContent = totalItems;
    }
}

// ==========================================
// 3. LÓGICA DE PRODUCTOS Y FILTROS
// ==========================================

function renderProducts(filteredList = products) {
    const grid = document.getElementById('product-grid');
    const noResults = document.getElementById('no-results');
    if (!grid) return;

    grid.innerHTML = '';

    if (filteredList.length === 0) {
        noResults.style.display = 'block';
        return;
    }

    noResults.style.display = 'none';

    filteredList.forEach(product => {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `
            <div class="product-img-container">
                <img src="${product.image}" alt="${product.name}" loading="lazy">
            </div>
            <div class="product-details">
                <span class="product-cat">${product.category}</span>
                <h3 class="product-title">${product.name}</h3>
                <p class="product-desc">${product.description}</p>
                <div class="product-bottom">
                    <span class="product-price">$${product.price.toFixed(2)}</span>
                    <div style="display:flex; gap: 5px;">
                        <button class="btn-add-cart" onclick="addToCart(${product.id})">
                            <i class="fa-solid fa-cart-plus"></i>
                        </button>
                        <button class="btn-wa-product" onclick="orderProductWA(${product.id})">
                            <i class="fa-brands fa-whatsapp"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;
        grid.appendChild(card);
    });
}

function handleSearch() {
    const query = document.getElementById('search-input').value.toLowerCase();
    const filtered = products.filter(p =>
        p.name.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query) ||
        p.category.toLowerCase().includes(query)
    );
    renderProducts(filtered);
}

function handleFilter() {
    const category = document.getElementById('category-filter').value;
    const sort = document.getElementById('sort-filter').value;

    let filtered = category === 'Todos' ? [...products] : products.filter(p => p.category === category);

    if (sort === 'low-high') filtered.sort((a, b) => a.price - b.price);
    else if (sort === 'high-low') filtered.sort((a, b) => b.price - a.price);
    else if (sort === 'az') filtered.sort((a, b) => a.name.localeCompare(b.name));

    renderProducts(filtered);
}

function filterByCategory(category) {
    const select = document.getElementById('category-filter');
    if (select) {
        select.value = category;
        handleFilter();
        document.getElementById('productos').scrollIntoView({ behavior: 'smooth' });
    }
}

// ==========================================
// 4. GESTIÓN DEL CARRITO
// ==========================================

function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    const existingItem = cart.find(item => item.id === productId);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }

    saveCart();
    showToast(`¡${product.name} agregado!`);
}

function changeQuantity(productId, delta) {
    const item = cart.find(i => i.id === productId);
    if (item) {
        item.quantity += delta;
        if (item.quantity <= 0) {
            removeFromCart(productId);
        } else {
            saveCart();
        }
    }
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
}

function clearCart() {
    if (confirm("¿Estás seguro de que quieres vaciar el carrito?")) {
        cart = [];
        saveCart();
    }
}

function renderCart() {
    const container = document.getElementById('cart-items');
    const totalElement = document.getElementById('cart-total');
    if (!container) return;

    container.innerHTML = '';
    let total = 0;

    if (cart.length === 0) {
        container.innerHTML = '<p style="text-align:center; padding: 2rem 0; color: #777;">Tu carrito está vacío 🛒</p>';
        if (totalElement) totalElement.textContent = '$0.00';
        return;
    }

    cart.forEach(item => {
        const subtotal = item.price * item.quantity;
        total += subtotal;

        const div = document.createElement('div');
        div.className = 'cart-item';
        div.innerHTML = `
            <div class="cart-item-info">
                <img src="${item.image}" alt="${item.name}">
                <div>
                    <h4>${item.name}</h4>
                    <p>$${item.price.toFixed(2)}</p>
                </div>
            </div>
            <div class="cart-qty-controls">
                <button class="qty-btn" onclick="changeQuantity(${item.id}, -1)">-</button>
                <span>${item.quantity}</span>
                <button class="qty-btn" onclick="changeQuantity(${item.id}, 1)">+</button>
                <button onclick="removeFromCart(${item.id})" style="color: red; background:none; border:none; cursor:pointer; margin-left:10px;">✕</button>
            </div>
        `;
        container.appendChild(div);
    });

    if (totalElement) totalElement.textContent = `$${total.toFixed(2)}`;
}

// ==========================================
// 5. WHATSAPP INTEGRATION
// ==========================================

function orderProductWA(productId) {
    const product = products.find(p => p.id === productId);
    const message = `Hola, estoy interesado en comprar el producto: *${product.name}*. ¿Podrían indicarme si está disponible?`;
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`, '_blank');
}

function sendCartWA() {
    if (cart.length === 0) {
        alert("El carrito está vacío");
        return;
    }

    let message = `Hola, quisiera realizar el siguiente pedido:\n\n`;
    let total = 0;

    cart.forEach(item => {
        const subtotal = item.price * item.quantity;
        total += subtotal;
        message += `• ${item.name} x${item.quantity} - $${subtotal.toFixed(2)}\n`;
    });

    message += `\n*Total aproximado: $${total.toFixed(2)}*\n\n¿Podrían confirmarme disponibilidad?`;

    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`, '_blank');
}

// ==========================================
// 6. UI & EVENTOS
// ==========================================

function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => {
        toast.classList.add('fade-out');
        setTimeout(() => toast.remove(), 500);
    }, 2000);
}

document.addEventListener('DOMContentLoaded', () => {
    renderProducts();
    updateCartBadge();

    // Mobile Menu
    const menuToggle = document.getElementById('menu-toggle');
    const navMenu = document.getElementById('nav-menu');
    if (menuToggle) {
        menuToggle.onclick = () => navMenu.classList.toggle('active');
    }

    // Cart Modal
    const cartToggle = document.getElementById('cart-toggle');
    const cartModal = document.getElementById('cart-modal');
    const closeCart = document.getElementById('close-cart');

    if (cartToggle) {
        cartToggle.onclick = () => {
            renderCart();
            cartModal.style.display = 'flex';
        };
    }
    if (closeCart) {
        closeCart.onclick = () => cartModal.style.display = 'none';
    }

    window.onclick = (event) => {
        if (event.target === cartModal) cartModal.style.display = 'none';
    };

    // WhatsApp Final Button
    const waFinalBtn = document.getElementById('checkout-whatsapp');
    if (waFinalBtn) {
        waFinalBtn.onclick = sendCartWA;
    }

    // Clear Cart Button
    const clearBtn = document.getElementById('clear-cart');
    if (clearBtn) {
        clearBtn.onclick = () => {
            clearCart();
            renderCart();
        };
    }

    // Back to top
    const btt = document.getElementById('back-to-top');
    window.onscroll = () => {
        if (window.pageYOffset > 300) btt.style.display = 'block';
        else btt.style.display = 'none';
    };
    if (btt) {
        btt.onclick = () => window.scrollTo({ top: 0, behavior: 'smooth' });
    }
});
