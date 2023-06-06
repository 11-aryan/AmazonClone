package Model

type Category struct {
	Id        		string      				`json:"_id" bson:"_id"`
	CategoryName	string 						`json:"categoryName" bson:"categoryName"`
	Brands        	[]string    				`json:"brands" bson:"brands"`
	Colors        	[]string    				`json:"colors" bson:"colors"`	
	PriceRanges 	[]string					`json:"priceRanges" bson:"priceRanges"`
	SellerIds 		[]string					`json:"sellerIds" bson:"sellerIds"`
	// Properties 		bson.M						`json:"properties" bson:"properties"`
	Properties 		map[string][]interface{}	`json:"properties" bson:"properties"`
}