// ── Config ──────────────────────────────────────────────────────
const WHATSAPP_NUMBER = '917719076463';
const GOOGLE_SHEET_WEBAPP_URL = 'https://script.google.com/macros/s/AKfycbwXLTk2qJNXRnZu_kjGmBxEKyMzroKzYFZLWLpkaS-QbCFUS388MB6KiydHnxt8jGJ8/exec';
// ────────────────────────────────────────────────────────────────

let currentSection = 1;
let teamMembers = 1;
let isTransitioning = false;

// Initialize form with enhanced animations
document.addEventListener('DOMContentLoaded', function() {
    // Show loading animation initially
    showLoading();
    
    // Set up initial animations
    setTimeout(() => {
        hideLoading();
        
        // Set today's date as default
        const today = new Date().toISOString().split('T')[0];
        document.getElementById('dateField').value = today;
        document.getElementById('dateField').min = today;
        
        // Set default event date to tomorrow
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        const tomorrowStr = tomorrow.toISOString().slice(0, 16);
        document.getElementById('eventDateField').value = tomorrowStr;
        document.getElementById('eventDateField').min = new Date().toISOString().slice(0, 16);
        
        // Add staggered animations to form elements
        animatePageElements();
        
        // Add input event listeners
        setupEventListeners();
        
        // Initial count updates
        updateCount('nameField', 'nameCount', 30);
        updateCount('requirementsField', 'reqCount', 500);
        updateCount('remarksField', 'remarkCount', 300);
    }, 1000);
});

function showLoading() {
    document.getElementById('loadingOverlay').classList.add('active');
}

function hideLoading() {
    document.getElementById('loadingOverlay').classList.remove('active');
}

function animatePageElements() {
    // Animate elements with delay
    const elements = document.querySelectorAll('[data-delay]');
    elements.forEach(el => {
        const delay = parseFloat(el.dataset.delay);
        setTimeout(() => {
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
        }, delay * 1000);
    });
}

function setupEventListeners() {
    document.getElementById('nameField').addEventListener('input', function() {
        updateCount('nameField', 'nameCount', 30);
        animateInput(this);
    });
    
    document.getElementById('phoneField').addEventListener('input', function() {
        this.value = this.value.replace(/\D/g, '');
        animateInput(this);
    });
    
    document.getElementById('requirementsField').addEventListener('input', function() {
        updateCount('requirementsField', 'reqCount', 500);
    });
    
    document.getElementById('remarksField').addEventListener('input', function() {
        updateCount('remarksField', 'remarkCount', 300);
    });
    
    // Add focus animations to all inputs
    const inputs = document.querySelectorAll('.field-input');
    inputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.parentElement.classList.add('focused');
        });
        
        input.addEventListener('blur', function() {
            this.parentElement.classList.remove('focused');
        });
    });
}

function animateInput(input) {
    input.style.transform = 'scale(1.02)';
    setTimeout(() => {
        input.style.transform = 'scale(1)';
    }, 200);
}

// Counter with animation
function changeCount(delta) {
    if (isTransitioning) return;
    
    teamMembers = Math.max(1, Math.min(10, teamMembers + delta));
    const display = document.getElementById('teamCount');
    
    // Add animation
    display.style.transform = 'scale(1.2)';
    display.style.color = delta > 0 ? 'var(--gold)' : '#c0392b';
    
    setTimeout(() => {
        display.textContent = teamMembers;
        display.style.transform = 'scale(1)';
        display.style.color = 'var(--dark)';
    }, 200);
}

// Character counter
function updateCount(fieldId, countId, max) {
    const len = document.getElementById(fieldId).value.length;
    const countElement = document.getElementById(countId);
    countElement.textContent = len + '/' + max;
    
    // Color change based on usage
    if (len > max * 0.8) {
        countElement.style.color = '#c0392b';
    } else if (len > max * 0.6) {
        countElement.style.color = 'var(--gold)';
    } else {
        countElement.style.color = 'rgba(122,101,82,0.8)';
    }
}

// Progress bar with animation
function setProgress(step) {
    const pct = step === 1 ? 33 : step === 2 ? 66 : 100;
    const progressBar = document.getElementById('progressBar');
    
    // Animate progress
    progressBar.style.transition = 'width 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)';
    progressBar.style.width = pct + '%';
    
    // Add pulse effect
    progressBar.parentElement.style.transform = 'scale(1.05)';
    setTimeout(() => {
        progressBar.parentElement.style.transform = 'scale(1)';
    }, 300);
}

