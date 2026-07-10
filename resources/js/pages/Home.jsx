import { useParams, Navigate } from 'react-router-dom';
import { categories } from '../data/categories';
import { AVAILABLE_YEARS, CURRENT_YEAR, getCalendar } from '../data/seasons';
import Header from '../components/Header';
import CategoryCard from '../components/CategoryCard';
import ThisWeekend from '../components/ThisWeekend';

export default function Home() {
    const { year } = useParams();
    const yearNum = Number(year);

    if (!AVAILABLE_YEARS.includes(yearNum)) {
        return <Navigate to={`/${CURRENT_YEAR}`} replace />;
    }

    const isCurrentYear = yearNum === CURRENT_YEAR;

    return (
        <div className="min-h-screen bg-zinc-950 text-white">
            <Header year={yearNum} />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="mb-10">
                    <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-white mb-3">
                        Calendários{' '}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-orange-400">
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

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {categories.map((category) => {
                        const cal = getCalendar(yearNum, category.id);
                        return (
                            <CategoryCard
                                key={category.id}
                                category={category}
                                year={yearNum}
                                hasData={Array.isArray(cal) && cal.length > 0}
                            />
                        );
                    })}
                </div>
            </main>

            <footer className="border-t border-zinc-800 mt-16 py-8 text-center text-zinc-500 text-sm">
                Motorsport Calendar &copy; {new Date().getFullYear()}
            </footer>
        </div>
    );
}
