import { Address } from "./address";
import { Payment } from "./payment";

export class Order {
    _id: string; 
    customerId: string; 
    // sellerId: string; 
    productId: string;
    orderedDate: Date | undefined; 
    orderQuantity: number;
    deliveredDate: Date | undefined;
    status: string; 
    shippingAddress: Address;
    paymentDetails: Payment; 
    totalAmount: number; 

    constructor(
        _id: string, 
        customerId: string, 
        // sellerId: string, 
        productId: string, 
        orderedDate: Date | undefined,
        orderQuantity: number,
        deliveredDate: Date | undefined,
        status: string, 
        shippingAddress: Address,
        paymentDetails: Payment, 
        totalAmount: number
    ) {
        this._id = _id;
        this.customerId = customerId;  
        // this.sellerId =  sellerId;
        this.productId = productId;
        this.orderedDate = orderedDate;
        this.orderQuantity = orderQuantity;
        this.deliveredDate = deliveredDate;
        this.status = status;
        this.shippingAddress = shippingAddress; 
        this.paymentDetails = paymentDetails;
        this.totalAmount = totalAmount;
    }   
}
