package customerController

import (
	connection "GoServer/Config"
	generic "GoServer/Generic"
	model "GoServer/Model"
	"context"
	"crypto/aes"
	"crypto/cipher"
	"crypto/md5"
	"crypto/rand"
	"encoding/hex"
	"encoding/json"
	"fmt"
	"io"
	"io/ioutil"
	"log"
	"net/http"

	// "github.com/gorilla/mux"
	"github.com/gorilla/mux"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
)


func createHash(key string) string {
    hasher := md5.New()
    hasher.Write([]byte(key))
    return hex.EncodeToString(hasher.Sum(nil))
}

func encrypt(data []byte, passphrase string) []byte {
    block, _ := aes.NewCipher([]byte(createHash(passphrase)))
    gcm, err := cipher.NewGCM(block)
    if err != nil {
        panic(err.Error())
    }
    nonce := make([]byte, gcm.NonceSize())
    if _, err = io.ReadFull(rand.Reader, nonce); err != nil {
        panic(err.Error())
    }
    ciphertext := gcm.Seal(nonce, nonce, data, nil)
    return ciphertext
}

func decrypt(data []byte, passphrase string) []byte {
    key := []byte(createHash(passphrase))
    block, err := aes.NewCipher(key)
    if err != nil {
        panic(err.Error())
    }
    gcm, err := cipher.NewGCM(block)
    if err != nil {
        panic(err.Error())
    }
    nonceSize := gcm.NonceSize()
    nonce, ciphertext := data[:nonceSize], data[nonceSize:]
    plaintext, err := gcm.Open(nil, nonce, ciphertext, nil)
    if err != nil {
        panic(err.Error())
    }
    return plaintext
}


func GetCustomerById(w http.ResponseWriter, r *http.Request) {
	fmt.Println("Get Customer by Id called");
	generic.SetupResponse(&w, r)

	w.Header().Set("Content-Type", "application/json")
	collection := connection.ConnectDB("customers")

	var customer model.Customer
	var params = mux.Vars(r)

    id, err := primitive.ObjectIDFromHex(params["id"])
	if err != nil {
		connection.GetError(err, w)
		return
	}

	fmt.Println("Customer id received: ", id)

	filter := bson.M{"_id": id}

	err = collection.FindOne(context.TODO(), filter).Decode(&customer)
	fmt.Println("filter: ", filter)
	fmt.Println(customer)

	if err != nil {
		connection.GetError(err, w)
		return
	}

	json.NewEncoder(w).Encode(customer)
}




func GetCustomer(w http.ResponseWriter, r *http.Request) {
	fmt.Println("\n\n\tGET Customer called\n\n")

    generic.SetupResponse(&w, r)
    w.Header().Set("Content-Type", "application/json")
    var customers []model.Customer
    collection := connection.ConnectDB("customers")

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
        var customer model.Customer
        err := cur.Decode(&customer)

        // a, _ := hex.DecodeString(customer.Password)
        // dec := decrypt(a, "RandomHash")
        // user.Password = string(dec)

        if err != nil {
			fmt.Println("\n\n****ERROR*****\n\n")
            log.Fatal(err)
        }

        customers = append(customers, customer)
		fmt.Println("\ncustomer: ", customer);
    }

    fmt.Println(len(customers))

    if err := cur.Err(); err != nil {
        log.Fatal(err)
    }

    json.NewEncoder(w).Encode(customers)

}



func CreateCustomer(w http.ResponseWriter, r *http.Request) {
	fmt.Println("\n\n\tPOST Customer called\n\n")

    generic.SetupResponse(&w, r)
    if r.Method == "POST" {
        w.Header().Set("Content-Type", "application/json")

        data, err := ioutil.ReadAll(r.Body)
        asString := string(data)
        // fmt.Println(asString)

        var customer map[string]interface{}

        json.Unmarshal([]byte(asString), &customer)
        // fmt.Println(customer)
        // customer["_id"] = customer["id"]

        // s := customer["password"].(string)
        // customer["password"] = hex.EncodeToString(encrypt([]byte(s), "RandomHash"))

        delete(customer, "_id")
        // fmt.Println("after: ", customer)

        collection := connection.ConnectDB("customers")

        result, err := collection.InsertOne(context.TODO(), customer)
        // fmt.Println(result)

        if err != nil {
            connection.GetError(err, w)
            return
        }

        json.NewEncoder(w).Encode(result)
    }
}



func UpdateCustomer(w http.ResponseWriter, r *http.Request) {
	fmt.Println("Update customer called (POST)");
	generic.SetupResponse(&w, r)
	if r.Method == "PUT" {
		fmt.Println("ok")
		w.Header().Set("Content-Type", "application/json")

		var params = mux.Vars(r)

		id, err := primitive.ObjectIDFromHex(params["id"]) 
		var customer model.Customer

		filter := bson.M{"_id": id}

		_ = json.NewDecoder(r.Body).Decode(&customer)

		update := bson.D{
			{Key: "$set", Value: bson.D{
				{Key: "firstName", Value: customer.FirstName},
                {Key: "lastName", Value: customer.LastName},
                {Key: "email", Value: customer.Email},
                {Key: "password", Value: customer.Password},
                {Key: "mobileNumber", Value: customer.MobileNumber},
                {Key: "dateOfBirth", Value: customer.DateOfBirth},
                {Key: "role", Value: customer.Role},
                {Key: "productsPurchased", Value: customer.ProductsPurchased},
                {Key: "addresses", Value: customer.Addresses},
			}},
		}

		fmt.Println("customer update received: ", customer)
		
		collection := connection.ConnectDB("customers")
		err = collection.FindOneAndUpdate(context.TODO(), filter, update).Decode(&customer)
		if err != nil {
			connection.GetError(err, w)
			return
		}

		// cart.Id, _ = primitive.ObjectIDFromHex(params["id"])

		json.NewEncoder(w).Encode(customer)
	}
}