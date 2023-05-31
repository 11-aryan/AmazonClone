package Model
 
type User struct {
	Id        		string      `json:"_id" bson:"_id"`
	FirstName 		string   `json:"firstName" bson:"firstName" `
	LastName  		string   `json:"lastName" bson:"lastName" `
	Email     		string   `json:"email" bson:"email" `
	Password  		string   `json:"password" bson:"password" `
	MobileNumber    string   `json:"mobileNumber" bson:"mobileNumber"`
	DateOfBirth     string   `json:"dateOfBirth" bson:"dateOfBirth"`
	Role      		string   `json:"role" bson:"role"`
}