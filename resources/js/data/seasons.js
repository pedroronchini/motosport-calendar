import { calendars as c2025 } from './categories';

export const CURRENT_YEAR = 2025;
export const AVAILABLE_YEARS = [2025, 2024, 2023];

// ── 2024 F1 (temporada completa, todas realizadas) ────────────────────
const f1_2024 = [
    { round: 1,  name: 'Grande Prêmio do Bahrein',        circuit: 'Bahrain International Circuit',      city: 'Sakhir',          country: 'Bahrein',       flag: '🇧🇭', date: '2024-03-02', status: 'completed' },
    { round: 2,  name: 'Grande Prêmio da Arábia Saudita', circuit: 'Jeddah Corniche Circuit',            city: 'Jeddah',          country: 'Arábia Saudita', flag: '🇸🇦', date: '2024-03-09', status: 'completed' },
    { round: 3,  name: 'Grande Prêmio da Austrália',      circuit: 'Albert Park Circuit',                city: 'Melbourne',       country: 'Austrália',     flag: '🇦🇺', date: '2024-03-24', status: 'completed' },
    { round: 4,  name: 'Grande Prêmio do Japão',          circuit: 'Suzuka International Racing Course', city: 'Suzuka',          country: 'Japão',         flag: '🇯🇵', date: '2024-04-07', status: 'completed' },
    { round: 5,  name: 'Grande Prêmio da China',          circuit: 'Shanghai International Circuit',     city: 'Xangai',          country: 'China',         flag: '🇨🇳', date: '2024-04-21', status: 'completed' },
    { round: 6,  name: 'Grande Prêmio de Miami',          circuit: 'Miami International Autodrome',      city: 'Miami',           country: 'EUA',           flag: '🇺🇸', date: '2024-05-05', status: 'completed' },
    { round: 7,  name: 'Grande Prêmio da Emilia Romagna', circuit: 'Autodromo Enzo e Dino Ferrari',      city: 'Imola',           country: 'Itália',        flag: '🇮🇹', date: '2024-05-19', status: 'completed' },
    { round: 8,  name: 'Grande Prêmio de Mônaco',         circuit: 'Circuit de Monaco',                  city: 'Monte Carlo',     country: 'Mônaco',        flag: '🇲🇨', date: '2024-05-26', status: 'completed' },
    { round: 9,  name: 'Grande Prêmio do Canadá',         circuit: 'Circuit Gilles Villeneuve',          city: 'Montreal',        country: 'Canadá',        flag: '🇨🇦', date: '2024-06-09', status: 'completed' },
    { round: 10, name: 'Grande Prêmio da Espanha',        circuit: 'Circuit de Barcelona-Catalunya',     city: 'Barcelona',       country: 'Espanha',       flag: '🇪🇸', date: '2024-06-23', status: 'completed' },
    { round: 11, name: 'Grande Prêmio da Áustria',        circuit: 'Red Bull Ring',                      city: 'Spielberg',       country: 'Áustria',       flag: '🇦🇹', date: '2024-06-30', status: 'completed' },
    { round: 12, name: 'Grande Prêmio da Grã-Bretanha',   circuit: 'Silverstone Circuit',                city: 'Silverstone',     country: 'Reino Unido',   flag: '🇬🇧', date: '2024-07-07', status: 'completed' },
    { round: 13, name: 'Grande Prêmio da Hungria',        circuit: 'Hungaroring',                        city: 'Budapest',        country: 'Hungria',       flag: '🇭🇺', date: '2024-07-21', status: 'completed' },
    { round: 14, name: 'Grande Prêmio da Bélgica',        circuit: 'Circuit de Spa-Francorchamps',       city: 'Spa',             country: 'Bélgica',       flag: '🇧🇪', date: '2024-07-28', status: 'completed' },
    { round: 15, name: 'Grande Prêmio dos Países Baixos', circuit: 'Circuit Zandvoort',                  city: 'Zandvoort',       country: 'Países Baixos', flag: '🇳🇱', date: '2024-08-25', status: 'completed' },
    { round: 16, name: 'Grande Prêmio da Itália',         circuit: 'Autodromo Nazionale Monza',          city: 'Monza',           country: 'Itália',        flag: '🇮🇹', date: '2024-09-01', status: 'completed' },
    { round: 17, name: 'Grande Prêmio do Azerbaijão',     circuit: 'Baku City Circuit',                  city: 'Baku',            country: 'Azerbaijão',    flag: '🇦🇿', date: '2024-09-15', status: 'completed' },
    { round: 18, name: 'Grande Prêmio de Singapura',      circuit: 'Marina Bay Street Circuit',          city: 'Singapura',       country: 'Singapura',     flag: '🇸🇬', date: '2024-09-22', status: 'completed' },
    { round: 19, name: 'Grande Prêmio dos EUA',           circuit: 'Circuit of the Americas',            city: 'Austin',          country: 'EUA',           flag: '🇺🇸', date: '2024-10-20', status: 'completed' },
    { round: 20, name: 'Grande Prêmio do México',         circuit: 'Autodromo Hermanos Rodriguez',       city: 'Cidade do México', country: 'México',       flag: '🇲🇽', date: '2024-10-27', status: 'completed' },
    { round: 21, name: 'Grande Prêmio do Brasil',         circuit: 'Autodromo José Carlos Pace',         city: 'São Paulo',       country: 'Brasil',        flag: '🇧🇷', date: '2024-11-03', status: 'completed' },
    { round: 22, name: 'Grande Prêmio de Las Vegas',      circuit: 'Las Vegas Strip Circuit',            city: 'Las Vegas',       country: 'EUA',           flag: '🇺🇸', date: '2024-11-23', status: 'completed' },
    { round: 23, name: 'Grande Prêmio do Catar',          circuit: 'Lusail International Circuit',       city: 'Lusail',          country: 'Catar',         flag: '🇶🇦', date: '2024-12-01', status: 'completed' },
    { round: 24, name: 'Grande Prêmio de Abu Dhabi',      circuit: 'Yas Marina Circuit',                 city: 'Abu Dhabi',       country: 'Abu Dhabi',     flag: '🇦🇪', date: '2024-12-08', status: 'completed' },
];

