This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

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

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Session & Stealth Integration

### Auth & Tokens

- Access/refresh tokens are set as HttpOnly cookies by the backend.
- The frontend keeps an in-memory reference to the access token (when returned) and schedules silent refreshes.
- `rememberMe=true` enables long-lived sliding refresh tokens (up to configured cap) and is required for Stealth Mode access.

### Passive Refresh

- Implemented via `SessionRefresherProvider` wrapping the root layout and `usePassiveRefresh` hook.
- Automatically refreshes ~60s before expiry (or 90% of remaining window) and on tab visibility return if <30s remain.

### Stealth Mode Requirements

- Stealth mode pages (`/stealth/...`) are only accessible if both `stealthMode` cookie and `rememberMe` cookie are `true`.
- Middleware enforces redirects to `/dashboard` when requirement not met.

### Adding the Provider

Wrap your root layout component (e.g. `app/layout.tsx`) with:

```tsx
import { SessionRefresherProvider } from "@/components/SessionRefresherProvider";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <SessionRefresherProvider>{children}</SessionRefresherProvider>
      </body>
    </html>
  );
}
```

### Environment Alignment

Ensure backend exposes and sets:

- `ACCESS_TOKEN_EXPIRY` (e.g. 15m)
- `REFRESH_TOKEN_SHORT_EXPIRY` (e.g. 2h)
- `REFRESH_TOKEN_LONG_EXPIRY` (e.g. 30d)
- `REFRESH_TOKEN_LONG_CAP` (e.g. 90d)

Frontend logic consumes only `expiresIn` from login/register (for scheduling) and relies on `POST /users/refresh-token` for rotation.
