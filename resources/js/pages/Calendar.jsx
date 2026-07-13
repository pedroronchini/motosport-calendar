import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useYears } from '../context/YearsContext';
import { fetchCategories, fetchCalendar } from '../api/client';
import Header from '../components/Header';
import RaceModal from '../components/RaceModal';

function formatDate(iso) {
    return new Date(iso).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' });
}

function formatShortDate(iso) {
    return new Date(iso).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
}

function CircuitPlaceholder() {
    return (
        <svg viewBox="0 0 200 120" className="w-full h-full opacity-10" fill="none" stroke="currentColor" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round">
            <path d="M 30 90 Q 20 90 20 80 L 20 50 Q 20 30 40 30 L 80 30 Q 95 30 100 20 Q 105 10 120 10 L 160 10 Q 180 10 180 30 L 180 60 Q 180 75 165 75 L 130 75 Q 110 75 110 90 L 110 100 Q 110 110 100 110 L 60 110 Q 45 110 40 100 Q 35 90 30 90 Z" />
        </svg>
    );
}

function StatusBadge({ status }) {
    if (status === 'finished') {
        return (
            <span className="inline-flex items-center gap-1 rounded-full bg-zinc-800 px-2 py-0.5 text-xs font-medium text-zinc-400">
                Realizada
            </span>
        );
    }
    if (status === 'cancelled') {
        return (
            <span className="inline-flex items-center gap-1 rounded-full bg-red-950 px-2 py-0.5 text-xs font-medium text-red-400">
                Cancelada
            </span>
        );
    }
    if (status === 'postponed') {
        return (
            <span className="inline-flex items-center gap-1 rounded-full bg-amber-950 px-2 py-0.5 text-xs font-medium text-amber-400">
                Adiada
            </span>
        );
    }
    return (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-950 px-2 py-0.5 text-xs font-semibold text-emerald-400 ring-1 ring-emerald-500/30">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Próxima
        </span>
    );
}

function RaceCard({ event, category, isNext, onClick }) {
    const [imgError, setImgError] = useState(false);
    const circuit = event.circuit;

    return (
        <div
            onClick={onClick}
            className={`group relative flex flex-col rounded-2xl overflow-hidden border transition-all duration-200 cursor-pointer hover:scale-[1.02] hover:shadow-xl hover:shadow-black/40
                ${isNext
                    ? 'border-zinc-600 bg-zinc-800/80 ring-1 ring-white/10'
                    : event.status === 'finished'
                        ? 'border-zinc-800/60 bg-zinc-900/60 opacity-70'
                        : 'border-zinc-800 bg-zinc-900 hover:border-zinc-700'
                }`}
        >
            {/* Top accent bar */}
            <div
                className="h-1 w-full flex-shrink-0"
                style={{ backgroundColor: isNext ? '#ffffff44' : category.color }}
            />

            {isNext && (
                <div
                    className="absolute top-3 right-3 text-xs font-bold uppercase tracking-widest px-2 py-1 rounded-full z-10"
                    style={{ backgroundColor: category.color, color: '#fff' }}
                >
                    Próxima
                </div>
            )}

            {/* Text section */}
            <div className="p-4 flex flex-col gap-2 flex-1">
                <div className="flex items-center justify-between">
                    <span className="font-mono text-xs text-zinc-500 font-bold">
                        E{String(event.round).padStart(2, '0')}
                    </span>
                    <StatusBadge status={event.status} />
                </div>

                <div className="flex items-center gap-2">
                    <span className="text-2xl leading-none">{circuit.flag}</span>
                    <span className="text-xs font-bold uppercase tracking-widest text-zinc-400 truncate">
                        {circuit.country}
                    </span>
                </div>

                <h3 className="font-black text-base leading-snug text-white line-clamp-2">
                    {event.name}
                </h3>

                <p className="text-xs text-zinc-500 truncate">{circuit.name}</p>

                <p
                    className="text-sm font-semibold mt-auto pt-1"
                    style={{ color: event.status !== 'finished' ? category.color : undefined }}
                >
                    {formatDate(event.starts_at)}
                </p>
            </div>

            {/* Circuit image section */}
            <div className="h-36 bg-zinc-950/50 relative flex items-center justify-center overflow-hidden">
                {circuit.map_image_url && !imgError ? (
                    <img
                        src={circuit.map_image_url}
                        alt={circuit.name}
                        onError={() => setImgError(true)}
                        className="w-full h-full object-contain p-4 transition-transform duration-500 group-hover:scale-110"
                        style={{ filter: 'brightness(0) invert(1) opacity(0.5)' }}
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center p-4 text-zinc-700">
                        <CircuitPlaceholder />
                    </div>
                )}

                {/* City label overlay */}
                <div className="absolute bottom-2 right-3 text-xs text-zinc-600 font-medium">
                    {circuit.city}
                </div>
            </div>
        </div>
    );
}

