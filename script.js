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
    initializeGameSystem();
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

// Demo Games System
function initializeGameSystem() {
    // Game system will be initialized for the new games
    console.log('Demo games system initialized');
}

// Game Functions
function openGame(gameType) {
    const overlay = document.getElementById('game-overlay');
    const games = document.querySelectorAll('.fullscreen-game');
    
    // Hide all games
    games.forEach(game => game.style.display = 'none');
    
    // Show the selected game
    const selectedGame = document.getElementById(gameType + '-game');
    if (selectedGame) {
        selectedGame.style.display = 'block';
        overlay.style.display = 'flex';
        
        // Initialize the specific game
        switch(gameType) {
            case 'orchard-worm':
                initializeOrchardWormGame();
                break;
            case 'coupon-slots':
                initializeCouponSlotsGame();
                break;
        }
    }
}

function closeGame() {
    const overlay = document.getElementById('game-overlay');
    overlay.style.display = 'none';
    
    // Stop any running games
    clearAllGameIntervals();
}

let gameIntervals = [];

function clearAllGameIntervals() {
    gameIntervals.forEach(interval => clearInterval(interval));
    gameIntervals = [];
}

// Orchard Worm Game (Snake-style)
function initializeOrchardWormGame() {
    const canvas = document.getElementById('worm-canvas');
    const startBtn = document.getElementById('start-worm-btn');
    const resetBtn = document.getElementById('reset-worm-btn');
    const scoreEl = document.getElementById('worm-score');
    
    if (!canvas || !startBtn || !resetBtn) return;
    
    const ctx = canvas.getContext('2d');
    const gridSize = 20;
    const tileCount = canvas.width / gridSize;
    
    let worm = [{x: 10, y: 10}];
    let fruit = {};
    let dx = 0;
    let dy = 0;
    let score = 0;
    let gameRunning = false;
    let gameLoop = null;
    
    function randomFruit() {
        fruit = {
            x: Math.floor(Math.random() * tileCount),
            y: Math.floor(Math.random() * (canvas.height / gridSize))
        };
        
        // Make sure fruit doesn't spawn on worm
        for (let segment of worm) {
            if (segment.x === fruit.x && segment.y === fruit.y) {
                randomFruit();
                return;
            }
        }
    }
    
    function drawGame() {
        // Clear canvas with orchard background
        ctx.fillStyle = '#E8F5E8';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Draw worm
        ctx.fillStyle = '#8BC34A';
        for (let segment of worm) {
            ctx.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize - 2, gridSize - 2);
        }
        
        // Draw fruit
        ctx.fillStyle = '#FF5722';
        ctx.fillRect(fruit.x * gridSize, fruit.y * gridSize, gridSize - 2, gridSize - 2);
        
        // Draw fruit emoji
        ctx.font = `${gridSize - 4}px Arial`;
        ctx.fillText('🍎', fruit.x * gridSize + 2, fruit.y * gridSize + gridSize - 4);
    }
    
    function updateGame() {
        if (!gameRunning) return;
        
        // Don't move if no direction is set
        if (dx === 0 && dy === 0) return;
        
        const head = {x: worm[0].x + dx, y: worm[0].y + dy};
        
        // Check wall collision
        if (head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= (canvas.height / gridSize)) {
            gameOver();
            return;
        }
        
        // Check self collision
        for (let segment of worm) {
            if (head.x === segment.x && head.y === segment.y) {
                gameOver();
                return;
            }
        }
        
        worm.unshift(head);
        
        // Check fruit collision
        if (head.x === fruit.x && head.y === fruit.y) {
            score += 10;
            scoreEl.textContent = score;
            
            // Check if player reached 10 apples (100 points)
            if (score >= 100 && score < 110) {
                // Trigger coupon modal
                setTimeout(() => showCoreChaser10PercentCoupon(), 500);
            }
            
            randomFruit();
        } else {
            worm.pop();
        }
        
        drawGame();
    }
    
    function gameOver() {
        gameRunning = false;
        clearInterval(gameLoop);
        startBtn.style.display = 'inline-block';
        resetBtn.style.display = 'inline-block';
        startBtn.textContent = 'Game Over - Restart';
        alert(`Game Over! Final Score: ${score}`);
    }
    
    function startGame() {
        if (gameRunning) return;
        
        worm = [{x: 10, y: 10}];
        dx = 0;
        dy = 0;
        gameRunning = true;
        randomFruit();
        drawGame();
        
        startBtn.style.display = 'none';
        resetBtn.style.display = 'inline-block';
        
        gameLoop = setInterval(updateGame, 200);
        gameIntervals.push(gameLoop);
    }
    
    function resetGame() {
        gameRunning = false;
        clearInterval(gameLoop);
        worm = [{x: 10, y: 10}];
        dx = 0;
        dy = 0;
        score = 0;
        scoreEl.textContent = '0';
        startBtn.style.display = 'inline-block';
        startBtn.textContent = 'Start Game';
        resetBtn.style.display = 'none';
        
        // Clear canvas
        ctx.fillStyle = '#E8F5E8';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Draw initial worm
        ctx.fillStyle = '#8BC34A';
        ctx.fillRect(worm[0].x * gridSize, worm[0].y * gridSize, gridSize - 2, gridSize - 2);
    }
    
    // Event listeners
    startBtn.addEventListener('click', startGame);
    resetBtn.addEventListener('click', resetGame);
    
    // Keyboard controls
    document.addEventListener('keydown', function(e) {
        if (!gameRunning) return;
        
        switch(e.key) {
            case 'ArrowUp':
                if (dy !== 1) { dx = 0; dy = -1; }
                e.preventDefault();
                break;
            case 'ArrowDown':
                if (dy !== -1) { dx = 0; dy = 1; }
                e.preventDefault();
                break;
            case 'ArrowLeft':
                if (dx !== 1) { dx = -1; dy = 0; }
                e.preventDefault();
                break;
            case 'ArrowRight':
                if (dx !== -1) { dx = 1; dy = 0; }
                e.preventDefault();
                break;
        }
    });
    
    // Initialize canvas
    resetGame();
}

