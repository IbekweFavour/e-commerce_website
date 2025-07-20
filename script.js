// Global Variables
let products = [];
let cart = [];
let orders = [];
let currentProduct = null;
let currentQuantity = 1;

// Sample Products Data
const sampleProducts = [
    {
        id: 1,
        name: "Classic White T-Shirt",
        description: "Premium cotton classic white t-shirt perfect for everyday wear. Comfortable fit and breathable fabric.",
        price: 29.99,
        category: "men",
        image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
        stock: 50
    },
    {
        id: 2,
        name: "Elegant Black Dress",
        description: "Sophisticated black dress perfect for formal occasions. Features a flattering silhouette and premium fabric.",
        price: 89.99,
        category: "women",
        image: "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
        stock: 25
    },
    {
        id: 3,
        name: "Denim Jacket",
        description: "Classic denim jacket with modern styling. Perfect for layering and casual outings.",
        price: 69.99,
        category: "men",
        image: "https://images.unsplash.com/photo-1544022613-e87ca75a784a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
        stock: 30
    },
    {
        id: 4,
        name: "Summer Floral Dress",
        description: "Beautiful floral print dress perfect for summer days. Lightweight and comfortable fabric.",
        price: 59.99,
        category: "women",
        image: "https://images.unsplash.com/photo-1496747611176-843222e1e57c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
        stock: 35
    },
    {
        id: 5,
        name: "Kids Casual Outfit",
        description: "Comfortable and stylish outfit for kids. Made with soft, durable materials.",
        price: 39.99,
        category: "kids",
        image: "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
        stock: 40
    },
    {
        id: 6,
        name: "Leather Handbag",
        description: "Premium leather handbag with multiple compartments. Perfect for daily use.",
        price: 129.99,
        category: "accessories",
        image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
        stock: 20
    },
    {
        id: 7,
        name: "Sneakers",
        description: "Comfortable and stylish sneakers for everyday wear. Available in multiple colors.",
        price: 79.99,
        category: "accessories",
        image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
        stock: 45
    },
    {
        id: 8,
        name: "Formal Shirt",
        description: "Professional formal shirt suitable for office wear. Wrinkle-resistant fabric.",
        price: 49.99,
        category: "men",
        image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
        stock: 30
    }
];

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    // Ensure checkout form event listener is always attached
    const checkoutForm = document.getElementById('checkoutForm');
    if (checkoutForm) {
        checkoutForm.addEventListener('submit', function(e) {
            e.preventDefault();
            placeOrder();
        });
    }
});

function initializeApp() {
    // Load products from localStorage or use sample data
    const savedProducts = localStorage.getItem('products');
    products = savedProducts ? JSON.parse(savedProducts) : sampleProducts;
    
    // Load cart from localStorage
    const savedCart = localStorage.getItem('cart');
    cart = savedCart ? JSON.parse(savedCart) : [];
    
    // Load orders from localStorage
    const savedOrders = localStorage.getItem('orders');
    orders = savedOrders ? JSON.parse(savedOrders) : [];
    
    // Initialize the UI
    renderProducts();
    updateCartCount();
    renderCart();
    renderAdminProducts();
    renderOrders();
    updateAnalytics();
    
    // Add event listeners
    addEventListeners();
}

function addEventListeners() {
    // Filter buttons
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const category = this.dataset.category;
            filterProducts(category);
            
            // Update active button
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
        });
    });
    
    // Admin tabs
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const tab = this.dataset.tab;
            switchTab(tab);
            
            // Update active tab
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
        });
    });
    
    // Add product form
    document.getElementById('addProductForm').addEventListener('submit', function(e) {
        e.preventDefault();
        addProduct();
    });
    
    // Contact form
    document.querySelector('.contact-form').addEventListener('submit', function(e) {
        e.preventDefault();
        submitContactForm();
    });
    
    // Footer category links
    document.querySelectorAll('[data-category]').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const category = this.dataset.category;
            filterProducts(category);
            
            // Update active filter button
            document.querySelectorAll('.filter-btn').forEach(btn => {
                btn.classList.remove('active');
                if (btn.dataset.category === category) {
                    btn.classList.add('active');
                }
            });
            
            // Scroll to products
            document.getElementById('products').scrollIntoView({ behavior: 'smooth' });
        });
    });
}

