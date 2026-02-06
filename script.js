   // Mobile Navigation Toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-link').forEach(n => n.addEventListener('click', () => {
    hamburger.classList.remove('active');
    navMenu.classList.remove('active');
}));


        // Cart functionality
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        const cartCount = document.getElementById('cart-count');
        const cartItemsContainer = document.getElementById('cart-items');
        const cartTotalElement = document.getElementById('cart-total');
        const cartSidebar = document.getElementById('cart-sidebar');
        const overlay = document.getElementById('overlay');
        const closeCartBtn = document.getElementById('close-cart');
        const cartIcon = document.getElementById('cart-icon');
        const checkoutBtn = document.getElementById('checkout-btn');
        const WHATSAPP_NUMBER = '+263772824132';

        // Update cart count
        function updateCartCount() {
            const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
            cartCount.textContent = totalItems;
            cartCount.style.display = totalItems > 0 ? 'block' : 'none';
        }

        // Update cart total
        function updateCartTotal() {
            const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            cartTotalElement.textContent = `$${total.toFixed(2)}`;
        }

        // Render cart items
        function renderCartItems() {
            if (cart.length === 0) {
                cartItemsContainer.innerHTML = `
                    <div class="empty-cart">
                        <i class="fas fa-shopping-cart"></i>
                        <p>Your cart is empty</p>
                    </div>
                `;
                checkoutBtn.style.display = 'none';
                return;
            }
            
            checkoutBtn.style.display = 'block';
            cartItemsContainer.innerHTML = '';
            
            cart.forEach(item => {
                const cartItem = document.createElement('div');
                cartItem.className = 'cart-item';
                cartItem.innerHTML = `
                    <div class="cart-item-image">
                        <img src="${item.image}" alt="${item.name}">
                    </div>
                    <div class="cart-item-details">
                        <div class="cart-item-title">${item.name}</div>
                        <div class="cart-item-price">$${item.price.toFixed(2)}</div>
                        <div class="cart-item-quantity">
                            <button class="quantity-btn decrease" data-id="${item.id}">-</button>
                            <input type="text" class="quantity-input" value="${item.quantity}" data-id="${item.id}" readonly>
                            <button class="quantity-btn increase" data-id="${item.id}">+</button>
                        </div>
                        <button class="remove-item" data-id="${item.id}">Remove</button>
                    </div>
                `;
                cartItemsContainer.appendChild(cartItem);
            });
        }

        // Add to cart function
        function addToCart(product) {
            const existingItem = cart.find(item => item.id === product.id);
            
            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                cart.push({
                    id: product.id,
                    name: product.name,
                    price: parseFloat(product.price),
                    image: product.image,
                    quantity: 1
                });
            }
            
            saveCart();
            updateCartCount();
            updateCartTotal();
            renderCartItems();
            
            // Show success animation
            const button = document.querySelector(`.add-to-cart[data-id="${product.id}"]`);
            const originalText = button.innerHTML;
            button.innerHTML = '<i class="fas fa-check"></i> Added!';
            button.style.backgroundColor = '#4ade80';
            
            setTimeout(() => {
                button.innerHTML = originalText;
                button.style.backgroundColor = '';
            }, 2000);
        }

        // Update quantity
        function updateQuantity(id, change) {
            const item = cart.find(item => item.id === id);
            if (item) {
                item.quantity += change;
                if (item.quantity <= 0) {
                    removeFromCart(id);
                    return;
                }
                saveCart();
                updateCartTotal();
                renderCartItems();
            }
        }

        // Remove from cart
        function removeFromCart(id) {
            cart = cart.filter(item => item.id !== id);
            saveCart();
            updateCartCount();
            updateCartTotal();
            renderCartItems();
        }

        // Save cart to localStorage
        function saveCart() {
            localStorage.setItem('cart', JSON.stringify(cart));
        }

        // Generate WhatsApp URL for individual product
        function generateProductWhatsAppURL(id, name, price) {
            const message = `Hello Comfort Designs, I would like to order the ${name} for $${price}.`;
            const encodedMessage = encodeURIComponent(message);
            return `https://wa.me/${WHATSAPP_NUMBER.replace(/\+/g, '')}?text=${encodedMessage}`;
        }

        // Generate WhatsApp URL for cart checkout
        function generateCartWhatsAppURL() {
            if (cart.length === 0) {
                return '#';
            }
            
            let message = 'Hello Comfort Designs, I would like to place an order for:\n\n';
            cart.forEach(item => {
                message += `- ${item.name} (Qty: ${item.quantity}) - $${(item.price * item.quantity).toFixed(2)}\n`;
            });
            message += `\nTotal: $${cart.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2)}`;
            
            const encodedMessage = encodeURIComponent(message);
            return `https://wa.me/${WHATSAPP_NUMBER.replace(/\+/g, '')}?text=${encodedMessage}`;
        }

        // Initialize cart
        function initCart() {
            updateCartCount();
            updateCartTotal();
            renderCartItems();
        }

        // Event listeners
        document.addEventListener('DOMContentLoaded', () => {
            initCart();
            
            // Add to cart buttons
            document.querySelectorAll('.add-to-cart').forEach(button => {
                button.addEventListener('click', (e) => {
                    e.preventDefault();
                    const product = {
                        id: parseInt(button.dataset.id),
                        name: button.dataset.name,
                        price: button.dataset.price,
                        image: button.dataset.image
                    };
                    addToCart(product);
                });
            });
            
            // Order via WhatsApp buttons (individual products)
            document.querySelectorAll('.order-whatsapp').forEach(button => {
                button.addEventListener('click', (e) => {
                    e.preventDefault();
                    const id = button.dataset.id;
                    const name = button.dataset.name;
                    const price = button.dataset.price;
                    const whatsappURL = generateProductWhatsAppURL(id, name, price);
                    window.open(whatsappURL, '_blank');
                });
            });
            
            // Cart icon click
            cartIcon.addEventListener('click', () => {
                cartSidebar.classList.add('active');
                overlay.classList.add('active');
            });
            
            // Close cart
            closeCartBtn.addEventListener('click', () => {
                cartSidebar.classList.remove('active');
                overlay.classList.remove('active');
            });
            
            // Close cart when clicking overlay
            overlay.addEventListener('click', () => {
                cartSidebar.classList.remove('active');
                overlay.classList.remove('active');
            });
            
            // Checkout button
            checkoutBtn.addEventListener('click', (e) => {
                e.preventDefault();
                if (cart.length === 0) {
                    alert('Your cart is empty!');
                    return;
                }
                const whatsappURL = generateCartWhatsAppURL();
                window.open(whatsappURL, '_blank');
            });
            
            // Event delegation for cart item actions
            cartItemsContainer.addEventListener('click', (e) => {
                if (e.target.classList.contains('decrease')) {
                    const id = parseInt(e.target.dataset.id);
                    updateQuantity(id, -1);
                } else if (e.target.classList.contains('increase')) {
                    const id = parseInt(e.target.dataset.id);
                    updateQuantity(id, 1);
                } else if (e.target.classList.contains('remove-item')) {
                    const id = parseInt(e.target.dataset.id);
                    removeFromCart(id);
                }
            });
      });

        
