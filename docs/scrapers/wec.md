# Scraper: FIA World Endurance Championship (WEC)

> Pré-requisitos: ver `00-arquitetura-e-schema.md`.
> **Dificuldade: Alta.** Mesmos conceitos do IMSA (endurance multi-classe +
> Al Kamel). Depende das mudanças de schema (multi-classe/duração).

## Visão geral

Mundial de endurance da FIA, **multi-classe**, com a joia da coroa: as **24
Horas de Le Mans**. Um `championship` (`slug = wec`, `category = endurance`).

**Classes (2026, confirmar):** Hypercar, LMGT3 (LMP2 saiu do grid do mundial em
temporadas recentes — validar o ano).

**Provas:** todas de enduro (mínimo 6h), incluindo Le Mans (24h).

## Fonte de dados

Política do projeto (ver arquitetura, seção 5): **site oficial ou Wikipedia**.
Fontes de terceiros privados com restrição de autorização **não são usadas**.

- **Calendário:** site oficial `fiawec.com` (scraping HTML) — sem chave.
- **Resultados (vencedor por classe):** Wikipedia (páginas da temporada, ex.
  "20xx FIA World Endurance Championship") ou o próprio `fiawec.com`.
- ❌ **Al Kamel** (`fiawec.alkamelsystems.com`): **descartada** — dados privados
  com restrição de redistribuição.
- ❌ **OcBlacktop / Sportradar** (APIs de terceiros pagas): **não usar**.

## Estrutura do fim de semana → `event_sessions`

- `practice` — treinos livres (vários; Le Mans tem semana estendida + testes).
- `qualifying` / **`hyperpole`** — quali por classe; a Hyperpole seleciona os
  mais rápidos para a definição da pole.
- `race` — corrida **por tempo** (6h/8h/24h).

## Mapeamento para o schema

- **Championship**: `wec`.
- **Season**: `year`.
- **Circuit**: Le Mans, Spa, Fuji, Interlagos, Bahrein, Imola, COTA… →
  `CountryReference` internacional. Reaproveitar circuitos já existentes da F1
  quando coincidirem (Spa, Bahrein, COTA, Interlagos). **Não** preencher volta
  mais rápida / recorde de volta (`lap_record_*`) — endurance (arquitetura 3.6).
- **Event**: round; `external_id = wec-{ano}-{round}`. Preencher
  **`duration_minutes`** (ex.: 360, 480, 1440) em vez de `laps`.
- **Result**: **um vencedor por classe** → `event_results.class`
  (`HYPERCAR`/`LMGT3`) + `drivers[]` (2–3 pilotos por carro).

## Particularidades / desafios

- **Le Mans**: formato especial (semana longa, testes, warm-up, largada às 16h)
  → tratar como caso à parte no mapeamento de sessões.
- **Hyperpole**: tipo de sessão próprio (`hyperpole`).
- **Multi-classe + tempo + multi-piloto**: exige as mudanças de schema da seção
  3 do doc de arquitetura.

### Frontend
- Mostrar **vários vencedores** (um por classe).
- **Ocultar** volta mais rápida / recorde de volta.
- Exibir **duração** (`duration_minutes`) em vez de voltas.
- Sessão **`hyperpole`** e caso especial **Le Mans** têm layout próprio.

## Esforço estimado
Alto. Reaproveita muito do **IMSA** e do **GTWC** (mesmos conceitos de
endurance) → construir na mesma leva.

## Checklist
- [ ] Aplicar mudanças de schema (multi-classe + `duration_minutes`).
- [ ] Championship `wec` no registry.
- [ ] Scraping do calendário em `fiawec.com`.
- [ ] Reutilizar/expandir circuitos e `CountryReference`.
- [ ] Resultado por classe (`event_results.class` + `drivers[]`).
- [ ] Caso especial Le Mans + sessão `hyperpole`.
- [ ] Scheduler.
