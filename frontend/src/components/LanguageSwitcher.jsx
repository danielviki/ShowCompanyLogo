import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

export function LanguageSwitcher() {
    const { i18n } = useTranslation();
    const navigate = useNavigate();

    const toggleLanguage = () => {
        const newLang = i18n.language === 'en' ? 'zh' : 'en';
        i18n.changeLanguage(newLang);
        navigate(`/${newLang}`, { replace: true });
    };

    return (
        <button 
            onClick={toggleLanguage}
            className="language-switcher">
            {i18n.language === 'en' ? '中文' : 'English'}
        </button>
    );
}