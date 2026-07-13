import { useEffect, useState } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { useYears } from '../context/YearsContext';
import { fetchCategories } from '../api/client';
import Header from '../components/Header';
import CategoryCard from '../components/CategoryCard';
import ThisWeekend from '../components/ThisWeekend';

export default function Home() {
    const { year } = useParams();
    const yearNum = Number(year);
    const { years, currentYear, loading: yearsLoading } = useYears();
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    const yearIsKnown = years.length === 0 || years.includes(yearNum);

    useEffect(() => {
        if (yearsLoading || !yearIsKnown) return;
        let cancelled = false;
        setLoading(true);
        fetchCategories(yearNum)
            .then((data) => !cancelled && setCategories(data))
            .finally(() => !cancelled && setLoading(false));
        return () => {
            cancelled = true;
        };
    }, [yearNum, yearsLoading, yearIsKnown]);

    if (yearsLoading) {
        return <div className="min-h-screen bg-zinc-950" />;
    }

    if (!yearIsKnown) {
        return <Navigate to={`/${currentYear}`} replace />;
    }

    const isCurrentYear = yearNum === currentYear;

    return (
        <div className="min-h-screen bg-zinc-950 text-white">
            <Header year={yearNum} />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="mb-10">
                    <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-white mb-3">
                        Calendários{' '}
                        <span className="text-transparent bg-clip-text bg-linear-to-r from-red-400 to-orange-400">
                            {yearNum}
                        </span>
                    </h1>
                    <p className="text-zinc-400 text-lg">
                        {isCurrentYear
                            ? 'Selecione uma categoria para ver o calendário completo da temporada.'
                            : `Calendários da temporada ${yearNum}. Categorias sem dados estarão disponíveis em breve.`}
                    </p>
                </div>

                {isCurrentYear && <ThisWeekend />}

                {loading ? (
                    <div className="text-zinc-500">Carregando categorias...</div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {categories.map((category) => (
                            <CategoryCard
                                key={category.slug}
                                category={category}
                                year={yearNum}
                                hasData={!!category.has_calendar}
                            />
                        ))}
                    </div>
                )}
            </main>

            <footer className="border-t border-zinc-800 mt-16 py-8 text-center text-zinc-500 text-sm">
                Motorsport Calendar &copy; {new Date().getFullYear()}
            </footer>
        </div>
    );
}
