'use client';

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import { type Language, getTranslation } from './translations';

interface LanguageContextType {
    lang: Language;
    setLang: (lang: Language) => void;
    t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType>({
    lang: 'en',
    setLang: () => {},
    t: (key) => key,
});

export function LanguageProvider({ children }: { children: ReactNode }) {
    const [lang, setLangState] = useState<Language>('en');
    const [isLoaded, setIsLoaded] = useState(false);

    // Load saved language on mount
    useEffect(() => {
        const saved = localStorage.getItem('app-language') as Language | null;
        if (saved && (saved === 'en' || saved === 'sw')) {
            setLangState(saved);
        }
        setIsLoaded(true);
    }, []);

    const setLang = useCallback((newLang: Language) => {
        setLangState(newLang);
        localStorage.setItem('app-language', newLang);
    }, []);

    const t = useCallback((key: string) => {
        return getTranslation(key, lang);
    }, [lang]);

    // Don't render until we've loaded the saved preference to avoid flash
    if (!isLoaded) return null;

    return (
        <LanguageContext.Provider value={{ lang, setLang, t }}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    return useContext(LanguageContext);
}
