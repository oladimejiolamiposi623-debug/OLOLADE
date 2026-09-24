/**
 * LADE LUXURY TRENDZ — SCROLL REVEAL & INTERACTIVE ANIMATIONS
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Intersection Observer for Scroll Reveals
  const revealElements = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    }, {
      root: null,
      rootMargin: '0px 0px -60px 0px',
      threshold: 0.12
    });

    revealElements.forEach(el => revealObserver.observe(el));
  } else {
    // Fallback if observer not supported
    revealElements.forEach(el => el.classList.add('revealed'));
  }

  // 2. Testimonials Carousel
  const testimonialSlider = document.querySelector('.testimonials-slider-box');
  if (testimonialSlider) {
    const track = testimonialSlider.querySelector('.testimonial-track');
    const slides = testimonialSlider.querySelectorAll('.testimonial-slide');
    const prevBtn = testimonialSlider.querySelector('.testimonial-prev');
    const nextBtn = testimonialSlider.querySelector('.testimonial-next');
    let currentIndex = 0;
    const totalSlides = slides.length;

    function updateTestimonial(index) {
      currentIndex = (index + totalSlides) % totalSlides;
      if (track) {
        track.style.transform = `translateX(-${currentIndex * 100}%)`;
      }
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', () => updateTestimonial(currentIndex - 1));
    }
    if (nextBtn) {
      nextBtn.addEventListener('click', () => updateTestimonial(currentIndex + 1));
    }

    // Auto rotate every 6 seconds
    let autoRotate = setInterval(() => {
      updateTestimonial(currentIndex + 1);
    }, 6000);

    testimonialSlider.addEventListener('mouseenter', () => clearInterval(autoRotate));
    testimonialSlider.addEventListener('mouseleave', () => {
      autoRotate = setInterval(() => {
        updateTestimonial(currentIndex + 1);
      }, 6000);
    });
  }

  // 3. Signature Selection Product Filtering
  const filterButtons = document.querySelectorAll('.filter-btn');
  const productCards = document.querySelectorAll('.product-card');

  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      productCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 50);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(15px)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 300);
        }
      });
    });
  });
});
