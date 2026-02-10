# SaaS Principles: A Developer's Guide

A comprehensive, interactive web application designed to teach the core architectural and business principles of Software as a Service (SaaS). This project serves as a hands-on learning resource for developers, product managers, and entrepreneurs.

## Features

- **Structured Curriculum**: detailed modules covering key SaaS concepts:
  - **Business Models**: recurring revenue, churn, growth metrics, and pricing strategies.
  - **Architecture**: multi-tenancy models, data isolation, and control planes.
  - **Service Levels**: understanding SLAs, SLOs, and high availability.
- **Interactive Quiz**: a 25-question assessment to test your knowledge after completing the modules.
- **Responsive Design**: a clean, modern UI built with Tailwind CSS and Next.js.
- **Sidebar Navigation**: easy access to all modules and the quiz.

## Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **UI Components**: custom components built with React 19.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

- `app/`: contains the application routes and pages.
- `components/`: reusable UI components like the Sidebar and Quiz interface.
- `data/`: static data files for the curriculum content (`modules.ts`) and quiz questions (`quiz.ts`).
- `public/`: static assets.

## Learn More

To learn more about the technologies used in this project:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [React Documentation](https://react.dev/) - learn about React components and hooks.
- [Tailwind CSS Documentation](https://tailwindcss.com/docs) - learn about utility-first CSS.
