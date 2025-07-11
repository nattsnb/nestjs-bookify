# NestJS Bookify

Database for Booking mock-up.

## App installation:

1. Pull repo to your directory
2. Move to branch 'feat/testing'
3. Install dependencies

`npm install`

4. Start Docker software
5. Provide with .env file containing DATABASE_URL, FRONTEND_URL, JWT_SECRET, JWT_EXPIRATION_TIME
6. In parallel terminal, in directory 'nestjs-bookify/', run:

`docker compose up`

7. In directory 'nestjs-bookify/' run:

`npm run build-prisma`

8. In directory 'nestjs-bookify/' run:

`npm prisma migrate dev`

9. To start the server, run:

`npm run start`

## Branches:

### Master

Basic website file structure, nothing to display.

### feat/structure

Database structure and basic tables functionality .

### feat/filters-calendar

Advanced functionality: filters for venue search results and endpoints for the calendar.

### feat/testing

Test development and final corrections.
