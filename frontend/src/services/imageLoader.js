// Lazy image loader class / 图片懒加载类
// Uses IntersectionObserver API / 使用IntersectionObserver API
class ImageLoader {
  constructor() {
    // Configuration for IntersectionObserver / IntersectionObserver配置
    this.images = document.querySelectorAll('img.lazy-load');
    this.observer = null;
    this.options = {
      rootMargin: '0px 0px 100px 0px', // Adjust as needed
      threshold: 0,
    };
  }

  // Initialize lazy loading / 初始化懒加载
  // Checks browser support first / 先检查浏览器支持
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

  // Handle intersection events / 处理交叉观察事件
  // Loads images when they enter viewport / 当图片进入视口时加载
  handleIntersection(entries, observer) {
    entries.forEach((entry) => {
      if (entry.isIntersecting && entry.target.dataset.loaded === 'false') {
        this.loadImage(entry.target);
        entry.target.dataset.loaded = 'true';
        this.observer.unobserve(entry.target); // Stop observing after loading
      }
    });
  }

  // Load individual image / 加载单个图片
  // Manages loading state classes / 管理加载状态类
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

  // Fallback for unsupported browsers / 不支持浏览器的回退方案
  // Load all images immediately / 立即加载所有图片
  loadAll() {
    this.images.forEach((img) => {
      this.loadImage(img);
    });
  }
}

export { ImageLoader };
