// Main JavaScript for Sriox Website

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functionality
    initNavigation();
    initAnimations();
    initCarousel();
    initCertificateVerification();
    initApplicationForm();
    initScrollAnimations();
});

// Navigation functionality
function initNavigation() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            hamburger.classList.toggle('active');
        });

        // Close menu when clicking on a link
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                navMenu.classList.remove('active');
                hamburger.classList.remove('active');
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', function(event) {
            if (!hamburger.contains(event.target) && !navMenu.contains(event.target)) {
                navMenu.classList.remove('active');
                hamburger.classList.remove('active');
            }
        });
    }

    // Navbar scroll effect
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 100) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });
    }
}

// Animation functionality
function initAnimations() {
    // Add entrance animations to elements
    const animatedElements = document.querySelectorAll('.animate-fade-up, .animate-slide-left, .animate-slide-right');
    
    animatedElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
    });

    // Trigger animations on scroll
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
                element.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    animatedElements.forEach(element => {
        observer.observe(element);
    });
}

// Carousel functionality for testimonials
let currentSlide = 0;
const testimonials = [
    {
        text: "Sriox gave me my first real project experience. Working on an actual client website taught me more than any tutorial ever could. I proudly added my certificate to LinkedIn and got multiple interview calls!",
        author: "Riya Sharma",
        role: "Computer Science Student",
        rating: 5
    },
    {
        text: "Best internship for beginners. Affordable, simple, and practical. I learned React by building a real e-commerce site. The mentorship was excellent!",
        author: "Arjun Mehta",
        role: "Web Development Intern",
        rating: 5
    },
    {
        text: "I used the certificate in my resume and it helped me crack my first interview! The real project experience gave me confidence to discuss my work.",
        author: "Sanya Verma",
        role: "UI/UX Design Intern",
        rating: 5
    },
    {
        text: "Working on real social media campaigns taught me more than my college courses. The certificate verification system impressed my employer.",
        author: "Karan Singh",
        role: "Digital Marketing Intern",
        rating: 5
    }
];

function initCarousel() {
    const carouselContainer = document.querySelector('.testimonial-carousel');
    if (!carouselContainer) return;

    updateCarousel();
    
    // Auto-advance carousel
    setInterval(() => {
        nextSlide();
    }, 5000);
}

function updateCarousel() {
    const slide = document.querySelector('.testimonial-slide');
    if (!slide) return;

    const testimonial = testimonials[currentSlide];
    
    slide.innerHTML = `
        <div class="testimonial-content">
            <div class="quote-icon">
                <i class="fas fa-quote-left"></i>
            </div>
            <p class="testimonial-text">"${testimonial.text}"</p>
            <div class="testimonial-author">
                <div class="author-image">
                    <i class="fas fa-user-circle"></i>
                </div>
                <div class="author-info">
                    <h4>${testimonial.author}</h4>
                    <p>${testimonial.role}</p>
                    <div class="rating">
                        ${'<i class="fas fa-star"></i>'.repeat(testimonial.rating)}
                    </div>
                </div>
            </div>
        </div>
    `;
}

function nextSlide() {
    currentSlide = (currentSlide + 1) % testimonials.length;
    updateCarousel();
}

function previousSlide() {
    currentSlide = (currentSlide - 1 + testimonials.length) % testimonials.length;
    updateCarousel();
}

// Certificate verification functionality
function initCertificateVerification() {
    const verifyBtn = document.querySelector('.verify-btn');
    const certificateInput = document.getElementById('certificateId');
    const resultDiv = document.getElementById('verificationResult');

    if (verifyBtn && certificateInput && resultDiv) {
        verifyBtn.addEventListener('click', function() {
            const certificateId = certificateInput.value.trim();
            
            if (!certificateId) {
                showVerificationResult('Please enter a certificate ID', 'error');
                return;
            }

            // Simulate verification process
            verifyBtn.textContent = 'Verifying...';
            verifyBtn.disabled = true;

            setTimeout(() => {
                // Mock verification - in real app, this would be an API call
                if (certificateId.toLowerCase().includes('srx')) {
                    showVerificationResult(`
                        <div class="verification-success">
                            <i class="fas fa-check-circle"></i>
                            <h4>Certificate Verified!</h4>
                            <p><strong>ID:</strong> ${certificateId}</p>
                            <p><strong>Issued to:</strong> John Doe</p>
                            <p><strong>Program:</strong> Web Development Internship</p>
                            <p><strong>Date:</strong> January 15, 2025</p>
                        </div>
                    `, 'success');
                } else {
                    showVerificationResult('Certificate not found. Please check the ID and try again.', 'error');
                }

                verifyBtn.textContent = 'Verify Certificate';
                verifyBtn.disabled = false;
            }, 2000);
        });

        // Allow Enter key to trigger verification
        certificateInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                verifyBtn.click();
            }
        });
    }
}

