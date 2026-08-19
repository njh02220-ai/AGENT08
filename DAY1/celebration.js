const canvas = document.getElementById('confettiCanvas');
const ctx = canvas.getContext('2d');
let particles = [];
let animating = false;
let frameId = null;

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

window.addEventListener('resize', () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});

const COLORS = [
  '#ff6b6b', '#ffd93d', '#6bcb77', '#4d96ff',
  '#f06292', '#ce93d8', '#80cbc4', '#ffcc80',
  '#ffffff', '#ff9a3c', '#a8edea', '#fed6e3'
];

const SHAPES = ['circle', 'rect', 'triangle', 'star'];

class Particle {
  constructor() {
    this.reset(true);
  }

  reset(fromTop = false) {
    this.x = Math.random() * canvas.width;
    this.y = fromTop ? (Math.random() * -200 - 10) : (Math.random() * -50 - 10);
    this.size = Math.random() * 10 + 5;
    this.color = COLORS[Math.floor(Math.random() * COLORS.length)];
    this.shape = SHAPES[Math.floor(Math.random() * SHAPES.length)];
    this.speedX = (Math.random() - 0.5) * 4;
    this.speedY = Math.random() * 4 + 2;
    this.gravity = 0.12;
    this.rotation = Math.random() * Math.PI * 2;
    this.rotationSpeed = (Math.random() - 0.5) * 0.2;
    this.opacity = 1;
    this.wobble = Math.random() * Math.PI * 2;
    this.wobbleSpeed = Math.random() * 0.05 + 0.02;
  }

  update() {
    this.wobble += this.wobbleSpeed;
    this.x += this.speedX + Math.sin(this.wobble) * 1.5;
    this.speedY += this.gravity;
    this.y += this.speedY;
    this.rotation += this.rotationSpeed;

    if (this.y > canvas.height + 20) {
      if (animating) this.reset();
    }

    if (this.y > canvas.height * 0.7) {
      this.opacity = Math.max(0, this.opacity - 0.015);
    }
  }

  draw() {
    ctx.save();
    ctx.globalAlpha = this.opacity;
    ctx.translate(this.x, this.y);
    ctx.rotate(this.rotation);
    ctx.fillStyle = this.color;

    if (this.shape === 'circle') {
      ctx.beginPath();
      ctx.arc(0, 0, this.size / 2, 0, Math.PI * 2);
      ctx.fill();

    } else if (this.shape === 'rect') {
      ctx.fillRect(-this.size / 2, -this.size / 4, this.size, this.size / 2);

    } else if (this.shape === 'triangle') {
      const s = this.size;
      ctx.beginPath();
      ctx.moveTo(0, -s / 2);
      ctx.lineTo(s / 2, s / 2);
      ctx.lineTo(-s / 2, s / 2);
      ctx.closePath();
      ctx.fill();

    } else if (this.shape === 'star') {
      drawStar(ctx, 0, 0, 5, this.size / 2, this.size / 4);
    }

    ctx.restore();
  }
}

function drawStar(ctx, cx, cy, spikes, outerR, innerR) {
  let rot = (Math.PI / 2) * 3;
  const step = Math.PI / spikes;
  ctx.beginPath();
  ctx.moveTo(cx, cy - outerR);
  for (let i = 0; i < spikes; i++) {
    ctx.lineTo(cx + Math.cos(rot) * outerR, cy + Math.sin(rot) * outerR);
    rot += step;
    ctx.lineTo(cx + Math.cos(rot) * innerR, cy + Math.sin(rot) * innerR);
    rot += step;
  }
  ctx.lineTo(cx, cy - outerR);
  ctx.closePath();
  ctx.fill();
}

function spawnBurst() {
  for (let i = 0; i < 180; i++) {
    particles.push(new Particle());
  }
}

function loop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach(p => {
    p.update();
    p.draw();
  });
  particles = particles.filter(p => p.opacity > 0);

  if (animating || particles.length > 0) {
    frameId = requestAnimationFrame(loop);
  } else {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }
}

function celebrate() {
  const btn = document.getElementById('btn');
  const message = document.getElementById('message');
  const emojiRow = document.getElementById('emojiRow');

  message.classList.add('show');
  emojiRow.classList.add('show');
  btn.classList.add('fired');
  btn.textContent = '다시 축하하기! 🎉';

  if (frameId) {
    cancelAnimationFrame(frameId);
    particles = [];
  }

  animating = true;
  spawnBurst();
  loop();

  setTimeout(() => {
    animating = false;
  }, 4000);
}
