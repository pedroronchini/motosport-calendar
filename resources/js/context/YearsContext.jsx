import { createContext, useContext, useEffect, useState } from 'react';
import { fetchYears } from '../api/client';

const YearsContext = createContext(null);

export function YearsProvider({ children }) {
    const [state, setState] = useState({ years: [], currentYear: new Date().getFullYear(), loading: true });

    useEffect(() => {
        let cancelled = false;
        fetchYears()
            .then(({ years, current_year }) => {
                if (cancelled) return;
                setState({
                    years,
                    currentYear: current_year ?? years[0] ?? new Date().getFullYear(),
                    loading: false,
                });
            })
            .catch(() => {
                if (cancelled) return;
                setState((prev) => ({ ...prev, loading: false }));
            });
        return () => {
            cancelled = true;
        };
    }, []);

    return <YearsContext.Provider value={state}>{children}</YearsContext.Provider>;
}

export function useYears() {
    const context = useContext(YearsContext);
    if (!context) {
        throw new Error('useYears must be used within a YearsProvider');
    }
    return context;
}
