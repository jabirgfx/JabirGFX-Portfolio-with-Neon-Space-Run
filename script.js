 // =========================
 // MOBILE MENU
 // =========================

const menuToggle = document.querySelector(".menu-toggle");
const nav = document.querySelector(".nav");

if (menuToggle && nav) {

    menuToggle.addEventListener("click", () => {

        const isOpen = nav.classList.toggle("open");

        menuToggle.setAttribute(
            "aria-expanded",
            isOpen
        );

        menuToggle.setAttribute(
            "aria-label",
            isOpen ? "Close menu" : "Open menu"
        );

    });


    // Menu link click করলে menu বন্ধ হবে
    nav.querySelectorAll("a").forEach(link => {

        link.addEventListener("click", () => {

            nav.classList.remove("open");

            menuToggle.setAttribute(
                "aria-expanded",
                "false"
            );

            menuToggle.setAttribute(
                "aria-label",
                "Open menu"
            );

        });

    });

}
// =========================
// ACTIVE NAV
// =========================

const navLinks = document.querySelectorAll(".nav a");

navLinks.forEach((link) => {

    link.addEventListener("click", function () {

        navLinks.forEach((item) => {
            item.classList.remove("active");
        });

        this.classList.add("active");

    });

});


// =========================
// DEFAULT HOME
// =========================

const homeLink = document.querySelector('.nav a[href="#home"]');

if (homeLink) {
    homeLink.classList.add("active");
}
// =========================
// FOOTER YEAR
// =========================

const year = document.getElementById("year");

if (year) {
    year.textContent = new Date().getFullYear();
}


// =========================
// DOWNLOAD CV
// =========================

function downloadCV(e) {
    if (e) {
        e.preventDefault();
    }

    window.location.href = "assets/JabirGFX-CV.pdf";
}


// =========================
// JABIRGFX LOADER
// =========================

document.addEventListener("DOMContentLoaded", function () {

    const loader = document.querySelector(".loader");

    if (!loader) return;

    setTimeout(() => {
        loader.classList.add("hide");
    }, 1200);

});


// =========================
// CUSTOM CURSOR
// =========================

document.addEventListener("DOMContentLoaded", function () {

    const cursor = document.querySelector(".cursor");
    const cursorRing = document.querySelector(".cursor-ring");

    if (!cursor || !cursorRing) return;

    let mouseX = 0;
    let mouseY = 0;

    let ringX = 0;
    let ringY = 0;


    // Mouse position

    document.addEventListener("mousemove", function (e) {

        mouseX = e.clientX;
        mouseY = e.clientY;

        cursor.style.left = mouseX + "px";
        cursor.style.top = mouseY + "px";

    });


    // Smooth ring

    function animateCursor() {

        ringX += (mouseX - ringX) * 0.15;
        ringY += (mouseY - ringY) * 0.15;

        cursorRing.style.left = ringX + "px";
        cursorRing.style.top = ringY + "px";

        requestAnimationFrame(animateCursor);

    }

    animateCursor();


    // Hover effect

    const hoverElements = document.querySelectorAll(
        "a, button, input, textarea, select, .project, .service"
    );

    hoverElements.forEach(function (element) {

        element.addEventListener("mouseenter", function () {
            document.body.classList.add("cursor-hover");
        });

        element.addEventListener("mouseleave", function () {
            document.body.classList.remove("cursor-hover");
        });

    });

});


// =========================
// FEATURED PROJECT CARDS
// =========================

document.addEventListener("DOMContentLoaded", () => {

    const cards = document.querySelectorAll(".project-card");


    if ("IntersectionObserver" in window) {

        const observer = new IntersectionObserver(
            (entries, obs) => {

                entries.forEach(entry => {

                    if (!entry.isIntersecting) {
                        return;
                    }

                    entry.target.classList.add("project-visible");

                    obs.unobserve(entry.target);

                });

            },
            {
                threshold: 0.12
            }
        );


        cards.forEach((card, index) => {

            card.style.transitionDelay =
                `${index * 80}ms`;

            observer.observe(card);

        });


    } else {

        cards.forEach(card => {

            card.classList.add("project-visible");

        });

    }


    // =====================================================
    // PROJECT ARROWS
    // =====================================================

    document.querySelectorAll(".project-arrow").forEach(arrow => {

        arrow.addEventListener("click", e => {

            const href = arrow.getAttribute("href");

            if (!href || href === "#") {
                e.preventDefault();
            }

        });

    });

});


// =========================================================
// VIEW ALL PROJECTS — GOOGLE DRIVE
// =========================================================

document.addEventListener("DOMContentLoaded", () => {

    const viewButton =
        document.querySelector(".view-projects-btn");

    if (!viewButton) return;


    const driveFolder =
        "https://drive.google.com/drive/folders/1n7PpImeK8QG2cMa15db6djOGnLK-K43A?usp=drive_link";


    viewButton.setAttribute(
        "href",
        driveFolder
    );

    viewButton.setAttribute(
        "target",
        "_blank"
    );

    viewButton.setAttribute(
        "rel",
        "noopener noreferrer"
    );

});


// =========================================================
// NEON SPACE RUN — SAME-PAGE GAME LAUNCHER
// =========================================================

document.addEventListener("DOMContentLoaded", () => {

    const openBtn =
        document.getElementById("nsrOpenGame");

    const closeBtn =
        document.getElementById("nsrCloseGame");

    const overlay =
        document.getElementById("nsrGameOverlay");

    const frame =
        document.getElementById("nsrGameFrame");


    if (
        !openBtn ||
        !closeBtn ||
        !overlay ||
        !frame
    ) {
        return;
    }


    const gameURL =
        "games/neon-space-run/index.html";


    // =====================================================
    // OPEN GAME
    // =====================================================

    const openGame = () => {

        if (!frame.getAttribute("src")) {

            frame.setAttribute(
                "src",
                gameURL
            );

        }

        overlay.classList.add(
            "is-open"
        );

        overlay.setAttribute(
            "aria-hidden",
            "false"
        );

        document.body.classList.add(
            "nsr-game-lock"
        );

        closeBtn.focus();

    };


    // =====================================================
    // CLOSE GAME
    // =====================================================

    const closeGame = () => {

        overlay.classList.remove(
            "is-open"
        );

        overlay.setAttribute(
            "aria-hidden",
            "true"
        );

        document.body.classList.remove(
            "nsr-game-lock"
        );

        frame.removeAttribute("src");

    };


    // Open

    openBtn.addEventListener(
        "click",
        openGame
    );


    // Close

    closeBtn.addEventListener(
        "click",
        closeGame
    );


    // Close outside

    overlay.addEventListener(
        "click",
        event => {

            if (event.target === overlay) {
                closeGame();
            }

        }
    );


    // Close ESC

    document.addEventListener(
        "keydown",
        event => {

            if (
                event.key === "Escape" &&
                overlay.classList.contains("is-open")
            ) {
                closeGame();
            }

        }
    );

});
