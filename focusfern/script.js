/**
 * Focus Fern
 * A cozy productivity timer.
 */

// --- Constants ---
const WORK_TIME_SECONDS = 25 * 60; // 25 minutes
const CANVAS_SIZE = 300;

// --- State ---
let state = {
    timeLeft: WORK_TIME_SECONDS,
    isActive: false,
    intervalId: null,
    plantSeed: null, // Initialized when timer starts
    growthStage: 0, // 0-100 progress
    isPeeking: false
};

// --- DOM Elements ---
const elements = {
    timerDisplay: document.getElementById('timer'),
    startBtn: document.getElementById('start-btn'),
    resetBtn: document.getElementById('reset-btn'),
    peekBtn: document.getElementById('peek-btn'),
    statusMsg: document.getElementById('status-msg'),
    canvas: document.getElementById('plant-canvas'),
    gardenGrid: document.getElementById('garden-grid')
};

const ctx = elements.canvas.getContext('2d');
// Disable anti-aliasing for pixel art look
ctx.imageSmoothingEnabled = false;

// --- Initialization ---
function init() {
    renderTimer();
    loadGarden();

    elements.startBtn.addEventListener('click', toggleTimer);
    elements.resetBtn.addEventListener('click', resetTimer);
    elements.peekBtn.addEventListener('click', peekAtFuture);

    // Initial draw
    clearCanvas();
    drawDirt();
}

// --- Timer Logic ---
function toggleTimer() {
    if (state.isActive) {
        pauseTimer();
    } else {
        startTimer();
    }
}

function startTimer() {
    if (state.timeLeft <= 0) return; // Already done

    state.isActive = true;
    elements.startBtn.textContent = "Pause";
    elements.resetBtn.textContent = "Give Up";
    elements.statusMsg.textContent = "Growing... Stay focused!";
    elements.peekBtn.disabled = false; // Enable peek when running

    // Initialize seed if starting fresh
    if (state.timeLeft === WORK_TIME_SECONDS) {
        state.plantSeed = Date.now();
        // Clear previous art
        clearCanvas();
        drawDirt();
        drawSeed(mulberry32(state.plantSeed)); // Fix: Pass RNG to drawSeed
    }

    // Clear any existing interval to prevent duplicates
    if (state.intervalId) clearInterval(state.intervalId);

    state.intervalId = setInterval(() => {
        // console.log("Tick"); // Optional debug
        state.timeLeft--;
        renderTimer();
        updatePlantGrowth(); // Checks isPeeking internally

        if (state.timeLeft <= 0) {
            completeSession();
        }
    }, 1000);
}

function pauseTimer() {
    state.isActive = false;
    clearInterval(state.intervalId);
    state.intervalId = null; // Clear ID
    elements.startBtn.textContent = "Resume";
    elements.statusMsg.textContent = "Growth paused.";
}

function resetTimer() {
    pauseTimer();

    // Random Consolation Messages
    const messages = [
        "It's okay, we can try again later.",
        "The plant will wait for you.",
        "Rest is important too.",
        "Don't worry, nature takes time.",
        "Small steps are still steps."
    ];
    const randomMsg = messages[Math.floor(Math.random() * messages.length)];

    state.timeLeft = WORK_TIME_SECONDS;
    state.plantSeed = null;
    state.growthStage = 0;
    state.isPeeking = false;

    elements.startBtn.textContent = "Start";
    elements.resetBtn.textContent = "Give Up";
    elements.peekBtn.disabled = true;
    elements.statusMsg.textContent = randomMsg;
    renderTimer();

    clearCanvas();
    drawDirt();
}

function completeSession() {
    pauseTimer();
    elements.startBtn.textContent = "Start";
    elements.statusMsg.textContent = "Harvested! Well done.";
    elements.peekBtn.disabled = true;

    // Add to garden
    saveToGarden();
    playCompletionSound();
}

