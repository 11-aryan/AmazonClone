import { identifierName } from "@angular/compiler";

export class CartItem {
    productId: string;
    customerId: string;  
    quantityInCart: number; 
    selectedForBuying: boolean;

    constructor(
        productId: string, 
        customerId: string,
        quantityInCart: number,
        selectedForBuying: boolean,
    ) {
        this.productId = productId;
        this.customerId = customerId;
        this.quantityInCart = quantityInCart;
        this.selectedForBuying = selectedForBuying;
    }
}