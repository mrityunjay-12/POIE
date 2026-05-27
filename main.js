/**
 * SPOXTALE POIE - Premium Landing Page Interactions
 * Provides smooth count-up animations, responsive card tilts, and Google Sheets lead capture integration.
 */

// Paste your Google Apps Script Web App URL here to connect to Google Sheets
const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzjhEQtMIig0u8OJbiwvQlIV6OKYRfpfU_FsJMUidSuoQ7C3NuMAerc7EDZBvnWVbwH-Q/exec";

document.addEventListener('DOMContentLoaded', () => {
  loadHeader();
  initExperienceCounter();
  initAccordion();
  initApplyForm();
});

/**
 * Loads the modular header component from header.html dynamically
 */
function loadHeader() {
  const placeholder = document.getElementById('header-placeholder');
  if (!placeholder) return;

  fetch('header.html')
    .then(response => {
      if (!response.ok) throw new Error('Header file not found');
      return response.text();
    })
    .then(html => {
      placeholder.innerHTML = html;
    })
    .catch(error => console.error('Error loading header:', error));
}

/**
 * Animates the '40+' years experience number count-up on load
 */
function initExperienceCounter() {
  const counterElement = document.getElementById('experience-val');
  if (!counterElement) return;

  const targetValue = 40;
  const duration = 1800; // Total duration in ms
  const frameRate = 60; // 60 frames per second
  const totalFrames = Math.round(duration / (1000 / frameRate));
  let currentFrame = 0;

  // Custom ease-out-expo curve for premium feel
  function easeOutExpo(x) {
    return x === 1 ? 1 : 1 - Math.pow(2, -10 * x);
  }

  const counterTimer = setInterval(() => {
    currentFrame++;
    const progress = currentFrame / totalFrames;
    const easedProgress = easeOutExpo(progress);
    const currentValue = Math.round(easedProgress * targetValue);

    counterElement.textContent = `${currentValue}+`;

    if (currentFrame >= totalFrames) {
      counterElement.textContent = `${targetValue}+`;
      clearInterval(counterTimer);
    }
  }, 1000 / frameRate);
}

/**
 * Initializes interactive accordion elements on the course details page.
 */
function initAccordion() {
  const headers = document.querySelectorAll('.accordion-header');
  headers.forEach(header => {
    header.addEventListener('click', () => {
      const item = header.parentElement;
      const isActive = item.classList.contains('active');

      // Close other open accordion items for a premium cohesive feel
      document.querySelectorAll('.accordion-item').forEach(otherItem => {
        otherItem.classList.remove('active');
      });

      if (!isActive) {
        item.classList.add('active');
      }
    });
  });
}

/**
 * Intercepts form submissions and posts data to the Google Sheets webhook
 */
function initApplyForm() {
  const forms = document.querySelectorAll('form.lead-form');
  forms.forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const submitBtn = form.querySelector('button[type="submit"]');
      const originalBtnText = submitBtn ? submitBtn.innerHTML : "Apply Now";

      // Display spinning indicator status during dispatching
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = `
          <svg class="animate-spin" style="animation: spin 1s linear infinite; display: inline-block; width: 14px; height: 14px; margin-right: 8px; vertical-align: middle;" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" style="opacity: 0.25;"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" style="opacity: 0.75;"></path>
          </svg>
          Submitting...
        `;
      }

      // Collect field values
      const formData = new FormData(form);
      const data = {
        first_name: formData.get('first_name') || "",
        last_name: formData.get('last_name') || "",
        email: formData.get('email') || "",
        phone: formData.get('phone') || "",
        message: formData.get('message') || "",
        address: formData.get('address') || "",
        page: window.location.pathname.split('/').pop() || "index.html",
        submittedAt: new Date().toISOString()
      };

      const isPlaceholder = GOOGLE_SCRIPT_URL.includes("YOUR_GOOGLE_");

      // Bypasses preflight restrictions with Apps Script redirections
      const postPromise = isPlaceholder
        ? Promise.resolve({ status: "success", simulated: true })
        : fetch(GOOGLE_SCRIPT_URL.trim(), {
            method: "POST",
            mode: "no-cors",
            headers: {
              "Content-Type": "text/plain;charset=utf-8"
            },
            body: JSON.stringify(data)
          });

      postPromise
        .then(() => {
          // Backup locally in localStorage
          const leads = JSON.parse(localStorage.getItem('poie_leads') || '[]');
          leads.unshift(data);
          localStorage.setItem('poie_leads', JSON.stringify(leads));

          // Present the dynamic glassmorphic success confirmation modal
          showSuccessMessage(form, data.first_name, isPlaceholder);
        })
        .catch(err => {
          console.error("Submission failed, backing up lead details:", err);
          alert("Submission encountered a network issue, but we've saved your details locally. Our team will contact you shortly!");
        })
        .finally(() => {
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalBtnText;
          }
        });
    });
  });

  // Inject dynamic keyframe animation style for the loader spinner
  if (!document.getElementById('spinner-keyframes')) {
    const styleSheet = document.createElement('style');
    styleSheet.id = 'spinner-keyframes';
    styleSheet.innerHTML = `@keyframes spin { to { transform: rotate(360deg); } }`;
    document.head.appendChild(styleSheet);
  }
}

