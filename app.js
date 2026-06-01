// ==========================================================================
// CASA DE COMIDAS DE URSU - APLICACIÓN INTERACTIVA DE BANQUETE DE MUÑECAS
// ==========================================================================

// 1. Datos del Menú (Comida de Juguete Inventada)
const menuProducts = [
    {
        id: 1,
        name: "Dona Unicornio Mágica",
        category: "dulce",
        price: 4.5,
        image: "assets/dona_unicornio.png",
        desc: "Mini rosquilla glaseada en rosa con chispas de estrella y cuerno de oro. ¡Pura magia!"
    },
    {
        id: 2,
        name: "Mini Hamburguesa Rosa",
        category: "salado",
        price: 6.2,
        image: "assets/mini_hamburguesa.png",
        desc: "Pan rosa súper tierno, queso derretido y lechuga fresca a escala Barbie perfecta."
    },
    {
        id: 3,
        name: "Tarta de Cumpleaños Glam",
        category: "dulce",
        price: 5.8,
        image: "assets/torta_rosa.png",
        desc: "Rebanada chic con capas de bizcocho rosa y crema de fresa. ¡Una dulzura total!"
    },
    {
        id: 4,
        name: "Batido Celestial de Fresa",
        category: "bebida",
        price: 3.5,
        image: "assets/milkshake_magico.png",
        desc: "Crema batida fucsia, chispitas de corazones y vaso retro para refrescar el Dreamhouse."
    },
    {
        id: 5,
        name: "Set de Sushi de Fantasía",
        category: "salado",
        price: 7.5,
        image: "assets/sushi_glam.png",
        desc: "Arroz rosa, salmón y mini aguacate con purpurina comestible. ¡La cena gourmet!"
    },
    {
        id: 6,
        name: "Torre de Macarons Glitter",
        category: "dulce",
        price: 4.8,
        image: "assets/macarons_glitter.png",
        desc: "Delicias francesas miniatura en colores pastel y crema de purpurina dorada."
    }
];

// 2. Estado de la Aplicación
let cart = JSON.parse(localStorage.getItem('ursu_barbie_cart')) || [];
const activeCombo = {
    salado: null,
    bebida: null,
    dulce: null
};

// 3. Inicialización cuando el DOM está listo
document.addEventListener('DOMContentLoaded', () => {
    // Generar efectos estéticos de burbujas de corazones
    setupHeartParticles();
    
    // Cargar Catálogo
    renderProducts(menuProducts);
    
    // Configurar Filtros
    setupFilters();
    
    // Configurar Sidebar de Carrito
    setupCartUI();
    
    // Inicializar Constructor de Combos
    setupComboBuilder();
    
    // Eventos Directos en Hero Card
    document.querySelectorAll('.add-to-cart-direct').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = parseInt(e.target.dataset.id);
            addToCart(id);
        });
    });

    // Actualizar estado inicial del carrito
    updateCartUI();
});

// ==========================================================================
// ESTÉTICA: EMISOR DE CORAZONES FLOTANTES
// ==========================================================================
function setupHeartParticles() {
    const container = document.getElementById('particle-container');
    const hearts = ['💖', '💕', '🌸', '✨', '🎀', '🤍'];
    
    function createHeart() {
        if (!container) return;
        const particle = document.createElement('div');
        particle.className = 'heart-particle';
        particle.textContent = hearts[Math.floor(Math.random() * hearts.length)];
        
        // Posicionamiento horizontal aleatorio
        particle.style.left = `${Math.random() * 100}vw`;
        
        // Tamaño y velocidad variables
        const scale = 0.5 + Math.random() * 1.2;
        const duration = 5 + Math.random() * 5;
        
        particle.style.transform = `scale(${scale})`;
        particle.style.animationDuration = `${duration}s`;
        
        container.appendChild(particle);
        
        // Eliminar del DOM después de terminar
        setTimeout(() => {
            particle.remove();
        }, duration * 1000);
    }
    
    // Generar una burbuja de amor cada 1.2 segundos
    setInterval(createHeart, 1200);
    
    // Generar unas pocas iniciales
    for (let i = 0; i < 6; i++) {
        setTimeout(createHeart, Math.random() * 3000);
    }
}

