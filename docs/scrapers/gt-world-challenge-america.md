# Scraper: GT World Challenge America

> Pré-requisitos: ver `00-arquitetura-e-schema.md` e
> `gt-world-challenge-europe.md` (scraper genérico SRO).
> **Dificuldade: Alta** (Média se feito após o da Europa, que é reaproveitado).

## Visão geral

Braço norte-americano do GT World Challenge da **SRO**, em GT3. Um `championship`
(`slug = gt-world-challenge-america`, `category = gt`).

**Temporada 2026:** **novo formato de corrida de 3 horas**, **7 rounds**, com a
estreia de Road Atlanta. Atenção: a mudança de formato altera o mapeamento de
sessões em relação a temporadas anteriores.

**Classes:** Pro, Pro-Am, Am (confirmar por temporada).

## Fonte de dados

Política do projeto (ver arquitetura, seção 5): **site oficial ou Wikipedia**.

- **Calendário:** `gt-world-challenge-america.com/calendar` (scraping HTML).
  A SRO já divulgou o calendário 2026 completo em news no próprio site.
- **Resultados (vencedor por classe):** Wikipedia ("2026 GT World Challenge
  America") ou o próprio site SRO.
- ❌ **Al Kamel North America** (`alkamelnorthamerica.com`): **descartada**
  (dados privados com restrição de redistribuição).

## Estrutura do fim de semana → `event_sessions`

A partir de 2026, formato **enduro de 3h**: `practice`, `qualifying`
(possivelmente por drivers/classe), `race` de 3 horas → tratar como corrida
**por tempo** (`duration_minutes = 180`), com troca de pilotos.

> ⚠️ Temporadas anteriores usavam formato Sprint (duas corridas). O scraper deve
> considerar o ano ao mapear sessões, ou assumir o formato 2026+.

## Mapeamento para o schema

- **Championship**: `gt-world-challenge-america`.
- **Season**: `year`.
- **Circuit**: Sonoma, COTA, Road America, VIR, Road Atlanta, Indianapolis
  (road)… → `CountryReference` (`US`/`CA`). Usar `circuit.type` (road/street).
  **Não** preencher volta mais rápida / recorde de volta (`lap_record_*`) —
  endurance (arquitetura 3.6).
- **Event**: 7 rounds; `external_id = gtwc-am-{ano}-{round}`. `duration_minutes`
  no formato 3h.
- **Result**: um vencedor por classe → `event_results.class` + `drivers[]`
  (2 pilotos por carro no formato enduro).

## Particularidades / desafios

- **Mudança de formato em 2026** (Sprint → 3h): principal armadilha; validar o
  ano antes de mapear sessões.
- **Reaproveitamento**: usa o **scraper genérico SRO** (ver doc da Europa),
  mudando `region`/URL/slug.
- **Multi-classe + enduro + multi-piloto**: exige as mudanças de schema da seção
  3 da arquitetura.

### Frontend
- Mostrar **vários vencedores** (um por classe).
- **Ocultar** volta mais rápida / recorde de volta.
- Exibir **duração** (`duration_minutes`, formato 3h) em vez de voltas.

## Esforço estimado
Baixo-médio **se** feito após a Europa; Alto isolado.

## Checklist
- [ ] Reusar o scraper genérico SRO (`region = america`).
- [ ] Championship `gt-world-challenge-america` no registry.
- [ ] Mapear formato 3h (2026+) com `duration_minutes`.
- [ ] Circuitos com `type` e `CountryReference` (US/CA).
- [ ] Resultado por classe (`event_results.class` + `drivers[]`).
- [ ] Scheduler.
