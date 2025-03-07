import React from 'react';
import { useTranslation } from 'react-i18next';

export function Navbar() {
    const { t, i18n } = useTranslation('common');

    const handleLanguageChange = async (event) => {
        try {
            await i18n.changeLanguage(event.target.value);
        } catch (error) {
            console.error('Language change failed:', error);
        }
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-light sticky-top">
            <div className="container">
                <a className="navbar-brand" href="#">
                    <img src="/src/assets/logo.png" alt={t('companyLogo')} width="40" height="40" />
                    <span className="navbar-title">{t('title')}</span>
                </a>
                <div className="language-select-wrapper">
                    <select 
                        className="form-control form-control-sm"
                        onChange={handleLanguageChange}
                        value={i18n.language}
                    >
                        <option value="en">English</option>
                        <option value="zh">中文</option>
                    </select>
                </div>
            </div>
        </nav>
    );
}