import { useNavigate } from 'react-router-dom';
import { getThisWeekendRaces } from '../utils/weekend';

function formatShortDate(d) {
    return d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
}

function formatRaceDate(dateStr) {
    const d = new Date(dateStr + 'T12:00:00');
    return d.toLocaleDateString('pt-BR', { weekday: 'short', day: '2-digit', month: 'short' });
}

export default function ThisWeekend() {
    const navigate = useNavigate();
    const { results, friday, sunday } = getThisWeekendRaces();

    if (results.length === 0) return null;

    return (
        <section className="mb-12">
            <div className="flex items-center gap-3 mb-4">
                <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500" />
                </span>
                <h2 className="text-xl font-black tracking-tight text-white">
                    Este fim de semana
                </h2>
                <span className="text-zinc-500 text-sm font-medium">
                    {formatShortDate(friday)} – {formatShortDate(sunday)}
                </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                {results.map(({ category, races }) =>
                    races.map((race) => (
                        <button
                            key={`${category.id}-${race.round}`}
                            onClick={() => navigate(`/calendar/${category.id}`)}
                            className="group text-left rounded-xl border border-zinc-800 bg-zinc-900 hover:bg-zinc-800 hover:border-zinc-700 transition-all duration-200 overflow-hidden focus:outline-none focus:ring-2 focus:ring-white/20"
                        >
                            <div className="h-1 w-full" style={{ backgroundColor: category.color }} />
                            <div className="p-4">
                                <div className="flex items-center justify-between mb-2">
                                    <span
                                        className="text-xs font-bold uppercase tracking-widest"
                                        style={{ color: category.color }}
                                    >
                                        {category.shortName}
                                    </span>
                                    <span className="text-xl">{race.flag}</span>
                                </div>
                                <p className="text-sm font-semibold text-white leading-snug mb-1 group-hover:text-white/90">
                                    {race.name}
                                </p>
                                <p className="text-xs text-zinc-500 truncate mb-3">{race.circuit}</p>
                                <div className="flex items-center justify-between">
                                    <span className="text-xs text-zinc-400 font-medium capitalize">
                                        {formatRaceDate(race.date)}
                                    </span>
                                    <svg
                                        className="w-3.5 h-3.5 text-zinc-600 group-hover:text-zinc-400 transition-colors"
                                        fill="none" stroke="currentColor" viewBox="0 0 24 24"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </div>
                            </div>
                        </button>
                    ))
                )}
            </div>
        </section>
    );
}
