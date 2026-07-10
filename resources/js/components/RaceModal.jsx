import { useEffect, useState } from 'react';
import { getCircuitImage } from '../data/circuitImages';
import { CIRCUIT_STATS } from '../data/circuitStats';
import { getSchedule, MAIN_SESSIONS } from '../data/schedules';
import { getWinner } from '../data/winners';

function StatBox({ label, value, sub }) {
    return (
        <div className="bg-zinc-800/60 rounded-xl p-3 flex flex-col gap-0.5">
            <span className="text-xs text-zinc-500 uppercase tracking-wider font-semibold">{label}</span>
            <span className="text-lg font-black text-white leading-tight">{value ?? '–'}</span>
            {sub && <span className="text-xs text-zinc-500">{sub}</span>}
        </div>
    );
}

export default function RaceModal({ race, category, categoryId, year, onClose }) {
    const [imgError, setImgError] = useState(false);
    const circuitImageUrl = getCircuitImage(race.circuit);
    const stats = CIRCUIT_STATS[race.circuit] ?? null;
    const schedule = getSchedule(categoryId, race);
    const winner = race.status === 'completed' ? getWinner(year, categoryId, race.round) : null;

    // Close on Escape, lock scroll
    useEffect(() => {
        function onKey(e) { if (e.key === 'Escape') onClose(); }
        document.addEventListener('keydown', onKey);
        document.body.style.overflow = 'hidden';
        return () => {
            document.removeEventListener('keydown', onKey);
            document.body.style.overflow = '';
        };
    }, [onClose]);

    const raceDate = new Date(race.date + 'T12:00:00');
    const formattedDate = raceDate.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' });

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={onClose}
        >
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/75 backdrop-blur-sm" />

            {/* Panel */}
            <div
                className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-zinc-900 border border-zinc-700 shadow-2xl shadow-black/60 flex flex-col"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Close */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-zinc-800 hover:bg-zinc-700 flex items-center justify-center text-zinc-400 hover:text-white transition-colors"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                {/* Circuit image hero */}
                <div className="relative h-44 bg-zinc-950 flex items-center justify-center overflow-hidden rounded-t-2xl flex-shrink-0">
                    <div className="absolute inset-0 opacity-20" style={{ background: `radial-gradient(circle at center, ${category.color}, transparent 70%)` }} />
                    {circuitImageUrl && !imgError ? (
                        <img
                            src={circuitImageUrl}
                            alt={race.circuit}
                            onError={() => setImgError(true)}
                            className="w-full h-full object-contain p-6"
                            style={{ filter: 'brightness(0) invert(1) opacity(0.7)' }}
                        />
                    ) : (
                        <svg viewBox="0 0 200 120" className="w-64 h-40 opacity-15" fill="none" stroke="white" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M 30 90 Q 20 90 20 80 L 20 50 Q 20 30 40 30 L 80 30 Q 95 30 100 20 Q 105 10 120 10 L 160 10 Q 180 10 180 30 L 180 60 Q 180 75 165 75 L 130 75 Q 110 75 110 90 L 110 100 Q 110 110 100 110 L 60 110 Q 45 110 40 100 Q 35 90 30 90 Z" />
                        </svg>
                    )}
                    {/* Bottom category color bar */}
                    <div className="absolute bottom-0 left-0 right-0 h-1" style={{ backgroundColor: category.color }} />
                </div>

                {/* Header info */}
                <div className="px-6 pt-5 pb-4 border-b border-zinc-800">
                    <div className="flex items-start gap-4">
                        <span className="text-4xl leading-none mt-1">{race.flag}</span>
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                                <span
                                    className="text-xs font-bold uppercase tracking-widest"
                                    style={{ color: category.color }}
                                >
                                    {category.shortName}
                                </span>
                                <span className="text-zinc-700">·</span>
                                <span className="text-xs text-zinc-500 font-mono">Etapa {race.round}</span>
                            </div>
                            <h2 className="text-xl font-black text-white leading-tight">{race.name}</h2>
                            <p className="text-sm text-zinc-400 mt-0.5">{race.circuit}</p>
                            <p className="text-xs text-zinc-500 mt-1">{race.city}, {race.country} · {formattedDate}</p>
                        </div>
                    </div>
                </div>

                {/* Winner banner */}
                {winner && (
                    <div
                        className="mx-6 mt-5 rounded-2xl overflow-hidden"
                        style={{ background: `linear-gradient(135deg, ${category.color}28, ${category.color}0a)`, border: `1px solid ${category.color}40` }}
                    >
                        <div className="flex items-center gap-4 px-5 py-4">
                            <div
                                className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 text-lg"
                                style={{ backgroundColor: category.color + '30' }}
                            >
                                🏆
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-xs font-bold uppercase tracking-widest mb-0.5" style={{ color: category.color }}>
                                    Vencedor
                                </p>
                                <p className="text-base font-black text-white leading-snug truncate">
                                    {winner.drivers.join(' · ')}
                                </p>
                                <p className="text-sm text-zinc-400 truncate">{winner.team}</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Body: schedule + circuit stats */}
                <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {/* Schedule */}
                    <div>
                        <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-3">
                            Programação
                        </h3>
                        <div className="space-y-1.5">
                            {schedule.map(({ session, day, time }) => {
                                const isMain = MAIN_SESSIONS.has(session);
                                return (
                                    <div
                                        key={session}
                                        className={`flex items-center justify-between rounded-lg px-3 py-2 ${
                                            isMain
                                                ? 'bg-zinc-800 ring-1 ring-zinc-600'
                                                : 'bg-zinc-800/40'
                                        }`}
                                    >
                                        <div>
                                            <span className={`text-sm font-semibold ${isMain ? 'text-white' : 'text-zinc-300'}`}>
                                                {session}
                                            </span>
                                            <span className="block text-xs text-zinc-500 capitalize">{day}</span>
                                        </div>
                                        <span
                                            className={`text-sm font-bold tabular-nums ${isMain ? 'text-white' : 'text-zinc-400'}`}
                                            style={isMain ? { color: category.color } : undefined}
                                        >
                                            {time !== '–' ? time : <span className="text-zinc-600 font-normal text-xs">A confirmar</span>}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                        {schedule.some(s => s.time !== '–') && (
                            <p className="text-xs text-zinc-600 mt-2">* Horário local no circuito</p>
                        )}
                    </div>

                    {/* Circuit Stats */}
                    <div>
                        <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-3">
                            Dados do Circuito
                        </h3>
                        {stats ? (
                            <div className="space-y-2">
                                <div className="grid grid-cols-2 gap-2">
                                    <StatBox label="Comprimento" value={`${stats.length} km`} />
                                    {stats.laps && <StatBox label="Voltas" value={stats.laps} />}
                                    <StatBox label="Curvas" value={stats.turns} />
                                    {stats.drsZones > 0 && <StatBox label="Zonas DRS" value={stats.drsZones} />}
                                    <StatBox label="Tipo" value={stats.type} />
                                    <StatBox label="1º GP" value={stats.firstGP} />
                                </div>
                                {stats.record && (
                                    <div className="bg-zinc-800/60 rounded-xl p-3">
                                        <span className="text-xs text-zinc-500 uppercase tracking-wider font-semibold block mb-1">
                                            Recorde de Volta
                                        </span>
                                        <span className="text-xl font-black text-white tabular-nums">
                                            {stats.record.time}
                                        </span>
                                        <span className="text-xs text-zinc-400 block mt-0.5">
                                            {stats.record.driver} · {stats.record.year}
                                        </span>
                                    </div>
                                )}
                                {stats.length && stats.laps && (
                                    <div className="bg-zinc-800/40 rounded-xl px-3 py-2 flex items-center justify-between">
                                        <span className="text-xs text-zinc-500 uppercase tracking-wider font-semibold">Distância total</span>
                                        <span className="text-sm font-bold text-zinc-300">
                                            {(stats.length * stats.laps).toFixed(1)} km
                                        </span>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="rounded-xl border border-zinc-800 bg-zinc-800/20 flex items-center justify-center h-32">
                                <p className="text-zinc-600 text-sm">Dados não disponíveis</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
