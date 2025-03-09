import React, { Suspense } from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { App } from './App'
import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import Backend from 'i18next-http-backend'
import LanguageDetector from 'i18next-browser-languagedetector'
import './assets/main.css'
import { ErrorBoundary } from './components/ErrorBoundary'

// i18next initialization
const i18nInstance = i18n
    .use(Backend)
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        backend: {
            loadPath: '/locales/{{lng}}/common.json'
        },
        fallbackLng: 'en',
        supportedLngs: ['en', 'zh'],
        ns: ['common'],
        defaultNS: 'common',
        debug: true, // Enable debug for troubleshooting
        interpolation: {
            escapeValue: false,
        },
        detection: {
            order: ['path', 'querystring', 'cookie', 'localStorage', 'navigator'],
            lookupFromPathIndex: 0,
            caches: ['localStorage', 'cookie'],
        },
        react: {
            useSuspense: true,
        }
    });

// Ensure i18n is initialized before rendering
await i18nInstance;

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <ErrorBoundary>
            <BrowserRouter>
                <Suspense fallback={<div>Loading...</div>}>
                    <Routes>
                        <Route path="/" element={<Navigate to="/en" replace />} />
                        <Route path="/:lang/*" element={<App />} />
                    </Routes>
                </Suspense>
            </BrowserRouter>
        </ErrorBoundary>
    </React.StrictMode>
);