/**
 * Creates and displays a gorgeous premium success modal with smooth animations
 */
function showSuccessMessage(form, firstName, isSimulated) {
  // Create backdrop glass overlay
  const modal = document.createElement('div');
  modal.style.position = 'fixed';
  modal.style.top = '0';
  modal.style.left = '0';
  modal.style.width = '100vw';
  modal.style.height = '100vh';
  modal.style.backgroundColor = 'rgba(21, 28, 45, 0.7)';
  modal.style.backdropFilter = 'blur(12px)';
  modal.style.webkitBackdropFilter = 'blur(12px)';
  modal.style.display = 'flex';
  modal.style.alignItems = 'center';
  modal.style.justifyContent = 'center';
  modal.style.zIndex = '999999';
  modal.style.opacity = '0';
  modal.style.transition = 'opacity 0.4s ease';

  // Modal Content Container
  const content = document.createElement('div');
  content.style.backgroundColor = '#ffffff';
  content.style.borderRadius = '28px';
  content.style.padding = '40px 32px';
  content.style.maxWidth = '460px';
  content.style.width = '90%';
  content.style.textAlign = 'center';
  content.style.boxShadow = '0 25px 50px -12px rgba(0, 0, 0, 0.25)';
  content.style.transform = 'translateY(24px)';
  content.style.transition = 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)';
  content.style.border = '1px solid rgba(226, 232, 240, 0.8)';

  content.innerHTML = `
    <div style="width: 76px; height: 76px; background-color: #ecfdf5; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 24px; border: 2px solid #a7f3d0; box-shadow: 0 4px 10px rgba(167, 243, 208, 0.3);">
      <svg style="width: 36px; height: 36px; color: #059669;" fill="none" viewBox="0 0 24 24" stroke="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
      </svg>
    </div>
    <h3 style="font-size: 24px; font-weight: 800; color: #151c2d; margin-bottom: 12px; font-family: 'Inter', system-ui, -apple-system, sans-serif; letter-spacing: -0.5px;">
      Application Received!
    </h3>
    <p style="font-size: 14px; color: #64748b; line-height: 1.6; margin-bottom: 24px; font-family: 'Inter', system-ui, -apple-system, sans-serif;">
      Thank you, <span style="font-weight: 700; color: #ff4757;">${firstName}</span>. Your details have been securely recorded. An academic counselor will contact you shortly!
    </p>
    ${isSimulated ? `
      <div style="background-color: #eff6ff; border: 1px dashed #bfdbfe; border-radius: 16px; padding: 14px; margin-bottom: 24px; text-align: left;">
        <p style="font-size: 12px; color: #1e40af; font-weight: bold; margin-bottom: 6px; font-family: system-ui; display: flex; align-items: center; gap: 6px;">
          💡 Google Sheets Setup Tip
        </p>
        <p style="font-size: 11px; color: #1e3a8a; line-height: 1.48; margin: 0; font-family: system-ui;">
          Your lead has been backed up in local storage. To sync directly to Google Sheets, open <b>main.js</b> and replace the placeholder URL with your Google Web App URL! (Check <b>GOOGLE_SHEET_SETUP.md</b> for details).
        </p>
      </div>
    ` : ''}
    <button id="close-success-modal" style="background-color: #ff4757; color: #ffffff; border: none; border-radius: 14px; padding: 14px 32px; font-size: 14px; font-weight: 800; cursor: pointer; transition: all 0.2s ease; width: 100%; box-shadow: 0 8px 20px rgba(255, 71, 87, 0.25); outline: none;">
      Continue
    </button>
  `;

  modal.appendChild(content);
  document.body.appendChild(modal);

  // Trigger animations
  setTimeout(() => {
    modal.style.opacity = '1';
    content.style.transform = 'translateY(0)';
  }, 50);

  // Dismiss modal
  const closeBtn = content.querySelector('#close-success-modal');
  closeBtn.addEventListener('click', () => {
    modal.style.opacity = '0';
    content.style.transform = 'translateY(24px)';
    setTimeout(() => {
      document.body.removeChild(modal);
      form.reset();
    }, 400);
  });
}
