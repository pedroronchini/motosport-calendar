const BASE = 'https://raw.githubusercontent.com/f1db/f1db/main/src/assets/circuits/black-outline/';
const img = (name) => `${BASE}${name}.svg`;

// Keys match the exact `circuit` field strings in categories.js
export const CIRCUIT_IMAGES = {
    // ── F1 / shared single-seater circuits ───────────────────────────
    'Albert Park Circuit':                  img('melbourne-2'),
    'Shanghai International Circuit':       img('shanghai-1'),
    'Suzuka International Racing Course':   img('suzuka-2'),
    'Bahrain International Circuit':        img('bahrain-3'),
    'Jeddah Corniche Circuit':              img('jeddah-1'),
    'Miami International Autodrome':        img('miami-1'),
    'Autodromo Enzo e Dino Ferrari':        img('imola-3'),
    'Circuit de Monaco':                    img('monaco-6'),
    'Circuit de Barcelona-Catalunya':       img('catalunya-6'),
    'Circuit Gilles Villeneuve':            img('montreal-6'),
    'Red Bull Ring':                        img('spielberg-3'),
    'Silverstone Circuit':                  img('silverstone-8'),
    'Circuit de Spa-Francorchamps':         img('spa-francorchamps-4'),
    'Hungaroring':                          img('hungaroring-3'),
    'Circuit Zandvoort':                    img('zandvoort-5'),
    'Autodromo Nazionale Monza':            img('monza-7'),
    'Baku City Circuit':                    img('baku-1'),
    'Marina Bay Street Circuit':            img('marina-bay-4'),
    'Circuit of the Americas':              img('austin-1'),
    'Autodromo Hermanos Rodriguez':         img('mexico-city-3'),
    'Autodromo José Carlos Pace':           img('interlagos-2'),
    'Las Vegas Strip Circuit':              img('las-vegas-1'),
    'Lusail International Circuit':         img('lusail-1'),
    'Yas Marina Circuit':                   img('yas-marina-2'),
    // ── WEC ──────────────────────────────────────────────────────────
    'Sebring International Raceway':        img('sebring-1'),
    'Fuji Speedway':                        img('fuji-2'),
    'Circuit de la Sarthe':                 null,   // not in f1db
    // ── GT World Challenge ────────────────────────────────────────────
    'Circuit Paul Ricard':                  img('paul-ricard-3'),
    'Brands Hatch Circuit':                 img('brands-hatch-2'),
    'Misano World Circuit':                 null,
    'Korea International Circuit':          img('yeongam-1'),
    'Sepang International Circuit':         img('sepang-1'),
    'Ningbo International Speedpark':       null,
    'Phillip Island Grand Prix Circuit':    null,
    // ── IMSA ─────────────────────────────────────────────────────────
    'Daytona International Speedway':       null,
    'Mid-Ohio Sports Car Course':           null,
    'Detroit Grand Prix':                   null,
    'Watkins Glen International':           img('watkins-glen-3'),
    'Canadian Tire Motorsport Park':        null,
    'Road America':                         null,
    'Virginia International Raceway':       null,
    'Michelin Raceway Road Atlanta':        img('atlanta'),     // fallback handled
    'Indianapolis Motor Speedway':          img('indianapolis-2'),
    // ── IndyCar ───────────────────────────────────────────────────────
    'Streets of St. Petersburg':            null,
    'Streets of Long Beach':                null,
    'Barber Motorsports Park':              null,
    'Iowa Speedway':                        null,
    'Streets of Toronto':                   null,
    'Nashville Superspeedway':              null,
    'World Wide Technology Raceway':        null,
    'Portland International Raceway':       null,
    'WeatherTech Raceway Laguna Seca':      null,
    // ── NASCAR ────────────────────────────────────────────────────────
    'Atlanta Motor Speedway':               null,
    'Las Vegas Motor Speedway':             null,
    'Phoenix Raceway':                      null,
    'Bristol Motor Speedway':               null,
    'Richmond Raceway':                     null,
    'Talladega Superspeedway':              null,
    'Dover Motor Speedway':                 null,
    'North Wilkesboro Speedway':            null,
    'Charlotte Motor Speedway':             null,
    'New Hampshire Motor Speedway':         null,
    'Michigan International Speedway':      null,
    // ── MotoGP ────────────────────────────────────────────────────────
    'Chang International Circuit':          null,   // Buriram
    'Autodromo Termas de Rio Hondo':        null,
    'Circuito de Jerez':                    img('jerez-2'),
    'Bugatti Circuit':                      img('bugatti-1'),
    'Autodromo del Mugello':                img('mugello-1'),
    'Sachsenring Circuit':                  null,
    'TT Circuit Assen':                     null,
    'Twin Ring Motegi':                     null,
    'Circuit Ricardo Tormo':                img('valencia-1'),
    // ── Porsche Cup Brasil ────────────────────────────────────────────
    'Autodromo de Interlagos':              img('interlagos-2'),
    'Autodromo Internacional de Curitiba':  null,
    'Autodromo do Velo Città':              null,
    'Autodromo Internacional de Londrina':  null,
    'Autodromo Internacional de Goiânia':   null,
    // ── Stock Car Brasil ──────────────────────────────────────────────
    'Autodromo Internacional Ayrton Senna': null,
    'Autodromo Internacional de Cascavel':  null,
    'Autodromo Internacional de Campo Grande': null,
    // ── DTM ───────────────────────────────────────────────────────────
    'Motorsport Arena Oschersleben':        null,
    'EuroSpeedway Lausitz':                 null,
    'Norisring':                            null,
    'Nürburgring':                          img('nurburgring-5'),
    'Hockenheimring':                       img('hockenheimring-3'),
    // ── WRC (rally stages – sem traçado de circuito) ──────────────────
    'Alpes Maritimes':                      null,
    'Hälsingland Stages':                   null,
    'Naivasha Stages':                      null,
    'Zagreb Stages':                        null,
    'Matosinhos Stages':                    null,
    'Alghero Stages':                       null,
    'Lamia Stages':                         null,
    'Liepāja Stages':                       null,
    'Tartu Stages':                         null,
    'Jyväskylä Stages':                     null,
    'Concepción Stages':                    null,
    'Salzburg Stages':                      null,
    'Aichi Stages':                         null,
    // ── Dakar ─────────────────────────────────────────────────────────
    'Arábia Saudita – 14 etapas':           null,
    // ── Formula E ─────────────────────────────────────────────────────
    'Circuito de Riade':                    null,
    'Circuito de São Paulo':                null,
    'Miami Street Circuit':                 null,
    'Berlin Tempelhof Airport':             null,
    'Seoul Street Circuit':                 null,
    'Excel London Circuit':                 null,
    'Tokyo Street Circuit':                 null,
};

export function getCircuitImage(circuitName) {
    const url = CIRCUIT_IMAGES[circuitName];
    // url is undefined (not mapped) or null (no f1db entry) → return null
    if (!url) return null;
    return url;
}