function showCoreChaser10PercentCoupon() {
    // Create a simple modal for the coupon
    const modal = document.createElement('div');
    modal.style.cssText = `
        position: fixed; top: 0; left: 0; width: 100%; height: 100%; 
        background: rgba(0,0,0,0.8); z-index: 10000; display: flex; 
        align-items: center; justify-content: center;
    `;
    
    const couponCode = 'CORE10-' + Math.random().toString(36).substr(2, 6).toUpperCase();
    
    modal.innerHTML = `
        <div style="background: white; padding: 2rem; border-radius: 12px; text-align: center; max-width: 400px;">
            <h3 style="color: #2c5aa0; margin-top: 0;">🍎 Amazing! 🍎</h3>
            <p>You collected 10 apples! Here's your reward:</p>
            <p><strong>10% OFF</strong> coupon!</p>
            <div style="background: #f8f9fa; padding: 1rem; border-radius: 6px; margin: 1rem 0;">
                <strong style="font-size: 1.2rem; color: #28a745;">${couponCode}</strong>
            </div>
            <button onclick="navigator.clipboard.writeText('${couponCode}').then(() => alert('Coupon code copied!'))" 
                    style="background: #28a745; color: white; border: none; padding: 0.5rem 1rem; border-radius: 4px; margin-right: 1rem; cursor: pointer;">
                Copy Code
            </button>
            <button onclick="this.parentElement.parentElement.remove()" 
                    style="background: #6c757d; color: white; border: none; padding: 0.5rem 1rem; border-radius: 4px; cursor: pointer;">
                Close
            </button>
        </div>
    `;
    
    document.body.appendChild(modal);
}

