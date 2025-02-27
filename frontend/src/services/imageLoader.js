export class ImageLoader {
    constructor() {
        this.observer = null;
        this.initIntersectionObserver();
    }

    initIntersectionObserver() {
        if ('IntersectionObserver' in window) {
            this.observer = new IntersectionObserver(
                (entries) => {
                    entries.forEach(entry => {
                        console.log('Observing image:', entry.target, 'isIntersecting:', entry.isIntersecting);
                        if (entry.isIntersecting) {
                            console.log('Loading image:', entry.target.dataset.src);
                            this.loadImage(entry.target);
                            this.observer.unobserve(entry.target);
                        }
                    });
                },
                {
                    root: null,
                    rootMargin: '200px 0px 200px 0px', // 增加上下预加载区域
                    threshold: 0.01 // 降低触发阈值
                }
            );
        } else {
            console.warn('IntersectionObserver not supported, loading all images immediately');
            this.loadAllImages();
        }
    }

    observe(imageElement) {
        if (this.observer) {
            this.observer.observe(imageElement);
        } else {
            this.loadImage(imageElement);
        }
    }

    loadImage(img) {
        const src = img.getAttribute('data-src');
        if (!src) return;

        img.classList.add('loading');
        
        return new Promise((resolve, reject) => {
            img.onload = () => {
                img.classList.remove('loading');
                img.classList.add('loaded');
                resolve(img);
            };
            img.onerror = () => {
                img.classList.remove('loading');
                img.classList.add('error');
                img.src = 'placeholder.png';
                reject(new Error(`Failed to load image: ${src}`));
            };
            img.src = src;
        });
    }

    loadAllImages() {
        // 降级方案：直接加载所有图片
        document.querySelectorAll('img[data-src]').forEach(img => {
            this.loadImage(img);
        });
    }
}
