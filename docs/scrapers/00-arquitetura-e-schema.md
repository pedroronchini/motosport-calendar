# Arquitetura de scrapers e mudanças de schema

Documento-base para a expansão do calendário para além da F1. Leia antes dos
documentos por categoria — todos eles referenciam as decisões daqui.

## 1. Como o F1 funciona hoje

O `ErgastF1Scraper` (`app/Services/Scrapers/ErgastF1Scraper.php`) é simples
**porque a F1 tem uma API pública em JSON estruturado** (Jolpica/Ergast). O fluxo:

1. `fetchSchedule($year)` → busca o calendário da temporada.
2. `upsertSeason` / `upsertCircuit` / `upsertEvent` → grava idempotente
   (evento casado por `season_id`+`round`, circuito por `slug`).
3. `syncSessions` → apaga e recria as sessões do fim de semana.
4. `upsertResult` → busca o vencedor quando o evento já terminou.
5. `writeLog` + `logChanges` → registra métricas em `scrape_logs` e mudanças de
   horário/status em `event_change_logs`.

Toda a dificuldade das outras categorias está em **de onde vêm os dados**.
Nenhuma tem uma fonte tão limpa quanto a F1.

## 2. Refatorações compartilhadas (fazer uma vez, serve para as 10)

### 2.1 Contrato + classe base de scraper

Hoje toda a lógica está acoplada dentro do `ErgastF1Scraper`. Extrair:

- **Interface `Scraper`**: `scrape(int $year, bool $markCurrent, bool $fetchResults, ?Closure $onProgress): ScrapeLog`.
- **`AbstractScraper`** com o que é genérico e já existe no F1: `upsertSeason`,
  `upsertCircuit`, `upsertEvent`, `syncSessions`, `logChanges`, `writeLog`,
  `parseDateTime`, `report`. Cada categoria implementa apenas
  `fetchSchedule()`, o mapeamento fonte→schema e (opcional) `fetchResults()`.
- **Registry** (`slug => classe`) para despachar por championship.

### 2.2 Comando genérico + agendamento

Em vez de um `ScrapeF1Command` por categoria (11 comandos quase idênticos):

- **Comando único** `scrape:championship {slug} {year?} {--current} {--no-results}`
  que resolve o scraper pelo registry. Manter `scrape:f1` como atalho, se quiser.
- **Scheduler**: no `routes/console.php`, uma entrada por categoria (ou um laço
  sobre o registry). Escalonar horários para não bater todas as fontes juntas.

### 2.3 `CountryReference` compartilhado

O `F1Reference` só tem os países da F1. Circuitos novos (Daytona, Indianapolis,
COTA, Bathurst, Sepang, Fuji…) não estão no mapa. Extrair um
**`CountryReference`** (país EN → `[ISO alpha-2, nome pt-BR]`) usado por todos os
scrapers. Cada categoria mantém só um "reference" próprio para nomes de
série/GP/classe.

## 3. Lacunas de schema a resolver ANTES de adicionar categorias novas

O schema atual é F1-cêntrico. Três pontos travam quase todas as categorias:

### 3.1 Resultados multi-classe / multi-piloto

`event_results` tem `event_id` **unique** + `team` + `drivers` (JSON) — modela
**um único vencedor**. Endurance e GT têm **um vencedor por classe** e **2–4
pilotos por carro**.

**Mudança recomendada:**
- Adicionar coluna `class` (nullable string) em `event_results`.
- Trocar o unique de `event_id` por unique composto **`(event_id, class)`**.
- `drivers` (JSON array) já cobre múltiplos pilotos por carro — manter.
- Opcional: `position` (int) para guardar pódio, não só o vencedor.

Afeta: IMSA, WEC, GTWC (Europe/Asia/America), MotoGP (vencedor por classe).

### 3.2 Corridas por tempo (endurance)

`events.laps` assume corrida definida por voltas. Enduro é por **tempo** (24h,
12h, 6h, 3h). `laps` já é nullable; adicionar **`duration_minutes`** (nullable)
para representar a duração agendada.

Afeta: IMSA, WEC, GTWC.

### 3.3 Múltiplas classes/séries no mesmo fim de semana

Um fim de semana tem MotoGP+Moto2+Moto3(+MotoE); IMSA/WEC/GTWC correm várias
classes na mesma prova. **Decisão de design:**

- **MotoGP** e **NASCAR**: cada classe/série é um **`championship` separado**
  (calendários e rounds próprios). Mais limpo e casa com a UI atual.
- **IMSA/WEC/GTWC**: **um `event` por corrida**, com as classes representadas em
  `event_results.class`. As sessões são compartilhadas pelas classes.

### 3.4 Valores de `championships.category`