export default function Calendar() {
    const { year, id } = useParams();
    const navigate = useNavigate();
    const yearNum = Number(year);
    const { years, currentYear, loading: yearsLoading } = useYears();

    const [category, setCategory] = useState(undefined);
    const [events, setEvents] = useState(undefined);
    const [selectedEvent, setSelectedEvent] = useState(null);

    useEffect(() => {
        let cancelled = false;
        fetchCategories().then((cats) => {
            if (cancelled) return;
            setCategory(cats.find((c) => c.slug === id) ?? null);
        });
        return () => {
            cancelled = true;
        };
    }, [id]);

    useEffect(() => {
        let cancelled = false;
        setEvents(undefined);
        fetchCalendar(id, yearNum).then((data) => !cancelled && setEvents(data));
        return () => {
            cancelled = true;
        };
    }, [id, yearNum]);

    const yearIsKnown = years.length === 0 || years.includes(yearNum);

    if (yearsLoading || category === undefined) {
        return <div className="min-h-screen bg-zinc-950" />;
    }

    if (!yearIsKnown || !category) {
        return (
            <div className="min-h-screen bg-zinc-950 flex items-center justify-center text-white">
                <div className="text-center">
                    <p className="text-zinc-400 mb-4">Categoria não encontrada.</p>
                    <button onClick={() => navigate(`/${currentYear}`)} className="text-white underline hover:no-underline">
                        Voltar ao início
                    </button>
                </div>
            </div>
        );
    }

    if (events === undefined) {
        return <div className="min-h-screen bg-zinc-950" />;
    }

    if (!events || events.length === 0) {
        return (
            <div className="min-h-screen bg-zinc-950 text-white">
                <Header year={yearNum} backTo={`/${yearNum}`} backLabel="Categorias" />
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
                    <div className="text-6xl mb-6">🏁</div>
                    <h2 className="text-2xl font-black text-white mb-3">{category.name} {yearNum}</h2>
                    <p className="text-zinc-400">Calendário desta temporada ainda não está disponível.</p>
                </div>
            </div>
        );
    }

    const completed = events.filter((e) => e.status === 'finished').length;
    const upcoming = events.filter((e) => e.status !== 'finished').length;
    const nextEvent = events.find((e) => e.status !== 'finished');
    const progress = Math.round((completed / events.length) * 100);

    return (
        <div className="min-h-screen bg-zinc-950 text-white">
            <Header year={yearNum} backTo={`/${yearNum}`} backLabel="Categorias" />
            {/* Hero */}
            <div
                className="relative overflow-hidden"
                style={{ background: `linear-gradient(135deg, ${category.color}22 0%, transparent 60%)` }}
            >
                <div className="h-1 w-full" style={{ backgroundColor: category.color }} />
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                    <div className="flex flex-col sm:flex-row sm:items-end gap-6">
                        <div className="flex-1">
                            <span
                                className="inline-block text-xs font-bold uppercase tracking-widest rounded-full px-3 py-1 mb-3"
                                style={{ backgroundColor: category.color + '25', color: category.color }}
                            >
                                Temporada {yearNum}
                            </span>
                            <h1 className="text-4xl sm:text-5xl font-black tracking-tight">{category.name}</h1>
                            <p className="text-zinc-400 mt-2">{category.description}</p>

                            {/* Progress bar */}
                            <div className="mt-5 max-w-xs">
                                <div className="flex justify-between text-xs text-zinc-500 mb-1.5">
                                    <span>{completed} etapas realizadas</span>
                                    <span>{progress}%</span>
                                </div>
                                <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                                    <div
                                        className="h-full rounded-full transition-all duration-700"
                                        style={{ width: `${progress}%`, backgroundColor: category.color }}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-6 sm:gap-8">
                            {[
                                { label: 'Etapas', value: events.length, color: 'text-white' },
                                { label: 'Realizadas', value: completed, color: 'text-zinc-400' },
                                { label: 'Restantes', value: upcoming, color: undefined },
                            ].map(({ label, value, color }) => (
                                <div key={label} className="text-center">
                                    <div
                                        className={`text-3xl font-black ${color || ''}`}
                                        style={!color ? { color: category.color } : undefined}
                                    >
                                        {value}
                                    </div>
                                    <div className="text-xs text-zinc-500 uppercase tracking-wider mt-1">{label}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Next race highlight */}
            {nextEvent && (
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-2">
                    <div
                        className="rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center gap-4 border"
                        style={{
                            background: `linear-gradient(135deg, ${category.color}18, transparent)`,
                            borderColor: category.color + '44',
                        }}
                    >
                        <div className="text-4xl">{nextEvent.circuit.flag}</div>
                        <div className="flex-1">
                            <div className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: category.color }}>
                                Próxima etapa · Rodada {nextEvent.round}
                            </div>
                            <div className="text-xl font-black">{nextEvent.name}</div>
                            <div className="text-sm text-zinc-400">{nextEvent.circuit.name} · {nextEvent.circuit.city}, {nextEvent.circuit.country}</div>
                        </div>
                        <div className="text-right sm:text-right">
                            <div className="text-2xl font-black">{formatShortDate(nextEvent.starts_at)}</div>
                            <div className="text-xs text-zinc-500">
                                {new Date(nextEvent.starts_at).getFullYear()}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Race card grid */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {events.map((event) => (
                        <RaceCard
                            key={event.id}
                            event={event}
                            category={category}
                            isNext={nextEvent && event.round === nextEvent.round}
                            onClick={() => setSelectedEvent(event)}
                        />
                    ))}
                </div>
            </main>

            <footer className="border-t border-zinc-800 mt-8 py-8 text-center text-zinc-500 text-sm">
                Motorsport Calendar &copy; {new Date().getFullYear()}
            </footer>

            {selectedEvent && (
                <RaceModal
                    event={selectedEvent}
                    category={category}
                    onClose={() => setSelectedEvent(null)}
                />
            )}
        </div>
    );
}
