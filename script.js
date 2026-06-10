const birthdayConfig = {
  name: "Constanza Vargas",
  mainMessage: "Feliz cumpleaños, HUACHA culia loca",
  subtitle: "Los choros no tosen y qué pasaaa!",
  photos: [
    "assets/photos/foto1.png",
    "assets/photos/foto2.png",
    "assets/photos/foto3.png"
  ],
  audio: "assets/audio/candy.m4a",
  colors: {
    primary: "#ff2bd6",
    secondary: "#00f5ff",
    accent: "#ffe600",
    background: "#10002b",
    danger: "#ff003c",
    green: "#39ff14"
  },
  clickPhrases: [
    "Wenaaaaa",
    "HUACHA modo legendaria",
    "Nivel desbloqueado",
    "Se prendió esta cuestión",
    "Cumpleaños con violencia visual",
    "Los choros no tosen",
    "Y qué pasaaa!",
    "Constanza supremacy",
    "Modo cumpleaños activado",
    "Hoy se celebra como corresponde"
  ],
  randomPhrases: [
    "Hoy no se trabaja, hoy se celebra",
    "Cumpleaños nivel dios",
    "La Constanza desbloqueó otro año de caos",
    "Modo HUACHA legendaria activado",
    "Peligro: exceso de brillo y personalidad",
    "Esta página no tiene sentido, pero tiene cariño",
    "Los choros no tosen y los globos explotan",
    "Otra vuelta al sol, pero con más escándalo",
    "Que este año venga más brígido que bug en producción",
    "Felicidades a la mismísima jefa del caos"
  ]
};

const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const isMobile = window.matchMedia("(max-width: 768px)").matches;
const state = {
  activePhotos: [],
  soundsEnabled: true,
  raveMode: false,
  audioReady: false,
  audioPlaying: false,
  audioContext: null,
  cleanupTimers: new Set(),
  balloonCount: isMobile ? 8 : 14,
  cursorBurstMax: isMobile ? 22 : 42,
  balloonLabels: [
    "Wenaaaa",
    "La jefa del caos",
    "Qué pasaaa",
    "Modo HUACHA",
    "Nivel dios",
    "Se prendió esta cuestión"
  ],
  photoCaptions: [
    "La mismísima",
    "Constanza modo cumpleaños",
    "HUACHA legendaria"
  ]
};

const refs = {};

document.addEventListener("DOMContentLoaded", async () => {
  cacheRefs();
  applyConfig();
  createAmbientNodes();
  setupAudio();
  bindUI();
  state.activePhotos = await getAvailablePhotos();
  renderGallery();
  seedBalloons();
  launchConfetti({ particleCount: reducedMotion ? 35 : 90, spread: 95, origin: { y: 0.16 } });
  refs.phraseOutput.textContent = birthdayConfig.randomPhrases[0];
});

function cacheRefs() {
  refs.ambientLayer = document.getElementById("ambientLayer");
  refs.confettiLayer = document.getElementById("confettiLayer");
  refs.cursorLayer = document.getElementById("cursorLayer");
  refs.balloonField = document.getElementById("balloonField");
  refs.galleryGrid = document.getElementById("galleryGrid");
  refs.heroEyebrow = document.getElementById("heroEyebrow");
  refs.heroLead = document.getElementById("heroLead");
  refs.heroMainMessage = document.getElementById("heroMainMessage");
  refs.heroName = document.getElementById("heroName");
  refs.heroSubtitle = document.getElementById("heroSubtitle");
  refs.musicBtn = document.getElementById("musicBtn");
  refs.activateBtn = document.getElementById("activateBtn");
  refs.explodeBtn = document.getElementById("explodeBtn");
  refs.raveBtn = document.getElementById("raveBtn");
  refs.raveToggleAside = document.getElementById("raveToggleAside");
  refs.soundToggleBtn = document.getElementById("soundToggleBtn");
  refs.audioStatus = document.getElementById("audioStatus");
  refs.audio = document.getElementById("birthdayAudio");
  refs.volumeRange = document.getElementById("volumeRange");
  refs.phraseBtn = document.getElementById("phraseBtn");
  refs.phraseOutput = document.getElementById("phraseOutput");
  refs.phraseCard = document.getElementById("phraseCard");
  refs.epicBtn = document.getElementById("epicBtn");
  refs.epicOverlay = document.getElementById("epicOverlay");
  refs.epicTitle = document.getElementById("epicTitle");
  refs.epicSubtitle = document.getElementById("epicSubtitle");
  refs.photoModal = document.getElementById("photoModal");
  refs.modalImage = document.getElementById("modalImage");
  refs.modalCaption = document.getElementById("modalCaption");
  refs.closeModalBtn = document.getElementById("closeModalBtn");
}