Hoje só existe `single_seater`. Padronizar o conjunto:
`single_seater`, `motorcycle`, `stock_car`, `gt`, `endurance`.

### 3.5 Tipos de sessão (`event_sessions.type`)

É string livre (flexível), mas convém padronizar um conjunto e documentá-lo:
`practice`, `qualifying`, `sprint_qualifying`, `sprint`, `race`, `warmup`,
`superpole` / `hyperpole`, `top_10_shootout`, `feature_race`, `sprint_race`,
`test` / `prologue`.

### 3.6 Endurance não usa "volta mais rápida" / recorde de volta

Decisão do projeto: nas categorias de **endurance** (IMSA, WEC, GTWC), a volta
mais rápida / recorde de volta (`circuits.lap_record_ms`, `lap_record_holder`,
`lap_record_year`) **não é relevante e não deve ser coletada nem exibida**.
Os scrapers de endurance deixam esses campos nulos e o frontend os oculta para
essas categorias (ver seção 6).

## 4. Ordem de implementação sugerida

1. **Base + schema** (seções 2 e 3) — desbloqueia todo o resto.
2. **NASCAR** e **MotoGP** — melhores fontes (JSON); validam a arquitetura.
3. **F2 / F3** — um scraper parametrizado para as duas.
4. **IndyCar**.
5. **IMSA, WEC, GTWC** — os mais pesados, já com o schema de endurance pronto.

## 5. Política de fontes de dados (decisão do projeto)

Regra: **usar apenas a fonte oficial da própria categoria (API ou site) ou a
Wikipedia.** É proibido usar dados de **empresas terceiras privadas com
restrição de autorização/redistribuição**. Se a única fonte de uma informação
for dessas, **essa informação não é implementada**.

Consequências práticas:
- **Al Kamel** (cronometragem de IMSA/WEC/GTWC): **descartada** — dados de
  propriedade privada com restrição de redistribuição. Resultados vêm do **site
  oficial** ou da **Wikipedia**.
- **APIs pagas de terceiros** (OcBlacktop, Sportradar, SportsDataIO): **não
  usar**. Preferir scraping do site oficial ou da Wikipedia.
- APIs de **1ª parte** (a própria categoria, sem chave/restrição) são OK:
  Jolpica (F1), `cf.nascar.com` (NASCAR), `api.motogp.pulselive.com` (MotoGP).

| Categoria | Fonte | Formato | Dificuldade |
|---|---|---|---|
| F1 (feito) | Jolpica/Ergast (1ª parte) | JSON | — |
| NASCAR | cf.nascar.com/cacher (1ª parte) | JSON | Média |
| MotoGP | api.motogp.pulselive.com (1ª parte) | JSON | Média |
| F2 / F3 | site oficial FIA / Wikipedia | HTML | Média-alta |
| IndyCar | site oficial / Wikipedia | HTML | Média-alta |
| IMSA | imsa.com / Wikipedia | HTML | Alta |
| WEC | fiawec.com / Wikipedia | HTML | Alta |
| GTWC EU/AS/AM | sites SRO / Wikipedia | HTML | Alta |

## 6. Frontend adapta-se por categoria (decisão do projeto)

O frontend **não é único para todas as categorias** — cada uma tem um formato
próprio que precisa de tratamento específico. Pontos que variam:

- **Campeonatos separados por classe** (MotoGP/Moto2/Moto3/MotoE; NASCAR
  Cup/Xfinity/Truck): a navegação lista cada um como um campeonato à parte.
- **Vencedor por classe** (IMSA, WEC, GTWC): a exibição de resultado mostra
  **vários vencedores** (um por classe), não um só.
- **Volta mais rápida oculta** para endurance (ver seção 3.6).
- **Corrida por tempo** (endurance): exibir `duration_minutes` em vez de `laps`.
- **Duas corridas por evento** (F2/F3 sprint+feature; GTWC Sprint): a UI mostra
  os dois resultados.
- **Tipos de sessão diferentes** por categoria (superpole, hyperpole, sprint,
  top-10 shootout, quali de oval…).

> Cada doc de categoria aponta o que o frontend precisa tratar de diferente.

## 7. Checklist genérico por scraper novo

- [ ] Validar a fonte: existe, formato, rate limit, termos de uso.
- [ ] Implementar `fetchSchedule()` mapeando para `season`/`event`/`circuit`.
- [ ] Mapear as sessões do fim de semana para `event_sessions`.
- [ ] Popular o `CountryReference` com os países/circuitos faltantes.
- [ ] Cadastrar o championship (slug, cor, categoria) no registry.
- [ ] Implementar resultados (respeitando multi-classe quando aplicável).
- [ ] Registrar `scrape_log` + `event_change_logs`.
- [ ] Adicionar entrada no scheduler.
- [ ] Idempotência: rodar 2x não duplica.
