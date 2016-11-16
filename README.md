## How to connect to the two databases:
1. Make sure you have a database that is called atdb - This is the production database.
2. Make sure you have a database that is called testAtdb - This is the test database.

3. If you are planning to develop on the test database, just write npm start.

4. If you are planning to develop on the production database (don't ever do that) then there are different ways of doing it for mac and windows:

#### For Mac
write
```
env NODE_ENV=production npm start
```

#### For Windows
write
```
set NODE_ENV=production
npm start
```