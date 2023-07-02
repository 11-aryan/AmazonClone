package Model

type CartItem struct {
	ProductId        	    string      `json:"productId" bson:"productId"`
	CustomerId        	  string      `json:"customerId" bson:"customerId"`
	QuantityInCart 		    int 		    `json:"quantityInCart" bson:"quantityInCart"`
	SelectedForBuying 	  bool		    `json:"selectedForBuying" bson:"selectedForBuying"`
}
