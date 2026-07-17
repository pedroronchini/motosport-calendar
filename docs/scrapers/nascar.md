# Scraper: NASCAR

> Pré-requisitos: ver `00-arquitetura-e-schema.md`.
> **Dificuldade: Média.** Melhor fonte depois da F1 — JSON público e estável.

## Visão geral

NASCAR tem **três séries nacionais**, cada uma com seu próprio calendário:

| Série | ID no feed | Slug sugerido |
|---|---|---|
| NASCAR Cup Series | `1` | `nascar-cup` |
| NASCAR Xfinity Series | `2` | `nascar-xfinity` |
| NASCAR Craftsman Truck Series | `3` | `nascar-truck` |

**Decisão de design:** cada série é um **`championship` separado** (calendário e
rounds próprios). `category = stock_car`.

## Fonte de dados (recomendada)

Feeds JSON públicos do **CDN da própria NASCAR** (`cf.nascar.com/cacher`), **sem
chave**. São dados de **1ª parte** (a própria categoria) — permitidos pela
política do projeto (ver arquitetura, seção 5). Fallback de calendário/resultado:
**Wikipedia**.

- **Calendário da temporada (as 3 séries juntas):**
  `https://cf.nascar.com/cacher/{ano}/race_list_basic.json`
  Cada item traz `series_id`, `race_id`, `race_name`, `track_name`, `date_scheduled`,
  `scheduled_distance`, `scheduled_laps`, etc.
- **Detalhe de uma corrida (resultado, stages, cautions):**
  `https://cf.nascar.com/cacher/{ano}/{series_id}/{race_id}/weekend-feed.json`
- **Voltas:** `https://cf.nascar.com/cacher/{ano}/{series_id}/{race_id}/lap-times.json`

### Alternativas
- **Sportradar NASCAR v3** e **SportsDataIO** — oficiais, completos, **pagos**.
- Usar apenas se os feeds `cacher` mudarem ou para dados ao vivo licenciados.

## Estrutura do fim de semana → `event_sessions`

- `practice` — treinos (número variável).
- `qualifying` — knockout em circuitos; em alguns ovais há formatos especiais
  (ex.: sem quali, grid por métrica; ou `top_10_shootout`).
- `race` — a corrida, dividida em **stages** (fases) — informação extra que pode
  ir para `description` do evento ou ser ignorada no MVP.

## Mapeamento para o schema

- **Championship**: um por série (ver tabela acima).
- **Season**: `year` do feed.
- **Circuit**: `track_name` → casar por `slug`. Maioria são **ovais**; há também
  road courses (COTA, Watkins Glen, Sonoma) e o street course de Chicago.
  Popular `CountryReference` — quase tudo é `US` (mais Canadá/México pontuais).
- **Event**: `race_id` do feed → `external_id = nascar-{series}-{ano}-{round}`.
  `laps = scheduled_laps`. `round` pela ordem no calendário.
- **Result**: vencedor (team + driver) a partir do `weekend-feed.json`. Uma
  classe só → não precisa de `event_results.class`.

## Particularidades / desafios

- **Ovais**: circuitos sem "curvas" no sentido tradicional; `number_of_turns`
  pode ficar nulo. Marcar `circuit.type` (oval/road/street) ajuda a UI.
- **Stages**: conceito exclusivo do NASCAR; decidir se entra no MVP.
- **Datas em horário local dos EUA** — normalizar para UTC ao gravar.
- **The Clash / All-Star**: eventos de exibição, não pontuam; decidir se entram.

### Frontend
- **3 campeonatos separados** (Cup / Xfinity / Truck) na navegação.
- **Não** é endurance → volta mais rápida / recorde de volta **permanece**.
- Marcar `circuit.type` (oval/road/street) para a UI diferenciar.

## Esforço estimado
Baixo-médio. Um scraper cobre as 3 séries parametrizando `series_id`.

## Checklist
- [ ] `fetchSchedule` lendo `race_list_basic.json` e filtrando por `series_id`.
- [ ] 3 championships no registry.
- [ ] Circuitos com `type` (oval/road/street) e países no `CountryReference`.
- [ ] Resultado via `weekend-feed.json`.
- [ ] Scheduler (rodar após corridas de domingo/sábado).
