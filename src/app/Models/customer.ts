import { Address } from "./address";
import { Order } from "./order";
import { User } from "./user";

export class Customer extends User {
    productsPurchased: Order[];
    addresses: Address[];
    friendRequests: string[]; 
    friends: string[]; 
    friendProductRecommendations: string[];

    constructor(
        _id: string, 
        firstName: string,
        lastName: string, 
        email: string, 
        mobileNumber: string, 
        dateOfBirth: Date, 
        password: string,
        role: string,
        productsPurchased: Order[], 
        addresses: Address[], 
        friendRequests: string[], 
        friends: string[], 
        friendProductRecommendations: string[],
    ) {
        super(_id, firstName, lastName, email, password, mobileNumber, dateOfBirth, role);
        this.productsPurchased = productsPurchased;
        this.addresses = addresses;
        this.friendRequests = friendRequests;
        this.friends = friends;
        this.friendProductRecommendations = friendProductRecommendations;
    }
}

