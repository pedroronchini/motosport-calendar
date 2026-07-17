# Scraper: MotoGP

> Pré-requisitos: ver `00-arquitetura-e-schema.md`.
> **Dificuldade: Média.** API JSON (não-oficial) estável, baseada em UUIDs.

## Visão geral

Um fim de semana de MotoGP reúne **várias classes**, cada uma com calendário e
pódio próprios:

| Classe | Slug sugerido |
|---|---|
| MotoGP | `motogp` |
| Moto2 | `moto2` |
| Moto3 | `moto3` |
| MotoE | `motoe` |

**Decisão de design:** cada classe é um **`championship` separado**
(`category = motorcycle`). Os eventos (GPs) e circuitos são compartilhados entre
as classes, mas os rounds/resultados são por classe.

## Fonte de dados (recomendada)

API da **própria MotoGP/Dorna** (Pulselive), **sem chave**, formato JSON. É dado
de **1ª parte** (a própria categoria) — permitido pela política do projeto (ver
arquitetura, seção 5). Fallback de calendário/resultado: **Wikipedia**. Fluxo
baseado em UUIDs — precisa navegar da temporada até a sessão.

- **Base:** `https://api.motogp.pulselive.com/motogp/v1`
- **Temporadas:** `GET /results/seasons` → obtém `seasonUuid` do ano.
- **Eventos:** `GET /results/events?seasonUuid={id}&isFinished={bool}`
- **Categorias (classes) do evento:** `GET /results/categories?eventUuid={id}`
- **Sessões:** `GET /results/sessions?eventUuid={id}&categoryUuid={id}`
- **Classificação/resultado:** `GET /results/session/{sessionId}/classification?test=false`

### Alternativas
- Repositórios da comunidade documentam a mesma API (ex.: robschmitt/MotoGP-API).
- Scraping do `motogp.com` como fallback se a API mudar.

## Estrutura do fim de semana → `event_sessions`

Formato atual (MotoGP): `practice` (FP1), `practice` (Pr — define quali direto),
`practice` (FP2), `qualifying` (Q1), `qualifying` (Q2), **`sprint`** (sábado, só
MotoGP), `warmup`, `race`. Moto2/Moto3 seguem sem sprint. Mapear a partir do
nome/tipo da sessão retornado pela API.

## Mapeamento para o schema

- **Championship**: um por classe.
- **Season**: `year` (resolver `seasonUuid`).
- **Circuit**: casar por `slug`; muitos circuitos novos (Mugello, Sepang,
  Phillip Island, Motegi, Termas de Río Hondo…) → popular `CountryReference`.
- **Event**: o GP; `external_id = motogp-{ano}-{eventUuid}` (ou round). Guardar
  o `eventUuid` para buscar sessões/resultado.
- **Result**: vencedor da sessão `race` por classe → grava no championship
  correspondente. Uma classe por championship, então `event_results.class`
  não é necessário aqui.

## Particularidades / desafios

- **UUIDs**: não dá para montar URL direto pelo ano/round; é preciso resolver
  season → event → category → session em cadeia. Cachear os UUIDs por execução.
- **Sprint**: só na classe MotoGP, e apenas em temporadas recentes.
- **MotoE**: calendário reduzido, formato próprio (duas corridas por evento em
  alguns anos) — validar antes.
- **Rate limit**: API pública; usar `retry` + pausa entre chamadas, como no F1.

### Frontend
- **4 campeonatos separados** (MotoGP / Moto2 / Moto3 / MotoE) na navegação.
- **Não** é endurance → volta mais rápida / recorde de volta **permanece**.
- **Sprint** só na classe MotoGP → a UI de sessões varia por classe.

## Esforço estimado
Médio. Um scraper cobre as 4 classes iterando pelas categorias do evento.

## Checklist
- [ ] Resolver `seasonUuid` do ano.
- [ ] Iterar eventos → categorias → sessões.
- [ ] 4 championships no registry.
- [ ] Circuitos e países no `CountryReference`.
- [ ] Resultado da corrida por classe.
- [ ] Scheduler (rodar às segundas, após os GPs de domingo).
