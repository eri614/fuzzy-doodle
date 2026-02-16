const filterButtons = document.querySelectorAll('.filter-btn');
const sections = document.querySelectorAll('.menu-section');
const yearEl = document.getElementById('year');

if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}

filterButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const filter = button.dataset.filter;

    filterButtons.forEach((btn) => {
      const active = btn === button;
      btn.classList.toggle('active', active);
      btn.setAttribute('aria-pressed', String(active));
    });

    sections.forEach((section) => {
      const show = filter === 'all' || section.dataset.category === filter;
      section.hidden = !show;
    });
  });
});
