/* ── BatchMind Workflow — Interactivity ── */

document.addEventListener('DOMContentLoaded', () => {

  /* ───── 1. Scroll-reveal cards ───── */
  const cards = document.querySelectorAll('.card');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        // stagger entrance
        setTimeout(() => entry.target.classList.add('visible'), i * 80);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  cards.forEach(c => observer.observe(c));

  /* ───── 2. Toggle detail panels ───── */
  document.querySelectorAll('.card-toggle').forEach(btn => {
    btn.addEventListener('click', () => {
      const card = btn.closest('.card');
      const detail = card.querySelector('.card-detail');
      const isOpen = detail.classList.contains('open');

      // close all others first
      document.querySelectorAll('.card-detail.open').forEach(d => {
        d.classList.remove('open');
        d.closest('.card').querySelector('.card-toggle').textContent = '＋';
      });

      if (!isOpen) {
        detail.classList.add('open');
        btn.textContent = '－';
      }
    });
  });

  /* ───── 3. Play-flow animation ───── */
  const playBtn = document.getElementById('playBtn');
  let playing = false;

  playBtn.addEventListener('click', async () => {
    if (playing) return;
    playing = true;
    playBtn.textContent = '⏳ Playing…';
    playBtn.disabled = true;

    // reset
    cards.forEach(c => {
      c.classList.remove('active-step');
      c.classList.add('visible'); // make sure all are visible
    });

    const orderedCards = [...cards].sort((a, b) =>
      Number(a.dataset.step) - Number(b.dataset.step)
    );

    for (const card of orderedCards) {
      card.classList.add('active-step');
      card.scrollIntoView({ behavior: 'smooth', block: 'center' });

      // open detail briefly
      const detail = card.querySelector('.card-detail');
      const toggleBtn = card.querySelector('.card-toggle');
      if (detail) {
        detail.classList.add('open');
        toggleBtn.textContent = '－';
      }

      await sleep(1400);

      // close detail
      if (detail) {
        detail.classList.remove('open');
        toggleBtn.textContent = '＋';
      }
    }

    // final state — highlight all
    await sleep(400);
    orderedCards.forEach(c => c.classList.add('active-step'));

    // pulse effect then clear
    await sleep(2000);
    orderedCards.forEach(c => c.classList.remove('active-step'));

    playBtn.textContent = '▶ Play Flow';
    playBtn.disabled = false;
    playing = false;
  });

  /* ───── 4. Keyboard accessibility ───── */
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.card-detail.open').forEach(d => {
        d.classList.remove('open');
        d.closest('.card').querySelector('.card-toggle').textContent = '＋';
      });
    }
  });

  /* ───── 5. Immediate reveal for above-fold cards ───── */
  setTimeout(() => {
    cards.forEach(c => {
      const rect = c.getBoundingClientRect();
      if (rect.top < window.innerHeight) {
        c.classList.add('visible');
      }
    });
  }, 100);

});

/* ── Utility ── */
function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}
