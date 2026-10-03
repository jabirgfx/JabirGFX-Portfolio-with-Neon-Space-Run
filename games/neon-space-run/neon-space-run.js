/* =========================================================
   JABIRGFX — NEON SPACE RUN
   Canvas Space Game
   ========================================================= */

(() => {

    "use strict";

    /* =====================================================
       ELEMENTS
       ===================================================== */

    const canvas = document.getElementById("nsrCanvas");
    const ctx = canvas.getContext("2d");

    const scoreElement = document.getElementById("nsrScore");
    const bestElement = document.getElementById("nsrBest");
    const livesElement = document.getElementById("nsrLives");

    const startScreen = document.getElementById("nsrStartScreen");
    const pauseScreen = document.getElementById("nsrPauseScreen");
    const gameOverScreen = document.getElementById("nsrGameOver");

    const startButton = document.getElementById("nsrStart");
    const restartButton = document.getElementById("nsrRestart");
    const resumeButton = document.getElementById("nsrResume");

    const pauseButton = document.getElementById("nsrPause");
    const soundButton = document.getElementById("nsrSound");

    const finalScore = document.getElementById("nsrFinalScore");
    const newBestElement = document.getElementById("nsrNewBest");


    /* =====================================================
       CANVAS
       ===================================================== */

    let width = 0;
    let height = 0;
    let dpr = 1;

    // Performance profile: keep desktop visuals rich, reduce GPU work on mobile.
    const isMobile = /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent) ||
        window.matchMedia("(max-width: 700px)").matches;
    const performanceMode = isMobile ? "mobile" : "desktop";
    const QUALITY = {
        maxDpr: isMobile ? 1.25 : 2,
        particleScale: isMobile ? 0.55 : 1,
        starsMin: isMobile ? 45 : 80,
        starsDivisor: isMobile ? 10000 : 7000,
        shadows: !isMobile,
        objectGradients: !isMobile,
        backgroundGlow: !isMobile
    };

    let backgroundGradient = null;
    let backgroundGlow = null;
    let touchRect = null;
    let shipGradient = null;


    function resizeCanvas() {

        const rect = canvas.getBoundingClientRect();

        width = rect.width;
        height = rect.height;

        dpr = Math.min(window.devicePixelRatio || 1, QUALITY.maxDpr);

        canvas.width = Math.floor(width * dpr);
        canvas.height = Math.floor(height * dpr);

        ctx.setTransform(
            dpr,
            0,
            0,
            dpr,
            0,
            0
        );

        // Cache static gradients; creating gradients every frame is expensive on mobile.
        backgroundGradient = ctx.createLinearGradient(0, 0, 0, height);
        backgroundGradient.addColorStop(0, "#02050c");
        backgroundGradient.addColorStop(0.55, "#05091a");
        backgroundGradient.addColorStop(1, "#08051b");

        backgroundGlow = QUALITY.backgroundGlow ? ctx.createRadialGradient(
            width / 2, height * 0.72, 0,
            width / 2, height * 0.72, width * 0.65
        ) : null;
        if (backgroundGlow) {
            backgroundGlow.addColorStop(0, "rgba(94,45,255,0.13)");
            backgroundGlow.addColorStop(1, "rgba(0,0,0,0)");
        }

        shipGradient = ctx.createLinearGradient(0, -30, 0, 25);
        shipGradient.addColorStop(0, "#e8f7ff");
        shipGradient.addColorStop(0.35, "#aab7d2");
        shipGradient.addColorStop(0.7, "#53617c");
        shipGradient.addColorStop(1, "#202a3d");

        touchRect = rect;
    }

    window.addEventListener("resize", resizeCanvas);

    resizeCanvas();


    /* =====================================================
       GAME STATE
       ===================================================== */

    let gameRunning = false;
    let paused = false;

    let score = 0;
    let lives = 3;

    let bestScore = Number(
        localStorage.getItem("jabirgfxNeonSpaceRunBest") || 0
    );

    let gameTime = 0;

    let baseSpeed = 2.7;

    let spawnTimer = 0;
    let particleTimer = 0;

    let lastTime = 0;

    let soundEnabled = true;

    bestElement.textContent = bestScore;


    /* =====================================================
       PLAYER
       ===================================================== */

    const player = {

        x: 0,
        y: 0,

        width: 42,
        height: 58,

        targetX: 0,

        speed: 8,

        tilt: 0,

        hitTimer: 0
    };


    /* =====================================================
       OBJECT ARRAYS
       ===================================================== */

    let objects = [];
    let particles = [];
    let stars = [];


    /* =====================================================
       RANDOM
       ===================================================== */

    function random(min, max) {

        return Math.random() * (max - min) + min;
    }

    function randomInt(min, max) {

        return Math.floor(random(min, max + 1));
    }


    /* =====================================================
       STARS
       ===================================================== */

    function createStars() {

        stars = [];

        const count = Math.max(
            QUALITY.starsMin,
            Math.floor(width * height / QUALITY.starsDivisor)
        );

        for (let i = 0; i < count; i++) {

            stars.push({

                x: random(0, width),

                y: random(0, height),

                size: random(0.5, 1.8),

                speed: random(0.15, 0.7),

                alpha: random(0.25, 0.9)
            });
        }
    }


    /* =====================================================
       PLAYER POSITION
       ===================================================== */

    function resetPlayer() {

        player.x = width / 2;

        player.targetX = width / 2;

        player.y = height - 85;

        player.hitTimer = 0;

        player.tilt = 0;
    }


    /* =====================================================
       GAME RESET
       ===================================================== */

    function resetGame() {

        score = 0;

        lives = 3;

        gameTime = 0;

        baseSpeed = 2.7;

        spawnTimer = 0;

        particleTimer = 0;

        objects = [];

        particles = [];

        resetPlayer();

        updateHUD();

        createStars();
    }


    /* =====================================================
       HUD
       ===================================================== */

    function updateHUD() {

        scoreElement.textContent = score;

        bestElement.textContent = Math.max(
            bestScore,
            score
        );

        if (lives === 3) {

            livesElement.textContent = "❤️ ❤️ ❤️";

        } else if (lives === 2) {

            livesElement.textContent = "❤️ ❤️ 🖤";

        } else if (lives === 1) {

            livesElement.textContent = "❤️ 🖤 🖤";

        } else {

            livesElement.textContent = "🖤 🖤 🖤";
        }
    }


    /* =====================================================
       OBJECT CREATION
       ===================================================== */

    function spawnObject() {

        const asteroidChance = Math.min(
            0.30 + gameTime / 100000,
            0.42
        );

        const roll = Math.random();

        let type;

        if (roll < asteroidChance) {

            type = "asteroid";

        } else if (roll < 0.67) {

            type = "purple";

        } else {

            type = "blue";
        }


        const size = type === "asteroid"
            ? random(26, 45)
            : random(15, 24);


        objects.push({

            type,

            x: random(
                size + 10,
                width - size - 10
            ),

            y: -size - 20,

            size,

            rotation: random(0, Math.PI * 2),

            rotationSpeed: random(-0.04, 0.04),

            speed:
                baseSpeed *
                random(0.78, 1.25),

            pulse: random(0, Math.PI * 2)
        });
    }


    /* =====================================================
       PARTICLES
       ===================================================== */

    function createParticle(
        x,
        y,
        type = "purple",
        amount = 8
    ) {

        amount = Math.max(1, Math.round(amount * QUALITY.particleScale));
        const MAX_PARTICLES = isMobile ? 110 : 220;
        if (particles.length >= MAX_PARTICLES) return;
        amount = Math.min(amount, MAX_PARTICLES - particles.length);

        for (let i = 0; i < amount; i++) {

            particles.push({

                x,

                y,

                vx: random(-2.5, 2.5),

                vy: random(-2.8, 2.8),

                size: random(1, 3.5),

                life: 1,

                decay: random(0.018, 0.04),

                type
            });
        }
    }


    function updateParticles(delta) {

        for (let i = particles.length - 1; i >= 0; i--) {

            const p = particles[i];

            p.x += p.vx * delta * 60;

            p.y += p.vy * delta * 60;

            p.life -= p.decay * delta * 60;

            p.size *= 0.992;

            if (p.life <= 0) {

                particles.splice(i, 1);
            }
        }
    }


    /* =====================================================
       DRAW PARTICLES
       ===================================================== */

    function drawParticles() {

        for (const p of particles) {

            let color;

            if (p.type === "blue") {

                color = `rgba(37,184,255,${p.life})`;

            } else if (p.type === "red") {

                color = `rgba(255,80,100,${p.life})`;

            } else if (p.type === "white") {

                color = `rgba(255,255,255,${p.life})`;

            } else {

                color = `rgba(154,76,255,${p.life})`;
            }

            ctx.beginPath();

            ctx.arc(
                p.x,
                p.y,
                p.size,
                0,
                Math.PI * 2
            );

            ctx.fillStyle = color;

            if (QUALITY.shadows) {
                ctx.shadowBlur = 12;
                ctx.shadowColor = color;
            }
            ctx.fill();
            if (QUALITY.shadows) ctx.shadowBlur = 0;
        }
    }


    /* =====================================================
       DRAW STARS
       ===================================================== */

    function drawStars(delta) {

        for (const star of stars) {

            star.y += star.speed * delta * 60;

            if (star.y > height + 5) {

                star.y = -5;

                star.x = random(0, width);
            }

            ctx.beginPath();

            ctx.arc(
                star.x,
                star.y,
                star.size,
                0,
                Math.PI * 2
            );

            ctx.fillStyle =
                `rgba(190,210,255,${star.alpha})`;

            ctx.fill();
        }
    }


    /* =====================================================
       DRAW BACKGROUND
       ===================================================== */

    function drawBackground() {

        ctx.fillStyle = backgroundGradient;
        ctx.fillRect(0, 0, width, height);

        if (backgroundGlow) {
            ctx.fillStyle = backgroundGlow;
            ctx.fillRect(0, 0, width, height);
        }

        ctx.save();
        ctx.globalAlpha = 0.08;
        ctx.strokeStyle = "#6478ff";
        ctx.lineWidth = 1;
        const spacing = 80;
        for (let y = height % spacing; y < height; y += spacing) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(width, y);
            ctx.stroke();
        }
        ctx.restore();
    }

    /* =====================================================
       DRAW ENERGY
       ===================================================== */

    function drawEnergy(obj) {

        const pulse = Math.sin(obj.pulse) * 2;
        const radius = obj.size + pulse;
        const purple = obj.type === "purple";

        if (QUALITY.objectGradients) {
            const gradient = ctx.createRadialGradient(
                obj.x, obj.y, 0, obj.x, obj.y, radius * 2
            );
            if (purple) {
                gradient.addColorStop(0, "rgba(210,130,255,1)");
                gradient.addColorStop(0.25, "rgba(157,70,255,0.95)");
                gradient.addColorStop(1, "rgba(120,30,255,0)");
            } else {
                gradient.addColorStop(0, "rgba(150,240,255,1)");
                gradient.addColorStop(0.25, "rgba(37,184,255,0.95)");
                gradient.addColorStop(1, "rgba(0,130,255,0)");
            }
            ctx.fillStyle = gradient;
        } else {
            ctx.fillStyle = purple ? "rgba(157,70,255,0.72)" : "rgba(37,184,255,0.72)";
        }

        ctx.beginPath();
        ctx.arc(obj.x, obj.y, radius * 2, 0, Math.PI * 2);
        ctx.fill();

        ctx.save();
        ctx.translate(obj.x, obj.y);
        ctx.rotate(obj.rotation);
        ctx.beginPath();
        ctx.moveTo(0, -obj.size);
        ctx.lineTo(obj.size * 0.62, 0);
        ctx.lineTo(0, obj.size);
        ctx.lineTo(-obj.size * 0.62, 0);
        ctx.closePath();
        ctx.fillStyle = purple ? "#b96cff" : "#39d6ff";

        if (QUALITY.shadows) {
            ctx.shadowBlur = 22;
            ctx.shadowColor = purple ? "#a13cff" : "#00aaff";
        }
        ctx.fill();
        if (QUALITY.shadows) ctx.shadowBlur = 0;
        ctx.restore();
    }

    /* =====================================================
       DRAW ASTEROID
       ===================================================== */

    function drawAsteroid(obj) {

        ctx.save();

        ctx.translate(
            obj.x,
            obj.y
        );

        ctx.rotate(
            obj.rotation
        );

        ctx.beginPath();

        const points = 9;

        for (let i = 0; i < points; i++) {

            const angle =
                (Math.PI * 2 / points) * i;

            const radius =
                obj.size *
                randomAsteroidRadius(i);

            const x =
                Math.cos(angle) * radius;

            const y =
                Math.sin(angle) * radius;

            if (i === 0) {

                ctx.moveTo(x, y);

            } else {

                ctx.lineTo(x, y);
            }
        }

        ctx.closePath();

        const gradient = QUALITY.objectGradients ? ctx.createRadialGradient(
            -obj.size * 0.3, -obj.size * 0.3, 2, 0, 0, obj.size
        ) : null;

        if (gradient) gradient.addColorStop(0, "#7d8799");

        if (gradient) gradient.addColorStop(0.6, "#303847");

        if (gradient) gradient.addColorStop(1, "#111721");

        ctx.fillStyle = gradient || "#303847";

        if (QUALITY.shadows) {
            ctx.shadowBlur = 12;
            ctx.shadowColor = "rgba(120,130,150,0.35)";
        }
        ctx.fill();
        if (QUALITY.shadows) ctx.shadowBlur = 0;


        /* Craters */

        ctx.fillStyle =
            "rgba(0,0,0,0.3)";

        ctx.beginPath();

        ctx.arc(
            -obj.size * 0.28,
            -obj.size * 0.18,
            obj.size * 0.17,
            0,
            Math.PI * 2
        );

        ctx.fill();

        ctx.beginPath();

        ctx.arc(
            obj.size * 0.28,
            obj.size * 0.22,
            obj.size * 0.12,
            0,
            Math.PI * 2
        );

        ctx.fill();

        ctx.restore();
    }


    function randomAsteroidRadius(i) {

        const pattern = [
            1.0,
            0.83,
            1.05,
            0.78,
            1.0,
            0.87,
            1.08,
            0.82,
            1.0
        ];

        return pattern[i % pattern.length];
    }


    /* =====================================================
       DRAW SHIP
       ===================================================== */

    function drawPlayer() {

        if (player.hitTimer > 0) {

            if (
                Math.floor(
                    player.hitTimer * 15
                ) % 2 === 0
            ) {

                return;
            }
        }

        ctx.save();

        ctx.translate(
            player.x,
            player.y
        );

        ctx.rotate(
            player.tilt
        );


        /* Engine glow */

        const engineGradient =
            ctx.createRadialGradient(
                0,
                player.height * 0.47,
                0,
                0,
                player.height * 0.47,
                30
            );

        engineGradient.addColorStop(
            0,
            "rgba(50,210,255,0.95)"
        );

        engineGradient.addColorStop(
            0.3,
            "rgba(105,55,255,0.7)"
        );

        engineGradient.addColorStop(
            1,
            "rgba(70,40,255,0)"
        );

        ctx.fillStyle = engineGradient;

        ctx.beginPath();

        ctx.arc(
            0,
            player.height * 0.42,
            30,
            0,
            Math.PI * 2
        );

        ctx.fill();


        /* Flame */

        const flameSize =
            random(15, 25);

        ctx.beginPath();

        ctx.moveTo(
            -7,
            20
        );

        ctx.lineTo(
            0,
            20 + flameSize
        );

        ctx.lineTo(
            7,
            20
        );

        ctx.closePath();

        ctx.fillStyle =
            "#43d9ff";

        if (QUALITY.shadows) {
            ctx.shadowBlur = 20;
            ctx.shadowColor = "#25b8ff";
        }
        ctx.fill();
        if (QUALITY.shadows) ctx.shadowBlur = 0;


        /* Ship body */

        const shipFill = shipGradient;

        ctx.beginPath();

        ctx.moveTo(
            0,
            -30
        );

        ctx.lineTo(
            17,
            17
        );

        ctx.lineTo(
            7,
            14
        );

        ctx.lineTo(
            0,
            25
        );

        ctx.lineTo(
            -7,
            14
        );

        ctx.lineTo(
            -17,
            17
        );

        ctx.closePath();

        ctx.fillStyle = shipFill;

        if (QUALITY.shadows) {
            ctx.shadowBlur = 15;
            ctx.shadowColor = "rgba(96,105,255,0.7)";
        }
        ctx.fill();
        if (QUALITY.shadows) ctx.shadowBlur = 0;


        /* Wings */

        ctx.beginPath();

        ctx.moveTo(
            -11,
            5
        );

        ctx.lineTo(
            -25,
            19
        );

        ctx.lineTo(
            -9,
            15
        );

        ctx.closePath();

        ctx.fillStyle =
            "#6c4cff";

        ctx.fill();

        ctx.beginPath();

        ctx.moveTo(
            11,
            5
        );

        ctx.lineTo(
            25,
            19
        );

        ctx.lineTo(
            9,
            15
        );

        ctx.closePath();

        ctx.fill();


        /* Cockpit */

        ctx.beginPath();

        ctx.ellipse(
            0,
            -9,
            7,
            11,
            0,
            0,
            Math.PI * 2
        );

        const cockpitGradient =
            ctx.createLinearGradient(
                -5,
                -17,
                5,
                3
            );

        cockpitGradient.addColorStop(
            0,
            "#c8f7ff"
        );

        cockpitGradient.addColorStop(
            0.5,
            "#25b8ff"
        );

        cockpitGradient.addColorStop(
            1,
            "#4b43ff"
        );

        ctx.fillStyle =
            cockpitGradient;

        if (QUALITY.shadows) {
            ctx.shadowBlur = 12;
            ctx.shadowColor = "#25b8ff";
        }
        ctx.fill();

        ctx.restore();
    }


    /* =====================================================
       COLLISION
       ===================================================== */

    function collision(
        a,
        b
    ) {

        const dx =
            a.x - b.x;

        const dy =
            a.y - b.y;

        const distance =
            Math.sqrt(
                dx * dx +
                dy * dy
            );

        return distance <
            a.radius +
            b.radius;
    }


    /* =====================================================
       OBJECT UPDATE
       ===================================================== */

    function updateObjects(delta) {

        for (
            let i = objects.length - 1;
            i >= 0;
            i--
        ) {

            const obj = objects[i];

            obj.y +=
                obj.speed *
                delta *
                60;

            obj.rotation +=
                obj.rotationSpeed *
                delta *
                60;

            obj.pulse +=
                0.08 *
                delta *
                60;


            const playerHitbox = {

                x: player.x,

                y: player.y,

                radius: 21
            };

            const objectHitbox = {

                x: obj.x,

                y: obj.y,

                radius:
                    obj.type === "asteroid"
                        ? obj.size * 0.72
                        : obj.size * 0.85
            };


            if (
                collision(
                    playerHitbox,
                    objectHitbox
                )
            ) {

                handleCollision(
                    obj,
                    i
                );

                continue;
            }


            if (
                obj.y >
                height + obj.size * 2
            ) {

                objects.splice(i, 1);
            }
        }
    }


    /* =====================================================
       COLLISION HANDLER
       ===================================================== */

    function handleCollision(
        obj,
        index
    ) {

        objects.splice(
            index,
            1
        );


        if (obj.type === "purple") {

            score += 10;

            createParticle(
                obj.x,
                obj.y,
                "purple",
                20
            );

            playSound(
                "collect",
                540
            );


        } else if (obj.type === "blue") {

            score += 20;

            createParticle(
                obj.x,
                obj.y,
                "blue",
                24
            );

            playSound(
                "collect",
                720
            );


        } else {

            lives--;

            player.hitTimer = 1.1;

            createParticle(
                obj.x,
                obj.y,
                "red",
                32
            );

            createParticle(
                obj.x,
                obj.y,
                "white",
                15
            );

            playSound(
                "hit",
                110
            );


            if (lives <= 0) {

                endGame();

                return;
            }
        }

        updateHUD();
    }


    /* =====================================================
       PLAYER MOVEMENT
       ===================================================== */

    let leftPressed = false;
    let rightPressed = false;


    function updatePlayer(delta) {

        if (leftPressed) {

            player.targetX -=
                player.speed *
                delta *
                60;
        }

        if (rightPressed) {

            player.targetX +=
                player.speed *
                delta *
                60;
        }


        const maxX =
            width - player.width;

        const minX =
            player.width;


        player.targetX =
            Math.max(
                minX,
                Math.min(
                    maxX,
                    player.targetX
                )
            );


        const difference =
            player.targetX -
            player.x;


        player.x +=
            difference *
            Math.min(
                1,
                delta * 12
            );


        player.tilt =
            Math.max(
                -0.18,
                Math.min(
                    0.18,
                    difference * 0.008
                )
            );


        if (player.hitTimer > 0) {

            player.hitTimer -=
                delta;
        }
    }


    /* =====================================================
       DIFFICULTY
       ===================================================== */

    function updateDifficulty(delta) {

        gameTime +=
            delta * 1000;


        baseSpeed =
            2.7 +
            Math.min(
                gameTime / 30000,
                4.5
            );
    }


    /* =====================================================
       SPAWNING
       ===================================================== */

    function updateSpawning(delta) {

        spawnTimer -=
            delta * 1000;


        const spawnInterval =
            Math.max(
                360,
                850 -
                gameTime * 0.0012
            );


        if (spawnTimer <= 0) {

            spawnObject();

            spawnTimer =
                spawnInterval *
                random(0.72, 1.08);
        }
    }


    /* =====================================================
       AUDIO
       ===================================================== */

    let audioContext = null;


    function getAudioContext() {

        if (!audioContext) {

            const AudioCtx =
                window.AudioContext ||
                window.webkitAudioContext;

            if (AudioCtx) {

                audioContext =
                    new AudioCtx();
            }
        }

        return audioContext;
    }


    function playSound(
        type,
        frequency
    ) {

        if (!soundEnabled) {
            return;
        }

        const audio =
            getAudioContext();

        if (!audio) {
            return;
        }


        if (
            audio.state ===
            "suspended"
        ) {

            audio.resume();
        }


        const oscillator =
            audio.createOscillator();

        const gain =
            audio.createGain();


        oscillator.type =
            type === "hit"
                ? "sawtooth"
                : "sine";


        oscillator.frequency.setValueAtTime(
            frequency,
            audio.currentTime
        );


        if (type === "collect") {

            oscillator.frequency.exponentialRampToValueAtTime(
                frequency * 1.4,
                audio.currentTime + 0.12
            );

        } else {

            oscillator.frequency.exponentialRampToValueAtTime(
                55,
                audio.currentTime + 0.25
            );
        }


        gain.gain.setValueAtTime(
            0.0001,
            audio.currentTime
        );

        gain.gain.exponentialRampToValueAtTime(
            0.08,
            audio.currentTime + 0.01
        );

        gain.gain.exponentialRampToValueAtTime(
            0.0001,
            audio.currentTime +
            (
                type === "hit"
                    ? 0.28
                    : 0.14
            )
        );


        oscillator.connect(gain);

        gain.connect(
            audio.destination
        );


        oscillator.start();

        oscillator.stop(
            audio.currentTime +
            (
                type === "hit"
                    ? 0.28
                    : 0.14
            )
        );
    }


    /* =====================================================
       DRAW OBJECTS
       ===================================================== */

    function drawObjects() {

        for (const obj of objects) {

            if (
                obj.type === "asteroid"
            ) {

                drawAsteroid(obj);

            } else {

                drawEnergy(obj);
            }
        }
    }


    /* =====================================================
       GAME LOOP
       ===================================================== */

    function gameLoop(timestamp) {

        if (document.hidden) {
            lastTime = timestamp;
            requestAnimationFrame(gameLoop);
            return;
        }

        if (!lastTime) {

            lastTime =
                timestamp;
        }


        const delta =
            Math.min(
                (timestamp - lastTime) / 1000,
                0.033
            );


        lastTime =
            timestamp;


        ctx.shadowBlur = 0;
        drawBackground();

        drawStars(delta);


        if (gameRunning && !paused) {

            updateDifficulty(delta);

            updatePlayer(delta);

            updateSpawning(delta);

            updateObjects(delta);

            updateParticles(delta);
        }


        drawObjects();

        drawParticles();

        drawPlayer();


        requestAnimationFrame(
            gameLoop
        );
    }


    requestAnimationFrame(
        gameLoop
    );


    /* =====================================================
       START GAME
       ===================================================== */

    function startGame() {

        resetGame();

        gameRunning = true;

        paused = false;

        startScreen.classList.remove(
            "nsr-active"
        );

        pauseScreen.classList.remove(
            "nsr-active"
        );

        gameOverScreen.classList.remove(
            "nsr-active"
        );

        pauseButton.textContent =
            "❚❚";

        lastTime =
            performance.now();

        playSound(
            "collect",
            440
        );
    }


    /* =====================================================
       PAUSE
       ===================================================== */

    function togglePause() {

        if (!gameRunning) {
            return;
        }

        paused =
            !paused;


        if (paused) {

            pauseScreen.classList.add(
                "nsr-active"
            );

            pauseButton.textContent =
                "▶";

        } else {

            pauseScreen.classList.remove(
                "nsr-active"
            );

            pauseButton.textContent =
                "❚❚";

            lastTime =
                performance.now();
        }
    }


    /* =====================================================
       END GAME
       ===================================================== */

    function endGame() {

        gameRunning = false;

        paused = false;

        finalScore.textContent =
            score;


        const isNewBest =
            score > bestScore;


        if (isNewBest) {

            bestScore =
                score;

            localStorage.setItem(
                "jabirgfxNeonSpaceRunBest",
                bestScore
            );

            newBestElement.classList.add(
                "nsr-show"
            );

        } else {

            newBestElement.classList.remove(
                "nsr-show"
            );
        }


        updateHUD();

        gameOverScreen.classList.add(
            "nsr-active"
        );

        pauseButton.textContent =
            "❚❚";


        playSound(
            "hit",
            160
        );
    }


    /* =====================================================
       BUTTON EVENTS
       ===================================================== */

    startButton.addEventListener(
        "click",
        startGame
    );

    restartButton.addEventListener(
        "click",
        startGame
    );

    pauseButton.addEventListener(
        "click",
        togglePause
    );

    resumeButton.addEventListener(
        "click",
        togglePause
    );


    soundButton.addEventListener(
        "click",
        () => {

            soundEnabled =
                !soundEnabled;

            soundButton.textContent =
                soundEnabled
                    ? "🔊"
                    : "🔇";

            if (soundEnabled) {

                playSound(
                    "collect",
                    500
                );
            }
        }
    );


    /* =====================================================
       KEYBOARD
       ===================================================== */

    window.addEventListener(
        "keydown",
        (event) => {

            if (
                event.key === "ArrowLeft" ||
                event.key.toLowerCase() === "a"
            ) {

                leftPressed = true;

                event.preventDefault();
            }


            if (
                event.key === "ArrowRight" ||
                event.key.toLowerCase() === "d"
            ) {

                rightPressed = true;

                event.preventDefault();
            }


            if (
                event.code === "Space" ||
                event.key.toLowerCase() === "p"
            ) {

                if (gameRunning) {

                    togglePause();
                }

                event.preventDefault();
            }
        }
    );


    window.addEventListener(
        "keyup",
        (event) => {

            if (
                event.key === "ArrowLeft" ||
                event.key.toLowerCase() === "a"
            ) {

                leftPressed = false;
            }


            if (
                event.key === "ArrowRight" ||
                event.key.toLowerCase() === "d"
            ) {

                rightPressed = false;
            }
        }
    );


    /* =====================================================
       MOBILE DRAG CONTROL
       ===================================================== */

    let pointerActive = false;


    function movePlayerToPointer(
        event
    ) {

        const rect = touchRect || canvas.getBoundingClientRect();


        const x =
            event.clientX -
            rect.left;


        player.targetX =
            Math.max(
                player.width,
                Math.min(
                    width - player.width,
                    x
                )
            );
    }


    canvas.addEventListener(
        "pointerdown",
        (event) => {

            pointerActive = true;

            canvas.setPointerCapture(
                event.pointerId
            );

            movePlayerToPointer(
                event
            );
        }
    );


    canvas.addEventListener(
        "pointermove",
        (event) => {

            if (!pointerActive) {
                return;
            }

            movePlayerToPointer(
                event
            );
        }
    );


    canvas.addEventListener(
        "pointerup",
        () => {

            pointerActive = false;
        }
    );


    canvas.addEventListener(
        "pointercancel",
        () => {

            pointerActive = false;
        }
    );


    /* =====================================================
       INITIALIZATION
       ===================================================== */

    resetGame();

})();