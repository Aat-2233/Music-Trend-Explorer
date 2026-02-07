// Predict Page JavaScript

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    initializePredictPage();
});

function initializePredictPage() {
    setupRangeSlider();
    setupFormInteraction();
    animateResults();
    setupButtonEffects();
}

// Setup range slider with input synchronization
function setupRangeSlider() {
    const slider = document.getElementById('followerSlider');
    const input = document.getElementById('followers');
    const sliderValue = document.getElementById('sliderValue');

    if (slider && input && sliderValue) {
        // Update slider when input changes
        input.addEventListener('input', function() {
            let value = parseInt(this.value) || 0;
            slider.value = value;
            updateSliderDisplay(value, sliderValue);
        });

        // Update input when slider changes
        slider.addEventListener('input', function() {
            let value = parseInt(this.value);
            input.value = value;
            updateSliderDisplay(value, sliderValue);
        });

        // Initialize slider display
        updateSliderDisplay(parseInt(slider.value), sliderValue);
    }
}

// Update slider display value
function updateSliderDisplay(value, sliderValue) {
    if (sliderValue) {
        sliderValue.textContent = formatNumber(value);
    }
}

// Format number with commas
function formatNumber(num) {
    return new Intl.NumberFormat('en-US').format(num);
}

// Setup form interaction
function setupFormInteraction() {
    const form = document.getElementById('predictForm');
    const input = document.getElementById('followers');

    if (form && input) {
        // Add focus effect
        input.addEventListener('focus', function() {
            this.parentElement.style.transform = 'scale(1.02)';
        });

        input.addEventListener('blur', function() {
            this.parentElement.style.transform = 'scale(1)';
        });

        // Form submission with loading state
        form.addEventListener('submit', function(e) {
            const btn = form.querySelector('.predict-btn');
            const originalHTML = btn.innerHTML;
            
            // Show loading state
            btn.innerHTML = '<span class="btn-icon">⏳</span><span>Predicting...</span>';
            btn.disabled = true;
        });
    }
}

// Animate results when they appear
function animateResults() {
    const resultCard = document.getElementById('resultCard');
    
    if (resultCard) {
        // Animate the gauge fill
        const gaugeFill = resultCard.querySelector('.gauge-fill');
        if (gaugeFill && gaugeFill.dataset.value) {
            const value = parseFloat(gaugeFill.dataset.value);
            // Trigger animation after a short delay
            setTimeout(() => {
                gaugeFill.style.width = (value / 100) * 100 + '%';
            }, 100);
        }

        // Animate counter numbers
        animateCounters(resultCard);

        // Add staggered animation to detail items
        const detailItems = resultCard.querySelectorAll('.detail-item');
        detailItems.forEach((item, index) => {
            item.style.animation = `slideInUp 0.5s ease forwards`;
            item.style.animationDelay = `${index * 0.1 + 0.3}s`;
            item.style.opacity = '0';
        });
    }
}

// Animate counter numbers
function animateCounters(container) {
    const predictionValue = container.querySelector('.prediction-value');
    const followerInput = container.querySelector('#followerInput');

    if (predictionValue) {
        const targetValue = parseFloat(predictionValue.textContent);
        animateNumber(predictionValue, targetValue, 2, 1500);
    }

    if (followerInput && followerInput.textContent) {
        const targetValue = parseInt(followerInput.textContent.replace(/,/g, ''));
        animateNumber(followerInput, targetValue, 0, 1500, true);
    }
}

// Animate a number from 0 to target
function animateNumber(element, target, decimals = 0, duration = 1500, useFormat = false) {
    const startValue = 0;
    const startTime = performance.now();

    function animate(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        const currentValue = startValue + (target - startValue) * easeOutQuad(progress);

        if (useFormat) {
            element.textContent = formatNumber(Math.floor(currentValue));
        } else {
            element.textContent = currentValue.toFixed(decimals);
        }

        if (progress < 1) {
            requestAnimationFrame(animate);
        } else {
            if (useFormat) {
                element.textContent = formatNumber(Math.floor(target));
            } else {
                element.textContent = target.toFixed(decimals);
            }
        }
    }

    requestAnimationFrame(animate);
}

// Easing function
function easeOutQuad(t) {
    return 1 - (1 - t) * (1 - t);
}

// Setup button effects
function setupButtonEffects() {
    const buttons = document.querySelectorAll('.predict-btn, .cta-btn');

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

        // Add ripple effect
        button.addEventListener('click', function(e) {
            addRipple(this, e);
        });
    });
}

// Add ripple effect to buttons
function addRipple(element, event) {
    const ripple = document.createElement('span');
    const rect = element.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;

    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';
    ripple.classList.add('ripple');

    element.appendChild(ripple);

    setTimeout(() => ripple.remove(), 600);
}

// Input validation
document.addEventListener('input', function(e) {
    if (e.target.id === 'followers') {
        const value = parseInt(e.target.value) || 0;
        
        // Add warning if value is unusual
        if (value > 100000000) {
            e.target.parentElement.style.borderColor = '#ff6b6b';
        } else {
            e.target.parentElement.style.borderColor = '';
        }
    }
});

// Keyboard shortcuts
document.addEventListener('keydown', function(event) {
    // Enter to predict
    if (event.key === 'Enter' && document.activeElement.id === 'followers') {
        document.getElementById('predictForm').submit();
    }

    // Ctrl/Cmd + K to focus followers input
    if ((event.ctrlKey || event.metaKey) && event.key === 'k') {
        event.preventDefault();
        document.getElementById('followers')?.focus();
    }
});

// Add smooth scroll behavior
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

// Intersection Observer for card animations
if ('IntersectionObserver' in window) {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
            }
        });
    }, observerOptions);

    document.querySelectorAll('.explanation-card').forEach(card => {
        card.style.opacity = '0';
        observer.observe(card);
    });
}

// Parallax effect on header
window.addEventListener('scroll', function() {
    const header = document.querySelector('.predict-header');
    if (header && window.scrollY < window.innerHeight) {
        const offset = window.scrollY * 0.5;
        header.style.transform = `translateY(${offset}px)`;
    }
});

// Add result notification
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `<span>${message}</span>`;
    notification.style.cssText = `
        position: fixed;
        top: 2rem;
        right: 2rem;
        background: ${type === 'success' ? '#4ecdc4' : '#ff6b6b'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        z-index: 1000;
        animation: slideInUp 0.3s ease;
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'fadeOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}
