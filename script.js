// =========================================================
// MOBILE MENU
// =========================================================

const menu = document.querySelector(".menu-toggle");
const nav = document.querySelector(".nav");

menu?.addEventListener("click", () => {

    const open = nav.classList.toggle("open");

    menu.setAttribute("aria-expanded", open);

});


document.querySelectorAll(".nav a").forEach((link) => {

    link.addEventListener("click", () => {

        nav.classList.remove("open");

    });

});


// =========================================================
// FOOTER YEAR
// =========================================================

const year = document.getElementById("year");

if (year) {

    year.textContent = new Date().getFullYear();

}


// =========================================================
// DOWNLOAD CV
// =========================================================

function downloadCV(e) {

    e.preventDefault();

    window.location.href = "assets/JabirGFX-CV.pdf";

}


// =========================================================
// JABIRGFX LOADER
// =========================================================

document.addEventListener("DOMContentLoaded", function () {

    const loader = document.querySelector(".loader");

    if (!loader) return;

    setTimeout(function () {

        loader.classList.add("hide");

    }, 1200);

});


// =========================================================
// CUSTOM CURSOR
// =========================================================

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


// =========================================================
// ACTIVE NAV LINK ON SCROLL
// =========================================================

const navLinks = document.querySelectorAll(".nav a");
const sections = document.querySelectorAll("section[id]");


function updateActiveNav() {

    let current = "";


    sections.forEach(function (section) {

        const sectionTop = section.offsetTop - 180;
        const sectionHeight = section.offsetHeight;


        if (
            window.scrollY >= sectionTop &&
            window.scrollY < sectionTop + sectionHeight
        ) {

            current = section.getAttribute("id");

        }

    });


    navLinks.forEach(function (link) {

        link.classList.remove("active");


        if (link.getAttribute("href") === "#" + current) {

            link.classList.add("active");

        }

    });

}


// Scroll event

window.addEventListener("scroll", updateActiveNav);


// Run once when page loads

updateActiveNav();


// =========================================================
// SMOOTH SCROLL — NAV ONLY
// =========================================================

navLinks.forEach(function (link) {

    link.addEventListener("click", function (e) {

        const targetId = this.getAttribute("href");


        // Only handle internal navigation links

        if (!targetId || !targetId.startsWith("#")) {

            return;

        }


        const target = document.querySelector(targetId);


        if (!target) {

            return;

        }


        e.preventDefault();


        target.scrollIntoView({

            behavior: "smooth",
            block: "start"

        });

    });

});


// =========================================================
// SMOOTH SLIDING NAV UNDERLINE
// =========================================================

const navContainer = document.querySelector(".nav");
const navItems = document.querySelectorAll(".nav a");


if (navContainer && navItems.length) {


    // Create one underline

    const underline = document.createElement("span");

    underline.classList.add("nav-underline");

    navContainer.appendChild(underline);


    // Move underline

    function moveUnderline(link) {

        if (!link) return;


        const navRect = navContainer.getBoundingClientRect();
        const linkRect = link.getBoundingClientRect();


        underline.style.left =
            (linkRect.left - navRect.left) + "px";


        underline.style.width =
            linkRect.width + "px";

    }


    // Set initial position

    const activeLink =
        navContainer.querySelector("a.active") || navItems[0];


    moveUnderline(activeLink);


    // Click effect

    navItems.forEach(function (link) {

        link.addEventListener("click", function () {


            // Remove active from all

            navItems.forEach(function (item) {

                item.classList.remove("active");

            });


            // Add active to clicked link

            this.classList.add("active");


            // Slide underline

            moveUnderline(this);

        });

    });


    // Update on scroll

    window.addEventListener("scroll", function () {

        let current = "";


        document.querySelectorAll("section[id]").forEach(function (section) {

            const sectionTop = section.offsetTop - 180;

            const sectionBottom =
                sectionTop + section.offsetHeight;


            if (
                window.scrollY >= sectionTop &&
                window.scrollY < sectionBottom
            ) {

                current = section.id;

            }

        });


        if (current) {


            const activeSectionLink =
                navContainer.querySelector(
                    'a[href="#' + current + '"]'
                );


            if (activeSectionLink) {


                navItems.forEach(function (item) {

                    item.classList.remove("active");

                });


                activeSectionLink.classList.add("active");


                moveUnderline(activeSectionLink);

            }

        }

    });


    // Recalculate on resize

    window.addEventListener("resize", function () {

        const currentActive =
            navContainer.querySelector("a.active");


        moveUnderline(currentActive);

    });

}


// =========================================================
// FEATURED PROJECT CARDS
// =========================================================

document.addEventListener("DOMContentLoaded", () => {


    const cards = document.querySelectorAll(".project-card");


    if ("IntersectionObserver" in window) {


        const observer = new IntersectionObserver(
            (entries, obs) => {


                entries.forEach(entry => {


                    if (!entry.isIntersecting) return;


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
//
// IMPORTANT:
// Replace the link below with your actual Google Drive
// folder link.
//
// Example:
// https://drive.google.com/drive/folders/XXXXXXXXXXXX
//
// =========================================================

document.addEventListener("DOMContentLoaded", () => {


    const viewButton =
        document.querySelector(".view-projects-btn");


    if (!viewButton) return;


    // Your Google Drive folder

    const driveFolder =
        "https://drive.google.com/drive/folders/1n7PpImeK8QG2cMa15db6djOGnLK-K43A?usp=drive_link";


    viewButton.setAttribute("href", driveFolder);

    viewButton.setAttribute("target", "_blank");

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


    if (!openBtn || !closeBtn || !overlay || !frame) {

        return;

    }


    const gameURL =
        "games/neon-space-run/index.html";


    // =====================================================
    // OPEN GAME
    // =====================================================

    const openGame = () => {


        if (!frame.getAttribute("src")) {

            frame.setAttribute("src", gameURL);

        }


        overlay.classList.add("is-open");


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


        overlay.classList.remove("is-open");


        overlay.setAttribute(
            "aria-hidden",
            "true"
        );


        document.body.classList.remove(
            "nsr-game-lock"
        );


        // Remove iframe source so the game loop/audio
        // stops cleanly.

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


    // Close by clicking outside modal

    overlay.addEventListener(
        "click",
        (event) => {

            if (event.target === overlay) {

                closeGame();

            }

        }
    );


    // Close with ESC

    document.addEventListener(
        "keydown",
        (event) => {


            if (
                event.key === "Escape" &&
                overlay.classList.contains("is-open")
            ) {

                closeGame();

            }

        }
    );

});