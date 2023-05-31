export class Payment {
    _id: string; 
    paymentMethod: string; 
    totalAmount: number; 
    userId: string; 
    cardNumber: string; 
    nameOnCard: string; 
    cardExpiryDate: string;
    upiId: string; 
    
    constructor(
        _id: string, 
        paymentMethod: string, 
        totalAmount: number,
        userId: string, 
        cardNumber: string, 
        nameOnCard: string, 
        cardExpiryDate: string,
        upiId: string
    ) {
        this._id = _id;
        this.paymentMethod = paymentMethod;
        this.totalAmount = totalAmount;
        this.userId = userId; 
        this.cardNumber = cardNumber; 
        this.nameOnCard = nameOnCard; 
        this.cardExpiryDate = cardExpiryDate;
        this.upiId = upiId;
    }   
}
