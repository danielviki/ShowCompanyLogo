import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams, useNavigate } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { CompanyList } from './components/CompanyList';
import { LoadingSpinner } from './components/LoadingSpinner';
import { authService } from './services/auth';
import { imageLoader } from './services/imageLoader';

export function App() {
    const [companies, setCompanies] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
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
        setLoading(true);
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
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="app">
            <Navbar />
            <main className="main-content">
                <div className="container">
                    {loading ? (
                        <LoadingSpinner />
                    ) : (
                        <CompanyList />
                    )}
                </div>
            </main>
        </div>
    );
}
