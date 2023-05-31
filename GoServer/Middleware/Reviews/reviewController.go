package reviewController

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
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/bson/primitive"
)


func GetReviewById(w http.ResponseWriter, r *http.Request) {
	fmt.Println("Get review by Id called");
	generic.SetupResponse(&w, r)

	w.Header().Set("Content-Type", "application/json")
	collection := connection.ConnectDB("reviews")

	var review model.Review
	var params = mux.Vars(r)

	fmt.Println("params1: ", params)

	// id, _ := strconv.ParseInt(params["id"], 10, 32) 
    // id, _ := params["id"]


    id, err := primitive.ObjectIDFromHex(params["id"])
	if err != nil {
		connection.GetError(err, w)
		return
	}

    fmt.Println("id: ", id)

	filter := bson.M{"_id": id}
    fmt.Println("filter: ", filter)

	err = collection.FindOne(context.TODO(), filter).Decode(&review)
	if err != nil {
		connection.GetError(err, w)
		return
	}

	json.NewEncoder(w).Encode(review)
}



func DeleteReview(w http.ResponseWriter, r *http.Request) {
    generic.SetupResponse(&w, r)
    // Set header
    if r.Method == "DELETE" {
        w.Header().Set("Content-Type", "application/json")

        // get params
        var params = mux.Vars(r)

        // string to primitve.ObjectID
		id, err := primitive.ObjectIDFromHex(params["id"])
		if err != nil {
			connection.GetError(err, w)
			return
		}
		
		filter := bson.M{"_id": id}
        
        collection := connection.ConnectDB("reviews")
        deleteResult, err := collection.DeleteOne(context.TODO(), filter)

        if err != nil {
            connection.GetError(err, w)
            return
        }

        json.NewEncoder(w).Encode(deleteResult)
    }
}





func GetReviews(w http.ResponseWriter, r *http.Request) {
	fmt.Println("\n\n\tGET reviews called\n\n")

    generic.SetupResponse(&w, r)
    w.Header().Set("Content-Type", "application/json")
    var reviews []model.Review
    collection := connection.ConnectDB("reviews")

    cur, err := collection.Find(context.TODO(), bson.M{})

	fmt.Println("\ncollection: ", collection)
	fmt.Println("\ncur: ", cur)

    if err != nil {
		fmt.Println("\n\n****ERROR 1*****\n\n")
        connection.GetError(err, w)
        return
    }

    defer cur.Close(context.TODO())

    for cur.Next(context.TODO()) {
        var review model.Review
        err := cur.Decode(&review)

        if err != nil {
			fmt.Println("\n\n****ERROR*****\n\n")
            log.Fatal(err)
        }

        reviews = append(reviews, review)
		fmt.Println("\nreview: ", review);
    }

    fmt.Println(len(reviews))

    if err := cur.Err(); err != nil {
        log.Fatal(err)
    }

    json.NewEncoder(w).Encode(reviews)

}



func CreateReview(w http.ResponseWriter, r *http.Request) {
	fmt.Println("\n\n\tPOST review called\n\n")

    generic.SetupResponse(&w, r)
    if r.Method == "POST" {
        w.Header().Set("Content-Type", "application/json")

        data, err := ioutil.ReadAll(r.Body)
        asString := string(data)

        var review map[string]interface{}
        json.Unmarshal([]byte(asString), &review)
        delete(review, "_id")

        collection := connection.ConnectDB("reviews")
        result, err := collection.InsertOne(context.TODO(), review)
        if err != nil {
            connection.GetError(err, w)
            return
        }

        json.NewEncoder(w).Encode(result)
    }
}