// Navigation Functions
function toggleSearch() {
    const searchBar = document.getElementById('searchBar');
    searchBar.classList.toggle('active');
    if (searchBar.classList.contains('active')) {
        document.getElementById('searchInput').focus();
    }
}

function toggleCart() {
    const cartSidebar = document.getElementById('cartSidebar');
    cartSidebar.classList.toggle('active');
}

function toggleAdmin() {
    const adminPanel = document.getElementById('adminPanel');
    adminPanel.classList.toggle('active');
}

function toggleMobileMenu() {
    const mobileMenu = document.getElementById('mobileMenu');
    mobileMenu.classList.toggle('active');
}

function scrollToProducts() {
    document.getElementById('products').scrollIntoView({ behavior: 'smooth' });
}

// Product Functions
function renderProducts(filteredProducts = null) {
    const productsGrid = document.getElementById('productsGrid');
    const productsToRender = filteredProducts || products;
    
    if (productsToRender.length === 0) {
        productsGrid.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-box-open"></i>
                <h3>No Products Found</h3>
                <p>Try adjusting your search or filter criteria.</p>
            </div>
        `;
        return;
    }
    
    productsGrid.innerHTML = productsToRender.map(product => `
        <div class="product-card" data-id="${product.id}">
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}">
            </div>
            <div class="product-info">
                <h3 class="product-name">${product.name}</h3>
                <p class="product-description">${product.description}</p>
                <div class="product-price">$${product.price.toFixed(2)}</div>
                <div class="product-actions">
                    <button class="add-to-cart-btn" onclick="addToCart(${product.id})">
                        Add to Cart
                    </button>
                    <button class="view-details-btn" onclick="showProductDetail(${product.id})">
                        View Details
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

function filterProducts(category) {
    if (category === 'all') {
        renderProducts();
    } else {
        const filtered = products.filter(product => product.category === category);
        renderProducts(filtered);
    }
}

function searchProducts() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const filtered = products.filter(product => 
        product.name.toLowerCase().includes(searchTerm) ||
        product.description.toLowerCase().includes(searchTerm)
    );
    renderProducts(filtered);
}

function showProductDetail(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    currentProduct = product;
    currentQuantity = 1;
    
    document.getElementById('detailProductName').textContent = product.name;
    document.getElementById('detailProductImage').src = product.image;
    document.getElementById('detailProductDescription').textContent = product.description;
    document.getElementById('detailProductPrice').textContent = `$${product.price.toFixed(2)}`;
    document.getElementById('quantityDisplay').textContent = currentQuantity;
    
    document.getElementById('productDetailModal').classList.add('active');
}

function closeProductDetail() {
    document.getElementById('productDetailModal').classList.remove('active');
    currentProduct = null;
}

function increaseQuantity() {
    currentQuantity++;
    document.getElementById('quantityDisplay').textContent = currentQuantity;
}

function decreaseQuantity() {
    if (currentQuantity > 1) {
        currentQuantity--;
        document.getElementById('quantityDisplay').textContent = currentQuantity;
    }
}

function addToCartFromDetail() {
    if (currentProduct) {
        addToCart(currentProduct.id, currentQuantity);
        closeProductDetail();
    }
}

// Cart Functions
function addToCart(productId, quantity = 1) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.push({
            ...product,
            quantity: quantity
        });
    }
    
    updateCartCount();
    renderCart();
    saveCart();
    showMessage('Product added to cart!', 'success');
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCartCount();
    renderCart();
    saveCart();
}

function updateCartItemQuantity(productId, newQuantity) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        if (newQuantity <= 0) {
            removeFromCart(productId);
        } else {
            item.quantity = newQuantity;
            updateCartCount();
            renderCart();
            saveCart();
        }
    }
}

