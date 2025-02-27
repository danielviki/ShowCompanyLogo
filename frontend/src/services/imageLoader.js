// imageLoader.js
class ImageLoader {
  constructor() {
    this.images = document.querySelectorAll('img.lazy-load');
    this.observer = null;
    this.options = {
      rootMargin: '0px 0px 100px 0px', // Adjust as needed
      threshold: 0,
    };
  }

  init() {
    if ('IntersectionObserver' in window) {
      this.observer = new IntersectionObserver(
        this.handleIntersection.bind(this),
        this.options
      );
      this.images.forEach((img) => this.observer.observe(img));
    } else {
      this.loadAll();
    }
  }

  handleIntersection(entries, observer) {
    entries.forEach((entry) => {
      if (entry.isIntersecting && entry.target.dataset.loaded === 'false') {
        this.loadImage(entry.target);
        entry.target.dataset.loaded = 'true';
        this.observer.unobserve(entry.target); // Stop observing after loading
      }
    });
  }

  loadImage(img) {
    const dataSrc = img.getAttribute('data-src');
    if (dataSrc) {
        img.classList.add('loading');
      img.onload = () => {
        img.classList.remove('loading');
      };
      img.src = dataSrc;
    }
  }

  loadAll() {
    this.images.forEach((img) => {
      this.loadImage(img);
    });
  }
}

export { ImageLoader };