// ==========================================================================
// RENDERIZADO DEL CATÁLOGO DE PRODUCTOS
// ==========================================================================
function renderProducts(products) {
    const grid = document.getElementById('products-grid');
    if (!grid) return;
    
    grid.innerHTML = '';
    
    products.forEach(p => {
        const card = document.createElement('article');
        card.className = 'product-card';
        card.dataset.category = p.category;
        
        // Etiqueta bonita según categoría
        const categoryLabels = {
            dulce: "🍬 Dulce",
            salado: "🍟 Salado",
            bebida: "🥤 Bebida"
        };
        
        card.innerHTML = `
            <div class="product-tag">${categoryLabels[p.category]}</div>
            <div class="product-img-wrapper">
                <img src="${p.image}" alt="${p.name}" class="product-img" loading="lazy">
            </div>
            <div class="product-info">
                <div>
                    <h3 class="product-name">${p.name}</h3>
                    <p class="product-desc">${p.desc}</p>
                </div>
                <div class="product-footer">
                    <span class="product-price">🎀 ${p.price.toFixed(1)} B-Coins</span>
                    <button class="btn btn-primary btn-small add-to-cart-btn" data-id="${p.id}">
                        ¡Añadir! 💖
                    </button>
                </div>
            </div>
        `;
        
        grid.appendChild(card);
    });
    
    // Asignar eventos de clic a los nuevos botones
    grid.querySelectorAll('.add-to-cart-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = parseInt(btn.dataset.id);
            addToCart(id);
        });
    });
}

// ==========================================================================
// FILTROS DE CATEGORÍA
// ==========================================================================
function setupFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            // Quitar clase activa de todos
            filterBtns.forEach(b => b.classList.remove('active'));
            // Añadir activa al actual
            btn.classList.add('active');
            
            const category = btn.dataset.category;
            
            // Si es todos, mostrar catálogo completo
            if (category === 'all') {
                renderProducts(menuProducts);
            } else {
                // Filtrar productos
                const filtered = menuProducts.filter(p => p.category === category);
                renderProducts(filtered);
            }
        });
    });
}

// ==========================================================================
// LÓGICA E INTERFAZ DEL CARRITO DE COMPRAS
// ==========================================================================
function setupCartUI() {
    const toggleBtn = document.getElementById('cart-toggle-btn');
    const closeBtn = document.getElementById('cart-close-btn');
    const sidebar = document.getElementById('cart-sidebar');
    const backdrop = document.getElementById('cart-backdrop');
    const checkoutBtn = document.getElementById('checkout-btn');
    const successCloseBtn = document.getElementById('success-close-btn');
    const successModal = document.getElementById('success-modal');
    
    // Abrir Carrito
    toggleBtn.addEventListener('click', () => {
        sidebar.classList.add('open');
        backdrop.classList.add('show');
    });
    
    // Cerrar Carrito
    const closeCart = () => {
        sidebar.classList.remove('open');
        backdrop.classList.remove('show');
    };
    
    closeBtn.addEventListener('click', closeCart);
    backdrop.addEventListener('click', closeCart);
    
    // Realizar Pedido (Checkout)
    checkoutBtn.addEventListener('click', () => {
        if (cart.length === 0) {
            showToast("⚠️ ¡Tu plato está vacío! Añade delicias para ordenar.");
            return;
        }
        
        // Generar N° de Pedido de fantasía
        const orderNum = `#B-${Math.floor(1000 + Math.random() * 9000)}`;
        document.getElementById('success-order-num').textContent = orderNum;
        
        // Vaciar Carrito
        cart = [];
        saveCart();
        updateCartUI();
        
        // Cerrar Carrito y abrir modal de éxito
        closeCart();
        successModal.classList.add('open');
    });
    
    // Cerrar Modal de Éxito
    successCloseBtn.addEventListener('click', () => {
        successModal.classList.remove('open');
    });
}

