const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const setupReveal = () => {
  const revealItems = document.querySelectorAll(".reveal");
  if (!revealItems.length) return;

  if (prefersReducedMotion || !("IntersectionObserver" in window)) {
    revealItems.forEach((item) => item.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        obs.unobserve(entry.target);
      });
    },
    { threshold: 0.16, rootMargin: "0px 0px -6% 0px" }
  );

  revealItems.forEach((item, index) => {
    item.style.transitionDelay = `${Math.min(index * 35, 260)}ms`;
    observer.observe(item);
  });
};

const setupParallax = () => {
  if (prefersReducedMotion) return;

  const parallaxItems = document.querySelectorAll(".parallax");
  if (!parallaxItems.length) return;

  const runParallax = () => {
    const scrollY = window.scrollY || window.pageYOffset;

    parallaxItems.forEach((item) => {
      const speed = Number(item.dataset.parallaxSpeed || 0.12);
      const y = Math.max(-24, Math.min(24, scrollY * speed * 0.12));
      item.style.transform = `translate3d(0, ${y}px, 0)`;
    });
  };

  runParallax();
  window.addEventListener("scroll", runParallax, { passive: true });
};

const setupInteractiveCards = () => {
  if (prefersReducedMotion || window.matchMedia("(hover: none), (pointer: coarse)").matches) return;

  const cards = document.querySelectorAll(".interactive-card");
  cards.forEach((card) => {
    let rafId;

    const onMove = (event) => {
      const rect = card.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      const rotateY = ((x / rect.width) - 0.5) * 8;
      const rotateX = (0.5 - (y / rect.height)) * 8;

      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        card.style.transform = `perspective(700px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-5px)`;
      });
    };

    const reset = () => {
      cancelAnimationFrame(rafId);
      card.style.transform = "";
    };

    card.addEventListener("mousemove", onMove);
    card.addEventListener("mouseleave", reset);
    card.addEventListener("blur", reset);
  });
};

const setupFormAnimation = () => {
  const form = document.querySelector(".request-form");
  if (!form) return;

  const trigger = () => {
    form.classList.remove("is-animated");
    void form.offsetWidth;
    form.classList.add("is-animated");
  };

  form.addEventListener("focusin", trigger);
};

setupReveal();
setupParallax();
setupInteractiveCards();
setupFormAnimation();
