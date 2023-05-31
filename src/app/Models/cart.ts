import { CartItem } from "./cartItem";


export class Cart {
    _id: string; // Equal to user Id
    cartItems: CartItem[]; // Ids of CartItem s in cart 

    constructor(
        _id: string,
        cartItems: CartItem[],
    ) {
        this._id = _id;
        this.cartItems = cartItems;
    }

}