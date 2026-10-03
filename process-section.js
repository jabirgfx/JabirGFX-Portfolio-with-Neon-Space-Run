/* =========================================================
   JABIRGFX — PROCESS MATRIX INTERACTION
   Fully scoped so it does not affect the rest of the site.
========================================================= */

document.addEventListener("DOMContentLoaded", () => {
    const processGrid = document.getElementById("jgProcessGrid");
    const cards = processGrid
        ? processGrid.querySelectorAll(".jg-process-card")
        : [];

    const energyFill = document.getElementById("jgProcessEnergyFill");
    const percentIndicator = document.getElementById("jgProcessPercent");
    const statusText = document.getElementById("jgProcessStatusText");

    if (!processGrid || !cards.length) return;

    const resetProcess = () => {
        cards.forEach((card) => {
            card.classList.remove("jg-process-active");
        });

        if (energyFill) energyFill.style.width = "0%";
        if (percentIndicator) percentIndicator.textContent = "0%";
        if (statusText) {
            statusText.textContent =
                "0% STANDBY [HOVER CARD TO INITIATE]";
        }
    };

    const activateProcess = (card) => {
        cards.forEach((item) => {
            item.classList.remove("jg-process-active");
        });

        card.classList.add("jg-process-active");

        const percent = card.dataset.percent || "0%";
        const status =
            card.dataset.status ||
            "0% STANDBY [HOVER CARD TO INITIATE]";

        if (energyFill) energyFill.style.width = percent;
        if (percentIndicator) percentIndicator.textContent = percent;
        if (statusText) statusText.textContent = status;
    };

    cards.forEach((card) => {
        card.addEventListener("mouseenter", () => {
            activateProcess(card);
        });

        card.addEventListener("focusin", () => {
            activateProcess(card);
        });

        card.addEventListener("click", () => {
            activateProcess(card);
        });
    });

    processGrid.addEventListener("mouseleave", resetProcess);

    processGrid.addEventListener("focusout", (event) => {
        if (!processGrid.contains(event.relatedTarget)) {
            resetProcess();
        }
    });

    /* Keep the interactive state usable on touch devices. */
    cards.forEach((card) => {
        card.addEventListener(
            "touchstart",
            () => activateProcess(card),
            { passive: true }
        );
    });
});
