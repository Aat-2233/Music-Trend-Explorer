// Artist Search Page JavaScript

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    initializeArtistPage();
});

function initializeArtistPage() {
    const artistForm = document.getElementById('artistForm');
    const artistInput = document.getElementById('artistInput');

    if (artistForm) {
        // Add smooth form submission
        artistForm.addEventListener('submit', function(e) {
            const inputValue = artistInput.value.trim();
            if (!inputValue) {
                e.preventDefault();
                artistInput.focus();
                artistInput.classList.add('shake');
                setTimeout(() => artistInput.classList.remove('shake'), 500);
            }
        });

        // Add real-time search suggestions (optional enhancement)
        artistInput.addEventListener('input', function() {
            // Remove error state while typing
            const errorMsg = document.querySelector('.error-message');
            if (errorMsg && this.value.length > 0) {
                errorMsg.style.opacity = '0.7';
            }
        });
    }

    // Add card animations
    const artistCards = document.querySelectorAll('.artist-card');
    artistCards.forEach((card, index) => {
        card.style.animation = `fadeIn 0.6s ease forwards`;
        card.style.animationDelay = `${index * 0.1}s`;
        card.style.opacity = '0';
    });

    // Add hover ripple effect
    artistCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            addRippleEffect(this);
        });
    });
}

function navigateToArtist(artistName) {
    // Get the artist link and click it
    const links = document.querySelectorAll('.artist-link');
    for (let link of links) {
        if (link.href.includes(encodeURIComponent(artistName))) {
            link.click();
            break;
        }
    }
}

function addRippleEffect(element) {
    const rect = element.getBoundingClientRect();
    const ripple = document.createElement('div');
    
    ripple.style.position = 'absolute';
    ripple.style.borderRadius = '50%';
    ripple.style.background = 'rgba(78, 205, 196, 0.5)';
    ripple.style.width = '20px';
    ripple.style.height = '20px';
    ripple.style.pointerEvents = 'none';
    ripple.style.animation = 'ripple-animation 0.6s ease-out';
    
    element.style.position = 'relative';
    element.style.overflow = 'hidden';
    element.appendChild(ripple);
    
    setTimeout(() => ripple.remove(), 600);
}

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

// Format large numbers for better readability
function formatNumber(num) {
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
}

// Search form enhancement - add loading state
const artistForm = document.getElementById('artistForm');
if (artistForm) {
    artistForm.addEventListener('submit', function() {
        const btn = this.querySelector('.search-btn');
        const originalText = btn.innerHTML;
        btn.innerHTML = '<span>🔍 Searching...</span>';
        btn.disabled = true;
        
        // Re-enable after response
        setTimeout(() => {
            btn.innerHTML = originalText;
            btn.disabled = false;
        }, 5000);
    });
}

// Add keyboard shortcuts
document.addEventListener('keydown', function(event) {
    // Ctrl/Cmd + K to focus search
    if ((event.ctrlKey || event.metaKey) && event.key === 'k') {
        event.preventDefault();
        const searchInput = document.getElementById('artistInput');
        if (searchInput) {
            searchInput.focus();
            searchInput.select();
        }
    }
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
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.artist-card').forEach(card => {
        observer.observe(card);
    });
}

// Add feedback on card click
document.querySelectorAll('.artist-card').forEach(card => {
    card.addEventListener('click', function(e) {
        if (e.target.closest('.artist-link')) {
            this.style.transform = 'scale(0.98)';
            setTimeout(() => {
                this.style.transform = '';
            }, 200);
        }
    });
});
