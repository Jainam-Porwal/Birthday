/* ==========================================
   🎉 WISH PAGE — JavaScript
   Multi-step birthday experience with
   dodging buttons, balloon game, confetti
   ========================================== */

// ---------- GLOBAL STATE ----------
let wishData = {};
let currentStep = 0;
let noClickCount1 = 0;
let noClickCount2 = 0;
let gameScore = 0;
let gameTimer = 20;
let gameInterval = null;
let spawnInterval = null;
let gameRunning = false;

// ---------- INIT ----------
document.addEventListener('DOMContentLoaded', () => {
  parseUrlParams();
  initFloatingEmojis();
  initLoadingScreen();
  initMusic();
});

// ---------- PARSE URL ----------
function parseUrlParams() {
  const params = new URLSearchParams(window.location.search);
  wishData = {
    yourName: params.get('yourName') || 'Someone',
    bdayName: params.get('bdayName') || 'Friend',
    age: params.get('age') || '??',
    msg: params.get('msg') || 'Happy Birthday! 🎂',
    compliment: params.get('compliment') || 'You are amazing!',
    photo: params.get('photo') || '',
    music: params.get('music') || '',
  };

  // Populate name displays
  document.getElementById('senderNameDisplay').textContent = wishData.yourName;
  document.getElementById('bdayNameDisplay1').textContent = wishData.bdayName;
  document.getElementById('ageDisplay').textContent = wishData.age;
  document.getElementById('bdayNameFinal').textContent = wishData.bdayName;
  document.getElementById('senderNameFinal').textContent = wishData.yourName;
  document.getElementById('bdayMessage').textContent = wishData.msg;
  document.getElementById('bdayCompliment').textContent = wishData.compliment;

  // Photo
  const photoWrapper = document.getElementById('photoWrapper');
  if (wishData.photo) {
    document.getElementById('bdayPhoto').src = wishData.photo;
    document.getElementById('bdayPhoto').onerror = () => {
      photoWrapper.style.display = 'none';
    };
  } else {
    photoWrapper.style.display = 'none';
  }

  // Update page title
  document.title = `🎂 ${wishData.bdayName}, you have a surprise!`;
}

// ---------- LOADING SCREEN ----------
function initLoadingScreen() {
  const loading = document.getElementById('loadingScreen');
  setTimeout(() => {
    loading.classList.add('fade-out');
    setTimeout(() => {
      loading.style.display = 'none';
    }, 600);
  }, 2400);
}

// ---------- MUSIC ----------
function initMusic() {
  if (wishData.music) {
    const audio = document.getElementById('bgMusic');
    audio.src = wishData.music;
    // Try to autoplay on first interaction
    const playMusic = () => {
      audio.volume = 0.3;
      audio.play().catch(() => { });
      document.removeEventListener('click', playMusic);
      document.removeEventListener('touchstart', playMusic);
    };
    document.addEventListener('click', playMusic);
    document.addEventListener('touchstart', playMusic);
  }
}

// ---------- FLOATING EMOJIS ----------
function initFloatingEmojis() {
  const container = document.getElementById('floatingEmojisBg');
  const emojis = ['🎈', '🎉', '🎊', '🎁', '⭐', '✨', '💫', '🎂', '💖'];

  function spawnEmoji() {
    const emoji = document.createElement('span');
    emoji.className = 'floating-emoji';
    emoji.textContent = emojis[Math.floor(Math.random() * emojis.length)];
    emoji.style.left = Math.random() * 100 + '%';
    emoji.style.animationDuration = (6 + Math.random() * 6) + 's';
    emoji.style.animationDelay = Math.random() * 2 + 's';
    emoji.style.fontSize = (1 + Math.random() * 1.5) + 'rem';
    container.appendChild(emoji);
    setTimeout(() => emoji.remove(), 14000);
  }

  for (let i = 0; i < 5; i++) {
    setTimeout(() => spawnEmoji(), i * 1000);
  }
  setInterval(spawnEmoji, 3000);
}


