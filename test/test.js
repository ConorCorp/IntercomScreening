// Unit Testing using Mocha with the Node assert library
// Manual Testing conducted on:
//      * readInList()
//      * parseJSONFile() - Malformed JSON file
//
// Side note: This is my first time Unit Testing in JS, my backround
// in unit testing is in Java but though it'd be cool to try out in JS. 
// Sorry if it looks wonky.



const ICL = require('../IntercomCustomerList');
const IntercomCustomerList = new ICL.IntercomCustomerList();

var assert = require('assert');

describe('IntercomCustomerList', () => { 
    describe('#checkIn100km()', () => {
        it('returns true if within 100 km', () => {
            assert.equal(IntercomCustomerList.checkIn100km(53.339428, -6.043701), true);
        });

        it('returns false if outside 100 km', () => {
            assert.equal(IntercomCustomerList.checkIn100km(2.986375, -6.043701), false);
        });

        it('returns true if near but under 100 km boundary', () => {
            assert.equal(IntercomCustomerList.checkIn100km(52.49428, -6.543701), true);
        });

        it('returns false if near but over 100 km boundary', () => {
            assert.equal(IntercomCustomerList.checkIn100km(52.29428, -6.543701), false);
        });

        it('returns false when >100km but with positive longitude', () => {
            assert.equal(IntercomCustomerList.checkIn100km(52.29428, 6.543701), false);
        });
    });

    describe('#getCustomersIn100()', () => {
       let customers = [
           {
               'name' : 'George',
               'latitude' : 1,
               'longitude' : 1,
               'user_id': ''
           },
           {
                'name' : 'Jake',
                'latitude' : 53.1489345,
                'longitude' : -6.8422408,
                'user_id': ''
            },
            {
                'name' : 'Billy',
                'latitude' : 7,
                'longitude' : -77,
                'user_id': ''
            }
       ];
       
       it('checks array for those within 100km and only returns Jake', () => {
           var cust = IntercomCustomerList.getCustomersIn100(customers);
           assert.equal(cust.length, 1);
           assert.equal(cust[0].name, 'Jake');
       });
       it('checks array for those within 100km, ', () => {
            var cust = IntercomCustomerList.getCustomersIn100(customers);
            assert.equal(cust.length, 1);
            assert.equal(cust[0].name, 'Jake');
        });
    });

    describe('#parseJSONFile()', () => {

        it ('Customer JSON array is parsed into customer objects', () => {
            let customers = [
                '{"latitude": "52.986375", "user_id": 12, "name": "Christina McArdle", "longitude": "-6.043701"}',
                '{"latitude": "51.92893", "user_id": 1, "name": "Alice Cahill", "longitude": "-10.27699"}',
                '{"latitude": "51.8856167", "user_id": 2, "name": "Ian McArdle", "longitude": "-10.4240951"}'
            ];
            let parsedCust = IntercomCustomerList.parseJSONFile(customers);
            parsedCust.forEach((cust) => {
                for (let i in cust) {
                    assert.notEqual(i, '');
                }
            }); 
        });

        it ('Malform JSON file (doesn\'t have all object properties), skips customer', () => {
            let customers = [
                '{"user_id": 12, "name": "Christina McArdle", "longitude": "-6.043701"}'
            ];
            console.assert(IntercomCustomerList.parseJSONFile(customers), 
            'A customer is missing information in his file, skipping him/her.');
        });
    });

    describe('#sortCustArr()', () => {
        let customers = [
            {
                'name' : 'George',
                'latitude' : 1,
                'longitude' : 1,
                'user_id': 1
            },
            {
                 'name' : 'Jake',
                 'latitude' : 53.1489345,
                 'longitude' : -6.8422408,
                 'user_id': 3
             },
             {
                 'name' : 'Billy',
                 'latitude' : 7,
                 'longitude' : -77,
                 'user_id': 2
             }
        ];
        it('sorts customers by UID (George, Billy, Jake)', () => {
            let sortedCustArr = IntercomCustomerList.sortCustArr(customers);
            assert.equal(sortedCustArr[0].name, 'George');
            assert.equal(sortedCustArr[1].name, 'Billy');
            assert.equal(sortedCustArr[2].name, 'Jake');
        });
    });
});


