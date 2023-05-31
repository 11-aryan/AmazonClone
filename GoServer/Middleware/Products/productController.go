package productController

import (
	connection "GoServer/Config"
	generic "GoServer/Generic"
	model "GoServer/Model"
	"context"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"math"
	"net/http"
	"strconv"
	"strings"

	// "strconv"
	"github.com/gorilla/mux"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo/options"
)


func GetProductById(w http.ResponseWriter, r *http.Request) {
	fmt.Println("Get product by Id called");
	generic.SetupResponse(&w, r)

	w.Header().Set("Content-Type", "application/json")
	collection := connection.ConnectDB("products")

	var product model.Product
	var params = mux.Vars(r)

	// //  fmt.Println("params1: ", params)

	// id, _ := strconv.ParseInt(params["id"], 10, 32) 
    // id, _ := params["id"]


    id, err := primitive.ObjectIDFromHex(params["id"])
	if err != nil {
		connection.GetError(err, w)
		return
	}

    //  fmt.Println("id: ", id)

	filter := bson.M{"_id": id}
    // //  fmt.Println("filter: ", filter)

	err = collection.FindOne(context.TODO(), filter).Decode(&product)
	if err != nil {
		connection.GetError(err, w)
		return
	}

	json.NewEncoder(w).Encode(product)
}



func GetProducts(w http.ResponseWriter, r *http.Request) {
	 fmt.Println("\n\n\tGET Products called\n\n")

    generic.SetupResponse(&w, r)
    w.Header().Set("Content-Type", "application/json")
    var products []model.Product
    collection := connection.ConnectDB("products")

    cur, err := collection.Find(context.TODO(), bson.M{})

	// //  fmt.Println("\ncollection: ", collection)
	// //  fmt.Println("\ncur: ", cur)

    if err != nil {
		//  fmt.Println("\n\n****ERROR 1*****\n\n")
        connection.GetError(err, w)
        return
    }

    defer cur.Close(context.TODO())

    for cur.Next(context.TODO()) {
        var product model.Product
        err := cur.Decode(&product)

        if err != nil {
			//  fmt.Println("\n\n****ERROR*****\n\n")
            log.Fatal(err)
        }

        products = append(products, product)
		//  fmt.Println("\nproduct: ", product);
    }

    // //  fmt.Println(len(products))

    if err := cur.Err(); err != nil {
        log.Fatal(err)
    }

    json.NewEncoder(w).Encode(products)

}



func CreateProduct(w http.ResponseWriter, r *http.Request) {
	 fmt.Println("\n\n\tPOST Product called\n\n")

    generic.SetupResponse(&w, r)
    if r.Method == "POST" {
        w.Header().Set("Content-Type", "application/json")

        data, err := ioutil.ReadAll(r.Body)
        asString := string(data)

        var product map[string]interface{}
        json.Unmarshal([]byte(asString), &product)
        delete(product, "_id")

        collection := connection.ConnectDB("products")
        result, err := collection.InsertOne(context.TODO(), product)
        if err != nil {
            connection.GetError(err, w)
            return
        }

        json.NewEncoder(w).Encode(result)
    }
}


func UpdateProduct(w http.ResponseWriter, r *http.Request) {
	 fmt.Println("Update product called (POST)");
	generic.SetupResponse(&w, r)
	if r.Method == "PUT" {
		w.Header().Set("Content-Type", "application/json")

		var params = mux.Vars(r)

		id, err := primitive.ObjectIDFromHex(params["id"]) 
		var product model.Product

		filter := bson.M{"_id": id}

		_ = json.NewDecoder(r.Body).Decode(&product)

		update := bson.D{
			{Key: "$set", Value: bson.D {
				{Key: "productName", Value: product.ProductName},
				{Key: "aboutProduct", Value: product.AboutProduct},
				{Key: "sellerId", Value: product.SellerId},
				{Key: "brand", Value: product.Brand},
				{Key: "maxRetailPrice", Value: product.MaxRetailPrice},
				{Key: "sellingPrice", Value: product.SellingPrice},
                {Key: "quantity", Value: product.Quantity},
                {Key: "productCategories", Value: product.ProductCategories},
                {Key: "averageRating", Value: product.AverageRating},
                {Key: "productImages", Value: product.ProductImages},
                {Key: "reviews", Value: product.Reviews},
			}},
		}

		// //  fmt.Println("product update received: ", product)
		
		collection := connection.ConnectDB("products")
		err = collection.FindOneAndUpdate(context.TODO(), filter, update).Decode(&product)
		if err != nil {
			connection.GetError(err, w)
			return
		}

		// product.Id, _ = primitive.ObjectIDFromHex(params["id"])

		json.NewEncoder(w).Encode(product)
	}
}

