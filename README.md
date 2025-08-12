```markdown
# Aplicação SaaS Completa com React, Supabase e Stripe

Este projeto é uma aplicação SaaS completa que demonstra a integração de autenticação de usuário com Supabase, gerenciamento de assinaturas recorrentes com Stripe e funções de backend (Edge Functions) no Supabase.

## Funcionalidades

*   **Autenticação de Usuário**: Login e cadastro de usuários utilizando Supabase Auth.
*   **Gerenciamento de Assinaturas**: Integração com Stripe Checkout para assinaturas recorrentes.
*   **Rotas Protegidas**: Páginas acessíveis apenas para usuários autenticados e/ou com assinatura ativa.
*   **Dashboard Dinâmico**: Exibe conteúdo VIP para assinantes e um botão de "Assinar agora" para não-assinantes.
*   **Persistência de Sessão**: Mantém o usuário logado mesmo após recarregar ou fechar o navegador.
*   **Supabase Edge Functions**: Funções de backend para lidar com a criação de sessões de checkout do Stripe e processar webhooks.
*   **Banco de Dados Supabase**: Gerenciamento de perfis de usuário e status de assinatura.

## Pré-requisitos

Antes de começar, certifique-se de ter o seguinte instalado:

*   [Node.js](https://nodejs.org/en/) (versão 18 ou superior)
*   [npm](https://www.npmjs.com/) ou [Yarn](https://yarnpkg.com/)
*   [Supabase CLI](https://supabase.com/docs/guides/cli)
*   Uma conta [Stripe](https://stripe.com/)
*   Uma conta [Supabase](https://supabase.com/)

## Configuração do Projeto

### 1. Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto (ao lado de `package.json`) e preencha-o com suas credenciais. Você pode usar o arquivo `.env.example` como base.

```dotenv
# Supabase Configuration
VITE_SUPABASE_URL=https://ofkhgdmdcvixprpjjfdn.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9ma2hnZG1kY3ZpeHBycGpqZmRuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ5NjU4NTEsImV4cCI6MjA3MDU0MTg1MX0.oj9Gr-CRgazrk4m-meCCcE5mS9EjxiNbGqF85jJfans

# Stripe Configuration
VITE_STRIPE_PRICE_ID=price_1Rv8OoB1cuFGKX9IF7rKWjfL
STRIPE_SECRET_KEY=sk_test_51•••••MNh
STRIPE_WEBHOOK_SECRET=whsec_kMUaNyTblAAm492huJYCNtCg3jNaBkpR
```

**Importante**: As variáveis `STRIPE_SECRET_KEY` e `STRIPE_WEBHOOK_SECRET` **NÃO** devem ser expostas no frontend. Elas serão usadas apenas pelas Supabase Edge Functions.

### 2. Configuração do Banco de Dados Supabase

O esquema do banco de dados necessário para este projeto já está definido no arquivo `supabase/migrations/20250812025803_dawn_palace.sql`. Este arquivo cria as tabelas `stripe_customers`, `stripe_subscriptions`, `stripe_orders` e as views `stripe_user_subscriptions`, `stripe_user_orders`, além de configurar o Row Level Security (RLS) e as políticas de acesso.

Para aplicar as migrações ao seu projeto Supabase:

1.  Certifique-se de estar logado no Supabase CLI:
    ```bash
    supabase login
    ```
2.  Vincule seu projeto local ao seu projeto Supabase remoto:
    ```bash
    supabase link --project-ref your-project-ref # Substitua 'your-project-ref' pelo ID do seu projeto Supabase
    ```
3.  Aplique as migrações:
    ```bash
    supabase db push
    ```

### 3. Deploy das Supabase Edge Functions

Este projeto utiliza duas Edge Functions: `stripe-checkout` e `stripe-webhook`.

1.  **Deploy das Funções**:
    Navegue até a raiz do seu projeto (onde está a pasta `supabase/functions`) e execute os comandos de deploy:

    ```bash
    supabase functions deploy stripe-checkout --no-verify-jwt
    supabase functions deploy stripe-webhook --no-verify-jwt
    ```
    O `--no-verify-jwt` é usado aqui para simplificar, mas em um ambiente de produção, você deve considerar a validação de JWT.

2.  **Configurar Variáveis de Ambiente para as Funções**:
    As Edge Functions precisam acessar suas chaves secretas do Stripe. Você deve configurá-las no painel do Supabase, em **Edge Functions > Configuração > Variáveis de Ambiente**.

    Adicione as seguintes variáveis:
    *   `STRIPE_SECRET_KEY`: Sua chave secreta do Stripe (ex: `sk_test_...`)
    *   `STRIPE_WEBHOOK_SECRET`: Seu secret de webhook do Stripe (ex: `whsec_...`)
    *   `SUPABASE_URL`: A URL do seu projeto Supabase (a mesma de `VITE_SUPABASE_URL`)
    *   `SUPABASE_SERVICE_ROLE_KEY`: A chave `service_role` do seu projeto Supabase (encontrada em **Project Settings > API**). Esta chave é muito poderosa, use com cautela e apenas no backend.

### 4. Configuração do Stripe Webhook

Para que o Stripe possa notificar seu backend sobre eventos de pagamento e assinatura, você precisa configurar um webhook endpoint.

1.  **Obtenha a URL do Webhook**:
    Após o deploy da função `stripe-webhook`, você pode encontrar a URL dela no painel do Supabase, em **Edge Functions**. A URL será algo como `https://<your-project-ref>.supabase.co/functions/v1/stripe-webhook`.

