// Pricing data structure with new project types
const pricingData = {
    projectTypes: {
        "Phone-Friendly Menu": { name: "Phone-Friendly Menu", basePrice: 325, tier: 1 },
        "Quick Quote Tool": { name: "Quick Quote Tool", basePrice: 575, tier: 2 },
        "Play-for-Perks Game": { name: "Play-for-Perks Game", basePrice: 1000, tier: 3 },
        "Premium Custom": { name: "Premium Custom", basePrice: 1500, tier: 4 },
        "Print-Ready Logo Pack": { name: "Print-Ready Logo Pack", basePrice: 200, tier: 1 },
        "Other": { name: "Custom Project", basePrice: 575, tier: 2 }
    },
    addons: {
        logoPack: { name: "Print-Ready Logo Pack", price: 200 },
        hosting: { name: "Hosting & Maintenance", price: 250, monthly: true },
        extraHours: { name: "Extra Hours (5hrs @ $50/hr)", price: 250 }
    }
};

// Track selected project type
let selectedProjectType = null;

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializePricingCalculator();
    initializeDemoCalculator();
    initializeScratchGame();
    initializeSmoothScrolling();
    initializeProjectTypeSelection();
});

// Project Type Selection Functions
function initializeProjectTypeSelection() {
    // Initially disable contact section
    disableContactForm();
}

function selectProjectType(cardElement, projectType) {
    // Remove selection from all cards
    document.querySelectorAll('.project-type-card').forEach(card => {
        card.classList.remove('selected');
    });
    
    // Add selection to clicked card
    cardElement.classList.add('selected');
    selectedProjectType = projectType;
    
    // Handle "Other" selection
    if (projectType === 'Other') {
        const otherInput = cardElement.querySelector('.other-input-container');
        otherInput.style.display = 'block';
        const textarea = cardElement.querySelector('#other-description');
        textarea.focus();
        
        // Wait for user to enter description before enabling contact
        textarea.addEventListener('input', function() {
            if (this.value.trim().length > 10) {
                enableContactForm();
                updateContactFormMessage('Other', this.value.trim());
            } else {
                disableContactForm();
            }
        });
    } else {
        // Hide other input for non-Other selections
        document.querySelectorAll('.other-input-container').forEach(container => {
            container.style.display = 'none';
        });
        
        // Enable contact form and update message
        enableContactForm();
        updateContactFormMessage(projectType);
    }
    
    // Update pricing calculator if project type is available
    const projectTypeSelect = document.getElementById('project-type-select');
    if (projectTypeSelect && pricingData.projectTypes[projectType]) {
        projectTypeSelect.value = projectType;
        updatePricingCalculator();
    }
}

function enableContactForm() {
    const contactSection = document.getElementById('contact');
    const contactForm = document.querySelector('.contact-form');
    const disabledMessage = document.querySelector('.contact-disabled-message');
    
    // If we're not on a page with the contact form, return early
    if (!contactSection || !contactForm) {
        return;
    }
    
    const inputs = contactForm.querySelectorAll('input, textarea, button');
    
    contactSection.classList.remove('disabled');
    if (disabledMessage) {
        disabledMessage.style.display = 'none';
    }
    
    inputs.forEach(input => {
        input.disabled = false;
    });
}

function disableContactForm() {
    const contactSection = document.getElementById('contact');
    const contactForm = document.querySelector('.contact-form');
    const disabledMessage = document.querySelector('.contact-disabled-message');
    
    // If we're not on a page with the contact form, return early
    if (!contactSection || !contactForm) {
        return;
    }
    
    const inputs = contactForm.querySelectorAll('input, textarea, button');
    
    contactSection.classList.add('disabled');
    if (disabledMessage) {
        disabledMessage.style.display = 'block';
    }
    
    inputs.forEach(input => {
        input.disabled = true;
    });
}

function updateContactFormMessage(projectType, customDescription = null) {
    const messageTextarea = document.getElementById('message');
    let prefillMessage;
    
    if (projectType === 'Other' && customDescription) {
        prefillMessage = `Hi! I'm interested in a custom project: "${customDescription}". Could you provide more details about pricing and how we can work together?`;
    } else {
        prefillMessage = `Hi! I'm interested in a ${projectType} project. Could you provide more details about pricing and the development process?`;
    }
    
    messageTextarea.value = prefillMessage;
}

