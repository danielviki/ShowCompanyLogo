import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { LanguageSwitcher } from './components/LanguageSwitcher';
import { CompanyCard } from './components/CompanyCard';
import { authService } from './services/auth';

export function App() {
    const [companies, setCompanies] = useState([]);
    const [error, setError] = useState(null);
    const { t } = useTranslation();

    useEffect(() => {
        fetchCompanies();
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
                <h1>{t('title')}</h1>
                <p>{t('subtitle')}</p>
            </header>
            <main className="company-grid">
                {error ? (
                    <p className="error-message">{error}</p>
                ) : (
                    companies.map(company => (
                        <CompanyCard 
                            key={company.id} 
                            company={company} 
                        />
                    ))
                )}
            </main>
        </div>
    );
}