// F1 sprint weekends 2025 (round numbers)
const F1_SPRINT_ROUNDS = new Set([2, 6, 13, 19, 22]); // China, Miami, Bélgica, EUA, Qatar

function addDays(dateStr, days) {
    const d = new Date(dateStr + 'T12:00:00');
    d.setDate(d.getDate() + days);
    return d.toLocaleDateString('pt-BR', { weekday: 'short', day: '2-digit', month: 'short' });
}

function sessions(categoryId, race) {
    const d = race.date;

    const fri = addDays(d, -2);
    const sat = addDays(d, -1);
    const sun = addDays(d, 0);
    // Some endurance races start earlier in the week
    const thu = addDays(d, -3);

    switch (categoryId) {
        case 'f1': {
            const isSprint = F1_SPRINT_ROUNDS.has(race.round);
            if (isSprint) {
                return [
                    { session: 'Treino Livre 1',       day: fri, time: '13:30' },
                    { session: 'Classificação do Sprint', day: fri, time: '17:00' },
                    { session: 'Sprint',               day: sat, time: '12:00' },
                    { session: 'Classificação',         day: sat, time: '16:00' },
                    { session: 'Corrida',               day: sun, time: '15:00' },
                ];
            }
            return [
                { session: 'Treino Livre 1', day: fri, time: '13:30' },
                { session: 'Treino Livre 2', day: fri, time: '17:00' },
                { session: 'Treino Livre 3', day: sat, time: '12:30' },
                { session: 'Classificação',  day: sat, time: '16:00' },
                { session: 'Corrida',        day: sun, time: '15:00' },
            ];
        }
        case 'f2':
        case 'f3':
        case 'f1-academy':
            return [
                { session: 'Treino',      day: fri, time: '–' },
                { session: 'Classificação', day: fri, time: '–' },
                { session: 'Corrida 1',   day: sat, time: '–' },
                { session: 'Corrida 2',   day: sun, time: '–' },
            ];
        case 'motogp':
            return [
                { session: 'Treino 1',     day: fri, time: '09:00' },
                { session: 'Treino 2',     day: fri, time: '13:15' },
                { session: 'Treino 3',     day: sat, time: '09:40' },
                { session: 'Q1',           day: sat, time: '10:50' },
                { session: 'Q2',           day: sat, time: '11:15' },
                { session: 'Sprint',       day: sat, time: '15:00' },
                { session: 'Corrida',      day: sun, time: '14:00' },
            ];
        case 'wec':
            return [
                { session: 'Treino Livre 1', day: thu, time: '–' },
                { session: 'Treino Livre 2', day: fri, time: '–' },
                { session: 'Classificação',  day: fri, time: '–' },
                { session: 'Corrida',        day: sat, time: '–' },
            ];
        case 'imsa':
            return [
                { session: 'Treino Livre 1', day: fri, time: '–' },
                { session: 'Treino Livre 2', day: fri, time: '–' },
                { session: 'Qualificação',   day: sat, time: '–' },
                { session: 'Corrida',        day: sun, time: '–' },
            ];
        case 'indycar':
            return [
                { session: 'Treino',      day: fri, time: '–' },
                { session: 'Qualificação', day: sat, time: '–' },
                { session: 'Corrida',     day: sun, time: '–' },
            ];
        case 'nascar':
            return [
                { session: 'Treino',      day: fri, time: '–' },
                { session: 'Qualificação', day: sat, time: '–' },
                { session: 'Corrida',     day: sun, time: '–' },
            ];
        case 'porsche-cup':
            return [
                { session: 'Qualificação', day: fri, time: '–' },
                { session: 'Corrida 1',   day: sat, time: '–' },
                { session: 'Corrida 2',   day: sun, time: '–' },
            ];
        case 'gt-europe':
        case 'gt-america':
        case 'gt-asia':
            return [
                { session: 'Treino Livre 1', day: fri, time: '–' },
                { session: 'Treino Livre 2', day: fri, time: '–' },
                { session: 'Qualificação',   day: sat, time: '–' },
                { session: 'Corrida 1',      day: sat, time: '–' },
                { session: 'Corrida 2',      day: sun, time: '–' },
            ];
        case 'stock-car':
            return [
                { session: 'Treino Livre',   day: fri, time: '–' },
                { session: 'Qualificação',   day: sat, time: '–' },
                { session: 'Corrida 1',      day: sat, time: '–' },
                { session: 'Corrida 2',      day: sun, time: '–' },
            ];
        case 'dtm':
            return [
                { session: 'Treino Livre 1', day: fri, time: '–' },
                { session: 'Treino Livre 2', day: fri, time: '–' },
                { session: 'Qualificação',   day: sat, time: '–' },
                { session: 'Corrida 1',      day: sat, time: '–' },
                { session: 'Corrida 2',      day: sun, time: '–' },
            ];
        case 'wrc':
            return [
                { session: 'Shakedown',             day: thu, time: '–' },
                { session: 'Dia 1 – Especiais',     day: fri, time: '–' },
                { session: 'Dia 2 – Especiais',     day: sat, time: '–' },
                { session: 'Power Stage',            day: sun, time: '–' },
            ];
        case 'dakar':
            return [
                { session: 'Prólogo',                day: addDays(d, -14), time: '–' },
                { session: 'Etapas 1–13',            day: addDays(d, -13), time: '–' },
                { session: 'Etapa Final',            day: sun,             time: '–' },
            ];
        case 'formula-e':
            return [
                { session: 'Treino Livre', day: sat, time: '–' },
                { session: 'Duelo',        day: sat, time: '–' },
                { session: 'Corrida',      day: sat, time: '–' },
            ];
        default:
            return [
                { session: 'Corrida', day: sun, time: '–' },
            ];
    }
}

export function getSchedule(categoryId, race) {
    return sessions(categoryId, race);
}

// Sessions that are "main events" for highlight styling
export const MAIN_SESSIONS = new Set(['Corrida', 'Sprint', 'Corrida 1', 'Corrida 2', 'Power Stage', 'Etapa Final']);