// Stepper update with animations
function updateStepper(active) {
    for (let i = 1; i <= 3; i++) {
        const el = document.getElementById('step-' + i);
        const circle = el.querySelector('.step-circle');
        
        if (i < active) {
            el.classList.remove('active');
            el.classList.add('done');
            
            // Animate checkmark
            circle.style.transform = 'scale(1.1)';
            setTimeout(() => {
                circle.style.transform = 'scale(1)';
            }, 300);
        } else if (i === active) {
            el.classList.remove('done');
            el.classList.add('active');
            
            // Pulse animation for active step
            circle.style.animation = 'pulse 2s infinite';
        } else {
            el.classList.remove('active', 'done');
            circle.style.animation = 'none';
        }
    }
}

// Validation with visual feedback
function validate(section) {
    let ok = true;
    const clear = id => { 
        const el = document.getElementById(id);
        if (el) {
            el.classList.remove('invalid');
            el.classList.add('valid');
            setTimeout(() => el.classList.remove('valid'), 1000);
        }
    };
    
    const fail = id => { 
        const el = document.getElementById(id);
        if (el) {
            el.classList.remove('valid');
            el.classList.add('invalid');
            shakeElement(el);
            ok = false;
        }
    };

    if (section === 1) {
        document.getElementById('dateField').value ? clear('grp-date') : fail('grp-date');
        document.getElementById('nameField').value.trim() ? clear('grp-name') : fail('grp-name');
        const ph = document.getElementById('phoneField').value;
        (ph.length === 10) ? clear('grp-phone') : fail('grp-phone');
        const em = document.getElementById('emailField').value;
        (!em || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(em)) ? clear('grp-email') : fail('grp-email');
        document.getElementById('eventTypeField').value ? clear('grp-event-type') : fail('grp-event-type');
    }
    
    if (section === 2) {
        document.getElementById('eventDateField').value ? clear('grp-event-date') : fail('grp-event-date');
        document.getElementById('locationField').value.trim() ? clear('grp-location') : fail('grp-location');
        document.getElementById('budgetField').value ? clear('grp-budget') : fail('grp-budget');
    }
    
    return ok;
}

function shakeElement(element) {
    element.style.transform = 'translateX(10px)';
    setTimeout(() => element.style.transform = 'translateX(-10px)', 100);
    setTimeout(() => element.style.transform = 'translateX(10px)', 200);
    setTimeout(() => element.style.transform = 'translateX(-10px)', 300);
    setTimeout(() => element.style.transform = 'translateX(0)', 400);
}

// Enhanced section transitions
async function goNext(from) {
    if (isTransitioning) return;
    
    if (!validate(from)) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
    }
    
    isTransitioning = true;
    await animateTransition('next', from);
    showSection(from + 1);
}

async function goPrev(from) {
    if (isTransitioning) return;
    
    isTransitioning = true;
    await animateTransition('prev', from);
    showSection(from - 1);
}

async function animateTransition(direction, from) {
    const overlay = document.getElementById('transitionOverlay');
    const currentSection = document.getElementById('section' + from);
    
    // Show overlay with direction-based gradient
    overlay.style.background = direction === 'next' 
        ? 'linear-gradient(90deg, var(--gold), var(--gold-light))'
        : 'linear-gradient(90deg, var(--gold-light), var(--gold))';
    overlay.classList.add('active');
    
    // Animate current section out
    currentSection.style.animation = direction === 'next' 
        ? 'slideOutLeft 0.5s ease forwards'
        : 'slideOutRight 0.5s ease forwards';
    
    // Wait for animation
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Hide overlay
    overlay.classList.remove('active');
    isTransitioning = false;
}

