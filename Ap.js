const accordionItems = document.querySelectorAll(".accordion-item");

accordionItems.forEach((item) => {
  const button = item.querySelector(".accordion-btn");
  const icon = button.querySelector("span");

  button.addEventListener("click", () => {
    const isOpen = item.classList.contains("active");

    accordionItems.forEach((otherItem) => {
      otherItem.classList.remove("active");

      const otherIcon = otherItem.querySelector(".accordion-btn span");
      if (otherIcon) {
        otherIcon.textContent = "+";
      }
    });

    if (!isOpen) {
      item.classList.add("active");

      if (icon) {
        icon.textContent = "-";
      }
    }
  });
});