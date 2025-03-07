import React, { Suspense } from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { App } from './App'
import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import Backend from 'i18next-http-backend'
import LanguageDetector from 'i18next-browser-languagedetector'
import './assets/main.css'

// i18next initialization
const i18nInstance = i18n
    .use(Backend)
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        fallbackLng: 'en',
        supportedLngs: ['en', 'zh'],
        debug: process.env.NODE_ENV === 'development',
        interpolation: {
            escapeValue: false,
        },
        backend: {
            loadPath: '/locales/{{lng}}/{{ns}}.json',
        },
        ns: ['common'],
        defaultNS: 'common',
        detection: {
            order: ['path', 'querystring', 'cookie', 'localStorage', 'navigator'],
            lookupFromPathIndex: 0,
            caches: ['localStorage', 'cookie'],
        },
        react: {
            useSuspense: true,
            defaultLocale: 'en',
        }
    });

// Wait for i18next to initialize before rendering
await i18nInstance;

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <BrowserRouter>
            <Suspense fallback={<div>Loading...</div>}>
                <Routes>
                    <Route path="/" element={<Navigate to="/en" replace />} />
                    <Route path="/:lang" element={<App />} />
                </Routes>
            </Suspense>
        </BrowserRouter>
    </React.StrictMode>
);