2.  **Configure o Webhook no Stripe**:
    *   Acesse seu [Stripe Dashboard](https://dashboard.stripe.com/).
    *   Vá para **Developers > Webhooks**.
    *   Clique em **Add endpoint**.
    *   Cole a URL da sua função `stripe-webhook` no campo **Endpoint URL**.
    *   Em **Select events to listen to**, adicione os seguintes eventos:
        *   `checkout.session.completed`
        *   `customer.subscription.deleted`
        *   `invoice.payment_succeeded`
    *   Clique em **Add endpoint**.
    *   Após criar o endpoint, o Stripe fornecerá um **Signing secret** (começando com `whsec_`). Copie este secret e adicione-o como `STRIPE_WEBHOOK_SECRET` nas variáveis de ambiente das suas Edge Functions no Supabase (passo 3.2).

### 5. Executando o Frontend Localmente

Para iniciar o servidor de desenvolvimento do frontend:

1.  Instale as dependências:
    ```bash
    npm install
    # ou yarn install
    ```
2.  Inicie o servidor de desenvolvimento:
    ```bash
    npm run dev
    # ou yarn dev
    ```
    O aplicativo estará disponível em `http://localhost:5173`.

### 6. Deploy do Frontend no Netlify

Este projeto está configurado para ser facilmente deployado no Netlify.

1.  **Crie um novo site no Netlify**:
    *   Conecte seu repositório Git (GitHub, GitLab, Bitbucket).
    *   Selecione o repositório do seu projeto.

2.  **Configurações de Build**:
    *   **Build command**: `npm run build` (ou `yarn build`)
    *   **Publish directory**: `dist`

3.  **Variáveis de Ambiente no Netlify**:
    Adicione as seguintes variáveis de ambiente no Netlify (em **Site settings > Build & deploy > Environment**):
    *   `VITE_SUPABASE_URL`
    *   `VITE_SUPABASE_ANON_KEY`
    *   `VITE_STRIPE_PRICE_ID`

4.  **Arquivo `netlify.toml`**:
    O arquivo `netlify.toml` já está configurado para lidar com redirecionamentos, garantindo que as rotas do React Router funcionem corretamente.

    ```toml
    # Exemplo de netlify.toml (se não existir, crie na raiz do projeto)
    [[redirects]]
      from = "/*"
      to = "/index.html"
      status = 200
    ```

5.  **Deploy**:
    O Netlify fará o deploy automaticamente a cada push para o branch configurado (geralmente `main`).

## Testando o Fluxo Completo

1.  **Acesse a Aplicação**: Abra a aplicação no seu navegador (localmente ou após o deploy).
2.  **Cadastro/Login**: Crie uma nova conta ou faça login. Você será redirecionado para o `/dashboard`.
3.  **Verifique o Dashboard**: Como um novo usuário, você não terá uma assinatura ativa. O dashboard deve exibir uma mensagem e um botão para "Assinar agora".
4.  **Assinar**: Clique no botão "Assinar agora". Você será redirecionado para a página `/subscribe`.
5.  **Stripe Checkout**: Selecione o plano e clique em "Subscribe Now". Isso o levará para a página de checkout do Stripe.
6.  **Pagamento**: Complete o pagamento no Stripe.
7.  **Página de Sucesso**: Após o pagamento bem-sucedido, o Stripe o redirecionará de volta para a página `/success` da sua aplicação.
8.  **Dashboard de Assinante**: Você será automaticamente redirecionado para o `/dashboard`, que agora deve exibir o conteúdo VIP, confirmando que sua assinatura está ativa.
9.  **Persistência**: Tente recarregar a página ou fechar e reabrir o navegador. Sua sessão e status de assinatura devem persistir.

Se você tiver qualquer problema, verifique os logs do seu navegador, os logs das Edge Functions no Supabase e os logs de webhook no Stripe Dashboard.
```