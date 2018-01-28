//Intercom List Class module
var fs = require('fs');

exports.IntercomCustomerList = class IntercomCustomerList {


    /**************** HELPER FUNCTIONS ****************/

    //@returns boolean wether latitude and longitude are within 100 km
    //Using Central Subtended Angle Formula
    //(https://en.wikipedia.org/wiki/Great-circle_distance)
    //Calculate if supplied longitude is within 100km of 
    //Intercom's Dublin HQ - Uses Kilometers
    checkIn100km(custLat, custLon) {
        const toRad = Math.PI/180;

        const hqLat = 53.339428 * toRad;
        const hqLon = -6.257664 * toRad;
        const earthRadius = 6371;
        custLat = parseFloat(custLat) * toRad;
        custLon = parseFloat(custLon) * toRad;
        
        let lambdaDelt = Math.abs(hqLon - custLon);

        //Javascript makes this odd because
        //sin cos etc. return radians while
        //acos returns degress    
        let alpha = Math.acos(
            Math.sin(custLat) * Math.sin(hqLat) +
            Math.cos(custLat) * Math.cos(hqLat) * Math.cos(lambdaDelt)
            );        
        let actualDist = earthRadius * alpha;
        
        return actualDist <= 100 ? true : false;
    }

    //@returns Array of Customers within 100 km
    //@params Array of all customers
    getCustomersIn100(customers) {
        let customersIn100 = [];
        for (let i = 0; i < customers.length; i++) {
            if (this.checkIn100km(customers[i].latitude, customers[i].longitude))
                customersIn100.push(customers[i]);
        }
        return customersIn100;
    }

    //@return Array of JSON objects from supplied file
    readInList() {
        let arrFromJSON;
        try {        
            if (process.argv.length < 3) throw { code: 'INSUFARGS' };
            arrFromJSON = fs.readFileSync(process.argv[2]).toString().split("\n");
            
            if (arrFromJSON == '') throw { code: 'EMPTYFILE' };
        } catch (err) {
            if (err.code == 'ENOENT') {
                console.log("ERROR: FILE NOT FOUND");
            } else if ( err.code == 'INSUFARGS') {
                console.log("ERROR: NO CUSTOMER LIST FILE SPECIFIED IN ARGS");
            } else if ( err.code == 'EMPTYFILE') {
                console.log("ERROR: EMPTY FILE ARGUMENT");
            } else {
                console.log(err);
            }
            process.exit(1);
        }
        return arrFromJSON;
    }

    //@returns Array of Customer Objects retrieved from JSON
    //@params Array of customer json objects
    parseJSONFile(jsonFileArr) {
        let customers = [];
        try {
            for (let i = 0; i < jsonFileArr.length; i++) {
                let customer = JSON.parse(jsonFileArr[i]);
                if (customer.latitude == undefined || customer.longitude == undefined
                     || customer.name == undefined || customer.user_id == undefined) {
                    console.log('A customer is missing information in his file, skipping him/her.');
                } else {
                    customers.push(customer);
                }
            }
        } catch (err) {
            console.log('ERROR: Could not parse customer list JSON file. Check input file');
            process.exit(1);
        }
        return customers;
    }

    //@returns sorted customer array by UID
    //@params array of customers
    sortCustArr(custUnder100) {
        custUnder100.sort((p1,p2) => {
            if ( p1.user_id > p2.user_id ) return 1; 
            else if ( p2.user_id > p1.user_id ) return -1;
            else return 0;
        });
        return custUnder100;
    }

    /**************** RUN PROGRAM ****************/
    run() {
        let jsonFileArr = this.readInList();
        let customers = this.parseJSONFile(jsonFileArr);
        let custUnder100 = this.getCustomersIn100(customers);
        let sortedCustArr = this.sortCustArr(custUnder100);

        //Outputing Results
        let count = 1;
        for (let cust of sortedCustArr) {
            console.log(
                "\n"+count++ + "." +
                "\nCustomer: "+ cust.name +
                "\nUID: "+ cust.user_id
            );
        }
    }

}