/* ==========================================
   STEP 1 — "Is it your birthday?"
   ========================================== */

function handleStep1Yes() {
  transitionToStep('step1', 'step2');
}

function handleStep1No(event) {
  noClickCount1++;
  const btn = document.getElementById('noBtn1');

  if (noClickCount1 <= 2) {
    // Button shakes wildly
    btn.style.animation = 'shakeNo 0.5s ease';
    setTimeout(() => { btn.style.animation = ''; }, 500);
  } else if (noClickCount1 <= 4) {
    // Button teleports randomly
    dodgeButton(btn);
  } else if (noClickCount1 <= 6) {
    // Button shrinks
    const scale = Math.max(0.3, 1 - (noClickCount1 - 4) * 0.2);
    btn.style.transform = `scale(${scale})`;
    dodgeButton(btn);
  } else {
    // Button disappears
    btn.style.transition = 'all 0.5s ease';
    btn.style.opacity = '0';
    btn.style.transform = 'scale(0) rotate(180deg)';
    setTimeout(() => { btn.style.display = 'none'; }, 500);
  }

  // YES button grows
  const yesBtn = document.getElementById('yesBtn1');
  const newScale = 1 + noClickCount1 * 0.06;
  yesBtn.style.transform = `scale(${Math.min(newScale, 1.5)})`;
}

function dodgeButton(btn) {
  const parent = btn.closest('.step-content');
  const parentRect = parent.getBoundingClientRect();
  const btnRect = btn.getBoundingClientRect();

  const maxX = parentRect.width - btnRect.width - 20;
  const maxY = 80;

  const randomX = Math.random() * maxX - maxX / 2;
  const randomY = Math.random() * maxY - maxY / 2;

  btn.style.position = 'relative';
  btn.style.transition = 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)';
  btn.style.left = randomX + 'px';
  btn.style.top = randomY + 'px';
}


/* ==========================================
   STEP 2 — "Are you really turning X?"
   ========================================== */

function handleStep2Yes() {
  const buttons = document.getElementById('step2Buttons');
  const heading = document.getElementById('ageHeading');
  const reveal = document.getElementById('step2Reveal');

  // Hide buttons and heading
  buttons.classList.add('hidden');
  heading.style.display = 'none';

  // Show reveal text
  reveal.classList.remove('hidden');

  // Transition after dramatic pause
  setTimeout(() => {
    transitionToStep('step2', 'step3');
  }, 2200);
}

function handleStep2No(event) {
  noClickCount2++;
  const btn = document.getElementById('noBtn2');

  if (noClickCount2 <= 2) {
    btn.style.animation = 'shakeNo 0.5s ease';
    setTimeout(() => { btn.style.animation = ''; }, 500);
  } else if (noClickCount2 <= 5) {
    // Teleport with spin
    dodgeButton(btn);
    btn.style.transform += ' rotate(' + (noClickCount2 * 30) + 'deg)';
  } else {
    // Shrink and vanish
    btn.style.transition = 'all 0.6s ease';
    btn.style.transform = 'scale(0) rotate(720deg)';
    btn.style.opacity = '0';
    setTimeout(() => { btn.style.display = 'none'; }, 600);
  }

  // YES button effect
  const yesBtn = document.getElementById('yesBtn2');
  const newScale = 1 + noClickCount2 * 0.07;
  yesBtn.style.transform = `scale(${Math.min(newScale, 1.6)})`;
  yesBtn.style.boxShadow = `0 6px ${20 + noClickCount2 * 5}px rgba(102, 126, 234, ${0.4 + noClickCount2 * 0.08})`;
}


/* ==========================================
   STEP 3 — BALLOON POP GAME
   ========================================== */

function startGame() {
  const startBtn = document.getElementById('startGameBtn');
  startBtn.classList.add('hidden');

  gameScore = 0;
  gameTimer = 20;
  gameRunning = true;

  updateScore();
  updateTimer();
  spawnBalloons();

  // Timer countdown
  gameInterval = setInterval(() => {
    gameTimer--;
    updateTimer();

    if (gameTimer <= 0) {
      endGame(false);
    }
  }, 1000);
}

