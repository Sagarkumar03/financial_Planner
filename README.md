# Financial Planner

A comprehensive financial planning and budgeting application built with Next.js, TypeScript, and Tailwind CSS.

## Features

- **Budget Overview**: Track monthly income, expenses, and net income
- **Savings Goals**: Set and monitor your savings objectives
- **Transaction Management**: Record and categorize your transactions
- **Financial Dashboard**: Get a quick overview of your financial health
- **Responsive Design**: Works seamlessly on desktop and mobile devices

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

You can start customizing the application by modifying `src/app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Project Structure

```
src/
  app/
    layout.tsx          # Root layout component
    page.tsx            # Main dashboard page
    globals.css         # Global styles
  components/           # Reusable React components (to be added)
  lib/                  # Utility functions (to be added)
  types/                # TypeScript type definitions (to be added)
```

## Technologies Used

- **Next.js 16**: React framework for production
- **TypeScript**: Type-safe JavaScript
- **Tailwind CSS 4**: Utility-first CSS framework
- **React 19**: Latest React features

## Development

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Future Enhancements

- Add database integration for persistent data
- Implement user authentication
- Create detailed financial reports and charts
- Add investment tracking features
- Mobile app development

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