function showSection(n) {
    const sections = document.querySelectorAll('.form-section');
    sections.forEach(s => {
        s.classList.remove('active');
        s.style.animation = '';
    });
    
    const newSection = document.getElementById('section' + n);
    if (newSection) {
        newSection.classList.add('active');
        newSection.style.animation = 'slideInRight 0.5s ease forwards';
        
        // Animate elements within new section
        setTimeout(() => {
            const inputs = newSection.querySelectorAll('.field-input, .field-label');
            inputs.forEach((input, index) => {
                input.style.animationDelay = (index * 0.1) + 's';
                input.classList.add('fade-in-up');
                
                // Remove animation class after it plays
                setTimeout(() => {
                    input.classList.remove('fade-in-up');
                    input.style.animationDelay = '';
                }, 1000);
            });
        }, 300);
    }
    
    currentSection = n;
    updateStepper(n);
    setProgress(n);
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Collect data
function collectData() {
    const delivery = document.querySelector('input[name="delivery"]:checked')?.value || '1 Month';
    return {
        'Date'            : document.getElementById('dateField').value,
        'Client Name'     : document.getElementById('nameField').value.trim(),
        'Contact Number'  : document.getElementById('phoneField').value,
        'Email'           : document.getElementById('emailField').value.trim(),
        'Event Type'      : document.getElementById('eventTypeField').value,
        'Event Date'      : document.getElementById('eventDateField').value,
        'Event Location'  : document.getElementById('locationField').value.trim(),
        'Budget'          : '₹' + document.getElementById('budgetField').value,
        'Advance/Pending' : document.getElementById('advanceField').value ? '₹' + document.getElementById('advanceField').value : '',
        'Requirements'    : document.getElementById('requirementsField').value.trim(),
        'Team Members'    : teamMembers,
        'Delivery'        : delivery,
        'Remarks'         : document.getElementById('remarksField').value.trim(),
    };
}

// Build WhatsApp message
function buildWhatsAppMessage(d) {
    return `*WEDFORIA - New Client Enquiry*

*CLIENT DETAILS*
Date: ${d['Date']}
Name: ${d['Client Name']}
Contact: ${d['Contact Number']}
Email: ${d['Email'] || '-'}
Event Type: ${d['Event Type']}

*EVENT DETAILS*
Event Date: ${d['Event Date']}
Location: ${d['Event Location']}
Budget: ${d['Budget']}
Advance/Pending: ${d['Advance/Pending'] || '-'}

*FINAL DETAILS*
Requirements: ${d['Requirements'] || '-'}
Team Members: ${d['Team Members']}
Delivery: ${d['Delivery']}
Remarks: ${d['Remarks'] || '-'}

_Sent via Wedforia Enquiry Form_`;
}

// Send to Google Sheets
async function sendToGoogleSheet(data) {
    if (!GOOGLE_SHEET_WEBAPP_URL.includes('YOUR_DEPLOYMENT_ID')) {
        try {
            await fetch(GOOGLE_SHEET_WEBAPP_URL, {
                method: 'POST',
                mode: 'no-cors',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });
        } catch (e) {
            console.warn('Google Sheets error:', e);
        }
    }
}

// Main submit with enhanced animations
async function handleSubmit() {
    if (isTransitioning) return;
    
    if (!validate(3)) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
    }

    const btn = document.getElementById('submitBtn');
    const originalText = btn.innerHTML;
    btn.disabled = true;
    isTransitioning = true;
    
    // Animate button
    btn.style.animation = 'pulse 1s infinite';
    btn.innerHTML = '<span class="wa-icon">⏳</span> Processing...';

    const data = collectData();

    try {
        // Show loading animation
        showLoading();
        
        // 1) Google Sheets
        await sendToGoogleSheet(data);
        
        // Simulate processing time for better UX
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Hide loading
        hideLoading();
        
        // 2) Show success with enhanced animations
        document.querySelectorAll('.form-section').forEach(s => {
            s.classList.remove('active');
            s.style.opacity = '0';
        });
        
        const successScreen = document.getElementById('successScreen');
        successScreen.style.display = 'block';
        successScreen.style.animation = 'fadeInScale 0.8s ease forwards';
        
        // Update stepper
        updateStepper(4);
        document.getElementById('progressBar').style.width = '100%';
        
        // Add celebration effects
        celebrateSuccess();
        
        // 3) WhatsApp redirect after delay
        setTimeout(() => {
            const msg = encodeURIComponent(buildWhatsAppMessage(data));
            const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`;
            window.open(url, '_blank');
        }, 2500);
        
    } catch (error) {
        console.error('Submission error:', error);
        hideLoading();
        
        // Show error animation
        const card = document.getElementById('mainCard');
        card.style.animation = 'shakeError 0.5s ease';
        
        setTimeout(() => {
            card.style.animation = '';
            btn.innerHTML = originalText;
            btn.disabled = false;
            btn.style.animation = '';
            alert('There was an error submitting the form. Please try again.');
        }, 500);
        
    } finally {
        isTransitioning = false;
    }
}

function celebrateSuccess() {
    // Add floating particles
    for (let i = 0; i < 20; i++) {
        createParticle();
    }
    
    // Animate success icon
    const successIcon = document.querySelector('.success-icon');
    successIcon.style.animation = 'bounceIn 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
}

function createParticle() {
    const particle = document.createElement('div');
    particle.className = 'particle';
    particle.style.cssText = `
        position: absolute;
        width: 8px;
        height: 8px;
        background: var(--gold);
        border-radius: 50%;
        pointer-events: none;
        z-index: 1000;
        left: ${Math.random() * 100}%;
        top: ${Math.random() * 100}%;
    `;
    
    document.body.appendChild(particle);
    
    // Animate particle
    const animation = particle.animate([
        { transform: 'translateY(0) scale(1)', opacity: 1 },
        { transform: `translateY(-${100 + Math.random() * 100}px) scale(0)`, opacity: 0 }
    ], {
        duration: 1000 + Math.random() * 1000,
        easing: 'cubic-bezier(0.215, 0.61, 0.355, 1)'
    });
    
    animation.onfinish = () => particle.remove();
}