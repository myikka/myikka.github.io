// Softly highlights the menu link of the section being read, and makes the Support & Feedback
// button stand out more once the page is scrolled down.
// The site's own script: it reads nothing about the visitor, stores nothing and sends nothing.

const READING_LINE = 0.35; // A section is "being read" once its top passes 35% down the screen.
const RAISED_AFTER = 64; // Pixels scrolled before the Support & Feedback button stands out more.

const supportButton = document.querySelector(".support-cta");

const pairs = [...document.querySelectorAll(".header-nav a[href*='#']")]
  .map((link) => [link, document.getElementById(link.hash.slice(1))])
  .filter(([, section]) => section);

/** The menu link of the section being read, or null above the first one. */
function currentLink() {
  const atBottom =
    window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2;
  if (atBottom) return pairs[pairs.length - 1][0];
  const line = window.innerHeight * READING_LINE;
  let found = null;
  for (const [link, section] of pairs) {
    if (section.getBoundingClientRect().top <= line) found = link;
  }
  return found;
}

function highlight() {
  supportButton?.classList.toggle("is-raised", window.scrollY > RAISED_AFTER);
  if (!pairs.length) return;
  const current = currentLink();
  for (const [link] of pairs) {
    if (link === current) link.setAttribute("aria-current", "location");
    else link.removeAttribute("aria-current");
  }
}

let scheduled = false;

/** Recalculate at most once per frame while scrolling. */
function schedule() {
  if (scheduled) return;
  scheduled = true;
  requestAnimationFrame(() => {
    scheduled = false;
    highlight();
  });
}

if (pairs.length || supportButton) {
  window.addEventListener("scroll", schedule, { passive: true });
  window.addEventListener("resize", schedule);
  highlight();
}
