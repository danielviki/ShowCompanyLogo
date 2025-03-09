import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams, useNavigate } from 'react-router-dom';
import { LanguageSwitcher } from './components/LanguageSwitcher';
import { CompanyList } from './components/CompanyList';
import { authService } from './services/auth';
import { imageLoader } from './services/imageLoader';

export function App() {
    const [companies, setCompanies] = useState([]);
    const [error, setError] = useState(null);
    const { lang } = useParams();
    const navigate = useNavigate();
    const { t, i18n } = useTranslation('common');

    useEffect(() => {
        if (lang && lang !== i18n.language) {
            console.log('Changing language to:', lang);
            i18n.changeLanguage(lang);
        }
    }, [lang, i18n]);

    useEffect(() => {
        if (i18n.language !== lang) {
            navigate(`/${i18n.language}`, { replace: true });
        }
    }, [i18n.language, lang, navigate]);

    useEffect(() => {
        fetchCompanies();
        imageLoader.init();
        return () => imageLoader.cleanup();
    }, []);

    async function fetchCompanies() {
        try {
            if (!authService.isAuthenticated()) {
                await authService.authenticate();
            }

            const response = await authService.fetchWithAuth(
                `${authService.apiUrl}/wp-json/wp/v2/company`
            );

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            setCompanies(data);
            setError(null);
        } catch (err) {
            console.error('Error fetching companies:', err);
            setError(t('fetchError'));
        }
    }

    return (
        <div className="app">
            <LanguageSwitcher />
            <header className="app-header">
                <h1 className="main-title">{t('title')}</h1>
                <p className="subtitle">{t('subtitle')}</p>
            </header>
            <main className="main-content">
                <div className="container">
                    <CompanyList />
                </div>
            </main>
        </div>
    );
}