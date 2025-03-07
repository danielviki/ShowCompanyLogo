// Lazy image loader class / 图片懒加载类
// Uses IntersectionObserver API / 使用IntersectionObserver API
class ImageLoader {
    constructor() {
        this.observer = null;
        this.options = {
            root: null,
            rootMargin: '50px 0px',
            threshold: 0.1
        };
        this.observedImages = new Set();
    }

    init() {
        if (!('IntersectionObserver' in window)) {
            console.warn('IntersectionObserver not supported');
            return;
        }

        this.observer = new IntersectionObserver(
            this.handleIntersection.bind(this),
            this.options
        );
    }

    observe(imageElement) {
        if (!this.observer || !imageElement || this.observedImages.has(imageElement)) {
            return;
        }

        this.observer.observe(imageElement);
        this.observedImages.add(imageElement);
    }

    handleIntersection(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                const src = img.dataset.src;

                if (src) {
                    img.src = src;
                    img.classList.add('loaded');
                    img.removeAttribute('data-src');
                }

                this.observer.unobserve(img);
                this.observedImages.delete(img);
            }
        });
    }

    cleanup(imageElement) {
        if (this.observer && imageElement) {
            this.observer.unobserve(imageElement);
            this.observedImages.delete(imageElement);
        }
    }
}

export const imageLoader = new ImageLoader();
