// Select elements
const appTitle = document.getElementById('app-title');
const introImage = document.getElementById('intro-image');
const video1 = document.getElementById('video1');
const video2 = document.getElementById('video2');
const statusText = document.getElementById('status-text');
const emojiContainer = document.getElementById('emoji-container');

// State
let hasInteracted = false;
let emojiInterval = null;
let vibrationInterval = null;

// Messages
const MSG_IDLE = "Place your finger on screen to feed me";
const MSG_FEEDING = "Happy Feeding";
const MSG_CRYING = "Why you stopped, I cry";

// Emojis
const EMOJI_HEART = "❤️"; // Red Heart
const EMOJI_CRY = "😭";   // Loudly Crying Face
const EMOJIS_HEARTS = ["❤️", "💖", "💗", "💓", "💕"]; // Variety
const EMOJIS_CRY = ["😭", "😢", "😿", "💧", "💔"]; // Variety

// --- Helper Functions ---

function setStatusText(text) {
  statusText.textContent = text;
}

function getRandomEmoji(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function spawnEmoji(emojiArray) {
  const emojiEl = document.createElement('div');
  emojiEl.classList.add('emoji');
  emojiEl.textContent = getRandomEmoji(emojiArray);

  // Random horizontal position (5% to 95%)
  const leftPos = 5 + Math.random() * 90;
  emojiEl.style.left = `${leftPos}%`;

  // Random animation duration for variety
  const duration = 2 + Math.random() * 2; // 2s to 4s
  emojiEl.style.animationDuration = `${duration}s`;

  // Random horizontal drift (subtle sine wave effect via transform is hard in pure CSS keyframes without complex setup, 
  // so we'll just stick to straight up or slight random offset if needed, but simple vertical is often cleaner)

  emojiContainer.appendChild(emojiEl);

  // Cleanup after animation finishes
  setTimeout(() => {
    if (emojiEl.parentNode) {
      emojiEl.parentNode.removeChild(emojiEl);
    }
  }, duration * 1000);
}

function startEmojiFlow(type) {
  // Clear any existing flow
  if (emojiInterval) clearInterval(emojiInterval);

  const emojis = type === 'heart' ? EMOJIS_HEARTS : EMOJIS_CRY;
  const frequency = type === 'heart' ? 300 : 400; // Hearts appear slightly faster

  // Spawn immediately
  spawnEmoji(emojis);

  // Set interval
  emojiInterval = setInterval(() => {
    spawnEmoji(emojis);
  }, frequency);
}

function stopEmojiFlow() {
  if (emojiInterval) clearInterval(emojiInterval);
  emojiInterval = null;
}

function startVibration() {
  // Check for support
  if ("vibrate" in navigator) {
    // Pulse pattern: 50ms pulse, 150ms pause
    navigator.vibrate([20]);
    if (vibrationInterval) clearInterval(vibrationInterval);

    vibrationInterval = setInterval(() => {
      navigator.vibrate([15]); // Very subtle tick
    }, 300); // Pulse every 300ms
  }
}

function stopVibration() {
  if (vibrationInterval) clearInterval(vibrationInterval);
  vibrationInterval = null;
  if ("vibrate" in navigator) {
    navigator.vibrate(0); // Cancel any ongoing vibration
  }
}


// --- Main Handlers ---

function handleStart(e) {
  // Prevent default to stop scrolling/selection, but allow if it's a click to avoid blocking other interactions? 
  // For this app, we want blocking.
  if (e.cancelable) e.preventDefault();

  if (!hasInteracted) {
    // First interaction: Hide intro and title
    hasInteracted = true;
    introImage.classList.add('hidden');
    appTitle.classList.add('hidden');
    video2.play().catch(e => console.log("Video 2 priming failed", e));
    video2.pause();

    // Enable sound after interaction
    video1.muted = false;
    video2.muted = false;
  } else {
    // Subsequent interactions: Switch from video 2 back to video 1
    video2.classList.add('hidden');
    video2.pause();
  }

  // Show Video 1 (Feeding)
  video1.classList.remove('hidden');
  video1.play().catch(e => console.log("Video 1 play failed", e));

  // UI Updates
  setStatusText(MSG_FEEDING);
  startEmojiFlow('heart');
  startVibration();
}

function handleEnd(e) {
  if (!hasInteracted) return;

  // Stop Video 1
  video1.classList.add('hidden');
  video1.pause();

  // Play Video 2 (Crying)
  video2.classList.remove('hidden');
  video2.play().catch(e => console.log("Video 2 play failed", e));

  // UI Updates
  setStatusText(MSG_CRYING); // Use MSG_CRYING here
  startEmojiFlow('cry');
  stopVibration();
}

// Add Event Listeners
document.addEventListener('touchstart', handleStart, { passive: false });
document.addEventListener('touchend', handleEnd);
document.addEventListener('touchcancel', handleEnd);

// Mouse events for desktop testing
document.addEventListener('mousedown', handleStart);
document.addEventListener('mouseup', handleEnd);
document.addEventListener('mouseleave', handleEnd);

// Initial State
setStatusText(MSG_IDLE);

console.log("App initialized.");