function renderTimer() {
    const minutes = Math.floor(state.timeLeft / 60);
    const seconds = state.timeLeft % 60;
    elements.timerDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

// --- Visual & Growth Logic ---

// Simple PRNG to ensure deterministic plants based on seed
function mulberry32(a) {
    return function () {
        var t = a += 0x6D2B79F5;
        t = Math.imul(t ^ t >>> 15, t | 1);
        t ^= t + Math.imul(t ^ t >>> 7, t | 61);
        return ((t ^ t >>> 14) >>> 0) / 4294967296;
    }
}

function clearCanvas() {
    ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
}

function drawDirt() {
    // Pot / Dirt area
    ctx.fillStyle = "#8d6e63"; // Earthy brown
    // Draw a pixelated mound or pot top
    const bottomY = CANVAS_SIZE;
    const soilHeight = 20;

    // Pot rim
    ctx.fillRect(CANVAS_SIZE / 2 - 40, bottomY - soilHeight, 80, soilHeight);

    // Decoration on pot
    ctx.fillStyle = "#5d4037"; // Darker brown
    ctx.fillRect(CANVAS_SIZE / 2 - 35, bottomY - soilHeight + 5, 70, 5);
}

function drawSeed(rng) {
    // Randomize seed position slightly using the passed RNG
    const offset = (rng() - 0.5) * 10;

    ctx.fillStyle = "#4e342e";
    const x = CANVAS_SIZE / 2 - 4 + offset;
    const y = CANVAS_SIZE - 28;

    // Pixel seed shape
    ctx.fillRect(x, y, 6, 6);
    ctx.fillStyle = "#a1887f"; // Highlight
    ctx.fillRect(x + 1, y + 1, 2, 2);
}

function updatePlantGrowth(forcedStage = null) {
    if (state.isPeeking && forcedStage === null) return; // Don't overwrite peek view unless forced

    // 1. Calculate Progress
    let progress = 0;

    if (forcedStage !== null) {
        // If peeking, we want full growth (1.0)
        progress = forcedStage === 4 ? 1.0 : 0;
    } else {
        const totalTime = WORK_TIME_SECONDS;
        const elapsed = totalTime - state.timeLeft;
        progress = elapsed / totalTime; // 0.0 to 1.0
    }

    // 2. Setup Canvas & PRNG
    clearCanvas();
    const prng = mulberry32(state.plantSeed);

    drawDirt();

    // 3. Draw based on Progress
    // Seed Stage (First 5%)
    if (progress < 0.05) {
        drawSeed(prng);
    } else {
        // Continuous Growth Scaling
        // We want the plant to start small and get MASSIVE (touching edges).

        // Structure Parameters mapped to Progress

        // Depth: Needs to be deep to fill volume
        let maxDepth = 2;
        if (progress > 0.1) maxDepth = 3;
        if (progress > 0.2) maxDepth = 4;
        if (progress > 0.35) maxDepth = 5;
        if (progress > 0.5) maxDepth = 6;
        if (progress > 0.7) maxDepth = 7;
        if (progress > 0.85) maxDepth = 8;

        // Size: Scaling to reach top and sides
        const baseLen = 20 + (progress * 40);

        // Width: Thicken significantly
        const baseWidth = 4 + (progress * 18);

        const startX = CANVAS_SIZE / 2;
        const startY = CANVAS_SIZE - 5;

        const plantPalette = generatePalette(prng);

        // MULTI-STEM LOGIC for MAXIMUM WIDTH
        // If the plant is very developed (> 80%), spawn side trunks to ensure it fills the width
        if (progress > 0.8) {
            // Center Stem
            drawBranch(startX, startY, baseLen, -Math.PI / 2, 0, maxDepth, baseWidth, prng, plantPalette, progress);

            // Left Stem (Angled)
            drawBranch(startX, startY, baseLen * 0.9, -Math.PI / 2 - 0.5, 0, maxDepth - 1, baseWidth * 0.9, prng, plantPalette, progress);

            // Right Stem (Angled)
            drawBranch(startX, startY, baseLen * 0.9, -Math.PI / 2 + 0.5, 0, maxDepth - 1, baseWidth * 0.9, prng, plantPalette, progress);
        } else {
            // Standard Single Stem
            const branchLen = baseLen + (prng() * 10);
            drawBranch(startX, startY, branchLen, -Math.PI / 2, 0, maxDepth, baseWidth, prng, plantPalette, progress);
        }
    }
}

function peekAtFuture() {
    // Show fully grown plant (Stage 4) for 5 seconds
    if (state.isPeeking || !state.plantSeed) return;

    state.isPeeking = true;
    elements.peekBtn.disabled = true;
    elements.peekBtn.textContent = "Peeking...";

    updatePlantGrowth(4); // Force Stage 4

    setTimeout(() => {
        state.isPeeking = false;
        elements.peekBtn.disabled = false;
        elements.peekBtn.textContent = "Peek";
        updatePlantGrowth(); // Revert to regular time-based growth
    }, 5000);
}

function generatePalette(rng) {
    // Randomize greens
    const greens = [
        ["#2e7d32", "#4caf50", "#81c784"], // Forest
        ["#1b5e20", "#388e3c", "#66bb6a"], // Deep
        ["#33691e", "#689f38", "#aed581"], // Olive
    ];
    const flowerColors = ["#f48fb1", "#ce93d8", "#fff59d", "#ffcc80", "#80cbc4"];

    const greenSet = greens[Math.floor(rng() * greens.length)];
    const flowerColor = flowerColors[Math.floor(rng() * flowerColors.length)];

    return {
        stem: greenSet[0],
        leaf: greenSet[1],
        highlight: greenSet[2],
        flower: flowerColor
    };
}

function drawBranch(x, y, len, angle, depth, maxDepth, width, rng, palette, progress) {
    // Coordinates
    const endX = x + len * Math.cos(angle);
    const endY = y + len * Math.sin(angle);

    // Draw Segment
    ctx.strokeStyle = palette.stem;
    ctx.lineWidth = width;
    ctx.beginPath();
    ctx.moveTo(Math.floor(x), Math.floor(y));
    ctx.lineTo(Math.floor(endX), Math.floor(endY));
    ctx.stroke();

    // Leaf generation (More leaves as it matures)
    // Scale leaf chance by progress
    if (depth > 1) {
        const leafChance = 0.3 + (progress * 0.4); // 30% -> 70% chance
        if (rng() < leafChance) {
            drawLeaf(endX, endY, angle + (Math.PI / 4), palette.leaf, rng);
        }
        if (rng() < leafChance) {
            drawLeaf(endX, endY, angle - (Math.PI / 4), palette.leaf, rng);
        }
    }

    // Recursion stop
    if (depth >= maxDepth) {
        // Draw Flower at tips if near completion (> 90%)
        if (progress > 0.9 && rng() > 0.5) {
            drawFlower(endX, endY, palette.flower, rng);
        }
        return;
    }

    // recursive call
    // Decay length less so it reaches further (0.9) - KEEPS SIZE HIGH
    const subLen = len * 0.9;
    const subWidth = Math.max(1, width * 0.7); // Tapering

    // 2 to 5 branches for CHAOTIC LUSHNESS
    const branchCount = Math.floor(rng() * 4) + 2;

    for (let i = 0; i < branchCount; i++) {
        // Random angle offset
        // Wide spread to hit left/right edges (1.7 radians is nearly 100 degrees)
        const variance = 1.7;
        const newAngle = angle + (rng() * variance - (variance / 2));

        drawBranch(endX, endY, subLen, newAngle, depth + 1, maxDepth, subWidth, rng, palette, progress);
    }
}

function drawLeaf(x, y, angle, color, rng) {
    // Small pixel cluster
    const size = 3 + (rng() * 3);
    const tipX = x + size * Math.cos(angle);
    const tipY = y + size * Math.sin(angle);

    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, size, 0, Math.PI * 2); // Simplified leaf as circle for pixelation effect
    ctx.fill();

    // Or pixel rects for cleaner look
    // ctx.fillRect(x, y, 4, 4);
}

