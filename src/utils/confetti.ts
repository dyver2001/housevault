// Enhanced Physics Particle Engine: Confetti, Golden Coins & Banknotes

export function triggerConfetti(xPercent = 50, yPercent = 50) {
  if (typeof document === 'undefined') return;

  const canvas = document.createElement('canvas');
  canvas.style.position = 'fixed';
  canvas.style.top = '0';
  canvas.style.left = '0';
  canvas.style.width = '100vw';
  canvas.style.height = '100vh';
  canvas.style.pointerEvents = 'none';
  canvas.style.zIndex = '999999';
  document.body.appendChild(canvas);

  const ctx = canvas.getContext('2d');
  if (!ctx) {
    document.body.removeChild(canvas);
    return;
  }

  const width = (canvas.width = window.innerWidth);
  const height = (canvas.height = window.innerHeight);

  const originX = (width * xPercent) / 100;
  const originY = (height * yPercent) / 100;

  const colors = ['#10b981', '#38bdf8', '#f59e0b', '#ec4899', '#8b5cf6', '#14b8a6', '#f43f5e'];

  interface Particle {
    x: number;
    y: number;
    vx: number;
    vy: number;
    size: number;
    color: string;
    rotation: number;
    rotationSpeed: number;
    opacity: number;
  }

  const particles: Particle[] = [];
  const count = 75;

  for (let i = 0; i < count; i++) {
    const angle = Math.random() * Math.PI * 2;
    const speed = Math.random() * 8 + 4;
    particles.push({
      x: originX,
      y: originY,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - 3,
      size: Math.random() * 8 + 4,
      color: colors[Math.floor(Math.random() * colors.length)],
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 12,
      opacity: 1
    });
  }

  let animationFrame: number;
  const startTime = Date.now();

  function render() {
    if (!ctx) return;
    ctx.clearRect(0, 0, width, height);

    const elapsed = Date.now() - startTime;
    let alive = false;

    particles.forEach((p) => {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.2;
      p.vx *= 0.98;
      p.rotation += p.rotationSpeed;
      p.opacity = Math.max(0, 1 - elapsed / 1800);

      if (p.opacity > 0) {
        alive = true;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.globalAlpha = p.opacity;
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
        ctx.restore();
      }
    });

    if (alive && elapsed < 2000) {
      animationFrame = requestAnimationFrame(render);
    } else {
      cancelAnimationFrame(animationFrame);
      if (document.body.contains(canvas)) {
        document.body.removeChild(canvas);
      }
    }
  }

  animationFrame = requestAnimationFrame(render);
}

// 6. Golden Coin & Banknote Shower with Physics Bounce
export function triggerCoinRain() {
  if (typeof document === 'undefined') return;

  const canvas = document.createElement('canvas');
  canvas.style.position = 'fixed';
  canvas.style.top = '0';
  canvas.style.left = '0';
  canvas.style.width = '100vw';
  canvas.style.height = '100vh';
  canvas.style.pointerEvents = 'none';
  canvas.style.zIndex = '999999';
  document.body.appendChild(canvas);

  const ctx = canvas.getContext('2d');
  if (!ctx) {
    document.body.removeChild(canvas);
    return;
  }

  const width = (canvas.width = window.innerWidth);
  const height = (canvas.height = window.innerHeight);

  interface CoinItem {
    x: number;
    y: number;
    vx: number;
    vy: number;
    type: 'COIN' | 'BILL';
    radius: number;
    scaleX: number;
    scaleSpeed: number;
    rotation: number;
    rotationSpeed: number;
    opacity: number;
    bounces: number;
  }

  const items: CoinItem[] = [];
  const count = 45;

  for (let i = 0; i < count; i++) {
    items.push({
      x: Math.random() * width,
      y: -Math.random() * 200 - 20,
      vx: (Math.random() - 0.5) * 3,
      vy: Math.random() * 4 + 3,
      type: Math.random() > 0.4 ? 'COIN' : 'BILL',
      radius: Math.random() * 6 + 14,
      scaleX: Math.random(),
      scaleSpeed: (Math.random() * 0.08 + 0.04) * (Math.random() > 0.5 ? 1 : -1),
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 6,
      opacity: 1,
      bounces: 0
    });
  }

  let animationFrame: number;
  const startTime = Date.now();

  function render() {
    if (!ctx) return;
    ctx.clearRect(0, 0, width, height);

    const elapsed = Date.now() - startTime;
    let alive = false;

    items.forEach((item) => {
      item.x += item.vx;
      item.y += item.vy;
      item.vy += 0.18; // gravity
      item.scaleX += item.scaleSpeed;
      if (Math.abs(item.scaleX) > 1) {
        item.scaleSpeed *= -1;
      }
      item.rotation += item.rotationSpeed;

      // Floor bounce
      const floorY = height - 40;
      if (item.y > floorY && item.bounces < 2) {
        item.y = floorY;
        item.vy = -item.vy * 0.5;
        item.vx *= 0.8;
        item.bounces++;
      }

      item.opacity = Math.max(0, 1 - (elapsed - 2000) / 1000);

      if (item.opacity > 0 && item.y < height + 100) {
        alive = true;
        ctx.save();
        ctx.translate(item.x, item.y);
        ctx.globalAlpha = item.opacity;

        if (item.type === 'COIN') {
          // Render Spinning Golden Coin
          ctx.scale(Math.sin(item.scaleX), 1);
          ctx.beginPath();
          ctx.arc(0, 0, item.radius, 0, Math.PI * 2);
          ctx.fillStyle = '#f59e0b';
          ctx.fill();
          ctx.lineWidth = 2.5;
          ctx.strokeStyle = '#d97706';
          ctx.stroke();

          // Inner gold ring & coin symbol
          ctx.beginPath();
          ctx.arc(0, 0, item.radius * 0.75, 0, Math.PI * 2);
          ctx.strokeStyle = '#fbbf24';
          ctx.lineWidth = 1;
          ctx.stroke();

          ctx.fillStyle = '#78350f';
          ctx.font = `bold ${Math.round(item.radius * 0.9)}px sans-serif`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText('€', 0, 1);
        } else {
          // Render Floating Euro/Lei Banknote
          ctx.rotate((item.rotation * Math.PI) / 180);
          ctx.fillStyle = '#10b981';
          const w = item.radius * 2.2;
          const h = item.radius * 1.2;
          ctx.fillRect(-w / 2, -h / 2, w, h);
          ctx.strokeStyle = '#059669';
          ctx.lineWidth = 1.5;
          ctx.strokeRect(-w / 2, -h / 2, w, h);

          // Banknote text
          ctx.fillStyle = '#ffffff';
          ctx.font = `bold ${Math.round(h * 0.5)}px monospace`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText('100', 0, 0);
        }

        ctx.restore();
      }
    });

    if (alive && elapsed < 3500) {
      animationFrame = requestAnimationFrame(render);
    } else {
      cancelAnimationFrame(animationFrame);
      if (document.body.contains(canvas)) {
        document.body.removeChild(canvas);
      }
    }
  }

  animationFrame = requestAnimationFrame(render);
}
