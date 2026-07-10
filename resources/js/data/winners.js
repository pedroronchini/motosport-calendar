// Keyed by `${year}-${categoryId}-${round}`
// drivers: array — 1 piloto (F1, IndyCar…), 2 (GT) ou 3 (Hypercar WEC)
const WINNERS = {
    // ── F1 2025 (rounds 1-10 realizados) ─────────────────────────────
    '2025-f1-1':  { team: 'McLaren',          drivers: ['Lando Norris'] },
    '2025-f1-2':  { team: 'Red Bull Racing',  drivers: ['Max Verstappen'] },
    '2025-f1-3':  { team: 'Red Bull Racing',  drivers: ['Max Verstappen'] },
    '2025-f1-4':  { team: 'McLaren',          drivers: ['Oscar Piastri'] },
    '2025-f1-5':  { team: 'McLaren',          drivers: ['Lando Norris'] },
    '2025-f1-6':  { team: 'McLaren',          drivers: ['Lando Norris'] },
    '2025-f1-7':  { team: 'Red Bull Racing',  drivers: ['Max Verstappen'] },
    '2025-f1-8':  { team: 'Ferrari',          drivers: ['Charles Leclerc'] },
    '2025-f1-9':  { team: 'McLaren',          drivers: ['Oscar Piastri'] },
    '2025-f1-10': { team: 'McLaren',          drivers: ['Lando Norris'] },

    // ── F1 2024 (temporada completa) ──────────────────────────────────
    '2024-f1-1':  { team: 'Red Bull Racing',  drivers: ['Max Verstappen'] },
    '2024-f1-2':  { team: 'Red Bull Racing',  drivers: ['Max Verstappen'] },
    '2024-f1-3':  { team: 'Ferrari',          drivers: ['Carlos Sainz'] },
    '2024-f1-4':  { team: 'Red Bull Racing',  drivers: ['Max Verstappen'] },
    '2024-f1-5':  { team: 'Red Bull Racing',  drivers: ['Max Verstappen'] },
    '2024-f1-6':  { team: 'McLaren',          drivers: ['Lando Norris'] },
    '2024-f1-7':  { team: 'Red Bull Racing',  drivers: ['Max Verstappen'] },
    '2024-f1-8':  { team: 'Ferrari',          drivers: ['Charles Leclerc'] },
    '2024-f1-9':  { team: 'Red Bull Racing',  drivers: ['Max Verstappen'] },
    '2024-f1-10': { team: 'Red Bull Racing',  drivers: ['Max Verstappen'] },
    '2024-f1-11': { team: 'Mercedes',         drivers: ['George Russell'] },
    '2024-f1-12': { team: 'Mercedes',         drivers: ['Lewis Hamilton'] },
    '2024-f1-13': { team: 'McLaren',          drivers: ['Oscar Piastri'] },
    '2024-f1-14': { team: 'Mercedes',         drivers: ['Lewis Hamilton'] },
    '2024-f1-15': { team: 'McLaren',          drivers: ['Lando Norris'] },
    '2024-f1-16': { team: 'Ferrari',          drivers: ['Charles Leclerc'] },
    '2024-f1-17': { team: 'McLaren',          drivers: ['Oscar Piastri'] },
    '2024-f1-18': { team: 'McLaren',          drivers: ['Lando Norris'] },
    '2024-f1-19': { team: 'Ferrari',          drivers: ['Charles Leclerc'] },
    '2024-f1-20': { team: 'Ferrari',          drivers: ['Carlos Sainz'] },
    '2024-f1-21': { team: 'Red Bull Racing',  drivers: ['Max Verstappen'] },
    '2024-f1-22': { team: 'Ferrari',          drivers: ['Carlos Sainz'] },
    '2024-f1-23': { team: 'Red Bull Racing',  drivers: ['Max Verstappen'] },
    '2024-f1-24': { team: 'McLaren',          drivers: ['Lando Norris'] },

    // ── WEC 2025 (rounds 1-5 realizados) ─────────────────────────────
    '2025-wec-1': { team: 'Toyota Gazoo Racing', drivers: ['Sébastien Buemi', 'Brendon Hartley', 'Ryō Hirakawa'] },
    '2025-wec-2': { team: 'Porsche Penske Motorsport', drivers: ['Kevin Estre', 'André Lotterer', 'Laurens Vanthoor'] },
    '2025-wec-3': { team: 'Ferrari AF Corse',    drivers: ['Antonio Fuoco', 'Miguel Molina', 'Nicklas Nielsen'] },
    '2025-wec-4': { team: 'Toyota Gazoo Racing', drivers: ['Mike Conway', 'Kamui Kobayashi', 'José María López'] },
    '2025-wec-5': { team: 'Ferrari AF Corse',    drivers: ['Antonio Fuoco', 'Miguel Molina', 'Nicklas Nielsen'] },

    // ── WEC 2024 (temporada completa) ─────────────────────────────────
    '2024-wec-1': { team: 'Toyota Gazoo Racing',        drivers: ['Sébastien Buemi', 'Brendon Hartley', 'Ryō Hirakawa'] },
    '2024-wec-2': { team: 'Ferrari AF Corse',           drivers: ['Antonio Fuoco', 'Miguel Molina', 'Nicklas Nielsen'] },
    '2024-wec-3': { team: 'Porsche Penske Motorsport',  drivers: ['Kevin Estre', 'André Lotterer', 'Laurens Vanthoor'] },
    '2024-wec-4': { team: 'Ferrari AF Corse',           drivers: ['Antonio Fuoco', 'Miguel Molina', 'Nicklas Nielsen'] },
    '2024-wec-5': { team: 'Ferrari AF Corse',           drivers: ['Antonio Fuoco', 'Miguel Molina', 'Nicklas Nielsen'] },
    '2024-wec-6': { team: 'Toyota Gazoo Racing',        drivers: ['Mike Conway', 'Kamui Kobayashi', 'José María López'] },
    '2024-wec-7': { team: 'Toyota Gazoo Racing',        drivers: ['Sébastien Buemi', 'Brendon Hartley', 'Ryō Hirakawa'] },
    '2024-wec-8': { team: 'Porsche Penske Motorsport',  drivers: ['Kevin Estre', 'André Lotterer', 'Laurens Vanthoor'] },
    '2024-wec-9': { team: 'Toyota Gazoo Racing',        drivers: ['Mike Conway', 'Kamui Kobayashi', 'José María López'] },

    // ── MotoGP 2025 (rounds 1-6 realizados) ──────────────────────────
    '2025-motogp-1': { team: 'Ducati Lenovo Team', drivers: ['Francesco Bagnaia'] },
    '2025-motogp-2': { team: 'Gresini Racing',     drivers: ['Marc Marquez'] },
    '2025-motogp-3': { team: 'Gresini Racing',     drivers: ['Marc Marquez'] },
    '2025-motogp-4': { team: 'Ducati Lenovo Team', drivers: ['Francesco Bagnaia'] },
    '2025-motogp-5': { team: 'Gresini Racing',     drivers: ['Marc Marquez'] },
    '2025-motogp-6': { team: 'Ducati Lenovo Team', drivers: ['Francesco Bagnaia'] },
};

export function getWinner(year, categoryId, round) {
    return WINNERS[`${year}-${categoryId}-${round}`] ?? null;
}
