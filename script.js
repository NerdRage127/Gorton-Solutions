// Pricing data structure
const pricingData = {
    tiers: {
        1: { name: "Digital Menu / Simple App", price: 325 },
        2: { name: "Mini Interactive App/Game", price: 575 },
        3: { name: "Standard Interactive App/Game", price: 1000 },
        4: { name: "Premium Custom Build", price: 1500 }
    },
    addons: {
        logoPack: { name: "Logo Pack", price: 200 },
        hosting: { name: "Hosting & Maintenance", price: 250, monthly: true },
        extraHours: { name: "Extra Hours (5hrs @ $50/hr)", price: 250 }
    }
};

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializePricingCalculator();
    initializeDemoCalculator();
    initializeScratchGame();
    initializeSmoothScrolling();
});

// Pricing Calculator Functions
function initializePricingCalculator() {
    const tierSelect = document.getElementById('tier-select');
    const logoPackCheckbox = document.getElementById('logo-pack');
    const hostingCheckbox = document.getElementById('hosting');
    const extraHoursCheckbox = document.getElementById('extra-hours');

    // Add event listeners
    tierSelect.addEventListener('change', updatePricingCalculator);
    logoPackCheckbox.addEventListener('change', updatePricingCalculator);
    hostingCheckbox.addEventListener('change', updatePricingCalculator);
    extraHoursCheckbox.addEventListener('change', updatePricingCalculator);

    // Initial calculation
    updatePricingCalculator();
}

function updatePricingCalculator() {
    const tierSelect = document.getElementById('tier-select');
    const logoPackCheckbox = document.getElementById('logo-pack');
    const hostingCheckbox = document.getElementById('hosting');
    const extraHoursCheckbox = document.getElementById('extra-hours');

    const selectedTier = parseInt(tierSelect.value);
    let oneTimeCost = pricingData.tiers[selectedTier].price;
    let monthlyCost = 0;

    // Add addon costs
    if (logoPackCheckbox.checked) {
        oneTimeCost += pricingData.addons.logoPack.price;
    }

    if (hostingCheckbox.checked) {
        monthlyCost += pricingData.addons.hosting.price;
    }

    if (extraHoursCheckbox.checked) {
        oneTimeCost += pricingData.addons.extraHours.price;
    }

    // Update display
    document.getElementById('one-time-cost').textContent = `$${oneTimeCost.toLocaleString()}`;
    document.getElementById('monthly-cost').textContent = monthlyCost > 0 ? `$${monthlyCost.toLocaleString()}` : '$0';
}

// Demo Calculator Functions
function initializeDemoCalculator() {
    const sqftInput = document.getElementById('demo-sqft');
    
    if (sqftInput) {
        sqftInput.addEventListener('input', updateDemoCalculator);
    }
}

function updateDemoCalculator() {
    const sqftInput = document.getElementById('demo-sqft');
    const pricePerSqft = 2.50;
    const sqft = parseFloat(sqftInput.value) || 0;
    const total = sqft * pricePerSqft;

    document.getElementById('demo-total').textContent = total.toFixed(2);
}

// Scratch Game Demo
function initializeScratchGame() {
    const scratchBtn = document.querySelector('.scratch-btn');
    
    if (scratchBtn) {
        scratchBtn.addEventListener('click', function() {
            const scratchArea = document.querySelector('.scratch-area');
            const discounts = ['10% OFF', '15% OFF', '20% OFF', 'FREE LOGO', 'TRY AGAIN'];
            const randomDiscount = discounts[Math.floor(Math.random() * discounts.length)];
            
            scratchArea.textContent = randomDiscount;
            scratchArea.style.background = randomDiscount === 'TRY AGAIN' ? '#e74c3c' : '#27ae60';
            
            // Reset after 3 seconds
            setTimeout(() => {
                scratchArea.textContent = 'Scratch to reveal discount!';
                scratchArea.style.background = '#333';
            }, 3000);
        });
    }
}

// Smooth scrolling for navigation
function initializeSmoothScrolling() {
    const navLinks = document.querySelectorAll('.nav a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            
            if (targetSection) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetSection.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Scroll to contact function
function scrollToContact() {
    const contactSection = document.getElementById('contact');
    const headerHeight = document.querySelector('.header').offsetHeight;
    const targetPosition = contactSection.offsetTop - headerHeight - 20;
    
    window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
    });
}

// Template contact function
function contactWithTemplate(templateName) {
    scrollToContact();
    
    // Pre-fill the contact form
    setTimeout(() => {
        const messageTextarea = document.getElementById('message');
        const prefillMessage = `Hi! I'm interested in the ${templateName} template. Could you provide more details about pricing and customization options?`;
        
        if (messageTextarea) {
            messageTextarea.value = prefillMessage;
            messageTextarea.focus();
        }
    }, 1000);
}

// Contact form submission
function handleContactSubmit(event) {
    event.preventDefault();
    
    const form = event.target;
    const formData = new FormData(form);
    
    // Create mailto link with form data
    const name = formData.get('name');
    const email = formData.get('email');
    const message = formData.get('message');
    
    const subject = encodeURIComponent(`New Contact from ${name}`);
    const body = encodeURIComponent(`
From: ${name} (${email})

Message:
${message}

---
Sent from Gorton Solutions contact form
    `);
    
    const mailtoLink = `mailto:hello@gortonsolutions.com?subject=${subject}&body=${body}`;
    
    // Open default email client
    window.location.href = mailtoLink;
    
    // Show success message
    showContactSuccess();
}

function showContactSuccess() {
    const submitButton = document.querySelector('.submit-button');
    const originalText = submitButton.textContent;
    
    submitButton.textContent = 'Message Sent! Check your email client.';
    submitButton.style.background = '#27ae60';
    
    setTimeout(() => {
        submitButton.textContent = originalText;
        submitButton.style.background = '#2c5aa0';
        
        // Reset form
        document.querySelector('.contact-form').reset();
    }, 3000);
}

// Add some interactive animations
function addScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe service cards and other elements
    const animatedElements = document.querySelectorAll('.service-card, .demo-item, .pricing-card, .step, .template-card');
    
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

// Initialize animations after DOM load
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(addScrollAnimations, 100);
});

// Export functions for potential external use
window.GortonSolutions = {
    updatePricingCalculator,
    scrollToContact,
    contactWithTemplate,
    handleContactSubmit,
    pricingData
};