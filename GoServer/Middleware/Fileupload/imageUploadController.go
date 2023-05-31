package imageUploadController

import (
	connection "GoServer/Config"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"os"
	"path/filepath"
	"time"
)



func UploadImages(w http.ResponseWriter, r *http.Request) {

	fmt.Println("Upload images called ")

	// Check if the request method is POST
	if r.Method != http.MethodPost {
		w.WriteHeader(http.StatusMethodNotAllowed)
		fmt.Fprintf(w, "Invalid request method. Only POST is allowed.")
		return
	}

	// Parse the multipart form data
	err := r.ParseMultipartForm(10 << 20) // Max size of 10 MB
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		fmt.Fprintf(w, "Failed to parse multipart form: %v", err)
		return
	}

	// Get the file headers from the request
	files := r.MultipartForm.File["productImages"]
	if len(files) == 0 {
		w.WriteHeader(http.StatusBadRequest)
		fmt.Fprintf(w, "No files received")
		return
	}

	var imagePathArr []string;

	// Loop through the files and save them to disk
	for _, fileHeader := range files {
		file, err := fileHeader.Open()
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			fmt.Fprintf(w, "Failed to open file: %v", err)
			return
		}
		defer file.Close()

		// Create a unique filename for each file to avoid conflicts
		filename := filepath.Base(fileHeader.Filename)
		ext := filepath.Ext(filename)
		filenameWithoutExt := filename[0 : len(filename)-len(ext)]
		newFilename := fmt.Sprintf("%s-%d%s", filenameWithoutExt, newTimestamp(), ext)


		path := "/home/aryantiwari/Aryan/Mini_Project/amazon/src/assets/Images/SellerImages/Products/"
		if _, err := os.Stat(path); os.IsNotExist(err) {
			if err := os.MkdirAll(path, 0755); err != nil {
				w.WriteHeader(http.StatusInternalServerError)
				fmt.Fprintf(w, "Failed to create directory: %v", err)
				return
			}
		}

		imagePathArr = append(imagePathArr, path + newFilename);

		// Create a new file on disk and write the contents of the uploaded file to it
		newFile, err := os.Create(path + newFilename) 
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			fmt.Fprintf(w, "Failed to create file: %v", err)
			return
		}

		defer newFile.Close()
		
		_, err = io.Copy(newFile, file)
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			fmt.Fprintf(w, "Failed to save file: %v", err)
			return
		}
	}

	collection := connection.ConnectDB("products")
	fmt.Println(collection)

	// Send a success response
	response := map[string]string{"message": "File(s) uploaded successfully!"}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}

// Helper function to generate a unique timestamp for each uploaded file
func newTimestamp() int64 {
	return time.Now().UnixNano() / int64(time.Millisecond)
}

