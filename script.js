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
    initializeSnakeGame();
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
    // Old simple calculator (if still exists)
    const sqftInput = document.getElementById('demo-sqft');
    if (sqftInput) {
        sqftInput.addEventListener('input', updateDemoCalculator);
    }
    
    // New pressure washing calculator
    const homeSqftInput = document.getElementById('home-sqft');
    const drivewayCheckbox = document.getElementById('driveway-cleaning');
    const garageCheckbox = document.getElementById('garage-cleaning');
    const premiumCheckbox = document.getElementById('premium-cleaners');
    
    if (homeSqftInput) {
        homeSqftInput.addEventListener('input', updatePressureWashingQuote);
    }
    if (drivewayCheckbox) {
        drivewayCheckbox.addEventListener('change', updatePressureWashingQuote);
    }
    if (garageCheckbox) {
        garageCheckbox.addEventListener('change', updatePressureWashingQuote);
    }
    if (premiumCheckbox) {
        premiumCheckbox.addEventListener('change', updatePressureWashingQuote);
    }
}

function updateDemoCalculator() {
    const sqftInput = document.getElementById('demo-sqft');
    const pricePerSqft = 2.50;
    const sqft = parseFloat(sqftInput.value) || 0;
    const total = sqft * pricePerSqft;

    const totalElement = document.getElementById('demo-total');
    if (totalElement) {
        totalElement.textContent = total.toFixed(2);
    }
}

function updatePressureWashingQuote() {
    const homeSqftInput = document.getElementById('home-sqft');
    const drivewayCheckbox = document.getElementById('driveway-cleaning');
    const garageCheckbox = document.getElementById('garage-cleaning');
    const premiumCheckbox = document.getElementById('premium-cleaners');
    
    if (!homeSqftInput) return;
    
    const sqft = parseFloat(homeSqftInput.value) || 0;
    const baseRate = 0.15; // $0.15 per sq ft
    let baseCost = sqft * baseRate;
    
    let drivewayAdd = 0;
    let garageAdd = 0;
    let premiumAdd = 0;
    
    // Handle add-ons
    if (drivewayCheckbox && drivewayCheckbox.checked) {
        drivewayAdd = 150;
        document.getElementById('driveway-line').style.display = 'flex';
    } else {
        document.getElementById('driveway-line').style.display = 'none';
    }
    
    if (garageCheckbox && garageCheckbox.checked) {
        garageAdd = 100;
        document.getElementById('garage-line').style.display = 'flex';
    } else {
        document.getElementById('garage-line').style.display = 'none';
    }
    
    let subtotal = baseCost + drivewayAdd + garageAdd;
    
    if (premiumCheckbox && premiumCheckbox.checked) {
        premiumAdd = subtotal * 0.25;
        document.getElementById('premium-line').style.display = 'flex';
        document.getElementById('premium-cost').textContent = '$' + premiumAdd.toFixed(2);
    } else {
        document.getElementById('premium-line').style.display = 'none';
    }
    
    const total = subtotal + premiumAdd;
    
    // Update display
    document.getElementById('base-cost').textContent = '$' + baseCost.toFixed(2);
    document.getElementById('total-quote').textContent = '$' + total.toFixed(2);
}

// Scratch Game Demo
function initializeScratchGame() {
    const scratchBtn = document.querySelector('.scratch-btn');
    const scratchArea = document.querySelector('.scratch-area');
    
    if (scratchBtn && scratchArea) {
        // Check if already scratched this session
        const hasScratched = localStorage.getItem('scratched-this-session');
        
        if (hasScratched) {
            scratchArea.textContent = "You've already revealed your perk this time!";
            scratchArea.style.background = '#6c757d';
            scratchBtn.disabled = true;
            scratchBtn.textContent = 'Already Used';
            scratchBtn.style.opacity = '0.6';
            scratchBtn.style.cursor = 'not-allowed';
        } else {
            scratchBtn.addEventListener('click', function() {
                const discounts = ['10% OFF', '15% OFF', '20% OFF', 'FREE LOGO', 'TRY AGAIN'];
                const randomDiscount = discounts[Math.floor(Math.random() * discounts.length)];
                
                scratchArea.textContent = randomDiscount;
                scratchArea.style.background = randomDiscount === 'TRY AGAIN' ? '#e74c3c' : '#27ae60';
                
                // Mark as used for this session
                localStorage.setItem('scratched-this-session', 'true');
                
                // Disable button after use
                scratchBtn.disabled = true;
                scratchBtn.textContent = 'Used';
                scratchBtn.style.opacity = '0.6';
                scratchBtn.style.cursor = 'not-allowed';
            });
        }
    }
}