function showVerificationResult(message, type) {
    const resultDiv = document.getElementById('verificationResult');
    if (!resultDiv) return;

    resultDiv.innerHTML = message;
    resultDiv.className = `verification-result ${type}`;
    resultDiv.style.display = 'block';
}

// Application form functionality
function initApplicationForm() {
    const form = document.getElementById('internshipForm');
    if (!form) return;

    // Domain selection functionality
    const domainOptionElements = document.querySelectorAll('.domain-option');
    const domainRadios = document.querySelectorAll('input[name="domain"]');
    
    domainOptionElements.forEach(option => {
        option.addEventListener('click', function() {
            const radio = this.querySelector('input[type="radio"]');
            if (radio) {
                radio.checked = true;
                
                // Update visual selection
                domainOptionElements.forEach(opt => opt.classList.remove('selected'));
                this.classList.add('selected');
            }
        });
    });
    
    // Update visual selection when radio changes
    domainRadios.forEach(radio => {
        radio.addEventListener('change', function() {
            domainOptionElements.forEach(opt => opt.classList.remove('selected'));
            const parentOption = this.closest('.domain-option');
            if (parentOption) {
                parentOption.classList.add('selected');
            }
        });
    });

    // Form validation
    const requiredFields = form.querySelectorAll('[required]');
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Validate all required fields
        let isValid = true;
        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                isValid = false;
                showFieldError(field, 'This field is required');
            } else {
                clearFieldError(field);
            }
        });

        // Validate email format
        const emailField = document.getElementById('email');
        if (emailField && emailField.value && !isValidEmail(emailField.value)) {
            isValid = false;
            showFieldError(emailField, 'Please enter a valid email address');
        }

        // Validate phone format
        const phoneField = document.getElementById('phone');
        if (phoneField && phoneField.value && !isValidPhone(phoneField.value)) {
            isValid = false;
            showFieldError(phoneField, 'Please enter a valid phone number');
        }

        if (isValid) {
            processApplication();
        } else {
            // Scroll to first error
            const firstError = form.querySelector('.form-error');
            if (firstError) {
                firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }
    });

    // Real-time validation
    requiredFields.forEach(field => {
        field.addEventListener('blur', function() {
            if (this.value.trim()) {
                clearFieldError(this);
            }
        });
    });

    // Domain selection highlighting
    const domainOptions = document.querySelectorAll('input[name="domain"]');
    domainOptions.forEach(option => {
        option.addEventListener('change', function() {
            // Remove selected class from all options
            document.querySelectorAll('.domain-option').forEach(opt => {
                opt.classList.remove('selected');
            });
            // Add selected class to chosen option
            this.closest('.domain-option').classList.add('selected');
        });
    });
}

function showFieldError(field, message) {
    clearFieldError(field);
    
    const errorElement = document.createElement('span');
    errorElement.className = 'form-error';
    errorElement.textContent = message;
    
    field.parentNode.appendChild(errorElement);
    field.classList.add('error');
}

function clearFieldError(field) {
    const existingError = field.parentNode.querySelector('.form-error');
    if (existingError) {
        existingError.remove();
    }
    field.classList.remove('error');
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function isValidPhone(phone) {
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''));
}

function processApplication() {
    const submitBtn = document.querySelector('.btn-submit');
    const btnText = submitBtn.querySelector('.btn-text');
    
    // Show loading state
    btnText.textContent = 'Processing...';
    submitBtn.disabled = true;
    submitBtn.classList.add('loading');

    // Simulate form processing
    setTimeout(() => {
        // In a real application, you would send the form data to your backend
        showSuccessMessage();
        
        // Reset button
        btnText.textContent = 'Apply Now & Pay ₹99';
        submitBtn.disabled = false;
        submitBtn.classList.remove('loading');
    }, 3000);
}

