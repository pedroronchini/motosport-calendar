import axios from 'axios';

const client = axios.create({
    baseURL: '/api',
    headers: { Accept: 'application/json' },
});

export async function fetchYears() {
    const { data } = await client.get('/seasons/years');
    return data;
}

export async function fetchCategories(year) {
    const { data } = await client.get('/championships', { params: year ? { year } : {} });
    return data.data;
}

export async function fetchCalendar(categorySlug, year) {
    try {
        const { data } = await client.get(`/championships/${categorySlug}/seasons/${year}/events`);
        return data.data;
    } catch (error) {
        if (error.response?.status === 404) return null;
        throw error;
    }
}

export async function fetchEvent(id) {
    const { data } = await client.get(`/events/${id}`);
    return data.data;
}

export async function fetchThisWeekend() {
    const { data } = await client.get('/this-weekend');
    return data;
}
