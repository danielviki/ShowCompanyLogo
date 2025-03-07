import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { authService } from '../services/auth';
import { imageLoader } from '../services/imageLoader';
import placeholderImage from '../assets/placeholder.png';

export function CompanyCard({ company }) {
    const { t, i18n } = useTranslation();
    const [logoUrl, setLogoUrl] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [imageLoaded, setImageLoaded] = useState(false);
    const imageRef = useRef(null);

    // Get description and introduction based on current language
    const description = i18n.language === 'zh' 
        ? company.acf?.company_description_cn 
        : company.acf?.company_description;

    const introduction = i18n.language === 'zh'
        ? company.acf?.company_intro_cn
        : company.acf?.company_intro;

    useEffect(() => {
        let mounted = true;

        async function loadLogo() {
            try {
                setIsLoading(true);
                const mediaId = company.acf?.logo_url;
                if (mediaId) {
                    const mediaUrl = await authService.fetchMediaWithAuth(mediaId);
                    if (mediaUrl && mounted) {
                        setLogoUrl(mediaUrl);
                    }
                }
            } catch (err) {
                console.error('Error loading logo:', err);
            } finally {
                if (mounted) {
                    setIsLoading(false);
                }
            }
        }

        loadLogo();
        return () => { mounted = false; };
    }, [company]);

    useEffect(() => {
        // Initialize lazy loading when logo URL is set
        if (!imageRef.current || !logoUrl) return;

        const currentImg = imageRef.current;
        imageLoader.observe(currentImg);

        return () => {
            if (currentImg) {
                imageLoader.cleanup(currentImg);
            }
        };
    }, [logoUrl]);

    return (
        <div className="company-card">
            <div className="logo-container">
                <img 
                    ref={imageRef}
                    src={placeholderImage}
                    data-src={logoUrl}
                    alt={company.title?.rendered || t('companyLogo')}
                    className={`company-logo ${isLoading ? 'loading' : ''} ${imageLoaded ? 'loaded' : ''}`}
                    onLoad={() => setImageLoaded(true)}
                    onError={(e) => {
                        console.error('Image load error:', e);
                        e.target.src = placeholderImage;
                        e.target.className = 'company-logo placeholder';
                    }}
                />
            </div>

            {/* Company Information */}
            <div className="company-info">
                <h3 className="company-title">{company.title?.rendered}</h3>
                
                {/* Description */}
                {description && (
                    <div className="company-description">
                        <h4>{t('description')}</h4>
                        <p>{description}</p>
                    </div>
                )}

                {/* Introduction */}
                {introduction && (
                    <div className="company-introduction">
                        <h4>{t('introduction')}</h4>
                        <p>{introduction}</p>
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