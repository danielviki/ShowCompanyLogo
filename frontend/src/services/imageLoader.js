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

    imagePreload(url, signal) {
        return new Promise((resolve, reject) => {
            if (signal?.aborted) {
                return reject(new DOMException('Aborted', 'AbortError'));
            }

            const img = new Image();
            const abortHandler = () => {
                img.onload = null;
                img.onerror = null;
                img.src = '';
                reject(new DOMException('Aborted', 'AbortError'));
            };

            img.src = url;
            
            img.onload = () => {
                signal?.removeEventListener('abort', abortHandler);
                resolve(img);
            };
            
            img.onerror = (error) => {
                signal?.removeEventListener('abort', abortHandler);
                const errorType = img.naturalWidth === 0 ? 
                    new Error('Image decode failed') : 
                    error.status === 404 ? 
                    new Error('Image not found (404)') : 
                    new Error('Network error');
                reject(errorType);
            };

            signal?.addEventListener('abort', abortHandler);
        });
    }

    // 预加载队列控制（最大并发数5）
    preloadQueue = [];
    activePreloads = 0;
    MAX_CONCURRENT_PRELOADS = 5;

    async enqueuePreload(url, signal) {
        return new Promise((resolve, reject) => {
            const task = async () => {
                try {
                    this.activePreloads++;
                    const result = await this.imagePreload(url, signal);
                    resolve(result);
                } catch (error) {
                    reject(error);
                } finally {
                    this.activePreloads--;
                    this.processQueue();
                }
            };

            this.preloadQueue.push(task);
            this.processQueue();
        });
    }

    processQueue() {
        while (this.preloadQueue.length > 0 && this.activePreloads < this.MAX_CONCURRENT_PRELOADS) {
            const task = this.preloadQueue.shift();
            task();
        }
    }

    cleanup(imageElement) {
        if (this.observer && imageElement) {
            this.observer.unobserve(imageElement);
            this.observedImages.delete(imageElement);
        }
    }
}

export const imageLoader = new ImageLoader();
