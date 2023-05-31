package userController

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



func GetUser(w http.ResponseWriter, r *http.Request) {
	fmt.Println("\n\n\tGET User called\n\n")

    generic.SetupResponse(&w, r)
    w.Header().Set("Content-Type", "application/json")
    var users []model.User
    collection := connection.ConnectDB("users")

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
        var user model.User
        err := cur.Decode(&user)

        // a, _ := hex.DecodeString(user.Password)
        // dec := decrypt(a, "RandomHash")
        // user.Password = string(dec)

        if err != nil {
			fmt.Println("\n\n****ERROR*****\n\n")
            log.Fatal(err)
        }

        users = append(users, user)
		fmt.Println("\nuser: ", user);
    }

    if err := cur.Err(); err != nil {
        log.Fatal(err)
    }

    json.NewEncoder(w).Encode(users)

}



func CreateUser(w http.ResponseWriter, r *http.Request) {
	fmt.Println("\n\n\tPOST User called\n\n")
    generic.SetupResponse(&w, r)
    if r.Method == "POST" {
        w.Header().Set("Content-Type", "application/json")

        data, err := ioutil.ReadAll(r.Body)
        asString := string(data)
        // fmt.Println(asString)

        var tempUser map[string]interface{}

        json.Unmarshal([]byte(asString), &tempUser)
        // fmt.Println(tempUser)
        // tempUser["_id"] = tempUser["id"]

        // s := tempUser["password"].(string)
        // tempUser["password"] = hex.EncodeToString(encrypt([]byte(s), "RandomHash"))

        delete(tempUser, "_id")
        // fmt.Println("after: ", tempUser)

        collection := connection.ConnectDB("users")

        result, err := collection.InsertOne(context.TODO(), tempUser)
        // fmt.Println(result)

        if err != nil {
            connection.GetError(err, w)
            return
        }

        json.NewEncoder(w).Encode(result)
    }
}