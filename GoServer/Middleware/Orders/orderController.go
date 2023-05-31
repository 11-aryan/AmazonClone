package orderController

import (
	connection "GoServer/Config"
	generic "GoServer/Generic"
	model "GoServer/Model"
	"context"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"

	// "strconv"
	"github.com/gorilla/mux"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
)


func GetOrderById(w http.ResponseWriter, r *http.Request) {
	fmt.Println("Get order by Id called");
	generic.SetupResponse(&w, r)

	w.Header().Set("Content-Type", "application/json")
	collection := connection.ConnectDB("orders")

	var order model.Order
	var params = mux.Vars(r)


    id, err := primitive.ObjectIDFromHex(params["id"])
	if err != nil {
		connection.GetError(err, w)
		return
	}

    fmt.Println("id: ", id)

	filter := bson.M{"_id": id}
    fmt.Println("filter: ", filter)

	err = collection.FindOne(context.TODO(), filter).Decode(&order)
	if err != nil {
		connection.GetError(err, w)
		return
	}

	json.NewEncoder(w).Encode(order)
}


func GetOrdersByCustomerId(w http.ResponseWriter, r *http.Request) {
	fmt.Println("Get orders by customer ID called")
	generic.SetupResponse(&w, r)

	w.Header().Set("Content-Type", "application/json")
	collection := connection.ConnectDB("orders")

	var orders []model.Order
	var params = mux.Vars(r)

	customerID := params["customerId"]

	filter := bson.M{"customerId": customerID}

	cur, err := collection.Find(context.TODO(), filter)
	if err != nil {
		connection.GetError(err, w)
		return
	}
	defer cur.Close(context.TODO())

	for cur.Next(context.TODO()) {
		var order model.Order
		err := cur.Decode(&order)
		if err != nil {
			connection.GetError(err, w)
			return
		}
		orders = append(orders, order)
	}

	if err := cur.Err(); err != nil {
		connection.GetError(err, w)
		return
	}

	json.NewEncoder(w).Encode(orders)
}




func CreateOrder(w http.ResponseWriter, r *http.Request) {
	fmt.Println("\n\tPOST Order called")

    generic.SetupResponse(&w, r)
    if r.Method == "POST" {
        w.Header().Set("Content-Type", "application/json")

        data, err := ioutil.ReadAll(r.Body)
        asString := string(data)

        var order map[string]interface{}
        json.Unmarshal([]byte(asString), &order)
        delete(order, "_id")

        collection := connection.ConnectDB("orders")
        result, err := collection.InsertOne(context.TODO(), order)
        if err != nil {
            connection.GetError(err, w)
            return
        }

        json.NewEncoder(w).Encode(result)
    }
}



