import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { YearsProvider, useYears } from './context/YearsContext';
import Home from './pages/Home';
import Calendar from './pages/Calendar';

function AppRoutes() {
    const { currentYear, loading } = useYears();

    if (loading) {
        return <div className="min-h-screen bg-zinc-950" />;
    }

    return (
        <Routes>
            <Route path="/" element={<Navigate to={`/${currentYear}`} replace />} />
            <Route path="/:year" element={<Home />} />
            <Route path="/:year/calendar/:id" element={<Calendar />} />
            <Route path="*" element={<Navigate to={`/${currentYear}`} replace />} />
        </Routes>
    );
}

export default function App() {
    return (
        <BrowserRouter>
            <YearsProvider>
                <AppRoutes />
            </YearsProvider>
        </BrowserRouter>
    );
}