function applyConfig() {
  const root = document.documentElement;
  Object.entries(birthdayConfig.colors).forEach(([key, value]) => {
    root.style.setProperty(`--${key}`, value);
  });

  const [leadTextRaw, ...restMessage] = birthdayConfig.mainMessage.split(",");
  const leadText = (leadTextRaw || "Feliz cumpleaños").trim();
  const mainLine = (restMessage.join(",") || birthdayConfig.mainMessage).trim();

  document.title = `${birthdayConfig.name} | Cumpleaños.exe`;
  refs.heroLead.textContent = leadText;
  refs.heroMainMessage.textContent = mainLine;
  refs.heroMainMessage.dataset.text = mainLine;
  refs.heroName.textContent = birthdayConfig.name;
  refs.heroSubtitle.textContent = birthdayConfig.subtitle;
  refs.heroSubtitle.dataset.text = birthdayConfig.subtitle;
  refs.epicTitle.textContent = `Feliz cumpleaños, ${birthdayConfig.name}`;
  refs.epicSubtitle.textContent = birthdayConfig.subtitle;
  refs.audio.src = birthdayConfig.audio;
}

function createAmbientNodes() {
  const total = reducedMotion ? 14 : isMobile ? 24 : 42;
  const kinds = ["star", "heart", "dot"];

  for (let index = 0; index < total; index += 1) {
    const node = document.createElement("span");
    const kind = kinds[index % kinds.length];
    node.className = `ambient-node ${kind === "dot" ? "" : kind}`.trim();
    node.style.setProperty("--x", `${Math.random() * 100}%`);
    node.style.setProperty("--y", `${Math.random() * 100}%`);
    node.style.setProperty("--size", `${10 + Math.random() * 28}px`);
    node.style.setProperty("--duration", `${4 + Math.random() * 6}s`);
    node.style.setProperty("--tone", pick([
      birthdayConfig.colors.primary,
      birthdayConfig.colors.secondary,
      birthdayConfig.colors.accent,
      birthdayConfig.colors.green
    ]));
    refs.ambientLayer.appendChild(node);
  }
}

function setupAudio() {
  refs.audio.volume = Number(refs.volumeRange.value);
  refs.audio.addEventListener("play", () => {
    state.audioPlaying = true;
    refs.musicBtn.textContent = "Pausar Candy";
    refs.audioStatus.textContent = "Candy prendida. Que se venga el escándalo.";
  });
  refs.audio.addEventListener("pause", () => {
    state.audioPlaying = false;
    refs.musicBtn.textContent = "Prender Candy";
    refs.audioStatus.textContent = "Candy en pausa, pero la energía sigue arriba.";
  });
  refs.audio.addEventListener("error", () => {
    refs.audioStatus.textContent = "Falta el archivo assets/audio/candy.m4a. Súbelo y aprieta de nuevo.";
  });
  refs.volumeRange.addEventListener("input", () => {
    refs.audio.volume = Number(refs.volumeRange.value);
  });
}

