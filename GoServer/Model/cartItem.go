package Model

type CartItem struct {
	// Id        			string      `json:"_id" bson:"_id"`
	ProductId        	string      `json:"productId" bson:"productId"`
	CustomerId        	string      `json:"customerId" bson:"customerId"`
	QuantityInCart 		int 		`json:"quantityInCart" bson:"quantityInCart"`
	SelectedForBuying 	bool		`json:"selectedForBuying" bson:"selectedForBuying"`
}