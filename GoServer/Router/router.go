package Router

import (
	customerController "GoServer/Middleware/Customers"
	sellerController "GoServer/Middleware/Sellers"
	userController "GoServer/Middleware/Users"
	productController "GoServer/Middleware/Products"
	cartController "GoServer/Middleware/Carts"
	orderController "GoServer/Middleware/Orders"
	reviewController "GoServer/Middleware/Reviews"
	categoryController "GoServer/Middleware/Categories"
	"github.com/gorilla/mux"
)

func GetRouter() *mux.Router {
	apiRouter := mux.NewRouter();
	addUserHandler(apiRouter);
	addSellerHandler(apiRouter);
	addCustomerHandler(apiRouter);
	addProductHandler(apiRouter);
	addOrderHandler(apiRouter);
	addCartHandler(apiRouter);
	addReviewHandler(apiRouter);
	addCategoryHandler(apiRouter);
	return apiRouter
}



func addUserHandler(router *mux.Router) {
	router.HandleFunc("/api/users", userController.GetUser).Methods("GET");
	// router.HandleFunc("/api/users/{id}", userController.GetUserById).Methods("GET");
	router.HandleFunc("/api/users", userController.CreateUser).Methods("POST", "OPTIONS");
	// router.HandleFunc("/api/users/{id}", userController.UpdateUser).Methods("PUT", "OPTIONS");
	// router.HandleFunc("/api/users/{id}", userController.DeleteUser).Methods("DELETE", "OPTIONS");
}


func addSellerHandler(router *mux.Router) {
	router.HandleFunc("/api/sellers", sellerController.GetSellers).Methods("GET");
	router.HandleFunc("/api/sellers", sellerController.CreateSeller).Methods("POST", "OPTIONS");
	router.HandleFunc("/api/sellers/{id}", sellerController.GetsellerById).Methods("GET");
}


func addCustomerHandler(router *mux.Router) {
	router.HandleFunc("/api/customers", customerController.GetCustomer).Methods("GET");
	router.HandleFunc("/api/customers", customerController.CreateCustomer).Methods("POST", "OPTIONS");
	router.HandleFunc("/api/customers/{id}", customerController.GetCustomerById).Methods("GET");
	router.HandleFunc("/api/customers/{id}", customerController.UpdateCustomer).Methods("PUT", "OPTIONS");
	router.HandleFunc("/api/search/customers", customerController.GetCustomersByEmail).Methods("GET");
}


func addProductHandler(router *mux.Router) {
	router.HandleFunc("/api/products", productController.GetProducts).Methods("GET");
	router.HandleFunc("/api/products", productController.CreateProduct).Methods("POST", "OPTIONS");
	router.HandleFunc("/api/products/{id}", productController.GetProductById).Methods("GET");
	router.HandleFunc("/api/products/seller/{sellerId}", productController.GetProductsBySellerId).Methods("GET");
	router.HandleFunc("/api/products/{id}", productController.UpdateProduct).Methods("PUT", "OPTIONS")
	// router.HandleFunc("/api/pagination/products", productController.GetPaginatedProducts).Methods("GET");
	router.HandleFunc("/api/pagination/products", productController.GetPaginatedProducts).Methods("POST", "OPTIONS");
	router.HandleFunc("/api/search/products", productController.GetProductsByProductname).Methods("GET");
	router.HandleFunc("/api/products/{id}", productController.DeleteProduct).Methods("DELETE", "OPTIONS");
}


func addOrderHandler(router *mux.Router) {
	router.HandleFunc("/api/orders", orderController.CreateOrder).Methods("POST", "OPTIONS");
	router.HandleFunc("/api/orders/{customerId}", orderController.GetOrdersByCustomerId).Methods("GET");
}


func addReviewHandler(router *mux.Router) {
	router.HandleFunc("/api/reviews", reviewController.GetReviews).Methods("GET")
	router.HandleFunc("/api/reviews", reviewController.CreateReview).Methods("POST", "OPTIONS")
	router.HandleFunc("/api/reviews/{id}", reviewController.GetReviewById).Methods("GET")
	router.HandleFunc("/api/reviews/product/{productId}", reviewController.GetReviewsByProductId).Methods("GET")
	router.HandleFunc("/api/reviews/productAndCustomer/productId", reviewController.GetReviewByProductAndCustomerId).Methods("GET")
	router.HandleFunc("/api/reviews/{id}", reviewController.UpdateReview).Methods("PUT", "OPTIONS")
	router.HandleFunc("/api/reviews/{id}", reviewController.DeleteReview).Methods("DELETE", "OPTIONS");
}


func addCartHandler(router *mux.Router) {
	router.HandleFunc("/api/carts", cartController.GetCarts).Methods("GET")
	router.HandleFunc("/api/carts", cartController.CreateCart).Methods("POST", "OPTIONS")
	router.HandleFunc("/api/carts/{id}", cartController.GetCartById).Methods("GET")
	router.HandleFunc("/api/carts/{id}", cartController.UpdateCart).Methods("PUT", "OPTIONS")
}


func addCategoryHandler(router *mux.Router) {
	router.HandleFunc("/api/categories", categoryController.GetCategories).Methods("GET")
	router.HandleFunc("/api/categories", categoryController.CreateCategory).Methods("POST", "OPTIONS")
	router.HandleFunc("/api/categories/{id}", categoryController.UpdateCategory).Methods("PUT", "OPTIONS")
	router.HandleFunc("/api/categories/{id}", categoryController.DeleteCategory).Methods("DELETE", "OPTIONS");
	router.HandleFunc("/api/search/categories", categoryController.GetCategoriesByCategoryName).Methods("GET");
}