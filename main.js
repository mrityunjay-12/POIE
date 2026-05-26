/**
 * SPOXTALE POIE - Premium Landing Page Interactions
 * Provides smooth count-up animations and responsive card perspective tilts.
 */

document.addEventListener('DOMContentLoaded', () => {
  loadHeader();
  initExperienceCounter();
  initAccordion();
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
