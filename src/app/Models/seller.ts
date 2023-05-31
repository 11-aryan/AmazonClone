import { User } from "./user";


export class Seller extends User {
    productsListedIds: string[];
    productsSoldIds: string[];

    constructor(
        _id: string, 
        firstName: string,
        lastName: string, 
        email: string, 
        mobileNumber: string, 
        dateOfBirth: Date, 
        password: string,
        role: string,
        productsListedIds: string[],
        productsSoldIds: string[]
    ) {
        super(_id, firstName, lastName, email, password, mobileNumber, dateOfBirth, role);
        this.productsListedIds = productsListedIds;
        this.productsSoldIds = productsSoldIds;
    }
}

