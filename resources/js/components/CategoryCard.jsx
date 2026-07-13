import { useNavigate } from 'react-router-dom';

export default function CategoryCard({ category, year, hasData }) {
    const navigate = useNavigate();

    return (
        <button
            onClick={() => navigate(`/${year}/calendar/${category.slug}`)}
            className={`group relative overflow-hidden rounded-2xl p-6 text-left transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-white/30
                ${hasData
                    ? 'hover:scale-105 hover:shadow-2xl'
                    : 'opacity-50 cursor-default'
                }`}
            style={{ backgroundColor: category.color }}
            disabled={!hasData}
        >
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />

            <div className="relative">
                <span
                    className="inline-block rounded-full px-3 py-1 text-xs font-bold uppercase tracking-widest mb-4"
                    style={{
                        backgroundColor: category.text_color === '#FFFFFF' ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.15)',
                        color: category.text_color,
                    }}
                >
                    {hasData ? 'Motorsport' : 'Em breve'}
                </span>

                <h2
                    className="text-2xl font-black tracking-tight leading-tight mb-2"
                    style={{ color: category.text_color }}
                >
                    {category.short_name}
                </h2>

                <p
                    className="text-sm leading-relaxed opacity-80"
                    style={{ color: category.text_color }}
                >
                    {category.description}
                </p>

                {hasData && (
                    <div
                        className="mt-4 flex items-center gap-2 text-sm font-semibold group-hover:gap-3 transition-all duration-300"
                        style={{ color: category.text_color }}
                    >
                        <span>Ver calendário</span>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </div>
                )}
            </div>

            <div
                className="absolute bottom-0 right-0 text-8xl font-black opacity-10 leading-none translate-x-4 translate-y-2 select-none pointer-events-none"
                style={{ color: category.text_color }}
            >
                {category.short_name.split(' ')[0]}
            </div>
        </button>
    );
}
