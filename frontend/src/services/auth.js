class AuthService {
    constructor() {
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

    async fetchMediaWithAuth(mediaId) {
        try {
            const response = await this.fetchWithAuth(
                `${this.apiUrl}/wp-json/wp/v2/media/${mediaId}`
            );
            
            if (!response.ok) {
                throw new Error('Failed to fetch media');
            }
            
            const mediaData = await response.json();
            return mediaData.source_url;
        } catch (error) {
            console.error('Media fetch error:', error);
            throw error;
        }
    }

    isAuthenticated() {
        return this.token && Date.now() < this.tokenExpiry;
    }
}

export const authService = new AuthService();