function bindUI() {
  refs.activateBtn.addEventListener("click", () => {
    playButtonFx();
    launchConfetti({ particleCount: reducedMotion ? 45 : 120, spread: 125, origin: { y: 0.55 } });
    showFloatingPhrase(window.innerWidth / 2, window.innerHeight * 0.32, pick(birthdayConfig.clickPhrases));
    sprinkleSparkles(window.innerWidth / 2, window.innerHeight * 0.32, 18);
  });

  refs.explodeBtn.addEventListener("click", () => {
    playConfettiFx();
    addScreenShake();
    launchConfetti({ particleCount: reducedMotion ? 70 : 160, spread: 180, startVelocity: 38, origin: { y: 0.44 } });
    sprinkleSparkles(window.innerWidth / 2, window.innerHeight * 0.5, 36);
  });

  refs.musicBtn.addEventListener("click", toggleMusic);
  refs.soundToggleBtn.addEventListener("click", toggleSoundEffects);
  refs.raveBtn.addEventListener("click", () => toggleRave());
  refs.raveToggleAside.addEventListener("click", () => toggleRave());

  refs.phraseBtn.addEventListener("click", () => {
    playArcadeFx();
    const phrase = pick(birthdayConfig.randomPhrases);
    refs.phraseOutput.textContent = phrase;
    refs.phraseCard.style.background = `linear-gradient(135deg, ${pick(Object.values(birthdayConfig.colors))}33, ${pick(Object.values(birthdayConfig.colors))}22)`;
    refs.phraseCard.animate([
      { transform: "scale(0.95) rotate(-1deg)" },
      { transform: "scale(1.02) rotate(1deg)" },
      { transform: "scale(1) rotate(0deg)" }
    ], { duration: reducedMotion ? 1 : 420, easing: "ease-out" });
    launchConfetti({ particleCount: reducedMotion ? 36 : 90, spread: 95, origin: { y: 0.7 } });
  });

  refs.epicBtn.addEventListener("click", launchEpicFinale);
  refs.closeModalBtn.addEventListener("click", closeModal);
  refs.photoModal.addEventListener("click", (event) => {
    if (event.target instanceof HTMLElement && event.target.dataset.closeModal === "true") {
      closeModal();
    }
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeModal();
    }
  });

  let pointerThrottle = false;
  const pointerHandler = (clientX, clientY) => {
    if (pointerThrottle) return;
    pointerThrottle = true;
    requestAnimationFrame(() => {
      pointerThrottle = false;
      spawnCursorTrail(clientX, clientY);
    });
  };

  window.addEventListener("pointermove", (event) => pointerHandler(event.clientX, event.clientY), { passive: true });
  window.addEventListener("pointerdown", (event) => handlePointerBurst(event.clientX, event.clientY), { passive: true });
  window.addEventListener("touchstart", (event) => {
    const point = event.touches[0];
    if (point) {
      handlePointerBurst(point.clientX, point.clientY);
    }
  }, { passive: true });
}

async function getAvailablePhotos() {
  const checks = birthdayConfig.photos.map((path, index) => new Promise((resolve) => {
    const image = new Image();
    image.onload = () => resolve({ path, caption: state.photoCaptions[index] || state.photoCaptions[0] });
    image.onerror = () => resolve(null);
    image.src = path;
  }));

  const results = await Promise.all(checks);
  return results.filter(Boolean);
}

function renderGallery() {
  refs.galleryGrid.innerHTML = "";

  if (!state.activePhotos.length) {
    const note = document.createElement("article");
    note.className = "gallery-note";
    note.innerHTML = `
      <strong>Faltan las 3 fotos reales.</strong>
      <p>Súbelas como <code>assets/photos/foto1.jpg</code>, <code>foto2.jpg</code> y <code>foto3.jpg</code> para prender la galería sin mostrar huecos feos.</p>
    `;
    refs.galleryGrid.appendChild(note);
    return;
  }

  state.activePhotos.forEach((photo, index) => {
    const card = document.createElement("button");
    card.type = "button";
    card.className = "polaroid";
    card.style.transform = `rotate(${[-5, 4, -3][index % 3]}deg)`;
    card.innerHTML = `
      <span class="polaroid-tag">${pick(["Wenaaaa", "Nivel dios", "Qué pasaaa"])}</span>
      <img src="${photo.path}" alt="${birthdayConfig.name} en modo cumpleaños" />
      <span class="polaroid-caption">${photo.caption}</span>
    `;
    card.addEventListener("click", () => openModal(photo));
    refs.galleryGrid.appendChild(card);
  });
}

function openModal(photo) {
  refs.modalImage.src = photo.path;
  refs.modalCaption.textContent = photo.caption;
  refs.photoModal.classList.add("open");
  refs.photoModal.setAttribute("aria-hidden", "false");
  launchConfetti({ particleCount: reducedMotion ? 24 : 50, spread: 75, origin: { y: 0.5 } });
}

function closeModal() {
  refs.photoModal.classList.remove("open");
  refs.photoModal.setAttribute("aria-hidden", "true");
}