function renderCart() {
    const cartItems = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');
    
    if (cart.length === 0) {
        cartItems.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-shopping-cart"></i>
                <h3>Your cart is empty</h3>
                <p>Add some products to get started!</p>
            </div>
        `;
        cartTotal.textContent = '$0.00';
        return;
    }
    
    cartItems.innerHTML = cart.map(item => `
        <div class="cart-item">
            <div class="cart-item-image">
                <img src="${item.image}" alt="${item.name}">
            </div>
            <div class="cart-item-info">
                <div class="cart-item-name">${item.name}</div>
                <div class="cart-item-price">$${item.price.toFixed(2)}</div>
                <div class="cart-item-quantity">
                    <button class="quantity-btn" onclick="updateCartItemQuantity(${item.id}, ${item.quantity - 1})">-</button>
                    <span>${item.quantity}</span>
                    <button class="quantity-btn" onclick="updateCartItemQuantity(${item.id}, ${item.quantity + 1})">+</button>
                </div>
            </div>
            <button class="remove-item-btn" onclick="removeFromCart(${item.id})">Remove</button>
        </div>
    `).join('');
    
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cartTotal.textContent = `$${total.toFixed(2)}`;
}

function updateCartCount() {
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    document.getElementById('cartCount').textContent = count;
}

function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Checkout Functions
function openCheckout() {
    if (cart.length === 0) {
        showMessage('Your cart is empty!', 'error');
        return;
    }
    
    renderCheckoutSummary();
    document.getElementById('checkoutModal').classList.add('active');
}

function closeCheckout() {
    document.getElementById('checkoutModal').classList.remove('active');
}

function renderCheckoutSummary() {
    const checkoutItems = document.getElementById('checkoutItems');
    const checkoutTotal = document.getElementById('checkoutTotal');
    
    checkoutItems.innerHTML = cart.map(item => `
        <div class="checkout-item">
            <span>${item.name} x${item.quantity}</span>
            <span>$${(item.price * item.quantity).toFixed(2)}</span>
        </div>
    `).join('');
    
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    checkoutTotal.textContent = `$${total.toFixed(2)}`;
}

function placeOrder() {
    // Validate cart is not empty
    if (!cart || cart.length === 0) {
        showMessage('Your cart is empty! Please add products before placing an order.', 'error');
        return;
    }
    // Validate all fields
    const name = document.getElementById('customerName').value.trim();
    const email = document.getElementById('customerEmail').value.trim();
    const phone = document.getElementById('customerPhone').value.trim();
    const address = document.getElementById('customerAddress').value.trim();
    const paymentMethod = document.getElementById('paymentMethod').value;
    if (!name || !email || !phone || !address || !paymentMethod) {
        showMessage('Please fill in all fields to place your order.', 'error');
        return;
    }
    const formData = { name, email, phone, address, paymentMethod };
    const order = {
        id: Date.now(),
        items: [...cart],
        customer: formData,
        total: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0),
        status: 'pending',
        date: new Date().toISOString()
    };
    orders.push(order);
    saveOrders();
    // Clear cart
    cart = [];
    updateCartCount();
    renderCart();
    saveCart();
    // Close checkout
    closeCheckout();
    // Show success message
    showMessage('Order placed successfully! Thank you for your purchase.', 'success');
    // Update analytics
    updateAnalytics();
    // Optionally, reset the checkout form
    document.getElementById('checkoutForm').reset();
}

// Admin Functions
function renderAdminProducts() {
    const adminProducts = document.getElementById('adminProducts');
    
    if (products.length === 0) {
        adminProducts.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-box-open"></i>
                <h3>No Products</h3>
                <p>Add your first product to get started!</p>
            </div>
        `;
        return;
    }
    
    adminProducts.innerHTML = products.map(product => `
        <div class="admin-product-item">
            <div class="admin-product-image">
                <img src="${product.image}" alt="${product.name}">
            </div>
            <div class="admin-product-info">
                <div class="admin-product-name">${product.name}</div>
                <div class="admin-product-price">$${product.price.toFixed(2)}</div>
                <div>Stock: ${product.stock}</div>
            </div>
            <div class="admin-product-actions">
                <button class="edit-btn" onclick="editProduct(${product.id})">Edit</button>
                <button class="delete-btn" onclick="deleteProduct(${product.id})">Delete</button>
            </div>
        </div>
    `).join('');
}

function showAddProductForm() {
    document.getElementById('addProductModal').classList.add('active');
}

function closeAddProductForm() {
    document.getElementById('addProductModal').classList.remove('active');
    document.getElementById('addProductForm').reset();
}