// Añadir Producto al Carrito
function addToCart(productId) {
    const product = menuProducts.find(p => p.id === productId);
    if (!product) return;
    
    const existing = cart.find(item => item.id === productId && !item.isCombo);
    
    if (existing) {
        existing.quantity += 1;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: 1,
            isCombo: false
        });
    }
    
    saveCart();
    updateCartUI();
    showToast(`💖 ¡${product.name} añadido a tu mesa!`);
}

// Eliminar o modificar cantidades
function changeQty(index, change) {
    if (cart[index].quantity + change <= 0) {
        cart.splice(index, 1);
    } else {
        cart[index].quantity += change;
    }
    saveCart();
    updateCartUI();
}

function deleteItem(index) {
    cart.splice(index, 1);
    saveCart();
    updateCartUI();
}

// Guardar en LocalStorage
function saveCart() {
    localStorage.setItem('ursu_barbie_cart', JSON.stringify(cart));
}

// Actualizar la interfaz del carrito
function updateCartUI() {
    const cartItemsContainer = document.getElementById('cart-items');
    const badge = document.getElementById('cart-badge');
    const subtotalText = document.getElementById('cart-subtotal');
    const taxText = document.getElementById('cart-tax');
    const totalText = document.getElementById('cart-total');
    
    if (!cartItemsContainer) return;
    
    // Contar total de unidades
    const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
    badge.textContent = totalItems;
    
    // Latido de badge si tiene ítems
    if (totalItems > 0) {
        badge.style.transform = 'scale(1.2)';
        setTimeout(() => badge.style.transform = 'scale(1)', 3000);
    }
    
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = `
            <div class="empty-cart-message">
                <span class="empty-icon">🍽️</span>
                <p>Tu plato aún está vacío. ¡Elige comidas deliciosas para llenarlo!</p>
            </div>
        `;
        subtotalText.textContent = "0.0 B-Coins";
        taxText.textContent = "0.0 B-Coins";
        totalText.textContent = "0.0 B-Coins";
        return;
    }
    
    cartItemsContainer.innerHTML = '';
    
    let subtotal = 0;
    
    cart.forEach((item, index) => {
        const itemTotal = item.price * item.quantity;
        subtotal += itemTotal;
        
        const card = document.createElement('div');
        card.className = 'cart-item';
        
        card.innerHTML = `
            <img src="${item.image}" alt="${item.name}" class="cart-item-img">
            <div class="cart-item-info">
                <h4>${item.name}</h4>
                <div class="cart-item-price">🎀 ${item.price.toFixed(1)} B-Coins</div>
            </div>
            <div class="cart-item-qty">
                <button class="qty-btn" onclick="changeQty(${index}, -1)">-</button>
                <span class="qty-val">${item.quantity}</span>
                <button class="qty-btn" onclick="changeQty(${index}, 1)">+</button>
            </div>
            <button class="delete-item-btn" onclick="deleteItem(${index})">🗑️</button>
        `;
        
        cartItemsContainer.appendChild(card);
    });
    
    // Impuesto de Purpurina Fantasía del 10%
    const tax = subtotal * 0.1;
    const total = subtotal + tax;
    
    subtotalText.textContent = `${subtotal.toFixed(1)} B-Coins`;
    taxText.textContent = `${tax.toFixed(1)} B-Coins`;
    totalText.textContent = `${total.toFixed(1)} B-Coins`;
}

// Vincular funciones a ventana global para onclick directo
window.changeQty = changeQty;
window.deleteItem = deleteItem;