function seedBalloons() {
  refs.balloonField.innerHTML = "";
  for (let index = 0; index < state.balloonCount; index += 1) {
    refs.balloonField.appendChild(createBalloon());
  }
}

function createBalloon() {
  const balloon = document.createElement("button");
  balloon.type = "button";
  balloon.className = "balloon";
  balloon.style.setProperty("--left", `${4 + Math.random() * 88}%`);
  balloon.style.setProperty("--top", `${8 + Math.random() * 62}%`);
  balloon.style.setProperty("--duration", `${4.2 + Math.random() * 3.5}s`);
  balloon.style.setProperty("--balloon-color", pick(Object.values(birthdayConfig.colors)));
  balloon.setAttribute("aria-label", "Reventar globo");

  const label = document.createElement("span");
  label.className = "balloon-label";
  label.textContent = pick(state.balloonLabels);
  balloon.appendChild(label);

  balloon.addEventListener("click", () => popBalloon(balloon));
  return balloon;
}

function popBalloon(balloon) {
  const box = balloon.getBoundingClientRect();
  const centerX = box.left + box.width / 2;
  const centerY = box.top + box.height / 2;

  playPopFx();
  launchConfetti({ particleCount: reducedMotion ? 18 : 44, spread: 70, origin: { x: centerX / window.innerWidth, y: centerY / window.innerHeight } });
  showFloatingPhrase(centerX, centerY, pick(birthdayConfig.clickPhrases));
  if (state.activePhotos.length) {
    showFloatingPhoto(centerX, centerY, pick(state.activePhotos));
  }

  balloon.animate([
    { transform: "scale(1)", opacity: 1 },
    { transform: "scale(1.4)", opacity: 0 }
  ], { duration: reducedMotion ? 1 : 280, easing: "ease-out" });
  setTimeout(() => balloon.remove(), reducedMotion ? 0 : 220);
  setTimeout(() => {
    if (refs.balloonField.childElementCount < state.balloonCount) {
      refs.balloonField.appendChild(createBalloon());
    }
  }, reducedMotion ? 1 : 1800 + Math.random() * 2200);
}

function toggleMusic() {
  initAudioContext();
  playButtonFx();

  if (state.audioPlaying) {
    refs.audio.pause();
    return;
  }

  refs.audio.play().catch(() => {
    refs.audioStatus.textContent = "Sube el m4a en assets/audio/candy.m4a para prender Candy sin drama.";
  });
}

function toggleSoundEffects() {
  state.soundsEnabled = !state.soundsEnabled;
  refs.soundToggleBtn.textContent = state.soundsEnabled ? "Silenciar escándalo" : "Activar escándalo";
  if (state.soundsEnabled) {
    playButtonFx();
  }
}

function toggleRave(forceValue) {
  state.raveMode = typeof forceValue === "boolean" ? forceValue : !state.raveMode;
  document.body.classList.toggle("rave-mode", state.raveMode);
  refs.raveBtn.textContent = state.raveMode ? "Desactivar modo rave" : "Modo rave";
  refs.raveToggleAside.textContent = state.raveMode ? "Desactivar modo rave" : "Activar modo rave";
  if (state.raveMode) {
    playArcadeFx();
    launchConfetti({ particleCount: reducedMotion ? 32 : 80, spread: 110, origin: { y: 0.6 } });
  } else {
    playButtonFx();
  }
}

function launchEpicFinale() {
  playFinalFx();
  addScreenShake();
  refs.epicOverlay.classList.add("is-visible");
  refs.epicOverlay.setAttribute("aria-hidden", "false");
  launchConfetti({ particleCount: reducedMotion ? 80 : 220, spread: 170, startVelocity: 48, origin: { y: 0.62 } });

  const bursts = reducedMotion ? 3 : 6;
  for (let index = 0; index < bursts; index += 1) {
    schedule(() => {
      launchConfetti({
        particleCount: reducedMotion ? 25 : 80,
        spread: 85,
        startVelocity: 42,
        origin: { x: 0.15 + Math.random() * 0.7, y: 0.2 + Math.random() * 0.4 }
      });
    }, index * 220);
  }

  state.activePhotos.forEach((photo, index) => {
    schedule(() => showFloatingPhoto(120 + index * 140, window.innerHeight - 120, photo, true), index * 180);
  });

  schedule(() => {
    refs.epicOverlay.classList.remove("is-visible");
    refs.epicOverlay.setAttribute("aria-hidden", "true");
  }, reducedMotion ? 800 : 3200);
}

