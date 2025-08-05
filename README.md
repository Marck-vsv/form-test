# Dynamic Form Builder

This project is a dynamic form builder and viewer application built with Next.js, React, and Tailwind CSS. It allows users to create, manage, and view custom forms with various question types, including conditional logic.

## Features

- **Form Management**: Create, view, update, and delete forms.
- **Question Management**: Add, edit, and remove questions within forms.
- **Diverse Question Types**: Supports text input, numbers (integer and decimal), Yes/No, single-choice, and multiple-choice questions.
- **Conditional Logic**: Define rules to show or hide questions based on previous answers.
- **Mock Backend**: Uses a simple in-memory mock database for data persistence during development.
- **Responsive UI**: Built with Tailwind CSS and Shadcn UI components for a modern and responsive user experience.

## Technologies Used

- **Next.js**: React framework for building web applications.
- **React**: JavaScript library for building user interfaces.
- **TypeScript**: Strongly typed superset of JavaScript.
- **Tailwind CSS**: Utility-first CSS framework for rapid UI development.
- **Shadcn UI**: Reusable UI components built with Tailwind CSS and Radix UI.
- **TanStack Query (React Query)**: For data fetching, caching, and synchronization.
- **Lucide React**: Icon library.
- **pnpm**: Fast, disk space efficient package manager.

## Installation

To set up the project locally, follow these steps:

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/your-username/form-test.git
    cd form-test
    ```

2.  **Install dependencies** using pnpm:
    ```bash
    pnpm install
    ```

## Running the Application

To start the development server:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## API Endpoints

The application exposes the following API endpoints (mocked):

-   `/api/forms`: Manage forms (GET all, POST new).
-   `/api/forms/[id]`: Get, update, or delete a specific form.
-   `/api/forms/[formId]/questions`: Manage questions for a specific form (GET all, POST new).
-   `/api/questions/[id]`: Get, update, or delete a specific question.
-   `/api/questions/[questionId]/options`: Manage options for a specific question (GET all, POST new).
-   `/api/options/[id]`: Get, update, or delete a specific option.
-   `/api/conditionals`: Create new conditional rules.
-   `/api/conditionals/[id]`: Get or delete a specific conditional rule.

## Project Structure

-   `src/app/`: Next.js application routes and API endpoints.
    -   `api/`: Backend API routes.
    -   `forms/`: Frontend pages for form management.
    -   `questions/`: Frontend pages for question management.
-   `src/components/`: Reusable React components, including Shadcn UI components.
-   `src/data/mock-db.ts`: In-memory mock database for development.
-   `src/services/`: Service layer for interacting with the API.
-   `src/types/index.ts`: TypeScript type definitions.
-   `src/lib/`: Utility functions and Axios instance.
-   `src/hooks/`: Custom React hooks.