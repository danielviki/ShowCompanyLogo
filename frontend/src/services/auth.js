// Public directory access: never send shared credentials or browser cookies.
class PublicDirectoryService {
    constructor() {
        this.baseUrl = (import.meta.env.PUBLIC_API_URL || '').replace(/\/$/, '') + '/wp-json/wp/v2';
    }
    async read(path) {
        const response = await fetch(this.baseUrl + path, { credentials: 'omit' });
        if (!response.ok) throw new Error('Directory request failed: ' + response.status);
        return response.json();
    }
    async fetchCompanies() { return this.read('/company'); }
    async fetchMediaWithAuth(mediaId) {
        // Keep the existing component API while using anonymous public media.
        if (!/^\d+$/.test(String(mediaId))) throw new Error('Invalid media ID');
        const media = await this.read('/media/' + mediaId);
        return media.media_details?.sizes?.medium?.source_url || media.source_url;
    }
}
export const authService = new PublicDirectoryService();