func UpdateReview(w http.ResponseWriter, r *http.Request) {
	fmt.Println("Update review called (POST)");
	generic.SetupResponse(&w, r)
	if r.Method == "PUT" {
		fmt.Println("ok")
		w.Header().Set("Content-Type", "application/json")

		var params = mux.Vars(r)

		id, err := primitive.ObjectIDFromHex(params["id"]) 
		var review model.Review

		filter := bson.M{"_id": id}

		_ = json.NewDecoder(r.Body).Decode(&review)

		update := bson.D{
			{Key: "$set", Value: bson.D {
				{Key: "productId", Value: review.ProductId},
				{Key: "customerId", Value: review.CustomerId},
				{Key: "rating", Value: review.Rating},
				{Key: "headline", Value: review.Headline},
				{Key: "description", Value: review.Description},
				{Key: "votes", Value: review.Votes},
			}},
		}

		fmt.Println("review update received: ", review)
		
		collection := connection.ConnectDB("reviews")
		err = collection.FindOneAndUpdate(context.TODO(), filter, update).Decode(&review)
		if err != nil {
			connection.GetError(err, w)
			return
		}

		// review.Id, _ = primitive.ObjectIDFromHex(params["id"])

		json.NewEncoder(w).Encode(review)
	}
}


func GetReviewsByProductId(w http.ResponseWriter, r *http.Request) {
	fmt.Println("Get review by product Id called");
	generic.SetupResponse(&w, r)

	w.Header().Set("Content-Type", "application/json")
	collection := connection.ConnectDB("reviews")

	var reviews []model.Review
	var params = mux.Vars(r)

	fmt.Println("params2: ", params)

    // id, err := primitive.ObjectIDFromHex(params["id"])
	// if err != nil {
	// 	connection.GetError(err, w)
	// 	return
	// }

	id := params["productId"];

	// id = params["id"];

	filter := bson.M{"productId": id}
    fmt.Println("filter: ", filter)

	cur, err := collection.Find(context.TODO(), filter)
    if err != nil {
        connection.GetError(err, w)
        return
    }
    defer cur.Close(context.TODO())

    for cur.Next(context.TODO()) {
        var review model.Review
        err := cur.Decode(&review)
        if err != nil {
            connection.GetError(err, w)
            return
        }
		fmt.Println("Reivew filtered: ", review);
        reviews = append(reviews, review)
    }

    if err := cur.Err(); err != nil {
        connection.GetError(err, w)
        return
    }

    json.NewEncoder(w).Encode(reviews)
}



func GetReviewByProductAndCustomerId(w http.ResponseWriter, r *http.Request) {
	fmt.Println("Get review by product and customer Id called");
	generic.SetupResponse(&w, r)
	w.Header().Set("Content-Type", "application/json")
	collection := connection.ConnectDB("reviews")

	var review model.Review
	params := r.URL.Query()
	productID := params.Get("productId")
	customerID := params.Get("customerId")

	// Create a filter to match the productId and customerId
	filter := bson.M{
		"productId":  productID,
		"customerId": customerID,
	}

	fmt.Println("filter: ", filter)

	// err := collection.FindOne(context.TODO(), filter).Decode(&review)
	// if err != nil {
	// 	connection.GetError(err, w)
	// 	return
	// }

	err := collection.FindOne(context.TODO(), filter).Decode(&review)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			// Handle the "no documents in result" error
			fmt.Println("No review found")
			w.WriteHeader(http.StatusNotFound)
			return
		}
		connection.GetError(err, w)
		return
	}

	json.NewEncoder(w).Encode(review)
}

// func GetReviewByProductAndCustomerId(w http.ResponseWriter, r *http.Request) {
// 	fmt.Println("Get review by product and customer Id called")
// 	generic.SetupResponse(&w, r)
// 	w.Header().Set("Content-Type", "application/json")
// 	collection := connection.ConnectDB("reviews")

// 	var review model.Review
// 	params := r.URL.Query()
// 	productID := params.Get("productId")
// 	customerID := params.Get("customerId")

// 	// Create a filter to match the productId and customerId
// 	filter := bson.M{
// 		"productId":  productID,
// 		"customerId": customerID,
// 	}

// 	fmt.Println("filter: ", filter)

// 	err := collection.FindOne(context.TODO(), filter).Decode(&review)
// 	if err != nil {
// 		if err == mongo.ErrNoDocuments {
// 			// Handle the "no documents in result" error
// 			fmt.Println("No review found")
// 			w.WriteHeader(http.StatusNotFound)
// 			return
// 		}
// 		connection.GetError(err, w)
// 		return
// 	}

// 	json.NewEncoder(w).Encode(review)
// }