// ==========================================================================
// CONSTRUCTOR DE COMBOS (BENTO BOX INTERACTIVO)
// ==========================================================================
function setupComboBuilder() {
    const addComboBtn = document.getElementById('add-combo-btn');
    const comboOldPriceText = document.getElementById('combo-old-price');
    const comboNewPriceText = document.getElementById('combo-new-price');
    
    // Configurar interacciones al hacer clic en los filtros de la sección Combo
    // Pero en lugar de obligar al usuario a hacer clic en selectores, ¡su mesa de menú le servirá!
    // Podemos permitir que el usuario asigne productos al combo haciendo clic en ellos, 
    // pero para hacerlo aún más amigable e interactivo, ¡se pueden elegir directamente en la sección!
    
    // Vamos a permitir que cuando hagan clic en los botones de "Elegir" o en los compartimentos bento vacíos, 
    // se abra o desplace al menú de la categoría apropiada.
    
    // Vamos a poblar opciones interactivas basadas en clic directo
    // Cada vez que un usuario añada un plato de categoría compatible a través del catálogo, 
    // ¡le ofreceremos también asignarlo como parte del combo!
    // Mejor aún: Hagamos que la sección del combo tenga mini-botones interactivos de selección rápida.
    // Busquemos las comidas de cada tipo para ponerlas allí.
    
    const salads = menuProducts.filter(p => p.category === 'salado');
    const drinks = menuProducts.filter(p => p.category === 'bebida');
    const sweets = menuProducts.filter(p => p.category === 'dulce');
    
    // Vamos a crear selectores rápidos interactivos justo debajo de la descripción en combo-steps
    const stepSalado = document.querySelector('.combo-step[data-step="salado"]');
    const stepBebida = document.querySelector('.combo-step[data-step="bebida"]');
    const stepDulce = document.querySelector('.combo-step[data-step="dulce"]');
    
    // Agregar botones de selección dentro de cada paso
    appendSelectors(stepSalado, salads, 'salado');
    appendSelectors(stepBebida, drinks, 'bebida');
    appendSelectors(stepDulce, sweets, 'dulce');
    
    function appendSelectors(container, items, categoryKey) {
        if (!container) return;
        const buttonWrapper = document.createElement('div');
        buttonWrapper.className = 'combo-selectors-wrapper';
        buttonWrapper.style.display = 'flex';
        buttonWrapper.style.gap = '8px';
        buttonWrapper.style.marginTop = '10px';
        buttonWrapper.style.flexWrap = 'wrap';
        
        items.forEach(item => {
            const btn = document.createElement('button');
            btn.className = 'btn btn-secondary btn-small';
            btn.style.padding = '5px 12px';
            btn.style.fontSize = '0.78rem';
            btn.textContent = item.name.split(' ')[0] + ' ' + (item.name.split(' ')[1] || ''); // nombre corto
            
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                selectComboItem(categoryKey, item);
                
                // Marcar este botón como activo
                buttonWrapper.querySelectorAll('button').forEach(b => b.style.background = 'var(--barbie-white)');
                btn.style.background = 'var(--barbie-light)';
            });
            buttonWrapper.appendChild(btn);
        });
        
        container.appendChild(buttonWrapper);
    }
    
    function selectComboItem(category, product) {
        activeCombo[category] = product;
        
        // Actualizar etiqueta del texto de paso
        document.getElementById(`selected-${category}-name`).textContent = product.name;
        
        // Actualizar Compartimento Bento Box con la foto real
        const compartment = document.getElementById(`bento-${category}`);
        compartment.classList.add('filled');
        compartment.innerHTML = `
            <img src="${product.image}" alt="${product.name}">
            <p class="placeholder-txt" style="color: var(--barbie-hot); font-weight: 700; margin-top: 5px;">${product.name.split(' ')[0]}</p>
        `;
        
        // Registrar clic para vaciar compartimento
        compartment.onclick = () => {
            activeCombo[category] = null;
            compartment.classList.remove('filled');
            
            const icons = { salado: '🍔', bebida: '🍹', dulce: '🍰' };
            compartment.innerHTML = `
                <span class="placeholder-icon">${icons[category]}</span>
                <p class="placeholder-txt">Selecciona un ${category}</p>
            `;
            document.getElementById(`selected-${category}-name`).textContent = "Ninguno";
            
            // Restablecer estilos de botón de selección rápida
            const stepEl = document.querySelector(`.combo-step[data-step="${category}"]`);
            stepEl.querySelectorAll('button').forEach(b => b.style.background = 'var(--barbie-white)');
            
            recalculateComboPrice();
        };
        
        // Marcar paso como completado
        const stepEl = document.querySelector(`.combo-step[data-step="${category}"]`);
        stepEl.classList.add('completed');
        
        recalculateComboPrice();
    }
    
    function recalculateComboPrice() {
        let originalTotal = 0;
        let filledCount = 0;
        
        if (activeCombo.salado) { originalTotal += activeCombo.salado.price; filledCount++; }
        if (activeCombo.bebida) { originalTotal += activeCombo.bebida.price; filledCount++; }
        if (activeCombo.dulce) { originalTotal += activeCombo.dulce.price; filledCount++; }
        
        comboOldPriceText.textContent = `${originalTotal.toFixed(1)} B-Coins`;
        
        // Si el combo está completo, aplicar 20% de descuento
        if (filledCount === 3) {
            const discountedTotal = originalTotal * 0.8; // 20% off
            comboNewPriceText.textContent = `${discountedTotal.toFixed(1)} B-Coins`;
            
            addComboBtn.removeAttribute('disabled');
            addComboBtn.classList.remove('disabled');
        } else {
            comboNewPriceText.textContent = `${originalTotal.toFixed(1)} B-Coins`;
            addComboBtn.setAttribute('disabled', 'true');
            addComboBtn.classList.add('disabled');
        }
    }
    
    // Añadir combo al carrito
    addComboBtn.addEventListener('click', () => {
        if (!activeCombo.salado || !activeCombo.bebida || !activeCombo.dulce) return;
        
        const originalPrice = activeCombo.salado.price + activeCombo.bebida.price + activeCombo.dulce.price;
        const discountedPrice = originalPrice * 0.8;
        
        // Crear un objeto combinado único
        const comboItem = {
            id: Date.now(), // ID único basado en timestamp
            name: `Combo Bento Box 🎁 (${activeCombo.salado.name.split(' ')[0]} + ${activeCombo.bebida.name.split(' ')[0]} + ${activeCombo.dulce.name.split(' ')[0]})`,
            price: discountedPrice,
            image: "assets/macarons_glitter.png", // Usamos una foto bonita para el combo
            quantity: 1,
            isCombo: true
        };
        
        cart.push(comboItem);
        saveCart();
        updateCartUI();
        
        showToast("🎁 ¡Combo Bento Box añadido a tu mesa con 20% de descuento!");
        
        // Reiniciar Bento Box
        resetBento();
    });
    
    function resetBento() {
        ['salado', 'bebida', 'dulce'].forEach(category => {
            activeCombo[category] = null;
            const compartment = document.getElementById(`bento-${category}`);
            compartment.classList.remove('filled');
            
            const icons = { salado: '🍔', bebida: '🍹', dulce: '🍰' };
            compartment.innerHTML = `
                <span class="placeholder-icon">${icons[category]}</span>
                <p class="placeholder-txt">Selecciona un ${category}</p>
            `;
            document.getElementById(`selected-${category}-name`).textContent = "Ninguno";
            
            const stepEl = document.querySelector(`.combo-step[data-step="${category}"]`);
            stepEl.classList.remove('completed', 'active');
            stepEl.querySelectorAll('button').forEach(b => b.style.background = 'var(--barbie-white)');
        });
        
        comboOldPriceText.textContent = "0.0 B-Coins";
        comboNewPriceText.textContent = "0.0 B-Coins";
        addComboBtn.setAttribute('disabled', 'true');
        addComboBtn.classList.add('disabled');
    }
}

// ==========================================================================
// TOAST NOTIFICATIONS (NOTIFICADOR DE ACCIONES)
// ==========================================================================
function showToast(message) {
    const toast = document.getElementById('toast-notification');
    if (!toast) return;
    
    toast.textContent = message;
    toast.classList.add('show');
    
    // Limpiar temporizador anterior si existe
    if (toast.timeoutId) {
        clearTimeout(toast.timeoutId);
    }
    
    // Ocultar después de 2.5 segundos
    toast.timeoutId = setTimeout(() => {
        toast.classList.remove('show');
    }, 2500);
}
