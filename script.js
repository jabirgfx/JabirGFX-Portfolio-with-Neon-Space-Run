/* =========================================================
   JABIRGFX PORTFOLIO — MAIN JAVASCRIPT
   ========================================================= */


/* =========================================================
   MOBILE MENU
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    const menuToggle = document.querySelector(".menu-toggle");
    const nav = document.querySelector(".nav");

    if (!menuToggle || !nav) return;

    menuToggle.addEventListener("click", () => {

        const isOpen = nav.classList.toggle("open");

        menuToggle.setAttribute(
            "aria-expanded",
            String(isOpen)
        );

        menuToggle.setAttribute(
            "aria-label",
            isOpen ? "Close menu" : "Open menu"
        );
    });

    // Close menu when a nav link is clicked
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

});


/* =========================================================
   ACTIVE NAVBAR — CLICK + SCROLL
   Single unified system
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    const navLinks = document.querySelectorAll(".nav a");
    const sections = document.querySelectorAll("section[id]");

    if (!navLinks.length) return;

    let isClickScrolling = false;
    let clickScrollTimer = null;

    function activateNav(id) {

        if (!id) return;

        navLinks.forEach(link => {

            const href = link.getAttribute("href");

            link.classList.toggle(
                "active",
                href === `#${id}`
            );

        });

    }

    /*
     * NAV CLICK
     */

    navLinks.forEach(link => {

        link.addEventListener("click", () => {

            const href = link.getAttribute("href");

            if (!href || !href.startsWith("#")) {
                return;
            }

            const id = href.substring(1);

            // Immediately activate clicked nav item
            activateNav(id);

            // Prevent scroll detection from fighting the click
            isClickScrolling = true;

            clearTimeout(clickScrollTimer);

            clickScrollTimer = setTimeout(() => {
                isClickScrolling = false;
            }, 900);

        });

    });


    /*
     * SCROLL DETECTION
     */

    function updateActiveSection() {

        if (isClickScrolling) return;

        const headerOffset = 150;

        let currentSection = "";

        sections.forEach(section => {

            const rect = section.getBoundingClientRect();

            if (
                rect.top <= headerOffset &&
                rect.bottom > headerOffset
            ) {
                currentSection = section.id;
            }

        });

        /*
         * If we're at the very top,
         * always keep Home active.
         */

        if (window.scrollY <= 10) {
            currentSection = "home";
        }

        if (currentSection) {
            activateNav(currentSection);
        }

    }

    window.addEventListener(
        "scroll",
        updateActiveSection,
        { passive: true }
    );

    // Initial state
    updateActiveSection();

});


/* =========================================================
   FOOTER YEAR
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    const year = document.getElementById("year");

    if (year) {
        year.textContent = new Date().getFullYear();
    }

});


/* =========================================================
   DOWNLOAD CV
   ========================================================= */

function downloadCV(event) {

    if (event) {
        event.preventDefault();
    }

    window.location.href = "assets/JabirGFX-CV.pdf";

}


/* =========================================================
   JABIRGFX LOADER
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    const loader = document.querySelector(".loader");

    if (!loader) return;

    setTimeout(() => {

        loader.classList.add("hide");

    }, 1200);

});


/* =========================================================
   CUSTOM CURSOR
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    const cursor = document.querySelector(".cursor");
    const cursorRing = document.querySelector(".cursor-ring");

    if (!cursor || !cursorRing) return;

    let mouseX = 0;
    let mouseY = 0;

    let ringX = 0;
    let ringY = 0;


    /*
     * Mouse position
     */

    document.addEventListener("mousemove", event => {

        mouseX = event.clientX;
        mouseY = event.clientY;

        cursor.style.left = `${mouseX}px`;
        cursor.style.top = `${mouseY}px`;

    });


    /*
     * Smooth cursor ring
     */

    function animateCursor() {

        ringX += (mouseX - ringX) * 0.15;
        ringY += (mouseY - ringY) * 0.15;

        cursorRing.style.left = `${ringX}px`;
        cursorRing.style.top = `${ringY}px`;

        requestAnimationFrame(animateCursor);

    }

    animateCursor();


    /*
     * Hover effect
     */

    const hoverElements = document.querySelectorAll(
        "a, button, input, textarea, select, .project, .project-card, .service, .service-card"
    );

    hoverElements.forEach(element => {

        element.addEventListener("mouseenter", () => {
            document.body.classList.add("cursor-hover");
        });

        element.addEventListener("mouseleave", () => {
            document.body.classList.remove("cursor-hover");
        });

    });

});


/* =========================================================
   FEATURED PROJECT CARDS
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    const cards = document.querySelectorAll(".project-card");

    if (!cards.length) return;


    /*
     * Intersection Observer
     */

    if ("IntersectionObserver" in window) {

        const observer = new IntersectionObserver(
            (entries, obs) => {

                entries.forEach(entry => {

                    if (!entry.isIntersecting) {
                        return;
                    }

                    entry.target.classList.add(
                        "project-visible"
                    );

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

            card.classList.add(
                "project-visible"
            );

        });

    }


    /*
     * Project arrows
     */

    document.querySelectorAll(".project-arrow").forEach(arrow => {

        arrow.addEventListener("click", event => {

            const href = arrow.getAttribute("href");

            if (!href || href === "#") {
                event.preventDefault();
            }

        });

    });

});


/* =========================================================
   VIEW ALL PROJECTS — GOOGLE DRIVE
   ========================================================= */

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


/* =========================================================
   NEON SPACE RUN — SAME PAGE GAME LAUNCHER
   ========================================================= */

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


    /*
     * OPEN GAME
     */

    function openGame() {

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

    }


    /*
     * CLOSE GAME
     */

    function closeGame() {

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

        /*
         * Remove iframe source to stop
         * the game completely.
         */

        frame.removeAttribute("src");

    }


    /*
     * Open
     */

    openBtn.addEventListener(
        "click",
        openGame
    );


    /*
     * Close
     */

    closeBtn.addEventListener(
        "click",
        closeGame
    );


    /*
     * Close by clicking outside
     */

    overlay.addEventListener(
        "click",
        event => {

            if (event.target === overlay) {
                closeGame();
            }

        }
    );


    /*
     * Close with ESC
     */

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


/* =========================================================
   SERVICES CARD ACTIVE STATE
   ========================================================= */

function selectCard(clickedCard) {

    if (!clickedCard) return;

    const allCards =
        document.querySelectorAll(".service-card");

    allCards.forEach(card => {

        card.classList.remove("active");

    });

    clickedCard.classList.add("active");

}


/* =========================================================
   SERVICES CARD — ARROW CLICK
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    const arrowButtons =
        document.querySelectorAll(".action-arrow");

    arrowButtons.forEach(button => {

        button.addEventListener("click", event => {

            /*
             * Prevent the arrow click from
             * triggering the card selection.
             */

            event.stopPropagation();

        });

    });

});