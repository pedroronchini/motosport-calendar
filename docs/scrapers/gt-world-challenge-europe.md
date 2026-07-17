# Scraper: GT World Challenge Europe

> Pré-requisitos: ver `00-arquitetura-e-schema.md`.
> **Dificuldade: Alta.** GT multi-classe, sem API pública. **Um único scraper
> parametrizado por região** cobre Europe/Asia/America — ver também
> `gt-world-challenge-asia.md` e `gt-world-challenge-america.md`.

## Visão geral

Principal campeonato de GT3 do mundo, organizado pela **SRO Motorsports**. É o
mais complexo dos três: dividido em **Sprint Cup** e **Endurance Cup**, com a
prova máxima das **24 Horas de Spa**. Um `championship`
(`slug = gt-world-challenge-europe`, `category = gt`).

**Classes:** Pro, Gold, Silver, Pro-Am, Am (variam por Cup/temporada — confirmar).

## Fonte de dados

Política do projeto (ver arquitetura, seção 5): **site oficial ou Wikipedia**.
Fontes de terceiros privados com restrição de autorização **não são usadas**.

- **Calendário:** site oficial SRO `gt-world-challenge.com/calendar` (scraping
  HTML) — sem chave.
- **Resultados (vencedor por classe):** Wikipedia (páginas da temporada) ou o
  próprio site SRO.
- ❌ **Cronometragem Al Kamel/afins**: **descartada** (dados privados com
  restrição de redistribuição).

## Estrutura do fim de semana → `event_sessions`

Depende do Cup:
- **Sprint Cup**: `practice`, `qualifying`, **duas corridas curtas** (~1h cada) →
  usar `event_results.class` (`race_1`/`race_2`) ou dois eventos.
- **Endurance Cup**: `practice`, **`superpole`** (define grid), `race` **por
  tempo** (3h / 6h / 24h em Spa).

## Mapeamento para o schema

- **Championship**: `gt-world-challenge-europe`.
- **Season**: `year`.
- **Circuit**: Spa, Monza, Zandvoort, Nürburgring, Paul Ricard, Barcelona,
  Misano, Brands Hatch, Hockenheim… → `CountryReference` europeu. Reaproveitar
  circuitos coincidentes com F1. **Não** preencher volta mais rápida / recorde
  de volta (`lap_record_*`) — endurance (arquitetura 3.6).
- **Event**: round; distinguir Sprint vs. Endurance (campo `description` ou tag).
  `external_id = gtwc-eu-{ano}-{round}`. Enduros preenchem `duration_minutes`.
- **Result**: **um vencedor por classe** → `event_results.class`
  (Pro/Silver/Am/Pro-Am) + `drivers[]` (2–3 pilotos por carro nos enduros).

## Particularidades / desafios

- **Sprint vs. Endurance**: dois formatos no mesmo campeonato; o mapeamento de
  sessões precisa ramificar por Cup.
- **24h de Spa**: caso especial (Superpole shootout, grid enorme).
- **Multi-classe + duas corridas (Sprint) + multi-piloto**: exige as mudanças de
  schema da seção 3 do doc de arquitetura.
- **Sem API**: 100% scraping (site oficial/Wikipedia) → resiliência a mudanças
  de layout.

### Frontend
- Mostrar **vários vencedores** (um por classe).
- **Ocultar** volta mais rápida / recorde de volta.
- **Sprint Cup**: exibir **duas corridas**; **Endurance Cup**: exibir duração.

## Esforço estimado
Alto. **Base compartilhada** com Asia e America — construir o scraper genérico
aqui e parametrizar `region` (URL base + slug + rounds).

## Checklist
- [ ] Scraper genérico SRO parametrizado por `region` (reusável nas 3).
- [ ] Championship `gt-world-challenge-europe` no registry.
- [ ] Ramificar mapeamento de sessões (Sprint vs. Endurance).
- [ ] Circuitos e `CountryReference` europeus.
- [ ] Resultado por classe (`event_results.class` + `drivers[]`).
- [ ] Caso especial 24h de Spa (`superpole`).
- [ ] Scheduler.
