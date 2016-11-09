## Slik får du mail til å virke. Viktig å lese:
For at mail skal fungere må nøkkelen til sendgrid-api'et være koblet mot env-variabelen til node.js. Det gjøres på følgende måte:

1. Åpne opp sendgrid-api-key.txt og kopier nøkkelen
2. Skriv inn følgende på hver sin nye linje
```
echo "export SENDGRID_API_KEY='YOUR_API_KEY'" > sendgrid.env
echo "sendgrid.env" >> .gitignore
source ./sendgrid.env
```
3. skriv npm install for å installere npm-modulen til sendgrid

Forhåpentligvis skal sendgrid-api'et fungere for deg nå.