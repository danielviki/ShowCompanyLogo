import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { CompanyCard } from './CompanyCard';
import { authService } from '../services/auth';

export function CompanyList() {
    const [companies, setCompanies] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const { t, i18n } = useTranslation();

    useEffect(() => {
        async function fetchCompanies() {
            try {
                setIsLoading(true);
                setError(null);
                const data = await authService.fetchCompanies();
                
                // Filter companies by current language
                const filteredData = data.filter(company => {
                    const urlParts = company.link.split('/');
                    const linkLang = urlParts.find(part => part === 'en' || part === 'zh');
                    return linkLang === i18n.language;
                });
                
                setCompanies(filteredData);
            } catch (err) {
                console.error('Error fetching companies:', err);
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        }

        fetchCompanies();
    }, [i18n.language]);

    if (isLoading) return <div className="loading">{t('loading')}</div>;
    if (error) return <div className="error">{t('errorLoading')}</div>;

    return (
        <div className="company-grid">
            {companies.map(company => (
                <CompanyCard key={company.id} company={company} />
            ))}
        </div>
    );
}