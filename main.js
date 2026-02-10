// Select elements
const appTitle = document.getElementById('app-title');
const introImage = document.getElementById('intro-image');
const video1 = document.getElementById('video1');
const video2 = document.getElementById('video2');
const video3 = document.getElementById('video3');
const statusText = document.getElementById('status-text');
const emojiContainer = document.getElementById('emoji-container');

// State
let hasInteracted = false;
let isFingerDown = false;
let isExercising = false; // Video 3 state
let emojiInterval = null;
let vibrationInterval = null;
let exerciseTimer = null;

// Messages
const MSG_IDLE = "Keep your finger on screen to feed me";
const MSG_FEEDING = "Happy Feeding";
const MSG_CRYING = "Why you stopped, I cry";
const MSG_EXERCISING = "My tummy is full gotta do some exercise";

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

function startFeeding() {
  // Show Video 1 (Feeding)
  video1.classList.remove('hidden');
  video1.play().catch(e => console.log("Video 1 play failed", e));

  // Ensure others are hidden/paused
  video2.classList.add('hidden');
  video2.pause();
  video3.classList.add('hidden');
  video3.pause();

  // UI Updates
  setStatusText(MSG_FEEDING);
  appTitle.classList.add('hidden'); // Hide title during feeding
  startEmojiFlow('heart');
  startVibration();

  // Start timer for exercise
  if (exerciseTimer) clearTimeout(exerciseTimer);
  exerciseTimer = setTimeout(startExercise, 10000); // 10 seconds
}

function stopFeeding() {
  if (exerciseTimer) clearTimeout(exerciseTimer);

  // Stop Video 1
  video1.classList.add('hidden');
  video1.pause();

  // Play Video 2 (Crying)
  video2.classList.remove('hidden');
  video2.play().catch(e => console.log("Video 2 play failed", e));

  // Ensure others are hidden
  video3.classList.add('hidden');
  video3.pause();

  // UI Updates
  setStatusText(MSG_CRYING);
  appTitle.classList.add('hidden');
  startEmojiFlow('cry');
  stopVibration();
}

function startExercise() {
  isExercising = true;
  if (exerciseTimer) clearTimeout(exerciseTimer); // Clear just in case

  // Stop feeding elements
  video1.classList.add('hidden');
  video1.pause();
  stopEmojiFlow(); // No emojis or different ones? Assuming stop based on request implications
  stopVibration(); // Maybe stop vibration during exercise? Or keep it? Assuming stop for clarity.

  // Play Video 3
  video3.classList.remove('hidden');
  video3.currentTime = 0;
  video3.play().catch(e => console.log("Video 3 play failed", e));

  // UI Update
  appTitle.textContent = MSG_EXERCISING;
  appTitle.classList.remove('hidden');
  setStatusText(""); // Clear bottom text or keep it? StartExercise implies focus on top text.
}

function onExerciseEnd() {
  isExercising = false;
  video3.classList.add('hidden');
  // Reset title for next time (or keep hidden until needed)
  appTitle.textContent = MSG_IDLE;
  appTitle.classList.add('hidden');

  if (isFingerDown) {
    // Check if user is still holding -> Go back to Feeding
    startFeeding();
  } else {
    // User released -> Go to Crying
    stopFeeding();
  }
}

// Video 3 ended event
video3.addEventListener('ended', onExerciseEnd);

function handleStart(e) {
  if (e.cancelable) e.preventDefault();

  // If actively exercising, just update state and ignore
  if (isExercising) {
    isFingerDown = true;
    return;
  }

  if (!hasInteracted) {
    hasInteracted = true;
    introImage.classList.add('hidden');
    appTitle.classList.add('hidden');

    // Unmute logic
    video1.muted = false;
    video2.muted = false;
    video3.muted = false;

    // Prime videos
    video2.play().catch(() => { }).then(() => video2.pause());
    video3.play().catch(() => { }).then(() => video3.pause());
  }

  isFingerDown = true;
  startFeeding();
}

function handleEnd(e) {
  isFingerDown = false;

  // If exercising, do nothing visual yet; onExerciseEnd determines next step
  if (isExercising) return;

  if (!hasInteracted) return;

  stopFeeding();
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
