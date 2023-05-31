package Model

type Review struct {
	Id        			string      	`json:"_id" bson:"_id"`
	ProductId        	string      	`json:"productId" bson:"productId"`
	CustomerId        	string      	`json:"customerId" bson:"customerId"`
	Rating 				int 			`json:"rating" bson:"rating"`
	Headline 			string			`json:"headline" bson:"headline"`
	Description 		string			`json:"description" bson:"description"`
	Votes 				int			`json:"votes" bson:"votes"`
	ReviewImages 		[]string		`json:"reviewImages" bson:"reviewImages"`
}