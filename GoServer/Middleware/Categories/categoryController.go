package categoryController

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
	// "go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/bson/primitive"
)


func GetCategoryById(w http.ResponseWriter, r *http.Request) {
	fmt.Println("Get category by Id called");
	generic.SetupResponse(&w, r)

	w.Header().Set("Content-Type", "application/json")
	collection := connection.ConnectDB("categories")

	var category model.Category
	var params = mux.Vars(r)

	fmt.Println("params1: ", params)

    id, err := primitive.ObjectIDFromHex(params["id"])
	if err != nil {
		connection.GetError(err, w)
		return
	}

    fmt.Println("id: ", id)

	filter := bson.M{"_id": id}
    fmt.Println("filter: ", filter)

	err = collection.FindOne(context.TODO(), filter).Decode(&category)
	if err != nil {
		connection.GetError(err, w)
		return
	}

	json.NewEncoder(w).Encode(category)
}



func DeleteCategory(w http.ResponseWriter, r *http.Request) {
    generic.SetupResponse(&w, r)
    // Set header
    if r.Method == "DELETE" {
        w.Header().Set("Content-Type", "application/json")

        var params = mux.Vars(r)

		id, err := primitive.ObjectIDFromHex(params["id"])
		if err != nil {
			connection.GetError(err, w)
			return
		}
		
		filter := bson.M{"_id": id}
        
        collection := connection.ConnectDB("categories")
        deleteResult, err := collection.DeleteOne(context.TODO(), filter)

        if err != nil {
            connection.GetError(err, w)
            return
        }

        json.NewEncoder(w).Encode(deleteResult)
    }
}





func GetCategories(w http.ResponseWriter, r *http.Request) {
	fmt.Println("\n\n\tGET categories called\n\n")

    generic.SetupResponse(&w, r)
    w.Header().Set("Content-Type", "application/json")
    var categories []model.Category
    collection := connection.ConnectDB("categories")

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
        var category model.Category
        err := cur.Decode(&category)

        if err != nil {
			fmt.Println("\n\n****ERROR*****\n\n")
            log.Fatal(err)
        }

        categories = append(categories, category)
		fmt.Println("\ncategory: ", category);
    }

    fmt.Println(len(categories))

    if err := cur.Err(); err != nil {
        log.Fatal(err)
    }

    json.NewEncoder(w).Encode(categories)

}



func CreateCategory(w http.ResponseWriter, r *http.Request) {
	fmt.Println("\n\n\tPOST Category called\n\n")

    generic.SetupResponse(&w, r)
    if r.Method == "POST" {
        w.Header().Set("Content-Type", "application/json")

        data, err := ioutil.ReadAll(r.Body)
        asString := string(data)

        var category map[string]interface{}

        json.Unmarshal([]byte(asString), &category)

        delete(category, "_id")

        collection := connection.ConnectDB("categories")

        result, err := collection.InsertOne(context.TODO(), category)

        if err != nil {
            connection.GetError(err, w)
            return
        }

        json.NewEncoder(w).Encode(result)
    }
}




func UpdateCategory(w http.ResponseWriter, r *http.Request) {
	fmt.Println("Update category called (POST)");
	generic.SetupResponse(&w, r)
	if r.Method == "PUT" {
		fmt.Println("ok")
		w.Header().Set("Content-Type", "application/json")

		var params = mux.Vars(r)

		id, err := primitive.ObjectIDFromHex(params["id"]) 
		var category model.Category

		filter := bson.M{"_id": id}

		_ = json.NewDecoder(r.Body).Decode(&category)

		update := bson.D{
			{Key: "$set", Value: bson.D {
				{Key: "categoryName", Value: category.CategoryName},
				{Key: "brands", Value: category.Brands},
				{Key: "colors", Value: category.Colors},
				{Key: "priceRanges", Value: category.PriceRanges},
				{Key: "sellerIds", Value: category.SellerIds},
                {Key: "properties", Value: category.Properties},
			}},
		}

		fmt.Println("category update received: ", category)
		
		collection := connection.ConnectDB("categories")
		err = collection.FindOneAndUpdate(context.TODO(), filter, update).Decode(&category)
		if err != nil {
			connection.GetError(err, w)
			return
		}

		// category.Id, _ = primitive.ObjectIDFromHex(params["id"])

		json.NewEncoder(w).Encode(category)
	}
}

func GetCategoriesByCategoryName(w http.ResponseWriter, r *http.Request) {
    fmt.Println("Get categorys by categoryName called");
	generic.SetupResponse(&w, r)

	w.Header().Set("Content-Type", "application/json")
	collection := connection.ConnectDB("categories")

	var categories []model.Category

    categoryName := r.URL.Query().Get("categoryName");

	filter := bson.M{
        "categoryName": bson.M{
            "$regex":   categoryName,
            "$options": "i", 
        },
    }

    // fmt.Println("filter: ", filter)

	cur, err := collection.Find(context.TODO(), filter)
    if err != nil {
        connection.GetError(err, w)
        return
    }
    defer cur.Close(context.TODO())

    for cur.Next(context.TODO()) {
        var category model.Category
        err := cur.Decode(&category)
        if err != nil {
            connection.GetError(err, w)
            return
        }
		// fmt.Println("categorys filtered: ", category);
        categories = append(categories, category)
    }

    if err := cur.Err(); err != nil {
        connection.GetError(err, w)
        return
    }

    json.NewEncoder(w).Encode(categories)
}