function addProduct() {
    const formData = {
        name: document.getElementById('productName').value,
        description: document.getElementById('productDescription').value,
        price: parseFloat(document.getElementById('productPrice').value),
        category: document.getElementById('productCategory').value,
        image: document.getElementById('productImage').value,
        stock: parseInt(document.getElementById('productStock').value)
    };
    
    const newProduct = {
        id: Date.now(),
        ...formData
    };
    
    products.push(newProduct);
    saveProducts();
    renderProducts();
    renderAdminProducts();
    closeAddProductForm();
    
    showMessage('Product added successfully!', 'success');
}

function editProduct(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    // For simplicity, we'll just show a prompt to edit
    // In a real application, you'd have a proper edit form
    const newName = prompt('Enter new product name:', product.name);
    if (newName && newName.trim()) {
        product.name = newName.trim();
        saveProducts();
        renderProducts();
        renderAdminProducts();
        showMessage('Product updated successfully!', 'success');
    }
}

function deleteProduct(productId) {
    if (confirm('Are you sure you want to delete this product?')) {
        products = products.filter(p => p.id !== productId);
        saveProducts();
        renderProducts();
        renderAdminProducts();
        showMessage('Product deleted successfully!', 'success');
    }
}

function renderOrders() {
    const ordersList = document.getElementById('ordersList');
    
    if (orders.length === 0) {
        ordersList.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-shopping-bag"></i>
                <h3>No Orders</h3>
                <p>Orders will appear here once customers start shopping.</p>
            </div>
        `;
        return;
    }
    
    ordersList.innerHTML = orders.map(order => `
        <div class="order-item">
            <div class="order-header">
                <h4>Order #${order.id}</h4>
                <span class="order-status ${order.status}">${order.status}</span>
            </div>
            <div class="order-details">
                <p><strong>Customer:</strong> ${order.customer.name}</p>
                <p><strong>Email:</strong> ${order.customer.email}</p>
                <p><strong>Total:</strong> $${order.total.toFixed(2)}</p>
                <p><strong>Date:</strong> ${new Date(order.date).toLocaleDateString()}</p>
                <p><strong>Payment:</strong> ${order.customer.paymentMethod}</p>
            </div>
            <div class="order-items">
                ${order.items.map(item => `
                    <div class="order-item-detail">
                        <span>${item.name} x${item.quantity}</span>
                        <span>$${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                `).join('')}
            </div>
        </div>
    `).join('');
}

function updateAnalytics() {
    const totalSales = orders.reduce((sum, order) => sum + order.total, 0);
    const totalOrders = orders.length;
    const productsSold = orders.reduce((sum, order) => 
        sum + order.items.reduce((itemSum, item) => itemSum + item.quantity, 0), 0
    );
    
    document.getElementById('totalSales').textContent = `$${totalSales.toFixed(2)}`;
    document.getElementById('totalOrders').textContent = totalOrders;
    document.getElementById('productsSold').textContent = productsSold;
}

function switchTab(tabName) {
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    
    document.getElementById(tabName + 'Tab').classList.add('active');
}

// Utility Functions
function saveProducts() {
    localStorage.setItem('products', JSON.stringify(products));
}

function saveOrders() {
    localStorage.setItem('orders', JSON.stringify(orders));
}

function showMessage(message, type = 'success') {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}`;
    messageDiv.textContent = message;
    
    document.body.appendChild(messageDiv);
    
    setTimeout(() => {
        messageDiv.remove();
    }, 3000);
}

function submitContactForm() {
    showMessage('Thank you for your message! We\'ll get back to you soon.', 'success');
    document.querySelector('.contact-form').reset();
}

// Close modals when clicking outside
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('modal')) {
        e.target.classList.remove('active');
    }
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.mobile-link').forEach(link => {
    link.addEventListener('click', function() {
        document.getElementById('mobileMenu').classList.remove('active');
    });
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Header scroll effect
window.addEventListener('scroll', function() {
    const header = document.querySelector('.header');
    if (window.scrollY > 100) {
        header.style.background = 'rgba(255, 255, 255, 0.98)';
    } else {
        header.style.background = 'rgba(255, 255, 255, 0.95)';
    }
});

// Search functionality with Enter key
document.getElementById('searchInput').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        searchProducts();
    }
});

// Initialize the app
console.log('StyleHub E-commerce initialized successfully!'); 