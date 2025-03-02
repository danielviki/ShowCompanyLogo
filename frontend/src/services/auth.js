// Authentication service class / 认证服务类
// Handles JWT authentication and API requests / 处理JWT认证和API请求
class AuthService {
    constructor() {
        // Validate environment variables / 验证环境变量
        if (!process.env.VITE_WP_USERNAME || !process.env.VITE_WP_PASSWORD) {
            throw new Error('Missing required environment variables');
        }

        this.credentials = {
            username: process.env.VITE_WP_USERNAME,
            password: process.env.VITE_WP_PASSWORD
        };
        this.apiUrl = process.env.VITE_API_URL;

        this.token = null;
        this.tokenExpiry = null;
        this.userInfo = null;
    }

    // Perform JWT authentication / 执行JWT认证
    // Returns token and user info / 返回令牌和用户信息
    async authenticate() {
        try {
            // JWT Authentication request
            const response = await fetch(`${this.apiUrl}/wp-json/jwt-auth/v1/token`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(this.credentials)
            });

            if (!response.ok) {
                throw new Error('Authentication failed');
            }

            const data = await response.json();
            
            // Store authentication data
            this.token = data.token;
            this.tokenExpiry = Date.now() + (6 * 24 * 60 * 60 * 1000); // 6 days
            this.userInfo = {
                email: data.user_email,
                nicename: data.user_nicename,
                displayName: data.user_display_name
            };

            return data;
        } catch (error) {
            console.error('Authentication error:', error);
            throw error;
        }
    }

    // Fetch wrapper with authorization header / 带认证头的Fetch封装
    // Automatically retries on 401 unauthorized / 401未授权时自动重试
    async fetchWithAuth(url, options = {}) {
        try {
            const response = await fetch(url, {
                ...options,
                credentials: 'include',
                headers: {
                    ...options.headers,
                    'Authorization': `Bearer ${this.token}`
                }
            });

            if (response.status === 401) {
                this.token = null;
                return this.fetchWithAuth(url, options);
            }

            return response;
        } catch (error) {
            console.error('API request failed:', error);
            throw error;
        }
    }

    // Get media URL with authentication / 通过认证获取媒体URL
    // mediaId: WordPress media ID / mediaId: WordPress媒体ID
    async fetchMediaWithAuth(mediaId) {
        try {
            const response = await this.fetchWithAuth(
                `${this.apiUrl}/wp-json/wp/v2/media/${mediaId}`
            );

            if (!response.ok) {
                throw new Error(`Failed to fetch media: ${response.statusText}`);
            }

            const mediaData = await response.json();
            
            // Check if 'media_details' and 'sizes' exist, and if 'thumbnail' is available
            if (mediaData.media_details && mediaData.media_details.sizes && mediaData.media_details.sizes.thumbnail) {
                return mediaData.media_details.sizes.thumbnail.source_url;
            } else {
                console.warn(`Thumbnail not available for media ID: ${mediaId}, falling back to full size.`);
                return mediaData.source_url; // Fallback to full-size URL if thumbnail is not available
            }
        } catch (error) {
            console.error('Media fetch error:', error);
            throw error;
        }
    }

    // Check authentication status / 检查认证状态
    // Verifies token existence and expiration / 验证令牌存在性和有效期
    isAuthenticated() {
        return this.token && Date.now() < this.tokenExpiry;
    }
}

export const authService = new AuthService();
