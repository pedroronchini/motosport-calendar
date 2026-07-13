import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useYears } from '../context/YearsContext';

export default function Header({ year, backTo, backLabel }) {
    const navigate = useNavigate();
    const { years, currentYear } = useYears();
    const [open, setOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        function handleClick(e) {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClick);
        return () => document.removeEventListener('mousedown', handleClick);
    }, []);

    function handleYearSelect(y) {
        setOpen(false);
        navigate(`/${y}`);
    }

    return (
        <header className="border-b border-zinc-800 bg-zinc-900/60 backdrop-blur-sm sticky top-0 z-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center gap-3">
                {/* Back button */}
                {backTo && (
                    <>
                        <button
                            onClick={() => navigate(backTo)}
                            className="flex items-center gap-1.5 text-zinc-400 hover:text-white transition-colors"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                            <span className="text-sm font-medium hidden sm:block">{backLabel || 'Voltar'}</span>
                        </button>
                        <span className="text-zinc-700 text-sm">/</span>
                    </>
                )}

                {/* Logo */}
                <button
                    onClick={() => navigate(`/${year}`)}
                    className="flex items-center gap-2 hover:opacity-80 transition-opacity"
                >
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-red-500 to-orange-400 flex items-center justify-center flex-shrink-0">
                        <svg className="w-3.5 h-3.5 text-white" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z" />
                        </svg>
                    </div>
                    <span className="font-black text-sm tracking-tight text-white hidden sm:block">
                        Motorsport Calendar
                    </span>
                </button>

                {/* Spacer */}
                <div className="flex-1" />

                {/* Year selector */}
                <div className="relative" ref={dropdownRef}>
                    <button
                        onClick={() => setOpen((v) => !v)}
                        className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 hover:border-zinc-600 transition-all text-sm font-bold text-white"
                    >
                        <svg className="w-3.5 h-3.5 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        {year}
                        <svg
                            className={`w-3.5 h-3.5 text-zinc-400 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
                            fill="none" stroke="currentColor" viewBox="0 0 24 24"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    </button>

                    {open && (
                        <div className="absolute right-0 top-full mt-2 w-44 bg-zinc-900 border border-zinc-700 rounded-xl shadow-2xl shadow-black/60 overflow-hidden z-30">
                            <div className="px-3 py-2 border-b border-zinc-800">
                                <span className="text-xs text-zinc-500 font-semibold uppercase tracking-wider">
                                    Temporada
                                </span>
                            </div>
                            {years.map((y) => {
                                const isActive = y === Number(year);
                                const isCurrent = y === currentYear;

                                return (
                                    <button
                                        key={y}
                                        onClick={() => handleYearSelect(y)}
                                        className={`w-full flex items-center justify-between px-3 py-2.5 text-sm transition-colors
                                            ${isActive
                                                ? 'bg-zinc-700 text-white font-bold'
                                                : 'text-zinc-300 hover:bg-zinc-800 hover:text-white'
                                            }`}
                                    >
                                        <div className="flex items-center gap-2">
                                            {isActive && (
                                                <span className="w-1.5 h-1.5 rounded-full bg-white flex-shrink-0" />
                                            )}
                                            <span className={isActive ? '' : 'ml-3.5'}>{y}</span>
                                        </div>
                                        {isCurrent && (
                                            <span className="text-xs text-emerald-400 font-semibold">atual</span>
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}