// ── 2024 MotoGP (temporada completa) ──────────────────────────────────
const motogp_2024 = [
    { round: 1,  name: 'Grande Prêmio do Catar',          circuit: 'Lusail International Circuit',       city: 'Lusail',          country: 'Catar',         flag: '🇶🇦', date: '2024-03-10', status: 'completed' },
    { round: 2,  name: 'Grande Prêmio de Portugal',       circuit: 'Algarve International Circuit',      city: 'Portimão',        country: 'Portugal',      flag: '🇵🇹', date: '2024-03-24', status: 'completed' },
    { round: 3,  name: 'Grande Prêmio das Américas',      circuit: 'Circuit of the Americas',            city: 'Austin',          country: 'EUA',           flag: '🇺🇸', date: '2024-04-14', status: 'completed' },
    { round: 4,  name: 'Grande Prêmio da Espanha',        circuit: 'Circuito de Jerez',                  city: 'Jerez de la Frontera', country: 'Espanha',  flag: '🇪🇸', date: '2024-04-28', status: 'completed' },
    { round: 5,  name: 'Grande Prêmio da França',         circuit: 'Bugatti Circuit',                    city: 'Le Mans',         country: 'França',        flag: '🇫🇷', date: '2024-05-12', status: 'completed' },
    { round: 6,  name: 'Grande Prêmio da Itália',         circuit: 'Autodromo del Mugello',              city: 'Mugello',         country: 'Itália',        flag: '🇮🇹', date: '2024-06-02', status: 'completed' },
    { round: 7,  name: 'Grande Prêmio dos Países Baixos', circuit: 'TT Circuit Assen',                   city: 'Assen',           country: 'Países Baixos', flag: '🇳🇱', date: '2024-06-30', status: 'completed' },
    { round: 8,  name: 'Grande Prêmio da Catalunha',      circuit: 'Circuit de Barcelona-Catalunya',     city: 'Barcelona',       country: 'Espanha',       flag: '🇪🇸', date: '2024-09-01', status: 'completed' },
    { round: 9,  name: 'Grande Prêmio da Grã-Bretanha',   circuit: 'Silverstone Circuit',                city: 'Silverstone',     country: 'Reino Unido',   flag: '🇬🇧', date: '2024-09-22', status: 'completed' },
    { round: 10, name: 'Grande Prêmio da Emilia Romagna', circuit: 'Misano World Circuit',               city: 'Misano Adriatico',country: 'Itália',        flag: '🇮🇹', date: '2024-09-08', status: 'completed' },
    { round: 11, name: 'Grande Prêmio da Índia',          circuit: 'Buddh International Circuit',        city: 'Greater Noida',   country: 'Índia',         flag: '🇮🇳', date: '2024-09-22', status: 'completed' },
    { round: 12, name: 'Grande Prêmio do Japão',          circuit: 'Twin Ring Motegi',                   city: 'Motegi',          country: 'Japão',         flag: '🇯🇵', date: '2024-10-06', status: 'completed' },
    { round: 13, name: 'Grande Prêmio da Indonésia',      circuit: 'Pertamina Mandalika Street Circuit', city: 'Lombok',          country: 'Indonésia',     flag: '🇮🇩', date: '2024-10-20', status: 'completed' },
    { round: 14, name: 'Grande Prêmio da Austrália',      circuit: 'Phillip Island Grand Prix Circuit',  city: 'Phillip Island',  country: 'Austrália',     flag: '🇦🇺', date: '2024-10-27', status: 'completed' },
    { round: 15, name: 'Grande Prêmio da Malásia',        circuit: 'Sepang International Circuit',       city: 'Kuala Lumpur',    country: 'Malásia',       flag: '🇲🇾', date: '2024-11-03', status: 'completed' },
    { round: 16, name: 'Grande Prêmio de Valência',       circuit: 'Circuit Ricardo Tormo',              city: 'Valência',        country: 'Espanha',       flag: '🇪🇸', date: '2024-11-17', status: 'completed' },
];