// Coupon Slots Game
function initializeCouponSlotsGame() {
    const spinBtn = document.getElementById('spin-btn');
    const coinsLeftEl = document.getElementById('coins-left');
    const resultEl = document.getElementById('slots-result');
    const slot1 = document.getElementById('slot-1');
    const slot2 = document.getElementById('slot-2');
    const slot3 = document.getElementById('slot-3');
    
    if (!spinBtn || !coinsLeftEl || !resultEl) return;
    
    // Get or initialize coins left from localStorage
    let coinsLeft = parseInt(localStorage.getItem('coupon-slots-coins') || '3');
    const symbols = ['🍎', '🍒', '⭐'];
    
    function updateDisplay() {
        coinsLeftEl.textContent = coinsLeft;
        localStorage.setItem('coupon-slots-coins', coinsLeft.toString());
        
        if (coinsLeft <= 0) {
            spinBtn.disabled = true;
            spinBtn.textContent = 'No Coins Left';
            if (!resultEl.textContent.includes('WIN')) {
                resultEl.textContent = 'Better luck next time!';
            }
        } else {
            spinBtn.textContent = `🪙 SPIN (${coinsLeft} Coin${coinsLeft !== 1 ? 's' : ''} Left)`;
        }
    }
    
    function showCouponModal() {
        // Create a simple modal for the coupon
        const modal = document.createElement('div');
        modal.style.cssText = `
            position: fixed; top: 0; left: 0; width: 100%; height: 100%; 
            background: rgba(0,0,0,0.8); z-index: 10000; display: flex; 
            align-items: center; justify-content: center;
        `;
        
        const couponCode = 'DEMO10-' + Math.random().toString(36).substr(2, 6).toUpperCase();
        
        modal.innerHTML = `
            <div style="background: white; padding: 2rem; border-radius: 12px; text-align: center; max-width: 400px;">
                <h3 style="color: #2c5aa0; margin-top: 0;">🎉 Congratulations! 🎉</h3>
                <p>You've won a <strong>10% OFF</strong> coupon!</p>
                <div style="background: #f8f9fa; padding: 1rem; border-radius: 6px; margin: 1rem 0;">
                    <strong style="font-size: 1.2rem; color: #28a745;">${couponCode}</strong>
                </div>
                <button onclick="navigator.clipboard.writeText('${couponCode}').then(() => alert('Coupon code copied!'))" 
                        style="background: #28a745; color: white; border: none; padding: 0.5rem 1rem; border-radius: 4px; margin-right: 1rem; cursor: pointer;">
                    Copy Code
                </button>
                <button onclick="this.parentElement.parentElement.remove()" 
                        style="background: #6c757d; color: white; border: none; padding: 0.5rem 1rem; border-radius: 4px; cursor: pointer;">
                    Close
                </button>
            </div>
        `;
        
        document.body.appendChild(modal);
    }
    
    function spin() {
        if (coinsLeft <= 0) return;
        
        const isLastCoin = coinsLeft === 1;
        coinsLeft--;
        resultEl.textContent = 'Spinning...';
        
        // Animate slots with longer sequence (~5 seconds)
        let spins = 0;
        const maxSpins = 50; // Longer animation
        
        const spinInterval = setInterval(() => {
            if (!isLastCoin) {
                // Regular random spin
                slot1.textContent = symbols[Math.floor(Math.random() * symbols.length)];
                slot2.textContent = symbols[Math.floor(Math.random() * symbols.length)];
                slot3.textContent = symbols[Math.floor(Math.random() * symbols.length)];
            } else {
                // Last coin - gradually move toward a match
                if (spins < maxSpins - 10) {
                    slot1.textContent = symbols[Math.floor(Math.random() * symbols.length)];
                    slot2.textContent = symbols[Math.floor(Math.random() * symbols.length)];
                    slot3.textContent = symbols[Math.floor(Math.random() * symbols.length)];
                } else {
                    // Force a match in the last few spins
                    const winSymbol = symbols[0]; // 🍎
                    slot1.textContent = winSymbol;
                    slot2.textContent = winSymbol;
                    slot3.textContent = winSymbol;
                }
            }
            
            spins++;
            if (spins >= maxSpins) {
                clearInterval(spinInterval);
                // Stop reels in sequence
                setTimeout(() => checkResult(), 200);
            }
        }, 100);
        
        gameIntervals.push(spinInterval);
    }
    
    function checkResult() {
        const symbol1 = slot1.textContent;
        const symbol2 = slot2.textContent;
        const symbol3 = slot3.textContent;
        
        if (symbol1 === symbol2 && symbol2 === symbol3) {
            resultEl.innerHTML = '🎉 <strong>WIN!</strong> 10% OFF Coupon! 🎉';
            resultEl.style.color = '#FFD700';
            spinBtn.disabled = true;
            spinBtn.textContent = 'You Won!';
            
            // Show coupon modal
            setTimeout(showCouponModal, 1000);
        } else if (coinsLeft === 0) {
            resultEl.textContent = 'Game Over - No more coins!';
            resultEl.style.color = '#e74c3c';
        } else {
            resultEl.textContent = 'Try again!';
            resultEl.style.color = '#666';
        }
        
        updateDisplay();
    }
    
    function resetGame() {
        coinsLeft = 3;
        localStorage.setItem('coupon-slots-coins', '3');
        resultEl.textContent = '';
        resultEl.style.color = '#666';
        slot1.textContent = '🍎';
        slot2.textContent = '🍒';
        slot3.textContent = '⭐';
        spinBtn.disabled = false;
        updateDisplay();
    }
    
    spinBtn.addEventListener('click', spin);
    
    // Initialize game
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