# Scrapers de calendário — análise por categoria

Documentação de planejamento para expandir o calendário para além da F1.
**Nenhum código ainda** — cada arquivo descreve fonte de dados, mapeamento para o
schema, particularidades e checklist de implementação.

## Comece por aqui

- **[00-arquitetura-e-schema.md](00-arquitetura-e-schema.md)** — decisões
  compartilhadas: contrato/classe base de scraper, comando genérico,
  `CountryReference`, e as **mudanças de schema** (resultados multi-classe,
  corridas por tempo, categorias). Leia antes dos demais.

## Política de fontes (decisão do projeto)

- **Só fonte oficial da própria categoria (API/site de 1ª parte) ou Wikipedia.**
- **Proibido** usar dados de **terceiros privados com restrição de autorização**
  (Al Kamel, OcBlacktop, Sportradar…). Se a única fonte for essa, a informação
  **não é implementada**.
- **Endurance** (IMSA/WEC/GTWC): **sem volta mais rápida / recorde de volta**;
  **vencedor por classe**; corrida **por tempo**.
- **MotoGP** e **NASCAR**: cada classe/série é um **campeonato separado**.
- O **frontend adapta-se por categoria** (ver arquitetura, seção 6).

## Categorias

| Doc | Fonte | Formato | Dificuldade |
|---|---|---|---|
| [nascar.md](nascar.md) | cf.nascar.com (1ª parte) / Wikipedia | JSON | Média |
| [motogp.md](motogp.md) | api.motogp.pulselive.com (1ª parte) / Wikipedia | JSON | Média |
| [f2.md](f2.md) | site oficial FIA / Wikipedia | HTML | Média-alta |
| [f3.md](f3.md) | site oficial FIA / Wikipedia | HTML | Média-alta |
| [indycar.md](indycar.md) | site oficial / Wikipedia | HTML | Média-alta |
| [imsa.md](imsa.md) | imsa.com / Wikipedia | HTML | Alta |
| [wec.md](wec.md) | fiawec.com / Wikipedia | HTML | Alta |
| [gt-world-challenge-europe.md](gt-world-challenge-europe.md) | SRO / Wikipedia | HTML | Alta |
| [gt-world-challenge-asia.md](gt-world-challenge-asia.md) | SRO / Wikipedia | HTML | Alta* |
| [gt-world-challenge-america.md](gt-world-challenge-america.md) | SRO / Wikipedia | HTML | Alta* |

\* Baixa-média se feitas após a Europa (scraper SRO genérico reaproveitado).

## Ordem sugerida

1. Base + mudanças de schema (doc de arquitetura).
2. **NASCAR** e **MotoGP** (melhores fontes; validam a arquitetura).
3. **F2 / F3** (um scraper parametrizado).
4. **IndyCar**.
5. **IMSA, WEC, GTWC** (Europe → Asia → America), já com o schema de endurance.

## Fontes consultadas (jul/2026)

- Jolpica/Ergast — https://github.com/jolpica/jolpica-f1 (só F1)
- NASCAR cacher feeds — https://github.com/armstjc/racing-data-repository
- MotoGP API — https://github.com/robschmitt/MotoGP-API
- FIA F2/F3 — https://www.fiaformula2.com/Calendar · https://www.fiaformula3.com/Calendar
- IndyCar — https://www.indycar.com (site oficial)
- IMSA — https://www.imsa.com · Wikipedia
- WEC — https://www.fiawec.com · Wikipedia
- SRO GTWC — https://www.gt-world-challenge.com/calendar · Wikipedia

> ❌ Não usadas por restrição de autorização (terceiros privados): Al Kamel,
> OcBlacktop, Sportradar, SportsDataIO.