function spawnBalloons() {
  const gameArea = document.getElementById('gameArea');
  const balloonEmojis = ['🎈', '🎈', '🎈', '🎈', '🎈', '🎈', '🎁', '⭐', '🎉'];

  function spawn() {
    if (!gameRunning) return;

    const balloon = document.createElement('div');
    balloon.className = 'balloon';
    balloon.textContent = balloonEmojis[Math.floor(Math.random() * balloonEmojis.length)];

    const areaWidth = gameArea.offsetWidth;
    const randomX = 20 + Math.random() * (areaWidth - 60);
    balloon.style.left = randomX + 'px';
    balloon.style.bottom = '-60px';
    balloon.style.animationDuration = (2.5 + Math.random() * 2) + 's';

    balloon.addEventListener('click', (e) => popBalloon(e, balloon));
    balloon.addEventListener('touchstart', (e) => {
      e.preventDefault();
      popBalloon(e, balloon);
    }, { passive: false });

    gameArea.appendChild(balloon);

    // Remove balloon if not popped
    setTimeout(() => {
      if (balloon.parentNode && !balloon.classList.contains('popped')) {
        balloon.remove();
      }
    }, 5000);
  }

  // Initial burst
  for (let i = 0; i < 3; i++) {
    setTimeout(spawn, i * 300);
  }

  // Continuous spawning — faster as time goes
  spawnInterval = setInterval(() => {
    if (!gameRunning) return;
    spawn();
    // Spawn extra as game progresses
    if (gameTimer < 12) spawn();
    if (gameTimer < 6) spawn();
  }, 700);
}

function popBalloon(event, balloon) {
  if (balloon.classList.contains('popped') || !gameRunning) return;

  balloon.classList.add('popped');
  gameScore++;
  updateScore();

  // Pop effect
  const effect = document.createElement('div');
  effect.className = 'pop-effect';
  effect.textContent = '💥';
  const rect = balloon.getBoundingClientRect();
  const gameArea = document.getElementById('gameArea');
  const areaRect = gameArea.getBoundingClientRect();
  effect.style.left = (rect.left - areaRect.left + rect.width / 2) + 'px';
  effect.style.top = (rect.top - areaRect.top) + 'px';
  gameArea.appendChild(effect);
  setTimeout(() => effect.remove(), 600);

  // Update progress bar
  const progress = Math.min((gameScore / 15) * 100, 100);
  document.getElementById('progressBar').style.width = progress + '%';

  // Remove balloon
  setTimeout(() => balloon.remove(), 300);

  // Check win
  if (gameScore >= 15) {
    endGame(true);
  }
}

function updateScore() {
  document.getElementById('score').textContent = gameScore;
}

function updateTimer() {
  document.getElementById('timer').textContent = gameTimer;

  // Timer warning colors
  const timerEl = document.querySelector('.game-timer');
  if (gameTimer <= 5) {
    timerEl.style.color = '#ef4444';
    timerEl.style.animation = 'pulseScale 0.5s ease-in-out infinite alternate';
  } else if (gameTimer <= 10) {
    timerEl.style.color = '#fbbf24';
  }
}

function endGame(won) {
  gameRunning = false;
  clearInterval(gameInterval);
  clearInterval(spawnInterval);

  // Clear remaining balloons
  document.querySelectorAll('.balloon:not(.popped)').forEach(b => b.remove());

  if (won) {
    // Show completion overlay
    document.getElementById('gameComplete').classList.remove('hidden');
  } else {
    // Didn't win — restart with encouragement
    const gameArea = document.getElementById('gameArea');
    gameArea.innerHTML = '';

    const startBtn = document.getElementById('startGameBtn');
    startBtn.classList.remove('hidden');
    startBtn.innerHTML = 'Try Again! 💪';

    document.getElementById('progressBar').style.width = '0%';
    document.querySelector('.game-timer').style.color = '';
    document.querySelector('.game-timer').style.animation = '';
  }
}

