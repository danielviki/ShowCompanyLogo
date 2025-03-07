import React from 'react';
import { useTranslation } from 'react-i18next';

export function LanguageSwitcher() {
    const { i18n } = useTranslation();

    const toggleLanguage = () => {
        const newLang = i18n.language === 'en' ? 'zh' : 'en';
        i18n.changeLanguage(newLang);
    };

    return (
        <button 
            onClick={toggleLanguage}
            className="language-switcher">
            {i18n.language === 'en' ? '中文' : 'English'}
        </button>
    );
}