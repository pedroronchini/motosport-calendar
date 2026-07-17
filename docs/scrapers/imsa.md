# Scraper: IMSA WeatherTech SportsCar Championship

> Pré-requisitos: ver `00-arquitetura-e-schema.md`.
> **Dificuldade: Alta.** Endurance multi-classe + fonte de resultados com
> restrição legal. Depende das mudanças de schema (multi-classe/duração).

## Visão geral

Campeonato de sportscar dos EUA, **multi-classe**, com provas de enduro
icônicas. Um `championship` (`slug = imsa`, `category = endurance`).

**Classes (2026, confirmar):** GTP, LMP2, GTD Pro, GTD.

**Provas de enduro:** Rolex 24 at Daytona (24h), 12h de Sebring, 6h de Watkins
Glen, Petit Le Mans (10h).

## Fonte de dados

Política do projeto (ver arquitetura, seção 5): **site oficial ou Wikipedia**.
Fontes de terceiros privados com restrição de autorização **não são usadas**.

- **Calendário:** site oficial `imsa.com` (scraping HTML) — sem chave.
- **Resultados (vencedor por classe):** Wikipedia (páginas da temporada, ex.
  "20xx IMSA SportsCar Championship") ou o próprio `imsa.com`.
- ❌ **Al Kamel** (`imsa.results.alkamelcloud.com`): **descartada** — dados de
  propriedade privada com restrição de redistribuição.

## Estrutura do fim de semana → `event_sessions`

- `practice` — vários treinos (enduro tem muitos).
- `qualifying` — quali por classe (define grid de cada classe).
- `race` — a corrida; nos enduros é **por tempo** (24h/12h/…), não por voltas.

## Mapeamento para o schema

- **Championship**: `imsa`.
- **Season**: `year`.
- **Circuit**: Daytona, Sebring, Long Beach (street), Laguna Seca, Road America,
  VIR, Road Atlanta… → popular `CountryReference` (majoritariamente `US`).
  Usar `circuit.type` (road/street/roval). **Não** preencher volta mais rápida /
  recorde de volta (`lap_record_*`) — irrelevante para endurance (arquitetura 3.6).
- **Event**: round; `external_id = imsa-{ano}-{round}`. Para enduros preencher
  **`duration_minutes`** (ver schema) em vez de `laps`.
- **Result**: **um vencedor por classe** → exige `event_results.class`
  (`GTP`/`LMP2`/`GTD_PRO`/`GTD`) e `drivers` como array (2–4 pilotos por carro).

## Particularidades / desafios

- **Multi-classe**: sem a coluna `event_results.class` (seção 3.1 do doc de
  arquitetura) não dá para modelar corretamente.
- **Corrida por tempo**: `duration_minutes` em vez de `laps`.
- **Múltiplos pilotos por carro**: `drivers` JSON já cobre.
- **HTML instável**: `imsa.com` pode mudar de layout; a Wikipedia é mais estável
  para o histórico de resultados.

### Frontend
- Mostrar **vários vencedores** (um por classe).
- **Ocultar** volta mais rápida / recorde de volta.
- Exibir **duração** (`duration_minutes`) em vez de voltas.

## Esforço estimado
Alto. Fazer **após** WEC ou junto (mesmos conceitos de endurance).

## Checklist
- [ ] Aplicar mudanças de schema (multi-classe + `duration_minutes`).
- [ ] Championship `imsa` no registry.
- [ ] Scraping do calendário em `imsa.com`.
- [ ] Circuitos com `type` e países no `CountryReference`.
- [ ] Resultado por classe (`event_results.class` + `drivers[]`).
- [ ] Scheduler.
