# PizzaStore backend project

The backend part of the PizzaStore project, made with NodeJS, ExpressJS

## Start server with npm run dev

`npm run dev`

---

# Rapport - Backend

## server.js

Starting point för backenden är server.js, vi skickar data i formatet json bodys och encoded urls. Så vi lägger till middleware som accepterar de formaten genom bodyparser paketet.

För att separera ut olika funktioner och göra projektet lättöverskådligt använder vi två olika routers. Pizzarouter och authrouter, detta gör vi också för att lättare maintaina koden. Exempelvis kan vi i en senare implementation extrahera ut auth-sevicen till en annan server helt och hållet. I och med att vi använder JWT tokens som är stateless kan vi ha två servrar, en resurs-server och en auth-server.

## auth.js

Vår route för authentication, seedUser() skapar vår användare, här använder vi bcrypt-paketet för att kryptera vårt lösenord. Vi använder salt för att kunna få unika krypterade lösenord även för användare som använder likadana lösenord. Salt används också för att försvara sig mot hashtable-angrepp.

login() är funktionen för att logga in, guard clause används för att validera requesten och skickar en response 500 om username eller password inte finns med i requesten. Går allt väl så skickas en accessToken och en refreshToken tillbaka till klienten. accessToken används sen för att kunna göra requests till endpoints som förändrar vår resurs, dvs de operationer som kräver adminrättigheter. RefreshToken används för att kvittera ut en ny accessToken när denna har passerat gilitighetstiden.

refreshTokens() är funktionen som gör detta. Klienten skickar en request till denna endpointen med en refreshToken, vi kollar så att denna är korrekt och att den finns i refreshTokenStore. Återfinns den inte där så är någonting fel, och vi skickar en status 401 tillbaka till klienten. Anledningen till detta är för att vi vill ha möjligheten att revoka access till vissa klienter (ej impl, men nyttigt i framtiden).

verifyToken() funktionen är en enkel verifieringsfunktion till accessToken.

## pizza.js

getPizzas() hämtar alla våra pizzor från databasen och returnerar

createPizza() skapar ny pizza, kräver accessToken via verifyToken-middleware.
updatePizza() uppdaterar en pizza, kräver accessToken som ovan
deletePizza() raderar en pizza, samma som ovan
pizzaTotalCost() är en helperfunction som hjälper oss räkna ut priset på en order. Som en förbättring hade vi kunnat extrahera ut denna funktion till en utility module i framtiden.

## repository.js

Här har vi options som vi använder när vi connectar till våran sql-databas (Postgres)

## databas

Databasen vi använder är en Postgres relationsdatabas, vi använde postgres för att det är en RDBMS som vi tidigare båda jobbat med och som vi då föredrar att använda.

## allmänt

Paket som använts förutom det som nämnts är pg för databas implementationen, nodemon för quality of life förbättring när vi utvecklar och dotenv för environment-variabler. I vår .env-fil håller vi våra secrets till jwt-tokens, de ska ju såklart inte skickas med så som det görs nu men för smidighetens skull under utveckling så har vi det så.

Som skrivits som kommenter i auth.js så bör inte refreshTokensStore sparas in-memory i en array så som gjorts. Det borde i en riktig implementation sparas i en säker databas eller i en redis-store.