// Pricing Calculator Functions
function initializePricingCalculator() {
    const projectTypeSelect = document.getElementById('project-type-select');
    const logoPackCheckbox = document.getElementById('logo-pack');
    const hostingCheckbox = document.getElementById('hosting');
    const extraHoursCheckbox = document.getElementById('extra-hours');
    const complexitySlider = document.getElementById('complexity-slider');

    // Add event listeners
    if (projectTypeSelect) {
        projectTypeSelect.addEventListener('change', updatePricingCalculator);
    }
    if (logoPackCheckbox) {
        logoPackCheckbox.addEventListener('change', updatePricingCalculator);
    }
    if (hostingCheckbox) {
        hostingCheckbox.addEventListener('change', updatePricingCalculator);
    }
    if (extraHoursCheckbox) {
        extraHoursCheckbox.addEventListener('change', updatePricingCalculator);
    }
    if (complexitySlider) {
        complexitySlider.addEventListener('input', updatePricingCalculator);
    }

    // Initial calculation
    updatePricingCalculator();
}

function updatePricingCalculator() {
    const projectTypeSelect = document.getElementById('project-type-select');
    const logoPackCheckbox = document.getElementById('logo-pack');
    const hostingCheckbox = document.getElementById('hosting');
    const extraHoursCheckbox = document.getElementById('extra-hours');
    const complexitySlider = document.getElementById('complexity-slider');

    const oneTimeCostElement = document.getElementById('one-time-cost');
    const monthlyCostElement = document.getElementById('monthly-cost');

    // If we're not on a page with the pricing calculator, return early
    if (!projectTypeSelect || !oneTimeCostElement || !monthlyCostElement) {
        return;
    }

    if (!projectTypeSelect.value) {
        oneTimeCostElement.textContent = 'Select a project type';
        monthlyCostElement.textContent = '$0';
        return;
    }

    const selectedProjectType = projectTypeSelect.value;
    const projectData = pricingData.projectTypes[selectedProjectType];
    
    if (!projectData) {
        oneTimeCostElement.textContent = 'Custom quote required';
        monthlyCostElement.textContent = '$0';
        return;
    }

    // Calculate base cost with complexity modifier
    const complexityMultiplier = complexitySlider ? (complexitySlider.value / 100) : 1;
    let oneTimeCost = Math.round(projectData.basePrice * complexityMultiplier);
    let monthlyCost = 0;

    // Add addon costs (with null checks)
    if (logoPackCheckbox && logoPackCheckbox.checked && selectedProjectType !== 'Print-Ready Logo Pack') {
        oneTimeCost += pricingData.addons.logoPack.price;
    }

    if (hostingCheckbox && hostingCheckbox.checked) {
        monthlyCost += pricingData.addons.hosting.price;
    }

    if (extraHoursCheckbox && extraHoursCheckbox.checked) {
        oneTimeCost += pricingData.addons.extraHours.price;
    }

    // Update display
    oneTimeCostElement.textContent = `$${oneTimeCost.toLocaleString()}`;
    monthlyCostElement.textContent = monthlyCost > 0 ? `$${monthlyCost.toLocaleString()}` : '$0';
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

// Template contact function (legacy support)
function contactWithTemplate(templateName) {
    // Map old template names to new project types
    const templateMapping = {
        'Restaurant QR Menu': 'Phone-Friendly Menu',
        'Retail Calculator': 'Quick Quote Tool',
        'Service Estimator': 'Quick Quote Tool',
        'Loyalty Game': 'Play-for-Perks Game',
        'Event RSVP': 'Quick Quote Tool',
        'Contact Form Plus': 'Quick Quote Tool'
    };
    
    const projectType = templateMapping[templateName] || templateName;
    
    // Find and select the appropriate project type card
    const projectTypeCards = document.querySelectorAll('.project-type-card');
    projectTypeCards.forEach(card => {
        if (card.dataset.projectType === projectType) {
            selectProjectType(card, projectType);
        }
    });
    
    // Scroll to contact
    scrollToContact();
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
    selectProjectType,
    pricingData,
    selectedProjectType
};