package main

import (
	"GoServer/Router"
	"fmt"
	"net/http"
	"github.com/gorilla/handlers"
)


func main() {
	fmt.Println("Server running");
	router := Router.GetRouter()
	router.HandleFunc("/", testHandler).Methods("GET"); 

	http.ListenAndServe(":4600",
		handlers.CORS(
			handlers.AllowedOrigins([]string{"*"}),
			handlers.AllowedMethods([]string{"GET", "POST", "PUT", "DELETE", "OPTIONS"}), 
			handlers.AllowedHeaders([]string{"X-Requested-With", "Content-Type", "Authorization"}),
		)(router))
}


func testHandler(w http.ResponseWriter, r*http.Request) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK); 
	w.Write([]byte(`("message": "Hello World!)`))
}
