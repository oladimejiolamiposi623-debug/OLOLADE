/**
 * LADE LUXURY TRENDZ — CINEMATIC HERO SLIDER
 * Slider Revolution style with Ken Burns slow zoom, layered text animations,
 * autoplay progress line, touch swipe, and manual navigation controls.
 */

document.addEventListener('DOMContentLoaded', () => {
  const slider = document.querySelector('.hero-slider-wrapper');
  if (!slider) return;

  const slides = slider.querySelectorAll('.hero-slide');
  const dots = slider.querySelectorAll('.hero-dot-btn');
  const prevBtn = slider.querySelector('.hero-arrow-prev');
  const nextBtn = slider.querySelector('.hero-arrow-next');
  const currentCounter = slider.querySelector('.hero-counter-current');
  const totalCounter = slider.querySelector('.hero-counter-total');
  const progressFill = slider.querySelector('.hero-progress-fill');

  let currentIndex = 0;
  const totalSlides = slides.length;
  const slideDuration = 7000; // 7 seconds per slide
  let slideTimer = null;
  let progressAnimation = null;
  let progressStartTime = 0;
  let isPaused = false;
  let touchStartX = 0;
  let touchEndX = 0;

  if (totalCounter) {
    totalCounter.textContent = String(totalSlides).padStart(2, '0');
  }

  // Ken Burns zoom variation classes
  const kenBurnsEffects = [
    'kenburns-zoom-in',
    'kenburns-zoom-out',
    'kenburns-pan-right',
    'kenburns-pan-left'
  ];

  function activateSlide(index, direction = 'next') {
    if (index === currentIndex && slides[index].classList.contains('active')) return;

    // Remove active state from current
    slides.forEach((slide, i) => {
      slide.classList.remove('active');
      const bg = slide.querySelector('.hero-slide-bg');
      if (bg) {
        kenBurnsEffects.forEach(effect => bg.classList.remove(effect));
      }
    });

    dots.forEach(dot => dot.classList.remove('active'));

    // Update index
    currentIndex = (index + totalSlides) % totalSlides;

    // Activate new slide
    const targetSlide = slides[currentIndex];
    targetSlide.classList.add('active');

    // Apply varied Ken Burns effect to background
    const targetBg = targetSlide.querySelector('.hero-slide-bg');
    if (targetBg) {
      const effect = kenBurnsEffects[currentIndex % kenBurnsEffects.length];
      targetBg.classList.add(effect);
    }

    // Update dots
    if (dots[currentIndex]) {
      dots[currentIndex].classList.add('active');
    }

    // Update counter
    if (currentCounter) {
      currentCounter.textContent = String(currentIndex + 1).padStart(2, '0');
    }

    // Restart timer & progress
    resetSlideTimer();
  }

  function nextSlide() {
    activateSlide(currentIndex + 1, 'next');
  }

  function prevSlide() {
    activateSlide(currentIndex - 1, 'prev');
  }

  function updateProgress(timestamp) {
    if (!progressStartTime) progressStartTime = timestamp;
    if (!isPaused) {
      const elapsed = timestamp - progressStartTime;
      const progress = Math.min((elapsed / slideDuration) * 100, 100);
      if (progressFill) {
        progressFill.style.width = `${progress}%`;
      }

      if (elapsed >= slideDuration) {
        nextSlide();
        return;
      }
    }
    progressAnimation = requestAnimationFrame(updateProgress);
  }

  function resetSlideTimer() {
    cancelAnimationFrame(progressAnimation);
    if (progressFill) progressFill.style.width = '0%';
    progressStartTime = 0;
    progressAnimation = requestAnimationFrame(updateProgress);
  }

  // Event Listeners for Controls
  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      nextSlide();
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      prevSlide();
    });
  }

  dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
      activateSlide(index);
    });
  });

  // Pause on hover
  slider.addEventListener('mouseenter', () => {
    isPaused = true;
  });

  slider.addEventListener('mouseleave', () => {
    isPaused = false;
  });

  // Touch navigation for mobile/tablets
  slider.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  slider.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
  }, { passive: true });

  function handleSwipe() {
    const swipeDistance = touchEndX - touchStartX;
    if (Math.abs(swipeDistance) > 45) {
      if (swipeDistance < 0) {
        nextSlide(); // swipe left
      } else {
        prevSlide(); // swipe right
      }
    }
  }

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') {
      const rect = slider.getBoundingClientRect();
      if (rect.top <= window.innerHeight && rect.bottom >= 0) {
        nextSlide();
      }
    } else if (e.key === 'ArrowLeft') {
      const rect = slider.getBoundingClientRect();
      if (rect.top <= window.innerHeight && rect.bottom >= 0) {
        prevSlide();
      }
    }
  });

  // Initial activation
  activateSlide(0);
});
