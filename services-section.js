/* Keyboard accessibility for the interactive service cards. */
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll("#services .jg-service-card").forEach((card) => {
    card.setAttribute("tabindex", "0");
    card.setAttribute("role", "group");
  });
});
