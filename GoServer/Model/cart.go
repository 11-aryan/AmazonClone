package Model

import "go.mongodb.org/mongo-driver/bson/primitive"

type Cart struct {
	Id        		primitive.ObjectID      `json:"_id" bson:"_id"`
	CartItems		  []CartItem	            `json:"cartItems" bson:"cartItems"`	
}
