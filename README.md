## Hvordan koble til de to ulike databasene
1. Pass på at du har en database som heter atdb - Dette er produksjonsdatabasen
2. Pass på at du har en database som heter testAtdb - Dette er testdatabasen

3. Dersom du ønsker å utvikle mot testdatabasen så holder det å skrive inn npm start

4. Dersom du ønsker å utvikle mot produksjonsdatasen (det må du aldri gjøre) så er det ulike fremgangsmåter for Mac og Windows.

#### For Mac
skriv 
```
env NODE_ENV=test npm start
```

#### For Windows
skriv 
```
set NODE_ENV=test
npm start
```