function drawFlower(x, y, color, rng) {
    ctx.fillStyle = color;
    // Cross shape
    ctx.fillRect(x - 2, y - 2, 5, 5); // Center
    ctx.fillStyle = "#fff"; // Sparkle center
    ctx.fillRect(x, y, 1, 1);
}

// --- Garden Persistence ---
function saveToGarden() {
    const dataUrl = elements.canvas.toDataURL();
    const gardenItem = {
        id: Date.now(),
        date: new Date().toLocaleDateString(),
        image: dataUrl
    };

    const garden = getGardenData();
    garden.push(gardenItem);
    localStorage.setItem('focusFernGarden', JSON.stringify(garden));

    addGardenItemToDOM(gardenItem);
}

function loadGarden() {
    const garden = getGardenData();
    garden.forEach(item => addGardenItemToDOM(item));
}

function getGardenData() {
    const data = localStorage.getItem('focusFernGarden');
    return data ? JSON.parse(data) : [];
}

function addGardenItemToDOM(item) {
    const div = document.createElement('div');
    div.className = 'garden-item';
    div.dataset.date = item.date;

    const img = document.createElement('img');
    img.src = item.image;

    div.appendChild(img);
    elements.gardenGrid.prepend(div); // Newest first
}

// --- Audio ---
function playCompletionSound() {
    // Simple oscillator beep for "retro" feel
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;

    const audioCtx = new AudioContext();
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    oscillator.type = 'square';
    oscillator.frequency.setValueAtTime(440, audioCtx.currentTime); // A4
    oscillator.frequency.setValueAtTime(880, audioCtx.currentTime + 0.1); // A5

    gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.00001, audioCtx.currentTime + 0.5);

    oscillator.start();
    oscillator.stop(audioCtx.currentTime + 0.5);
}

// Start app
init();
