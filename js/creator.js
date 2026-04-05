/* ==========================================
   🎨 CREATOR PAGE — JavaScript
   ========================================== */

document.addEventListener('DOMContentLoaded', () => {
  initFloatingEmojis();
  initForm();
});

// ---------- FLOATING EMOJIS ----------
function initFloatingEmojis() {
  const container = document.getElementById('floatingEmojisBg');
  const emojis = ['🎈', '🎉', '🎊', '🎁', '⭐', '✨', '💫', '🎂', '🧁', '🍰', '🥳', '💖'];
  
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
  
  // Spawn initial batch
  for (let i = 0; i < 6; i++) {
    setTimeout(() => spawnEmoji(), i * 800);
  }
  
  // Continue spawning
  setInterval(spawnEmoji, 2500);
}

// ---------- FORM HANDLING ----------
function initForm() {
  const form = document.getElementById('birthdayForm');
  const linkSection = document.getElementById('linkSection');
  const generatedLink = document.getElementById('generatedLink');
  const copyBtn = document.getElementById('copyBtn');
  const whatsappShare = document.getElementById('whatsappShare');
  const previewBtn = document.getElementById('previewBtn');
  const createAnother = document.getElementById('createAnother');

  // Form submission
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const data = {
      yourName: document.getElementById('yourName').value.trim(),
      bdayName: document.getElementById('bdayName').value.trim(),
      age: document.getElementById('age').value.trim(),
      msg: document.getElementById('message').value.trim(),
      compliment: document.getElementById('compliment').value.trim(),
      photo: document.getElementById('photo').value.trim(),
      music: document.getElementById('music').value.trim(),
    };

    // Generate URL
    const params = new URLSearchParams();
    for (const [key, value] of Object.entries(data)) {
      if (value) params.set(key, value);
    }
    
    const baseUrl = window.location.origin + window.location.pathname.replace(/index\.html$/, '').replace(/\/$/, '');
    const wishUrl = `${baseUrl}/wish?${params.toString()}`;
    
    generatedLink.value = wishUrl;
    
    // WhatsApp share
    const whatsappMsg = encodeURIComponent(
      `🎂 Hey ${data.bdayName}! Someone has a birthday surprise for you! 🎁\n\n${wishUrl}`
    );
    whatsappShare.href = `https://wa.me/?text=${whatsappMsg}`;
    
    // Show link section with animation
    form.style.display = 'none';
    linkSection.classList.remove('hidden');
    
    // Scroll to link section
    linkSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
  });

  // Copy button
  copyBtn.addEventListener('click', () => {
    navigator.clipboard.writeText(generatedLink.value).then(() => {
      const copyText = copyBtn.querySelector('.copy-text');
      const copyIcon = copyBtn.querySelector('.copy-icon');
      copyText.textContent = 'Copied!';
      copyIcon.textContent = '✅';
      copyBtn.classList.add('copied');
      
      setTimeout(() => {
        copyText.textContent = 'Copy';
        copyIcon.textContent = '📋';
        copyBtn.classList.remove('copied');
      }, 2000);
    });
  });

  // Preview button
  previewBtn.addEventListener('click', () => {
    window.open(generatedLink.value, '_blank');
  });

  // Create another
  createAnother.addEventListener('click', () => {
    form.reset();
    form.style.display = '';
    linkSection.classList.add('hidden');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // Input animations — add focus glow
  document.querySelectorAll('.input-wrapper input, .input-wrapper textarea').forEach(input => {
    input.addEventListener('focus', () => {
      input.closest('.form-group').classList.add('focused');
    });
    input.addEventListener('blur', () => {
      input.closest('.form-group').classList.remove('focused');
    });
  });
}
