/**
 * NovaTech - Main JavaScript
 */

document.addEventListener('DOMContentLoaded', function() {
    // Variables
    const header = document.getElementById('header');
    const menuToggle = document.querySelector('.menu-toggle');
    const navContainer = document.querySelector('.nav-container');
    const navLinks = document.querySelectorAll('.nav-menu a');
    const backToTopBtn = document.getElementById('back-to-top');
    const testimonialTrack = document.querySelector('.testimonial-track');
    const testimonialCards = document.querySelectorAll('.testimonial-card');
    const prevBtn = document.querySelector('.testimonial-prev');
    const nextBtn = document.querySelector('.testimonial-next');
    const dotsContainer = document.querySelector('.testimonial-dots');
    const contactForm = document.getElementById('contact-form');
    const statNumbers = document.querySelectorAll('.stat-number');
    const fadeElements = document.querySelectorAll('.fade-in');
    
    let currentSlide = 0;
    let slideWidth = 0;
    let slideInterval;
    let statsAnimated = false;
    
    // Initialize the page
    init();
    
    /**
     * Initialize all scripts
     */
    function init() {
        // Initialize navigation
        initNavigation();
        
        // Initialize scroll events
        initScrollEvents();
        
        // Initialize testimonial slider
        initTestimonialSlider();
        
        // Initialize form validation
        initContactForm();
        
        // Initialize animations
        initAnimations();
    }
    
    /**
     * Initialize navigation functionality
     */
    function initNavigation() {
        // Toggle mobile menu
        menuToggle.addEventListener('click', function() {
            const isExpanded = this.getAttribute('aria-expanded') === 'true';
            this.setAttribute('aria-expanded', !isExpanded);
            navContainer.classList.toggle('active');
            document.body.classList.toggle('menu-open');
        });
        
        // Close menu when clicking on a nav link
        navLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                
                // Get the target section
                const targetId = this.getAttribute('href');
                const targetSection = document.querySelector(targetId);
                
                if (targetSection) {
                    // Smooth scroll to the section
                    window.scrollTo({
                        top: targetSection.offsetTop - 80,
                        behavior: 'smooth'
                    });
                    
                    // Close the mobile menu if open
                    if (navContainer.classList.contains('active')) {
                        menuToggle.setAttribute('aria-expanded', 'false');
                        navContainer.classList.remove('active');
                        document.body.classList.remove('menu-open');
                    }
                    
                    // Update active link
                    navLinks.forEach(link => link.classList.remove('active'));
                    this.classList.add('active');
                }
            });
        });
    }
    
    /**
     * Initialize scroll events
     */
    function initScrollEvents() {
        // Change header style on scroll
        window.addEventListener('scroll', function() {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
            
            // Show/hide back to top button
            if (window.scrollY > 300) {
                backToTopBtn.classList.add('active');
            } else {
                backToTopBtn.classList.remove('active');
            }
            
            // Check if stats are in view
            if (!statsAnimated && isInViewport(document.querySelector('.stats-container'))) {
                animateStats();
                statsAnimated = true;
            }
            
            // Animate elements when they come into view
            fadeElements.forEach(element => {
                if (isInViewport(element)) {
                    element.classList.add('visible');
                }
            });
            
            // Update active nav link based on scroll position
            updateActiveNavLink();
        });
        
        // Back to top button click event
        backToTopBtn.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
    
    /**
     * Initialize testimonial slider
     */
    function initTestimonialSlider() {
        if (!testimonialTrack) return;
        
        // Calculate slide width
        slideWidth = testimonialCards[0].offsetWidth;
        
        // Create dots
        testimonialCards.forEach((_, index) => {
            const dot = document.createElement('span');
            dot.classList.add('dot');
            if (index === 0) dot.classList.add('active');
            dot.addEventListener('click', () => goToSlide(index));
            dotsContainer.appendChild(dot);
        });
        
        // Initialize slider controls
        prevBtn.addEventListener('click', prevSlide);
        nextBtn.addEventListener('click', nextSlide);
        
        // Start auto sliding
        startSlideInterval();
        
        // Pause auto sliding on hover
        testimonialTrack.addEventListener('mouseenter', stopSlideInterval);
        testimonialTrack.addEventListener('mouseleave', startSlideInterval);
        
        // Update slider on window resize
        window.addEventListener('resize', updateSliderSize);
    }
    
    /**
     * Go to previous slide
     */
    function prevSlide() {
        goToSlide(currentSlide - 1);
    }
    
    /**
     * Go to next slide
     */
    function nextSlide() {
        goToSlide(currentSlide + 1);
    }
    
    /**
     * Go to specific slide
     */
    function goToSlide(index) {
        // Reset index if it's out of bounds
        if (index < 0) {
            index = testimonialCards.length - 1;
        } else if (index >= testimonialCards.length) {
            index = 0;
        }
        
        // Update current slide
        currentSlide = index;
        
        // Move slider
        testimonialTrack.style.transform = `translateX(-${currentSlide * 100}%)`;
        
        // Update dots
        const dots = document.querySelectorAll('.dot');
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === currentSlide);
        });
    }
    
    /**
     * Start auto sliding
     */
    function startSlideInterval() {
        slideInterval = setInterval(nextSlide, 5000);
    }
    
    /**
     * Stop auto sliding
     */
    function stopSlideInterval() {
        clearInterval(slideInterval);
    }
    
    /**
     * Update slider size on window resize
     */
    function updateSliderSize() {
        slideWidth = testimonialCards[0].offsetWidth;
        goToSlide(currentSlide);
    }
    
    /**
     * Initialize contact form validation
     */
    function initContactForm() {
        if (!contactForm) return;
        
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Simple validation
            let isValid = true;
            const requiredFields = contactForm.querySelectorAll('[required]');
            
            requiredFields.forEach(field => {
                if (!field.value.trim()) {
                    isValid = false;
                    field.classList.add('error');
                } else {
                    field.classList.remove('error');
                }
            });
            
            // Email validation
            const emailField = contactForm.querySelector('#email');
            if (emailField && !validateEmail(emailField.value)) {
                isValid = false;
                emailField.classList.add('error');
            }
            
            if (isValid) {
                // Success message (in a real app, you would submit the form data)
                const formData = new FormData(contactForm);
                const formValues = Object.fromEntries(formData.entries());
                
                // Show success message
                contactForm.innerHTML = `
                    <div class="success-message">
                        <i class="fas fa-check-circle"></i>
                        <h3>Message Sent Successfully!</h3>
                        <p>Thank you for contacting us, ${formValues.name}. We'll get back to you shortly.</p>
                    </div>
                `;
            }
        });
        
        // Remove error class on input
        const formInputs = contactForm.querySelectorAll('input, textarea');
        formInputs.forEach(input => {
            input.addEventListener('input', function() {
                this.classList.remove('error');
            });
        });
    }
    
    /**
     * Initialize animations
     */
    function initAnimations() {
        // Initial check for elements in viewport
        fadeElements.forEach(element => {
            if (isInViewport(element)) {
                element.classList.add('visible');
            }
        });
    }
    
    /**
     * Animate statistics counters
     */
    function animateStats() {
        statNumbers.forEach(stat => {
            const target = parseInt(stat.getAttribute('data-count'));
            const duration = 2000; // 2 seconds
            const step = target / (duration / 16); // 60fps
            let current = 0;
            
            const updateCounter = () => {
                current += step;
                if (current < target) {
                    stat.textContent = Math.floor(current);
                    requestAnimationFrame(updateCounter);
                } else {
                    stat.textContent = target;
                }
            };
            
            updateCounter();
        });
    }
    
    /**
     * Update active navigation link based on scroll position
     */
    function updateActiveNavLink() {
        const sections = document.querySelectorAll('section');
        let currentSection = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.offsetHeight;
            
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                currentSection = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSection}`) {
                link.classList.add('active');
            }
        });
    }
    
    /**
     * Check if element is in viewport
     */
    function isInViewport(element) {
        if (!element) return false;
        
        const rect = element.getBoundingClientRect();
        return (
            rect.top <= (window.innerHeight || document.documentElement.clientHeight) * 0.8 &&
            rect.bottom >= 0
        );
    }
    
    /**
     * Validate email format
     */
    function validateEmail(email) {
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }
});