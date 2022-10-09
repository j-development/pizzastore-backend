# PizzaStore backend project

The backend part of the PizzaStore project, made with NodeJS, ExpressJS

## Start server with npm run dev

`npm run dev`

---

# Rapport - Frontend
Rapport för frontenden hittar du i README.md i projektet pizzastore-frontend: https://gitlab.com/g720/pizzastore-frontend

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

Databasen vi använde är en Postgres relationsdatabas, vi använde Postgres RDBMS för att det är en SQL databas
som vi båda använt tidigare och som har ett trevligt GUI-verktyg (pgAdmin) som gör det lite enklare för oss att använda. Vi hade också ganska enkla specifikationer på vår databas, vi behövde spara ner pizzagrupper, pizzor och ordrar, inga krav på några utstuderade relationer som där en graph-databas hade varit en intressant sak att utforska. Att spara ner dessa objekt i tabeller skulle funka alldeles utmärkt kände vi, så därför föll valet på en SQL relationsdatabas.

<img width="1026" alt="image" src="https://user-images.githubusercontent.com/83879466/194750253-d70a0ecf-925a-4748-8ce0-ab798188f0e8.png">

Vi skapade 4 tabeller med kolumner utifrån de objekt vi hanterar i backenden. Den första tabellen i bilden "order_pizza" är en join-table som i nuvarande implementation inte används. Vi lade till den för att kunna spara och se vilka pizzor och hur många som ingår i en specifik order. I en mer fullständig version av detta projektet hade vi använt det till exempel i en funktion där klienten kan se sina gamla ordrar. I "orders"-tabellen så har vi en kolumn med en delivered-flagga som inte heller är implementerad just nu i backenden. Men den skulle isåfall användas av en admin som kan markera en order som levererad.


## allmänt

Paket som använts förutom det som nämnts är pg för databas implementationen, nodemon för quality of life förbättring när vi utvecklar och dotenv för environment-variabler. I vår .env-fil håller vi våra secrets till jwt-tokens, de ska ju såklart inte skickas med så som det görs nu men för smidighetens skull under utveckling så har vi det så.

Som skrivits som kommenter i auth.js så bör inte refreshTokensStore sparas in-memory i en array så som gjorts. Det borde i en riktig implementation sparas i en säker databas eller i en redis-store.