// ── 2024 WEC ──────────────────────────────────────────────────────────
const wec_2024 = [
    { round: 1,  name: '1812km do Qatar',        circuit: 'Lusail International Circuit',    city: 'Lusail',     country: 'Catar',   flag: '🇶🇦', date: '2024-03-02', status: 'completed' },
    { round: 2,  name: '1000 Miles de Sebring',  circuit: 'Sebring International Raceway',   city: 'Sebring',    country: 'EUA',     flag: '🇺🇸', date: '2024-03-16', status: 'completed' },
    { round: 3,  name: '6 Horas de Imola',       circuit: 'Autodromo Enzo e Dino Ferrari',   city: 'Imola',      country: 'Itália',  flag: '🇮🇹', date: '2024-04-21', status: 'completed' },
    { round: 4,  name: '6 Horas de Spa',         circuit: 'Circuit de Spa-Francorchamps',    city: 'Spa',        country: 'Bélgica', flag: '🇧🇪', date: '2024-05-11', status: 'completed' },
    { round: 5,  name: '24 Horas de Le Mans',    circuit: 'Circuit de la Sarthe',            city: 'Le Mans',    country: 'França',  flag: '🇫🇷', date: '2024-06-15', status: 'completed' },
    { round: 6,  name: '6 Horas de São Paulo',   circuit: 'Autodromo José Carlos Pace',      city: 'São Paulo',  country: 'Brasil',  flag: '🇧🇷', date: '2024-07-14', status: 'completed' },
    { round: 7,  name: '6 Horas de Fuji',        circuit: 'Fuji Speedway',                   city: 'Oyama',      country: 'Japão',   flag: '🇯🇵', date: '2024-09-15', status: 'completed' },
    { round: 8,  name: '6 Horas de Xangai',      circuit: 'Shanghai International Circuit',  city: 'Xangai',     country: 'China',   flag: '🇨🇳', date: '2024-11-03', status: 'completed' },
    { round: 9,  name: '8 Horas do Bahrein',     circuit: 'Bahrain International Circuit',   city: 'Sakhir',     country: 'Bahrein', flag: '🇧🇭', date: '2024-11-02', status: 'completed' },
];

// ── Tabela de temporadas ───────────────────────────────────────────────
export const seasons = {
    2025: c2025,
    2024: {
        f1: f1_2024,
        motogp: motogp_2024,
        wec: wec_2024,
    },
    2023: {},
};

export function getCalendar(year, categoryId) {
    return seasons[Number(year)]?.[categoryId] ?? null;
}

export function hasAnyData(year) {
    const s = seasons[Number(year)];
    return s && Object.keys(s).length > 0;
}
