// Artist Detail Page JavaScript

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    initializeDetailPage();
});

function initializeDetailPage() {
    // Set dynamic styles
    setDynamicStyles();
    
    // Animate numbers
    animateNumbers();
    
    // Add smooth scroll behavior
    addSmoothScroll();
    
    // Add card interactions
    addCardInteractions();
    
    // Add button hover effects
    addButtonEffects();
}

// Set dynamic styles from data attributes
function setDynamicStyles() {
    // Set popularity bar width
    const popularityFill = document.querySelector('.popularity-fill');
    if (popularityFill && popularityFill.dataset.width) {
        popularityFill.style.width = popularityFill.dataset.width + '%';
    }
    
    // Set genre badge animation delays
    const genreBadges = document.querySelectorAll('.genre-badge');
    genreBadges.forEach(badge => {
        if (badge.dataset.delay) {
            badge.style.animationDelay = (badge.dataset.delay * 0.1) + 's';
        }
    });
}

// Animate counter numbers
function animateNumbers() {
    const animatedNumbers = document.querySelectorAll('.animated-number');
    
    animatedNumbers.forEach(element => {
        const finalValue = parseInt(element.dataset.value);
        const duration = 2000;
        const startTime = performance.now();
        
        function animate(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            const currentValue = Math.floor(finalValue * progress);
            element.textContent = currentValue.toLocaleString();
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                element.textContent = finalValue.toLocaleString();
            }
        }
        
        // Check if element is in viewport before starting animation
        if (isElementInViewport(element)) {
            requestAnimationFrame(animate);
        } else {
            // Start animation when element becomes visible
            observeElement(element, () => {
                const currentTime = performance.now();
                requestAnimationFrame(() => animate(currentTime));
            });
        }
    });
}

// Animate popularity bar
function animatePopularityBar() {
    const bars = document.querySelectorAll('.popularity-fill');
    
    bars.forEach((bar, index) => {
        setTimeout(() => {
            bar.style.transition = 'width 1s ease';
        }, index * 100);
    });
}

// Check if element is in viewport
function isElementInViewport(el) {
    const rect = el.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

// Observe element visibility
function observeElement(element, callback) {
    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    callback();
                    observer.unobserve(entry.target);
                }
            });
        });
        
        observer.observe(element);
    } else {
        callback();
    }
}

// Add smooth scroll behavior
function addSmoothScroll() {
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
}

// Add card interactions
function addCardInteractions() {
    const statCards = document.querySelectorAll('.stat-card');
    const infoCards = document.querySelectorAll('.info-card');
    const genreBadges = document.querySelectorAll('.genre-badge');
    
    // Stat card interactions
    statCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px)';
            this.style.boxShadow = '0 12px 24px rgba(78, 205, 196, 0.2)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.08)';
        });
    });
    
    // Info card interactions
    infoCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-4px)';
            this.style.boxShadow = '0 8px 20px rgba(78, 205, 196, 0.15)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.08)';
        });
    });
    
    // Genre badge interactions
    genreBadges.forEach(badge => {
        badge.addEventListener('click', function() {
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 100);
        });
    });
}

// Add button effects
function addButtonEffects() {
    const buttons = document.querySelectorAll('.cta-btn, .back-button');
    
    buttons.forEach(button => {
        button.addEventListener('mousedown', function() {
            this.style.transform = 'scale(0.98)';
        });
        
        button.addEventListener('mouseup', function() {
            this.style.transform = 'scale(1)';
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
        });
    });
}

// Add page transition animation on load
window.addEventListener('load', function() {
    document.body.style.animation = 'fadeIn 0.6s ease';
});

// Add parallax effect on scroll
window.addEventListener('scroll', function() {
    const heroSection = document.querySelector('.hero-section');
    if (heroSection && window.scrollY < window.innerHeight) {
        const offset = window.scrollY * 0.5;
        heroSection.style.transform = `translateY(${offset}px)`;
    }
});

// Format numbers in the page
function formatNumber(num) {
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
}

// Add copy-to-clipboard functionality (optional enhancement)
document.querySelectorAll('.stat-value').forEach(element => {
    element.style.cursor = 'pointer';
    element.addEventListener('click', function() {
        const text = this.textContent;
        navigator.clipboard.writeText(text).then(() => {
            // Show feedback
            const originalText = this.textContent;
            this.textContent = '✓ Copied!';
            setTimeout(() => {
                this.textContent = originalText;
            }, 1500);
        });
    });
});

// Keyboard navigation
document.addEventListener('keydown', function(event) {
    // Escape key to go back
    if (event.key === 'Escape') {
        const backButton = document.querySelector('.back-button');
        if (backButton) {
            backButton.click();
        }
    }
});

// Add scroll-to-top button functionality
function addScrollToTop() {
    const scrollTopBtn = document.createElement('button');
    scrollTopBtn.className = 'scroll-to-top';
    scrollTopBtn.innerHTML = '↑';
    scrollTopBtn.style.cssText = `
        position: fixed;
        bottom: 2rem;
        right: 2rem;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background: linear-gradient(135deg, #2d6a4f 0%, #4ecdc4 100%);
        color: white;
        border: none;
        cursor: pointer;
        font-size: 1.5rem;
        display: none;
        z-index: 1000;
        box-shadow: 0 4px 12px rgba(78, 205, 196, 0.3);
        transition: all 0.3s ease;
    `;
    
    document.body.appendChild(scrollTopBtn);
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 300) {
            scrollTopBtn.style.display = 'flex';
            scrollTopBtn.style.alignItems = 'center';
            scrollTopBtn.style.justifyContent = 'center';
        } else {
            scrollTopBtn.style.display = 'none';
        }
    });
    
    scrollTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}
