Intercom Screening Project - Customer Party
Conor Lamb 01/28/18

We have some customer records in a text file (customers.json) -- one customer per line, JSON-encoded.We want to invite any customer within 100km of our Dublin office for some food and drinks on us. Write a program that will read the full list of customers and output the names and user ids of matching customers (within 100km), sorted by User ID (ascending).

# Running

## Config
~~~~
> npm install
~~~~

## Running

With provided CustomerList:
~~~~
> npm run-script exec
~~~~

With custom CustomerList:
~~~~
> node run.js <PathToJSONList>
~~~~

## Running Tests
~~~~
> npm test
~~~~