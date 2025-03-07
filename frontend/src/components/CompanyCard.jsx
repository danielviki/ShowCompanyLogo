import React, { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { authService } from '../services/auth';
import placeholderImage from '../assets/placeholder.png';

export function CompanyCard({ company }) {
    const { t } = useTranslation();
    const [logoUrl, setLogoUrl] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [imageLoaded, setImageLoaded] = useState(false);

    // Memoize loadLogo function
    const loadLogo = useCallback(async () => {
        // Skip if we already have a URL
        if (logoUrl) return;

        try {
            setIsLoading(true);
            const mediaId = company.acf?.logo_url;
            if (mediaId) {
                const mediaUrl = await authService.fetchMediaWithAuth(mediaId);
                if (mediaUrl && mediaUrl !== logoUrl) {
                    setLogoUrl(mediaUrl);
                }
            }
        } catch (err) {
            console.error('Error loading logo:', err);
        } finally {
            setIsLoading(false);
        }
    }, [company.acf?.logo_url, logoUrl]);

    useEffect(() => {
        loadLogo();
    }, [loadLogo]);

    const handleImageLoad = () => {
        console.log('Image loaded successfully:', logoUrl);
        setImageLoaded(true);
        setIsLoading(false);
    };

    const handleImageError = (e) => {
        console.error('Image failed to load:', logoUrl);
        e.target.src = placeholderImage;
        e.target.className = 'company-logo placeholder';
        setIsLoading(false);
    };

    return (
        <div className="company-card">
            <div className="logo-container">
                <img 
                    src={logoUrl || placeholderImage}
                    alt={company.title?.rendered || t('companyLogo')}
                    className={`company-logo ${isLoading ? 'loading' : ''} ${imageLoaded ? 'loaded' : ''}`}
                    onLoad={handleImageLoad}
                    onError={handleImageError}
                />
            </div>

            {/* Company Information */}
            <div className="company-info">
                <h3 className="company-title">{company.title?.rendered}</h3>
                
                {/* Description */}
                {company.acf?.company_description && (
                    <div className="company-description">
                        <h4>{t('description')}</h4>
                        <p>{company.acf.company_description}</p>
                    </div>
                )}

                {/* Introduction */}
                {company.acf?.company_intro && (
                    <div className="company-introduction">
                        <h4>{t('introduction')}</h4>
                        <p>{company.acf.company_intro}</p>
                    </div>
                )}

                {/* Contact Information */}
                {(company.acf?.company_website || company.acf?.contact_email) && (
                    <div className="company-contact">
                        <h4>{t('contact')}</h4>
                        {company.acf?.company_website && (
                            <p>
                                <strong>{t('website')}: </strong>
                                <a 
                                    href={company.acf.company_website}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    {company.acf.company_website}
                                </a>
                            </p>
                        )}
                        {company.acf?.contact_email && (
                            <p>
                                <strong>{t('email')}: </strong>
                                <a href={`mailto:${company.acf.contact_email}`}>
                                    {company.acf.contact_email}
                                </a>
                            </p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}