function goToFinalWish() {
  document.getElementById('gameComplete').classList.add('hidden');
  transitionToStep('step3', 'step4');

  // Start confetti after transition
  setTimeout(() => {
    startConfetti();
  }, 600);
}


/* ==========================================
   STEP 4 — CONFETTI ENGINE
   ========================================== */

function startConfetti() {
  const canvas = document.getElementById('confettiCanvas');
  const ctx = canvas.getContext('2d');

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  });

  const confettiPieces = [];
  const colors = ['#c084fc', '#f472b6', '#38bdf8', '#fbbf24', '#34d399', '#fb7185', '#a78bfa', '#67e8f9'];
  const shapes = ['rect', 'circle', 'star'];

  class Confetti {
    constructor() {
      this.reset();
      this.y = Math.random() * -canvas.height;
    }

    reset() {
      this.x = Math.random() * canvas.width;
      this.y = -20;
      this.size = 4 + Math.random() * 6;
      this.color = colors[Math.floor(Math.random() * colors.length)];
      this.shape = shapes[Math.floor(Math.random() * shapes.length)];
      this.speedY = 1.5 + Math.random() * 3;
      this.speedX = (Math.random() - 0.5) * 2;
      this.rotation = Math.random() * 360;
      this.rotationSpeed = (Math.random() - 0.5) * 10;
      this.oscillationSpeed = 0.02 + Math.random() * 0.03;
      this.oscillationDistance = 30 + Math.random() * 40;
      this.time = Math.random() * 100;
      this.opacity = 0.7 + Math.random() * 0.3;
    }

    update() {
      this.time += this.oscillationSpeed;
      this.x += this.speedX + Math.sin(this.time) * 0.5;
      this.y += this.speedY;
      this.rotation += this.rotationSpeed;

      if (this.y > canvas.height + 20) {
        this.reset();
      }
    }

    draw() {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate((this.rotation * Math.PI) / 180);
      ctx.globalAlpha = this.opacity;
      ctx.fillStyle = this.color;

      if (this.shape === 'rect') {
        ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size * 0.6);
      } else if (this.shape === 'circle') {
        ctx.beginPath();
        ctx.arc(0, 0, this.size / 2, 0, Math.PI * 2);
        ctx.fill();
      } else {
        // Star / sparkle
        this.drawStar(ctx, 0, 0, 5, this.size / 2, this.size / 4);
      }

      ctx.restore();
    }

    drawStar(ctx, cx, cy, spikes, outerRadius, innerRadius) {
      let rot = (Math.PI / 2) * 3;
      let step = Math.PI / spikes;
      ctx.beginPath();
      ctx.moveTo(cx, cy - outerRadius);
      for (let i = 0; i < spikes; i++) {
        ctx.lineTo(cx + Math.cos(rot) * outerRadius, cy + Math.sin(rot) * outerRadius);
        rot += step;
        ctx.lineTo(cx + Math.cos(rot) * innerRadius, cy + Math.sin(rot) * innerRadius);
        rot += step;
      }
      ctx.closePath();
      ctx.fill();
    }
  }

  // Create confetti pieces
  for (let i = 0; i < 120; i++) {
    confettiPieces.push(new Confetti());
  }

  // Animate
  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    confettiPieces.forEach(piece => {
      piece.update();
      piece.draw();
    });

    requestAnimationFrame(animate);
  }

  animate();
}


/* ==========================================
   PAGE TRANSITIONS
   ========================================== */

function transitionToStep(fromId, toId) {
  const fromStep = document.getElementById(fromId);
  const toStep = document.getElementById(toId);

  // Exit animation
  fromStep.classList.add('exit-anim');

  setTimeout(() => {
    fromStep.classList.add('hidden');
    fromStep.classList.remove('exit-anim');

    // Enter
    toStep.classList.remove('hidden');
    toStep.style.animation = 'none';
    toStep.offsetHeight; // Force reflow
    toStep.style.animation = 'fadeSlideIn 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards';
  }, 500);
}
