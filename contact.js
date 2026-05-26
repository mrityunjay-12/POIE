const contactForm = document.getElementById("contactForm");
const successMsg = document.getElementById("successMsg");

contactForm.addEventListener("submit", function (e) {
  e.preventDefault();

  successMsg.textContent = "Thank you! Your message has been submitted.";
  contactForm.reset();
});