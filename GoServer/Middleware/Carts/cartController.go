package CartController

import (
	connection "GoServer/Config"
	generic "GoServer/Generic"
	model "GoServer/Model"
	"context"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"

	// "strconv"
	"github.com/gorilla/mux"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
)


func GetCartById(w http.ResponseWriter, r *http.Request) {
	fmt.Println("Get Cart by Id called");
	generic.SetupResponse(&w, r)

	w.Header().Set("Content-Type", "application/json")
	collection := connection.ConnectDB("carts")

	var cart model.Cart
	var params = mux.Vars(r)

    id, err := primitive.ObjectIDFromHex(params["id"])
	if err != nil {
		connection.GetError(err, w)
		return
	}

	fmt.Println("cart id received: ", id)

	filter := bson.M{"_id": id}

	err = collection.FindOne(context.TODO(), filter).Decode(&cart)
	fmt.Println("filter: ", filter)
	fmt.Println(cart)

	if err != nil {
		connection.GetError(err, w)
		return
	}

	json.NewEncoder(w).Encode(cart)
}



func GetCarts(w http.ResponseWriter, r *http.Request) {
	fmt.Println("GET Carts called")

    generic.SetupResponse(&w, r)
    w.Header().Set("Content-Type", "application/json")
    var carts []model.Cart
    collection := connection.ConnectDB("carts")

    cur, err := collection.Find(context.TODO(), bson.M{})
    if err != nil {
        connection.GetError(err, w)
        return
    }

    defer cur.Close(context.TODO())

    for cur.Next(context.TODO()) {
        var cart model.Cart
        err := cur.Decode(&cart)

        if err != nil {
            log.Fatal(err)
        }

        carts = append(carts, cart)
		fmt.Println("\nCart: ", cart);
    }

    if err := cur.Err(); err != nil {
        log.Fatal(err)
    }

    json.NewEncoder(w).Encode(carts)
}



func CreateCart(w http.ResponseWriter, r *http.Request) {
	fmt.Println("POST Cart called")

    generic.SetupResponse(&w, r)
    if r.Method == "POST" {
        w.Header().Set("Content-Type", "application/json")

        data, err := ioutil.ReadAll(r.Body)
        asString := string(data)

        // var cart map[string]interface{}
		var cart model.Cart;
        json.Unmarshal([]byte(asString), &cart)
        // delete(cart, "_id")

		var tempId = cart.Id;
		// cart.Id = primitive.NewObjectID(tempId);

		fmt.Println("temp id: ", tempId)

		objectId, err := primitive.ObjectIDFromHex(tempId.Hex());
		if err != nil {
			fmt.Println("Invalid cart id");
			return;
		}

		cart.Id = objectId; 

        collection := connection.ConnectDB("carts")
        result, err := collection.InsertOne(context.TODO(), cart)
        if err != nil {
            connection.GetError(err, w)
            return
        }

        json.NewEncoder(w).Encode(result)
    }
}


func UpdateCart(w http.ResponseWriter, r *http.Request) {
	fmt.Println("Update cart called (POST)");
	generic.SetupResponse(&w, r)
	if r.Method == "PUT" {
		fmt.Println("ok")
		w.Header().Set("Content-Type", "application/json")

		var params = mux.Vars(r)

		id, err := primitive.ObjectIDFromHex(params["id"]) 
		var cart model.Cart

		filter := bson.M{"_id": id}

		_ = json.NewDecoder(r.Body).Decode(&cart)

		update := bson.D{
			{Key: "$set", Value: bson.D{
				{Key: "cartItems", Value: cart.CartItems},
			}},
		}

		fmt.Println("cart update received: ", cart)
		
		collection := connection.ConnectDB("carts")
		err = collection.FindOneAndUpdate(context.TODO(), filter, update).Decode(&cart)
		if err != nil {
			connection.GetError(err, w)
			return
		}

		// cart.Id, _ = primitive.ObjectIDFromHex(params["id"])

		json.NewEncoder(w).Encode(cart)
	}
}