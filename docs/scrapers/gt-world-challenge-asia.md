# Scraper: GT World Challenge Asia

> Pré-requisitos: ver `00-arquitetura-e-schema.md` e
> `gt-world-challenge-europe.md` (scraper genérico SRO).
> **Dificuldade: Alta** (Média se feito após o da Europa, que é reaproveitado).

## Visão geral

Braço asiático do GT World Challenge da **SRO**, disputado em GT3. Formato mais
enxuto que o europeu — predominam fins de semana de **Sprint** (duas corridas).
Um `championship` (`slug = gt-world-challenge-asia`, `category = gt`).

**Temporada 2026:** começa em ~04/abr em Sepang (Malásia) e termina em ~01/nov em
Xangai (China). **Classes:** Pro, Silver, Pro-Am, Am (confirmar por temporada).

## Fonte de dados

Política do projeto (ver arquitetura, seção 5): **site oficial ou Wikipedia**.

- **Calendário:** `gt-world-challenge-asia.com/calendar` (scraping HTML).
- **Resultados (vencedor por classe):** Wikipedia (páginas da temporada) ou o
  próprio site SRO.
- ❌ **Cronometragem Al Kamel/afins**: **descartada** (dados privados restritos).

## Estrutura do fim de semana → `event_sessions`

Predominantemente **Sprint**: `practice`, `qualifying`, **duas corridas** curtas
→ `event_results.class` (`race_1`/`race_2`) ou dois eventos.

## Mapeamento para o schema

- **Championship**: `gt-world-challenge-asia`.
- **Season**: `year`.
- **Circuit**: Sepang, Suzuka, Fuji, Okayama, Shanghai, Buriram… →
  `CountryReference` asiático (`MY`, `JP`, `CN`, `TH`…). Reaproveitar Suzuka/Fuji/
  Shanghai se já existirem. **Não** preencher volta mais rápida / recorde de
  volta (`lap_record_*`) — endurance (arquitetura 3.6).
- **Event**: round; `external_id = gtwc-as-{ano}-{round}`.
- **Result**: um vencedor por classe → `event_results.class` + `drivers[]`.

## Particularidades / desafios

- **Reaproveitamento**: usa o **scraper genérico SRO** (ver doc da Europa),
  mudando `region`/URL/slug. O esforço real é baixo se a Europa vier antes.
- **Calendário variável**: a Ásia costuma ter mudanças de última hora → o
  re-scrape periódico + `event_change_logs` é importante.
- **Multi-classe**: exige `event_results.class` (seção 3.1 da arquitetura).

### Frontend
- Mostrar **vários vencedores** (um por classe).
- **Ocultar** volta mais rápida / recorde de volta.
- Exibir **duas corridas** por evento (Sprint).

## Esforço estimado
Baixo-médio **se** feito após a Europa; Alto isolado.

## Checklist
- [ ] Reusar o scraper genérico SRO (`region = asia`).
- [ ] Championship `gt-world-challenge-asia` no registry.
- [ ] Circuitos e `CountryReference` asiáticos.
- [ ] Duas corridas por evento (Sprint).
- [ ] Resultado por classe.
- [ ] Scheduler.
