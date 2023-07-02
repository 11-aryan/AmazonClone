package Model


type Address struct {

	Country        		string      `json:"country" bson:"country"`
	FullName        	string      `json:"fullName" bson:"fullName"`
	MobileNumber 		  string 		  `json:"mobileNumber" bson:"mobileNumber"`
	Pincode			 	    string		  `json:"pincode" bson:"pincode"`
	Line1        		  string      `json:"line1" bson:"line1"`
	Line2        		  string      `json:"line2" bson:"line2"`
	Landmark 			    string 		  `json:"landmark" bson:"landmark"`
	City			 	      string		  `json:"city" bson:"city"`
	State        		  string      `json:"state" bson:"state"`

}
