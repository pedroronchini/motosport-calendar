# Motosport Calendar

Um projeto Laravel com React integrado usando Vite e Tailwind CSS.

## Pré-requisitos

- PHP 8.2+
- Node.js 18+ e npm
- Composer

## Instalação

1. **Instalar dependências PHP:**
```bash
composer install
```

2. **Instalar dependências Node:**
```bash
npm install
```

3. **Gerar chave da aplicação (se ainda não foi gerada):**
```bash
php artisan key:generate
```

## Desenvolvimento

Para rodar o servidor de desenvolvimento com hot reload:

**Terminal 1 - Servidor Laravel:**
```bash
php artisan serve
```

**Terminal 2 - Vite Dev Server (React):**
```bash
npm run dev
```

Acesse `http://localhost:8000` no seu navegador.

## Compilação para Produção

```bash
npm run build
php artisan optimize
```

## Estrutura do Projeto

- `resources/js/` - Componentes e lógica React
- `resources/css/` - Estilos Tailwind CSS
- `resources/views/` - Views Blade do Laravel
- `routes/` - Definição de rotas da aplicação
- `app/` - Lógica da aplicação Laravel (controllers, models, etc)

## Principais Tecnologias

- **Laravel 13** - Framework PHP moderno
- **React 19** - Biblioteca JavaScript para UI
- **Vite** - Build tool e dev server
- **Tailwind CSS 4** - Framework de CSS utility-first

## Próximos Passos

1. Criar modelos e controllers no Laravel para gerenciar eventos de motosport
2. Desenvolver componentes React para exibir calendário de eventos
3. Integrar API entre React e Laravel
4. Adicionar autenticação (Laravel Sanctum)
5. Configurar banco de dados
