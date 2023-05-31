package sellerController 

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
	"go.mongodb.org/mongo-driver/bson"
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



func GetSellers(w http.ResponseWriter, r *http.Request) {
	fmt.Println("\n\n\t GET Sellers called\n\n")

    generic.SetupResponse(&w, r)
    w.Header().Set("Content-Type", "application/json")
    var sellers []model.Seller
    collection := connection.ConnectDB("sellers")

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
        var tempSeller model.Seller
        
        err := cur.Decode(&tempSeller)

        // a, _ := hex.DecodeString(seller.Password)
        // dec := decrypt(a, "RandomHash")
        // seller.Password = string(dec)

        fmt.Println("tempSeller: ", tempSeller.Email)

        if err != nil {
			fmt.Println("\n\n****ERROR*****\n\n")
            log.Fatal(err)
        }

        sellers = append(sellers, tempSeller)
		fmt.Println("\nseller: ", tempSeller);
    }

    if err := cur.Err(); err != nil {
        log.Fatal(err)
    }

    json.NewEncoder(w).Encode(sellers)
}



func CreateSeller(w http.ResponseWriter, r *http.Request) {
	fmt.Println("\n\n\tPOST Seller called\n\n")

    generic.SetupResponse(&w, r)
    if r.Method == "POST" {
        w.Header().Set("Content-Type", "application/json")

        data, err := ioutil.ReadAll(r.Body)
        asString := string(data)
        // fmt.Println(asString)

        var seller map[string]interface{}

        json.Unmarshal([]byte(asString), &seller)
        // fmt.Println(seller)
        // seller["_id"] = seller["id"]

        // s := seller["password"].(string)
        // seller["password"] = hex.EncodeToString(encrypt([]byte(s), "RandomHash"))

        delete(seller, "_id")
        // fmt.Println("after: ", seller)

        collection := connection.ConnectDB("sellers")

        result, err := collection.InsertOne(context.TODO(), seller)
        // fmt.Println(result)

        if err != nil {
            connection.GetError(err, w)
            return
        }

        json.NewEncoder(w).Encode(result)
    }
}