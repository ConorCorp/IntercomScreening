//Driver program for inviting Intercom Customers in 100km
//to our party.

//Running instructions
//>npm install
//>node run.js <CustomerListFilename>
//
//Running Tests
//>npm test

const ICL = require('./IntercomCustomerList');

const IntercomCustomerList = new ICL.IntercomCustomerList();
IntercomCustomerList.run();