function handlePointerBurst(clientX, clientY) {
  playButtonFx();
  spawnCursorTrail(clientX, clientY, true);
  showFloatingPhrase(clientX, clientY, pick(birthdayConfig.clickPhrases));
  launchConfetti({ particleCount: reducedMotion ? 14 : 32, spread: 65, origin: { x: clientX / window.innerWidth, y: clientY / window.innerHeight } });
  if (state.activePhotos.length && Math.random() > 0.55) {
    showMiniPhoto(clientX, clientY, pick(state.activePhotos));
  }
}

function spawnCursorTrail(clientX, clientY, burst = false) {
  const layer = refs.cursorLayer;
  const currentCount = layer.childElementCount;
  if (currentCount > state.cursorBurstMax) {
    const excess = currentCount - state.cursorBurstMax;
    [...layer.children].slice(0, excess).forEach((node) => node.remove());
  }

  const words = ["wena", "qué pasaaa", "HUACHA", "nivel dios"];
  const glyphs = ["✦", "★", "♥", "✹"];
  const total = burst ? (reducedMotion ? 4 : 8) : (isMobile ? 1 : 2);

  for (let index = 0; index < total; index += 1) {
    const burstNode = document.createElement("span");
    burstNode.className = "cursor-burst";
    burstNode.textContent = Math.random() > 0.45 ? pick(glyphs) : pick(words);
    burstNode.style.setProperty("--x", `${clientX}px`);
    burstNode.style.setProperty("--y", `${clientY}px`);
    burstNode.style.setProperty("--size", `${0.75 + Math.random() * 0.65}rem`);
    burstNode.style.setProperty("--tone", pick(Object.values(birthdayConfig.colors)));
    burstNode.style.setProperty("--duration", `${0.7 + Math.random() * 0.6}s`);
    burstNode.style.setProperty("--dx", `${-18 + Math.random() * 36}px`);
    layer.appendChild(burstNode);
    schedule(() => burstNode.remove(), 1400);
  }
}

function showFloatingPhrase(x, y, phrase) {
  const node = document.createElement("span");
  node.className = "floating-phrase";
  node.textContent = phrase;
  node.style.setProperty("--x", `${x}px`);
  node.style.setProperty("--y", `${y}px`);
  refs.cursorLayer.appendChild(node);
  schedule(() => node.remove(), 1800);
}

function showFloatingPhoto(x, y, photo, longFlight = false) {
  const card = document.createElement("article");
  card.className = "floating-polaroid";
  card.style.setProperty("--x", `${x}px`);
  card.style.setProperty("--y", `${y}px`);
  card.style.setProperty("--rotation", `${-12 + Math.random() * 24}deg`);
  card.innerHTML = `<img src="${photo.path}" alt="${birthdayConfig.name}" /><p>${photo.caption}</p>`;
  refs.cursorLayer.appendChild(card);
  schedule(() => card.remove(), longFlight ? 2600 : 2200);
}

function showMiniPhoto(x, y, photo) {
  const node = document.createElement("article");
  node.className = "mini-photo";
  node.style.setProperty("--x", `${x}px`);
  node.style.setProperty("--y", `${y}px`);
  node.style.setProperty("--rotation", `${-18 + Math.random() * 32}deg`);
  node.innerHTML = `<img src="${photo.path}" alt="${birthdayConfig.name}" /><p>La mismísima</p>`;
  refs.cursorLayer.appendChild(node);
  schedule(() => node.remove(), 1600);
}

function sprinkleSparkles(x, y, amount = 12) {
  for (let index = 0; index < amount; index += 1) {
    const sparkle = document.createElement("span");
    sparkle.className = "sparkle";
    sparkle.style.setProperty("--x", `${x}px`);
    sparkle.style.setProperty("--y", `${y}px`);
    sparkle.style.setProperty("--size", `${4 + Math.random() * 10}px`);
    sparkle.style.setProperty("--tone", pick(Object.values(birthdayConfig.colors)));
    sparkle.style.setProperty("--dx", `${-80 + Math.random() * 160}px`);
    sparkle.style.setProperty("--dy", `${-80 + Math.random() * 160}px`);
    refs.cursorLayer.appendChild(sparkle);
    schedule(() => sparkle.remove(), 950);
  }
}