func GetProductsBySellerId(w http.ResponseWriter, r *http.Request) {
	fmt.Println("Get products by seller Id called");
	generic.SetupResponse(&w, r)

	w.Header().Set("Content-Type", "application/json")
	collection := connection.ConnectDB("products")

	var products []model.Product
	var params = mux.Vars(r)

	// fmt.Println("params2: ", params)

	id := params["sellerId"];

	filter := bson.M{"sellerId": id}
    // fmt.Println("filter: ", filter)

	cur, err := collection.Find(context.TODO(), filter)
    if err != nil {
        connection.GetError(err, w)
        return
    }
    defer cur.Close(context.TODO())

    for cur.Next(context.TODO()) {
        var product model.Product
        err := cur.Decode(&product)
        if err != nil {
            connection.GetError(err, w)
            return
        }
		// fmt.Println("Products filtered: ", product);
        products = append(products, product)
    }

    if err := cur.Err(); err != nil {
        connection.GetError(err, w)
        return
    }

    json.NewEncoder(w).Encode(products)
}


func GetPaginatedProducts(w http.ResponseWriter, r *http.Request) {
    fmt.Println("Get pagination products called:")

	pageNumber, err := strconv.Atoi(r.URL.Query().Get("pageNumber"));
    pageSize, err := strconv.Atoi(r.URL.Query().Get("pageSize"));
	productCategories := r.URL.Query().Get("productCategories");
	sortVal, err := strconv.Atoi(r.URL.Query().Get("sortVal"));

	fmt.Println("\n\t sort value: ", sortVal)

	if((sortVal!= -1) && (sortVal!=1)) {
		sortVal = 1;
	}

	fmt.Println("categories received: ", productCategories);

    skip := (pageNumber - 1) * pageSize 
	skip = int(math.Max(float64(skip), 0));

    fmt.Println("page:", pageNumber, "pagesize:", pageSize, "skip:", skip)

    data, totalCount, err := fetchPaginatedDataFromMongoDB(skip, pageSize, productCategories, sortVal)
    if err != nil {
		//  fmt.Println("Error in fetchPagiatedData")
        return
    }

	//  fmt.Println("data: ", data);

    response := map[string]interface{}{
        "data":       data,
        "totalCount": totalCount,
    }

    json.NewEncoder(w).Encode(response)
}


func fetchPaginatedDataFromMongoDB(skip, limit int, productCategories string, sortVal int) ([]model.Product, int64, error) {
    collection := connection.ConnectDB("products")

	filter := bson.D{}
    if productCategories != "" {
        categoryArray := strings.Split(productCategories, ",")
        filter = append(filter, bson.E{"productCategories", bson.D{{"$in", categoryArray}}})
    }

    options := options.Find().SetSkip(int64(skip)).SetLimit(int64(limit)).SetSort(bson.D{{"sellingPrice", sortVal}})

    cursor, err := collection.Find(context.TODO(), filter, options)
    if err != nil {
		//  fmt.Println("Error in cursor: ", err);
        return nil, 0, err
    }
    defer cursor.Close(context.TODO())

    var results []model.Product
    if err := cursor.All(context.TODO(), &results); err != nil { 
		//  fmt.Println("Error in curson All");
        return nil, 0, err
    }

    totalCount, err := collection.CountDocuments(context.TODO(), bson.D{})
    if err != nil { 
		//  fmt.Println("Error in Count Documents");
        return nil, 0, err
    }

    return results, totalCount, nil
}



func GetProductsByProductname(w http.ResponseWriter, r *http.Request) {
    fmt.Println("Get products by productName called");
	generic.SetupResponse(&w, r)

	w.Header().Set("Content-Type", "application/json")
	collection := connection.ConnectDB("products")

	var products []model.Product

    productName := r.URL.Query().Get("productName");

	filter := bson.M{
        "productName": bson.M{
            "$regex":   productName,
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
        var product model.Product
        err := cur.Decode(&product)
        if err != nil {
            connection.GetError(err, w)
            return
        }
		// fmt.Println("Products filtered: ", product);
        products = append(products, product)
    }

    if err := cur.Err(); err != nil {
        connection.GetError(err, w)
        return
    }

    json.NewEncoder(w).Encode(products)
}