package Model

type Order struct {
	Id        			string      `json:"_id" bson:"_id"`
	CustomerId        	string      `json:"customerId" bson:"customerId"`
	// SellerId 			string 		`json:"sellerId" bson:"sellerId"`	
	ProductId        	string      `json:"productId" bson:"productId"`
	OrderQuantity		int			`json:"orderQuantity" bson:"orderQuantity"`
	OrderedDate			string   	`json:"orderedDate" bson:"orderedDate"`
	DeliveredDate		string   	`json:"deliveredDate" bson:"deliveredDate"`
	Status		    	string   	`json:"status" bson:"status"`
	ShippingAddress    	Address   	`json:"shippingAddress" bson:"shippingAddress"`
	PaymentDetails		Payment   	`json:"paymentDetails" bson:"paymentDetails"` 
	TotalAmount 		int 		`json:"totalAmount" bson:"totalAmount"`
}