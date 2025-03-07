// Lazy image loader class / 图片懒加载类
// Uses IntersectionObserver API / 使用IntersectionObserver API
class ImageLoader {
  constructor() {
    this.observer = null;
    this.options = {
      rootMargin: '50px 0px',    // 预加载阈值调整
      threshold: 0.1             // 图片显示10%时触发
    };
  }

  // Initialize for specific container
  init(containerSelector = '.company-grid') {
    if (!('IntersectionObserver' in window)) {
      console.warn('IntersectionObserver not supported');
      return;
    }

    this.observer = new IntersectionObserver(
      this.handleIntersection.bind(this),
      this.options
    );

    // Observe all lazy images in the container
    const container = document.querySelector(containerSelector);
    if (container) {
      const images = container.querySelectorAll('img[data-src]');
      images.forEach(img => this.observer.observe(img));
    }
  }

  handleIntersection(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        this.loadImage(entry.target);
        this.observer.unobserve(entry.target);
      }
    });
  }

  loadImage(img) {
    const src = img.getAttribute('data-src');
    if (!src) return;

    img.classList.add('loading');
    
    img.onload = () => {
      img.classList.remove('loading');
      img.classList.add('loaded');
    };

    img.src = src;
    img.removeAttribute('data-src');
  }

  destroy() {
    if (this.observer) {
      this.observer.disconnect();
    }
  }
}

export const imageLoader = new ImageLoader();
