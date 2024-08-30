# Welcome to Taqseem

Taqseem is a web application that allows users to create and join groups to share expenses. This project was created as an alternative to popular, but paid expense sharing applications.

This application is built using the following technologies:
* [Next.js v14](https://nextjs.org/)
* [React.js v18](https://react.dev/)
* [Chakra UI v2](https://v2.chakra-ui.com/)
* [Auth.js](https://authjs.dev/)
* [Prisma](https://www.prisma.io/)
* [React Hook Forms](https://react-hook-form.com/)
* [Tanstack Query](https://tanstack.com/query/latest)

This project uses Next.js React Server Components insofar as allowed by Chakra UI. Since Chakra is a client-side library, the server components are limited to acting as data providers and pre-hydration which reduces the time to first paint. It also uses Server Actions for mutations and TanStack query for client-side data fetching and infinite scrolling.

## Project Structure
```
.
├── prisma
│   ├── schema.prisma
├── src
│   ├── app
│   │   ├── (auth)
│   │   ├── (site)
│   │   |   ├── components
│   │   |   ├── activity
│   │   |   ├── group
│   │   |   ├── dashboard
│   │   |   ├── settings
│   ├── client/hooks
│   ├── components
│   ├── lib
│   |   ├── db
│   |   ├── providers
│   |   ├── theme
│   |   ├── utils
│   ├── server
│   |   ├── actions
│   |   ├── data
│   |   ├── service
│   ├── types
├── public
├── .env
├── Dockerfile
```

|   |   |   |
|---|---|---|
|![home](https://github.com/user-attachments/assets/dda878eb-0899-4c87-bf33-edefcb101dd1) |![groups](https://github.com/user-attachments/assets/63a2aa52-8da6-493b-ad13-ab2a8cedfbb1) | ![transactions](https://github.com/user-attachments/assets/3d991cc9-a31c-40e4-b3ae-a63569b5af6e)|
|![new_transaction](https://github.com/user-attachments/assets/226f63dd-00e5-4761-8b7c-2add242b57ee)|![new_transaction_2](https://github.com/user-attachments/assets/b670d769-fc13-459e-86fa-29b1b0a02620)|![settlement](https://github.com/user-attachments/assets/bdc445c1-34e7-4d83-97f9-c454aa565629)|