function launchConfetti(options) {
  if (typeof window.confetti === "function") {
    window.confetti({
      ...options,
      colors: Object.values(birthdayConfig.colors),
      disableForReducedMotion: reducedMotion
    });
    return;
  }

  const amount = Math.min(options.particleCount || 40, 90);
  const originX = `${(options.origin?.x ?? 0.5) * window.innerWidth}px`;
  const originY = `${(options.origin?.y ?? 0.5) * window.innerHeight}px`;
  for (let index = 0; index < amount; index += 1) {
    const piece = document.createElement("span");
    piece.className = "sparkle";
    piece.style.setProperty("--x", originX);
    piece.style.setProperty("--y", originY);
    piece.style.setProperty("--size", `${5 + Math.random() * 8}px`);
    piece.style.setProperty("--tone", pick(Object.values(birthdayConfig.colors)));
    piece.style.setProperty("--dx", `${-180 + Math.random() * 360}px`);
    piece.style.setProperty("--dy", `${-150 + Math.random() * 300}px`);
    refs.confettiLayer.appendChild(piece);
    schedule(() => piece.remove(), 1100);
  }
}

function initAudioContext() {
  if (!state.audioContext) {
    const AudioContextCtor = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextCtor) return null;
    state.audioContext = new AudioContextCtor();
  }

  if (state.audioContext.state === "suspended") {
    state.audioContext.resume();
  }

  return state.audioContext;
}

function playTone({ frequency = 440, duration = 0.18, type = "triangle", gain = 0.03, sweep = 0, detune = 0 }) {
  if (!state.soundsEnabled) return;
  const context = initAudioContext();
  if (!context) return;

  const oscillator = context.createOscillator();
  const gainNode = context.createGain();
  oscillator.type = type;
  oscillator.frequency.setValueAtTime(frequency, context.currentTime);
  oscillator.detune.setValueAtTime(detune, context.currentTime);
  if (sweep) {
    oscillator.frequency.exponentialRampToValueAtTime(Math.max(50, frequency + sweep), context.currentTime + duration);
  }

  gainNode.gain.setValueAtTime(gain, context.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + duration);

  oscillator.connect(gainNode);
  gainNode.connect(context.destination);
  oscillator.start();
  oscillator.stop(context.currentTime + duration);
}

function playButtonFx() {
  playTone({ frequency: 520, duration: 0.08, type: "triangle", gain: 0.03, sweep: 220 });
  schedule(() => playTone({ frequency: 880, duration: 0.05, type: "sine", gain: 0.02 }), 40);
}

function playPopFx() {
  playTone({ frequency: 220, duration: 0.11, type: "square", gain: 0.035, sweep: -120 });
}

function playConfettiFx() {
  playTone({ frequency: 180, duration: 0.18, type: "sawtooth", gain: 0.04, sweep: 320 });
}

function playArcadeFx() {
  playTone({ frequency: 330, duration: 0.09, type: "square", gain: 0.03, sweep: 340 });
  schedule(() => playTone({ frequency: 660, duration: 0.11, type: "square", gain: 0.03, sweep: 420 }), 70);
}

function playFinalFx() {
  playTone({ frequency: 180, duration: 0.25, type: "sawtooth", gain: 0.045, sweep: 520 });
  schedule(() => playTone({ frequency: 360, duration: 0.18, type: "triangle", gain: 0.04, sweep: 380 }), 90);
  schedule(() => playTone({ frequency: 720, duration: 0.22, type: "square", gain: 0.03, sweep: 620 }), 180);
}

function addScreenShake() {
  document.body.classList.remove("shake");
  void document.body.offsetWidth;
  document.body.classList.add("shake");
  schedule(() => document.body.classList.remove("shake"), 1100);
}

function schedule(callback, delay) {
  const timer = window.setTimeout(() => {
    state.cleanupTimers.delete(timer);
    callback();
  }, delay);
  state.cleanupTimers.add(timer);
  return timer;
}

function pick(items) {
  return items[Math.floor(Math.random() * items.length)];
}
