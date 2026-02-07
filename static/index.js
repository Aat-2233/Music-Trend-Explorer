// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeDashboard();
});

// Initialize all dashboard features
function initializeDashboard() {
    showLoadingOverlay();
    setupImageLoading();
    setupSmoothScrolling();
    setupKeyboardShortcuts();
    addImageErrorHandling();
    addImageZoomOnClick();
    hideLoadingOverlay();
}

// Show loading overlay
function showLoadingOverlay() {
    const overlay = document.getElementById('loadingOverlay');
    if (overlay) {
        overlay.classList.add('active');
    }
}

// Hide loading overlay
function hideLoadingOverlay() {
    const overlay = document.getElementById('loadingOverlay');
    if (overlay) {
        setTimeout(() => {
            overlay.classList.remove('active');
        }, 500);
    }
}

// Toggle fullscreen mode for chart cards
function toggleFullscreen(button) {
    const card = button.closest('.chart-card');
    
    if (card.classList.contains('fullscreen')) {
        exitFullscreen(card, button);
    } else {
        enterFullscreen(card, button);
    }
}

// Enter fullscreen mode
function enterFullscreen(card, button) {
    card.classList.add('fullscreen');
    button.textContent = '✕';
    button.setAttribute('aria-label', 'Exit fullscreen');
    document.body.style.overflow = 'hidden';
    
    // Add click outside to close
    setTimeout(() => {
        document.addEventListener('click', closeFullscreenOnOutsideClick);
    }, 100);
}

// Exit fullscreen mode
function exitFullscreen(card, button) {
    card.classList.remove('fullscreen');
    button.textContent = '⛶';
    button.setAttribute('aria-label', 'Enter fullscreen');
    document.body.style.overflow = '';
    document.removeEventListener('click', closeFullscreenOnOutsideClick);
}

// Close fullscreen when clicking outside the card
function closeFullscreenOnOutsideClick(event) {
    const fullscreenCard = document.querySelector('.chart-card.fullscreen');
    if (fullscreenCard && !fullscreenCard.contains(event.target)) {
        const button = fullscreenCard.querySelector('.expand-btn');
        exitFullscreen(fullscreenCard, button);
    }
}

// Setup image loading with fade-in effect
function setupImageLoading() {
    const images = document.querySelectorAll('.chart-image');
    
    images.forEach((img, index) => {
        // Add loading class
        img.style.opacity = '0';
        
        // When image loads, fade it in
        img.addEventListener('load', function() {
            setTimeout(() => {
                img.style.opacity = '1';
            }, index * 100); // Stagger the animations
        });
        
        // If image is already cached, trigger load event
        if (img.complete) {
            img.dispatchEvent(new Event('load'));
        }
    });
}

// Add error handling for images
function addImageErrorHandling() {
    const images = document.querySelectorAll('.chart-image');
    
    images.forEach(img => {
        img.addEventListener('error', function() {
            const cardBody = this.closest('.card-body');
            if (cardBody) {
                cardBody.innerHTML = `
                    <div style="text-align: center; padding: 3rem; color: var(--text-secondary);">
                        <div style="font-size: 3rem; margin-bottom: 1rem;">📊</div>
                        <p>Chart image not available</p>
                        <p style="font-size: 0.9rem; margin-top: 0.5rem;">The image could not be loaded</p>
                    </div>
                `;
            }
        });
    });
}

// Add zoom functionality on image click
function addImageZoomOnClick() {
    const images = document.querySelectorAll('.chart-image');
    
    images.forEach(img => {
        img.style.cursor = 'pointer';
        
        img.addEventListener('click', function(e) {
            // Don't trigger if already in fullscreen
            if (this.closest('.chart-card').classList.contains('fullscreen')) {
                return;
            }
            
            const expandBtn = this.closest('.chart-card').querySelector('.expand-btn');
            if (expandBtn) {
                toggleFullscreen(expandBtn);
            }
        });
    });
}

// Setup smooth scrolling for navigation
function setupSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
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

// Setup keyboard shortcuts
function setupKeyboardShortcuts() {
    document.addEventListener('keydown', function(e) {
        // ESC to close fullscreen
        if (e.key === 'Escape') {
            const fullscreenCard = document.querySelector('.chart-card.fullscreen');
            if (fullscreenCard) {
                const button = fullscreenCard.querySelector('.expand-btn');
                exitFullscreen(fullscreenCard, button);
            }
        }
        
        // F to toggle fullscreen on focused card
        if (e.key === 'f' || e.key === 'F') {
            const focusedCard = document.activeElement.closest('.chart-card');
            if (focusedCard) {
                const button = focusedCard.querySelector('.expand-btn');
                if (button) {
                    toggleFullscreen(button);
                }
            }
        }
    });
}

// Add hover effects to navigation links
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-2px) scale(1.05)';
    });
    
    link.addEventListener('mouseleave', function() {
        this.style.transform = '';
    });
});

// Add animation to cards on scroll (Intersection Observer)
function setupScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    document.querySelectorAll('.chart-card').forEach(card => {
        observer.observe(card);
    });
}

// Initialize scroll animations after page load
window.addEventListener('load', setupScrollAnimations);

// Add touch support for mobile devices
function setupTouchSupport() {
    let touchStartY = 0;
    
    document.addEventListener('touchstart', function(e) {
        touchStartY = e.touches[0].clientY;
    }, { passive: true });
    
    document.addEventListener('touchmove', function(e) {
        const fullscreenCard = document.querySelector('.chart-card.fullscreen');
        if (fullscreenCard) {
            const touchY = e.touches[0].clientY;
            const deltaY = touchY - touchStartY;
            
            // Swipe down to close
            if (deltaY > 100) {
                const button = fullscreenCard.querySelector('.expand-btn');
                exitFullscreen(fullscreenCard, button);
            }
        }
    }, { passive: true });
}

setupTouchSupport();

// Add performance monitoring
function monitorPerformance() {
    window.addEventListener('load', function() {
        setTimeout(() => {
            const perfData = window.performance.timing;
            const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
            console.log(`Page load time: ${pageLoadTime}ms`);
        }, 0);
    });
}

monitorPerformance();

// Add dynamic chart card highlighting
function highlightChartCard(card) {
    card.style.boxShadow = '0 0 20px rgba(29, 185, 84, 0.5)';
    setTimeout(() => {
        card.style.boxShadow = '';
    }, 1000);
}

// Add refresh functionality (can be triggered by button if needed)
function refreshCharts() {
    showLoadingOverlay();
    
    const images = document.querySelectorAll('.chart-image');
    images.forEach(img => {
        const src = img.src;
        img.src = '';
        setTimeout(() => {
            img.src = src + '?t=' + new Date().getTime();
        }, 100);
    });
    
    setTimeout(() => {
        hideLoadingOverlay();
    }, 1000);
}

// Export functions for use in HTML
window.toggleFullscreen = toggleFullscreen;
window.refreshCharts = refreshCharts;

// Log successful initialization
console.log('🎵 Music Trends Explorer Dashboard initialized successfully!');