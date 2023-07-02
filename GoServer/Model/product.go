package Model

 
type Product struct {
  Id        			    string      `json:"_id" bson:"_id"`
	ProductName			    string 		  `json:"productName" bson:"productName"`
	AboutProduct 		    string 		  `json:"aboutProduct" bson:"aboutProduct"`
	SellerId			      string		  `json:"sellerId" bson:"sellerId"`
	Brand				        string		  `json:"brand" bson:"brand"`
	MaxRetailPrice		  int 		    `json:"maxRetailPrice" bson:"maxRetailPrice"`
	SellingPrice		    int			    `json:"sellingPrice" bson:"sellingPrice"`
	Quantity			      int 		    `json:"quantity" bson:"quantity"`
	UnitsSold			      int 		    `json:"unitsSold" bson:"unitsSold"`
	ProductCategories	  []string 	  `json:"productCategories" bson:"productCategories"`
	AverageRating		    int 		    `json:"averageRating" bson:"averageRating"`
	ProductImages 		  []string 	  `json:"productImages" bson:"productImages"`
	ProductProperties   []string 	  `json:"productProperties" bson:"productProperties"`
	Reviews				      []Review	  `json:"reviews" bson:"reviews"`
}
