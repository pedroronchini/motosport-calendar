# Scraper: IndyCar Series

> Pré-requisitos: ver `00-arquitetura-e-schema.md`.
> **Dificuldade: Média-alta.** Sem feed oficial público limpo; melhor caminho é
> uma API de terceiros (free tier) ou scraping do site oficial.

## Visão geral

Monoposto norte-americana que corre em **ovais, circuitos de rua e mistos** —
essa diversidade é o principal desafio. Um `championship` (`slug = indycar`,
`category = single_seater`). Série de acesso: **Indy NXT** (opcional, como
championship separado no futuro).

## Fonte de dados

Política do projeto (ver arquitetura, seção 5): **site oficial ou Wikipedia**.
IndyCar não tem API pública de 1ª parte bem documentada → **scraping**.

- **Calendário:** site oficial `indycar.com` (scraping HTML).
- **Resultados (vencedor):** Wikipedia (páginas da temporada, ex. "20xx IndyCar
  Series") ou o próprio `indycar.com`.
- ❌ **OcBlacktop / Sportradar** (APIs de terceiros): **não usar** — terceiros
  privados/pagos.

## Estrutura do fim de semana → `event_sessions`

Varia conforme o tipo de circuito:
- `practice` — treinos.
- `qualifying` — **formato diferente por pista**:
  - Circuito misto/rua: knockout em grupos + Fast 12/Fast 6.
  - Oval: voltas cronometradas (multi-lap).
  - **Indy 500**: quali de dois dias, 4 voltas, Fast 12 + Fast 6 (Pole Day).
- `warmup` (em alguns eventos).
- `race`.

## Mapeamento para o schema

- **Championship**: `indycar`.
- **Season**: `year`.
- **Circuit**: usar `circuit.type` = `oval` / `road` / `street` (importante para
  a UI e para o formato de quali). Popular `CountryReference` (quase tudo `US`,
  com Toronto `CA`). Ovais: `number_of_turns` pode ficar nulo.
- **Event**: round; `external_id = indycar-{ano}-{round}`. A **Indy 500** é um
  caso especial (fim de semana estendido, quali própria).
- **Result**: um vencedor (team + driver). Classe única → sem `class`.

## Particularidades / desafios

- **Heterogeneidade de formato**: o mapeamento de sessões precisa de lógica por
  tipo de pista; a Indy 500 é praticamente um caso à parte.
- **Doubleheaders**: alguns fins de semana têm duas corridas → tratar como dois
  eventos ou usar `event_results.class`.
- **Fonte 100% scraping** (site oficial/Wikipedia): resiliência a mudanças de
  layout.

### Frontend
- **Não** é endurance → volta mais rápida / recorde de volta **permanece**.
- Formato de **qualificação varia por pista** (oval / rua / misto / Indy 500) —
  a UI de sessões precisa refletir isso.

## Esforço estimado
Médio-alto — a variação oval/rua/misto e a Indy 500 exigem casos especiais.

## Checklist
- [ ] Scraping do calendário em `indycar.com` (+ Wikipedia para resultados).
- [ ] Championship `indycar` no registry.
- [ ] `circuit.type` e países no `CountryReference`.
- [ ] Mapear sessões por tipo de pista + caso Indy 500.
- [ ] Resultado do vencedor.
- [ ] Scheduler.
