import { seasons, CURRENT_YEAR } from '../data/seasons';
import { categories } from '../data/categories';

function toDateStr(d) {
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export function getWeekendRange() {
    const today = new Date();
    const day = today.getDay(); // 0=Dom … 5=Sex, 6=Sáb

    let daysToFriday;
    if (day === 5) daysToFriday = 0;
    else if (day === 6) daysToFriday = -1;
    else if (day === 0) daysToFriday = -2;
    else daysToFriday = 5 - day;

    const friday = new Date(today);
    friday.setDate(today.getDate() + daysToFriday);

    const sunday = new Date(friday);
    sunday.setDate(friday.getDate() + 2);

    return { friday, sunday };
}

export function getThisWeekendRaces() {
    const { friday, sunday } = getWeekendRange();
    const fridayStr = toDateStr(friday);
    const sundayStr = toDateStr(sunday);

    const currentSeasonCalendars = seasons[CURRENT_YEAR] ?? {};
    const results = [];

    for (const [id, races] of Object.entries(currentSeasonCalendars)) {
        if (!Array.isArray(races)) continue;
        const weekendRaces = races.filter(
            (r) => r.date >= fridayStr && r.date <= sundayStr
        );
        if (weekendRaces.length > 0) {
            const category = categories.find((c) => c.id === id);
            if (category) results.push({ category, races: weekendRaces });
        }
    }

    return { results, friday, sunday };
}