// Snake Game Implementation
function initializeSnakeGame() {
    const canvas = document.getElementById('snake-canvas');
    const startBtn = document.getElementById('start-snake-btn');
    const resetBtn = document.getElementById('reset-snake-btn');
    const appleCountEl = document.getElementById('apple-count');
    const couponArea = document.getElementById('coupon-area');
    
    if (!canvas || !startBtn || !resetBtn) return;
    
    const ctx = canvas.getContext('2d');
    const gridSize = 20;
    const tileCount = canvas.width / gridSize;
    
    let snake = [{x: 10, y: 10}];
    let food = {};
    let dx = 0;
    let dy = 0;
    let appleCount = 0;
    let gameRunning = false;
    let gameLoop = null;
    
    function randomFood() {
        food = {
            x: Math.floor(Math.random() * tileCount),
            y: Math.floor(Math.random() * (canvas.height / gridSize))
        };
        
        // Make sure food doesn't spawn on snake
        for (let segment of snake) {
            if (segment.x === food.x && segment.y === food.y) {
                randomFood();
                return;
            }
        }
    }
    
    function drawGame() {
        // Clear canvas
        ctx.fillStyle = '#E8F5E8';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Draw snake
        ctx.fillStyle = '#4CAF50';
        for (let segment of snake) {
            ctx.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize - 2, gridSize - 2);
        }
        
        // Draw food (apple)
        ctx.fillStyle = '#FF0000';
        ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize - 2, gridSize - 2);
        
        // Draw apple emoji on food
        ctx.font = `${gridSize - 4}px Arial`;
        ctx.fillText('🍎', food.x * gridSize + 2, food.y * gridSize + gridSize - 4);
    }
    
    function updateGame() {
        if (!gameRunning) return;
        
        // Don't move if no direction is set
        if (dx === 0 && dy === 0) return;
        
        const head = {x: snake[0].x + dx, y: snake[0].y + dy};
        
        // Check wall collision
        if (head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= canvas.height / gridSize) {
            gameOver();
            return;
        }
        
        // Check self collision
        for (let segment of snake) {
            if (head.x === segment.x && head.y === segment.y) {
                gameOver();
                return;
            }
        }
        
        snake.unshift(head);
        
        // Check food collision
        if (head.x === food.x && head.y === food.y) {
            appleCount++;
            appleCountEl.textContent = appleCount;
            randomFood();
            
            // Check if goal reached
            if (appleCount >= 15) {
                showCoupon();
            }
        } else {
            snake.pop();
        }
        
        drawGame();
    }
    
    function gameOver() {
        gameRunning = false;
        clearInterval(gameLoop);
        startBtn.style.display = 'inline-block';
        resetBtn.style.display = 'inline-block';
        startBtn.textContent = 'Game Over - Restart';
    }
    
    function showCoupon() {
        couponArea.style.display = 'block';
        gameRunning = false;
        clearInterval(gameLoop);
        startBtn.style.display = 'none';
        resetBtn.style.display = 'inline-block';
        resetBtn.textContent = 'Play Again';
    }
    
    function startGame() {
        if (gameRunning) return;
        
        snake = [{x: 10, y: 10}];
        dx = 0;
        dy = 0;
        gameRunning = true;
        randomFood();
        drawGame();
        
        startBtn.style.display = 'none';
        resetBtn.style.display = 'inline-block';
        
        gameLoop = setInterval(updateGame, 200);
    }
    
    function resetGame() {
        gameRunning = false;
        clearInterval(gameLoop);
        snake = [{x: 10, y: 10}];
        dx = 0;
        dy = 0;
        appleCount = 0;
        appleCountEl.textContent = '0';
        couponArea.style.display = 'none';
        startBtn.style.display = 'inline-block';
        startBtn.textContent = 'Start Game';
        resetBtn.style.display = 'none';
        
        // Clear canvas
        ctx.fillStyle = '#E8F5E8';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Draw initial state
        ctx.fillStyle = '#4CAF50';
        ctx.fillRect(snake[0].x * gridSize, snake[0].y * gridSize, gridSize - 2, gridSize - 2);
    }
    
    // Event listeners
    startBtn.addEventListener('click', startGame);
    resetBtn.addEventListener('click', resetGame);
    
    // Keyboard controls
    document.addEventListener('keydown', function(e) {
        if (!gameRunning) return;
        
        switch(e.code) {
            case 'ArrowUp':
                if (dy === 0) { dx = 0; dy = -1; }
                break;
            case 'ArrowDown':
                if (dy === 0) { dx = 0; dy = 1; }
                break;
            case 'ArrowLeft':
                if (dx === 0) { dx = -1; dy = 0; }
                break;
            case 'ArrowRight':
                if (dx === 0) { dx = 1; dy = 0; }
                break;
        }
    });
    
    // Initialize canvas
    resetGame();
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