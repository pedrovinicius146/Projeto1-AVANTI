document.addEventListener('DOMContentLoaded', () => {
    
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartCountEl = document.querySelector('.cart-count');
    const cartIconEl = document.querySelector('.cart-icon');

    function updateCartCount() {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        if (cartCountEl) cartCountEl.textContent = totalItems;
    }

    function saveCart() {
        localStorage.setItem('cart', JSON.stringify(cart));
    }

    function animateCartIcon() {
        if (!cartIconEl) return;
        cartIconEl.style.transform = 'scale(1.2)';
        cartIconEl.style.transition = 'transform 0.3s ease';
        setTimeout(() => {
            cartIconEl.style.transform = 'scale(1)';
        }, 300);
    }

    updateCartCount();

    (function setupSearch() {
        const searchInput = document.querySelector('.search-bar input');
        const searchIcon = document.querySelector('.search-icon');
        let resultEl = null;

        function processSearch() {
            if (!searchInput) return;
            const term = searchInput.value.trim();
            if (resultEl) resultEl.remove();
            if (term) {
                resultEl = document.createElement('div');
                resultEl.className = 'search-result';
                resultEl.style.cssText = 'background-color:#f8f8f8;padding:15px;border-radius:5px;margin:20px 0;box-shadow:0 2px 5px rgba(0,0,0,0.05);';
                resultEl.innerHTML = `<p>Você buscou por: <strong>"${term}"</strong></p>`;
                const mainNav = document.querySelector('.main-nav');
                if (mainNav) mainNav.after(resultEl);
                searchInput.value = '';
            }
        }

        if (searchIcon) searchIcon.addEventListener('click', processSearch);
        if (searchInput) searchInput.addEventListener('keypress', e => {
            if (e.key === 'Enter') processSearch();
        });
    })();

    
    (function setupCarousel() {
        const productGrid = document.querySelector('.product-grid');
        const dots = document.querySelectorAll('.dot');
        const productCards = document.querySelectorAll('.product-card');
        if (!productGrid || dots.length === 0 || productCards.length === 0) return;
        let currentIndex = 0;

        function calculateVisible() {
            const gridWidth = productGrid.offsetWidth;
            const cardStyle = window.getComputedStyle(productCards[0]);
            const cardWidth = productCards[0].offsetWidth + parseInt(cardStyle.marginRight);
            const visibleItems = Math.max(1, Math.floor(gridWidth / cardWidth));
            return { cardWidth, visibleItems };
        }

        function updateDots(index) {
            dots.forEach((dot, i) => dot.classList.toggle('active', i === index));
        }

        function scrollToGroup(index) {
            const { cardWidth, visibleItems } = calculateVisible();
            const scrollPosition = index * visibleItems * cardWidth;
            productGrid.scrollTo({ left: scrollPosition, behavior: 'smooth' });
            updateDots(index);
        }

       
        dots.forEach((dot, i) => dot.addEventListener('click', () => scrollToGroup(i)));
        window.addEventListener('resize', () => scrollToGroup(currentIndex));

        const { visibleItems } = calculateVisible();
        const totalGroups = Math.ceil(productCards.length / visibleItems);

        
        setInterval(() => {
            currentIndex = (currentIndex + 1) % totalGroups;
            scrollToGroup(currentIndex);
        }, 5000);

       
        productGrid.addEventListener('scroll', () => {
            const { cardWidth, visibleItems } = calculateVisible();
            const newIndex = Math.round(productGrid.scrollLeft / (visibleItems * cardWidth));
            if (newIndex !== currentIndex && newIndex >= 0 && newIndex < totalGroups) {
                currentIndex = newIndex;
                updateDots(currentIndex);
            }
        });

        
        productCards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                card.style.transform = 'translateY(-5px)';
                card.style.boxShadow = '0 5px 15px rgba(0,0,0,0.1)';
            });
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'translateY(0)';
                card.style.boxShadow = '0 2px 5px rgba(0,0,0,0.05)';
            });
        });
    })();

    
    (function setupMenu() {
        const menuContainer = document.querySelector('.menu-container');
        const menuContent = document.querySelector('.menu-content');
        if (!menuContainer || !menuContent) return;

        menuContent.style.display = 'none';
        menuContainer.addEventListener('mouseenter', () => menuContent.style.display = 'flex');
        menuContainer.addEventListener('mouseleave', () => menuContent.style.display = 'none');

        document.querySelectorAll('.department-item').forEach(item => {
            item.addEventListener('mouseenter', () => {
                document.querySelectorAll('.department-item').forEach(d => d.classList.remove('active'));
                item.classList.add('active');
            });
        });
    })();

    
    (function setupBuyButtons() {
        document.querySelectorAll('.btn.btn-primary').forEach(button => {
            button.addEventListener('click', () => {
                const card = button.closest('.product-card');
                if (!card) return;
                const name = card.querySelector('.product-name')?.textContent || '';
                const price = card.querySelector('.current-price')?.textContent || '';

                const existing = cart.find(item => item.name === name);
                if (existing) existing.quantity++;
                else cart.push({ name, price, quantity: 1 });

                saveCart();
                updateCartCount();
                animateCartIcon();
                alert(`Produto "${name}" adicionado ao carrinho!`);
            });
        });
    })();
});
