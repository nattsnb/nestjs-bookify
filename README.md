# NestJS Bookify

Database for Booking mock-up.

## App installation:

1. On branch master, install dependencies

`npm ci`

2. Start Docker software
3. Provide with .env file containing DATABASE_URL, FRONTEND_URL, JWT_SECRET, JWT_EXPIRATION_TIME
4. Provide with .docker.env file containing POSTGRES_USER, POSTGRES_PASSWORD, POSTGRES_DB, PGADMIN_DEFAULT_EMAIL, PGADMIN_DEFAULT_PASSWORD
5. In directory 'nestjs-bookify/', run:

`docker compose up -d`

6. In directory 'nestjs-bookify/' run:

`npm run build-prisma`

7. In directory 'nestjs-bookify/' run:

`npx prisma migrate dev`

7. To use seed file, in directory 'nestjs-bookify/' run:

`npm run seed-database`

8. To start the server, run:

`npm run start`

## Branches:

### Master

Fully working app.

### feat/structure

Database structure and basic tables functionality .

### feat/filters-calendar

Advanced functionality: filters for venue search results and endpoints for the calendar.

### feat/testing

Test development.

### feat/frontend-corelation

Adjusting existing app to use with provided frontend.

### feat//correction

Final corrections.
