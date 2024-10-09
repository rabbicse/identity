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

## Updated ory quickstart
```
version: '3.7'
services:
  kratos-migrate:
    image: oryd/kratos:v1.3.0
    environment:
      - DSN=sqlite:///var/lib/sqlite/db.sqlite?_fk=true&mode=rwc
    volumes:
      - type: volume
        source: kratos-sqlite
        target: /var/lib/sqlite
        read_only: false
      - type: bind
        source: ./contrib/quickstart/kratos/email-password
        target: /etc/config/kratos
    command: -c /etc/config/kratos/kratos.yml migrate sql -e --yes
    restart: on-failure
    networks:
      - intranet
  kratos-selfservice-ui-node:
    image: oryd/kratos-selfservice-ui-node:v1.3.0
    environment:
      - KRATOS_PUBLIC_URL=http://kratos:4433/
      - KRATOS_BROWSER_URL=http://127.0.0.1:4433/
      - COOKIE_SECRET=changeme
      - CSRF_COOKIE_NAME=ory_csrf_ui
      - CSRF_COOKIE_SECRET=changeme
    networks:
      - intranet
    restart: on-failure
  kratos:
    depends_on:
      - kratos-migrate
    image: oryd/kratos:v1.3.0
    ports:
      - '4433:4433' # public
      - '4434:4434' # admin
    restart: unless-stopped
    environment:
      - DSN=sqlite:///var/lib/sqlite/db.sqlite?_fk=true
      - LOG_LEVEL=trace
      - SERVE_PUBLIC_CORS_ENABLED=true
      - SERVE_PUBLIC_CORS_ALLOWED_ORIGINS=http://localhost:3000
      - SERVE_PUBLIC_CORS_ALLOWED_METHODS=GET,POST,PUT,DELETE,OPTIONS
      - SERVE_PUBLIC_CORS_ALLOWED_HEADERS=Content-Type,Authorization,X-Requested-With
      - SERVE_PUBLIC_CORS_ALLOW_CREDENTIALS=true
    command: serve -c /etc/config/kratos/kratos.yml --dev --watch-courier
    volumes:
      - type: volume
        source: kratos-sqlite
        target: /var/lib/sqlite
        read_only: false
      - type: bind
        source: ./contrib/quickstart/kratos/email-password
        target: /etc/config/kratos
    networks:
      - intranet
  mailslurper:
    image: oryd/mailslurper:latest-smtps
    ports:
      - '4436:4436'
      - '4437:4437'
    networks:
      - intranet
networks:
  intranet:
volumes:
  kratos-sqlite:
```
