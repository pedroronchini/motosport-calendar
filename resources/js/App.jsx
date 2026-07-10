import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { CURRENT_YEAR } from './data/seasons';
import Home from './pages/Home';
import Calendar from './pages/Calendar';

export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Navigate to={`/${CURRENT_YEAR}`} replace />} />
                <Route path="/:year" element={<Home />} />
                <Route path="/:year/calendar/:id" element={<Calendar />} />
                <Route path="*" element={<Navigate to={`/${CURRENT_YEAR}`} replace />} />
            </Routes>
        </BrowserRouter>
    );
}
