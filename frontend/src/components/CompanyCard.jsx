import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { authService } from '../services/auth';
import { imageLoader } from '../services/imageLoader';
import placeholderImage from '../assets/placeholder.png';

export function CompanyCard({ company }) {
    const { t } = useTranslation('common');  // Specify namespace
    const [logoUrl, setLogoUrl] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [imageLoaded, setImageLoaded] = useState(false);
    const imageRef = useRef(null);

    // 获取当前语言的内容
    const description = company.acf?.company_description;
    const introduction = company.acf?.company_intro;

    useEffect(() => {
        let mounted = true;

        async function loadLogo() {
            const controller = new AbortController();
            try {
                setIsLoading(true);
                const mediaId = company.acf?.logo_url;
                if (mediaId) {
                    const mediaUrl = await authService.fetchMediaWithAuth(mediaId);
                    if (mediaUrl && mounted) {
                        try {
                            // 预加载图片
                            await imageLoader.enqueuePreload(mediaUrl, controller.signal);
                            if (!controller.signal.aborted && mounted) {
                                setLogoUrl(mediaUrl);
                            }
                        } catch (preloadError) {
                            console.error('Image preload failed:', preloadError);
                            // 由onError处理备用图片
                        }
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
                        e.target.src = placeholderImage;
                        e.target.className = 'company-logo placeholder';
                    }}
                />
            </div>
            <div className="company-info">
                <h3 className="company-title">{company.title?.rendered}</h3>
                
                {company.acf?.company_description && (
                    <div className="company-description">
                        <h4>{t('description')}</h4>
                        <p>{company.acf.company_description}</p>
                    </div>
                )}

                {company.acf?.company_intro && (
                    <div className="company-introduction">
                        <h4>{t('introduction')}</h4>
                        <p>{company.acf.company_intro}</p>
                    </div>
                )}

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
