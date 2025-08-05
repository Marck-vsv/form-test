# Teste tecnico form

Este projeto é um construtor e visualizador de formulários dinâmicos desenvolvido com Next.js, React e Tailwind CSS. Ele permite aos usuários criar, gerenciar e visualizar formulários personalizados com vários tipos de perguntas, incluindo lógica condicional.

## Funcionalidades

- **Gerenciamento de Formulários**: Crie, visualize, atualize e exclua formulários.
- **Gerenciamento de Perguntas**: Adicione, edite e remova perguntas dentro dos formulários.
- **Diversos Tipos de Perguntas**: Suporta entrada de texto, números (inteiros e decimais), Sim/Não, escolha única e perguntas de múltipla escolha.
- **Lógica Condicional**: Defina regras para mostrar ou ocultar perguntas com base em respostas anteriores.
- **Backend Mock**: Utiliza um banco de dados mock simples em memória para persistência de dados durante o desenvolvimento.
- **UI Responsiva**: Construído com Tailwind CSS e componentes Shadcn UI para uma experiência de usuário moderna e responsiva.

## Tecnologias Utilizadas

- **Next.js**: Framework React para construção de aplicações web.
- **React**: Biblioteca JavaScript para construção de interfaces de usuário.
- **TypeScript**: Superset tipado de JavaScript.
- **Tailwind CSS**: Framework CSS utility-first para desenvolvimento rápido de UI.
- **Shadcn UI**: Componentes de UI reutilizáveis construídos com Tailwind CSS e Radix UI.
- **TanStack Query (React Query)**: Para busca, cache e sincronização de dados.
- **Lucide React**: Biblioteca de ícones.
- **pnpm**: Gerenciador de pacotes rápido e eficiente em espaço em disco.

## Instalação

Para configurar o projeto localmente, siga estes passos:

1.  **Clone o repositório**:
    ```bash
    git clone https://github.com/Marck-vsv/form-test.git
    cd form-test
    ```

2.  **Instale as dependências** usando pnpm:
    ```bash
    pnpm install
    ```

## Executando a Aplicação

Para iniciar o servidor de desenvolvimento:

```bash
pnpm dev
```

Abra [http://localhost:3000](http://localhost:3000) no seu navegador para ver a aplicação.

## Endpoints da API

A aplicação expõe os seguintes endpoints da API (mockados):

-   `/api/forms`: Gerencia formulários (GET todos, POST novo).
-   `/api/forms/[id]`: Obtém, atualiza ou exclui um formulário específico.
-   `/api/forms/[formId]/questions`: Gerencia perguntas para um formulário específico (GET todos, POST novo).
-   `/api/questions/[id]`: Obtém, atualiza ou exclui uma pergunta específica.
-   `/api/questions/[questionId]/options`: Gerencia opções para uma pergunta específica (GET todos, POST novo).
-   `/api/options/[id]`: Obtém, atualiza ou exclui uma opção específica.
-   `/api/conditionals`: Cria novas regras condicionais.
-   `/api/conditionals/[id]`: Obtém ou exclui uma regra condicional específica.

## Estrutura do Projeto

-   `src/app/`: Rotas da aplicação Next.js e endpoints da API.
    -   `api/`: Rotas da API de backend.
    -   `forms/`: Páginas de frontend para gerenciamento de formulários.
    -   `questions/`: Páginas de frontend para gerenciamento de perguntas.
-   `src/components/`: Componentes React reutilizáveis, incluindo componentes Shadcn UI.
-   `src/data/mock-db.ts`: Banco de dados mock em memória para desenvolvimento.
-   `src/services/`: Camada de serviço para interagir com a API.
-   `src/types/index.ts`: Definições de tipos TypeScript.
-   `src/lib/`: Funções utilitárias e instância do Axios.
-   `src/hooks/`: Hooks React personalizados.