function showSuccessMessage() {
    // Create success overlay
    const overlay = document.createElement('div');
    overlay.className = 'success-overlay';
    overlay.innerHTML = `
        <div class="success-modal">
            <div class="success-icon">
                <i class="fas fa-check-circle"></i>
            </div>
            <h3>Application Submitted Successfully!</h3>
            <p>Thank you for applying to the Sriox Internship Program. You will be redirected to the payment page in a few seconds.</p>
            <div class="success-actions">
                <button class="btn btn-primary" onclick="closeSuccessModal()">Continue to Payment</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(overlay);
    
    // Auto-redirect after 5 seconds
    setTimeout(() => {
        closeSuccessModal();
        // In a real application, redirect to payment gateway
        alert('Redirecting to secure payment gateway...');
    }, 5000);
}

function closeSuccessModal() {
    const overlay = document.querySelector('.success-overlay');
    if (overlay) {
        overlay.remove();
    }
}

// Scroll animations
function initScrollAnimations() {
    // Parallax effect for hero sections
    const heroSections = document.querySelectorAll('.hero, .about-hero, .services-hero, .how-hero, .certificate-hero, .testimonials-hero, .apply-hero');
    
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        
        heroSections.forEach(hero => {
            if (hero) {
                const rate = scrolled * -0.5;
                hero.style.transform = `translateY(${rate}px)`;
            }
        });
    });

    // Counter animation for stats
    const counters = document.querySelectorAll('.stat-item h3, .stat-showcase h3');
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                counterObserver.unobserve(entry.target);
            }
        });
    });

    counters.forEach(counter => {
        counterObserver.observe(counter);
    });
}

function animateCounter(element) {
    const target = parseInt(element.textContent.replace(/[^\d]/g, ''));
    const prefix = element.textContent.replace(/[\d]/g, '');
    let current = 0;
    const increment = target / 50;
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        
        if (prefix.includes('%')) {
            element.textContent = Math.floor(current) + '%';
        } else if (prefix.includes('₹')) {
            element.textContent = '₹' + Math.floor(current);
        } else if (target > 100) {
            element.textContent = Math.floor(current) + '+';
        } else {
            element.textContent = Math.floor(current);
        }
    }, 30);
}

// Smooth scrolling for anchor links
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

// Video testimonial modal functionality
function openVideoModal(videoSrc) {
    const modal = document.createElement('div');
    modal.className = 'video-modal';
    modal.innerHTML = `
        <div class="video-modal-content">
            <span class="video-close" onclick="closeVideoModal()">&times;</span>
            <video controls autoplay>
                <source src="${videoSrc}" type="video/mp4">
                Your browser does not support the video tag.
            </video>
        </div>
    `;
    
    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';
}

function closeVideoModal() {
    const modal = document.querySelector('.video-modal');
    if (modal) {
        modal.remove();
        document.body.style.overflow = 'auto';
    }
}

// Close modal when clicking outside
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('video-modal')) {
        closeVideoModal();
    }
});

// Copy to clipboard functionality
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(function() {
        showToast('Copied to clipboard!');
    }).catch(function() {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        showToast('Copied to clipboard!');
    });
}

// Toast notification
function showToast(message, duration = 3000) {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.classList.add('show');
    }, 100);
    
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        }, 300);
    }, duration);
}

// Lazy loading for images
function initLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => {
        imageObserver.observe(img);
    });
}

// Initialize lazy loading
initLazyLoading();

// Error handling for images
document.addEventListener('error', function(e) {
    if (e.target.tagName === 'IMG') {
        e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDMwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjMUExQTFBIi8+Cjx0ZXh0IHg9IjE1MCIgeT0iMTAwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjQTBBMEEwIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTQiPkltYWdlIG5vdCBmb3VuZDwvdGV4dD4KPC9zdmc+';
    }
}, true);

// Performance monitoring
window.addEventListener('load', function() {
    // Log page load time
    const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
    console.log('Page load time:', loadTime + 'ms');
    
    // Optional: Send analytics data
    // analytics.track('page_loaded', { load_time: loadTime });
});