import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProductService } from '../Services/product.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Product } from '../Models/product';
import { Seller } from '../Models/seller';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-add-products',
  templateUrl: './add-products.component.html',
  styleUrls: ['./add-products.component.scss']
})
export class AddProductsComponent {
  addProductForm: FormGroup;
  submitted = false;

  dropdownList: any;
  dropdownSettings: any;
  selectedItems = [];
  productImages:string[] = [];
  subscriptions:Subscription[] = [];

  base64textString: any
  binaryString: any
  profilePhoto: string = "";

  constructor(private fb: FormBuilder, private productService: ProductService, private http: HttpClient) {
    this.addProductForm = fb.group({
      productName: ['', Validators.required], 
      aboutProduct: ['', Validators.required], 
      brand: ['', Validators.required],
      maxRetailPrice: ['', Validators.required], 
      sellingPrice: ['', Validators.required], 
      productCategories: ['', Validators.required],       
      quantity: ['', Validators.required], 
      productProperties: ['', Validators.required],
    })
  }


  ngOnInit() {
    this.dropdownList = this.getData();
    this.dropdownSettings = {
      singleSelection: false,
      idField: 'item_id',
      textField: 'item_text',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 3,
      allowSearchFilter: true
    };
  }


  onItemSelect(event: any){
    console.log('$event is ', event); 
  }

  getObjectListFromData(ids: string){
    return this.getData().filter(item => ids.includes(item.item_id))
  }

  getData() : Array<any>{
    return [
      "Electronics", 
      "Groceries", 
      "Fashion", 
      "Footwear", 
      "Laptops", 
      "Accessories", 
      "Jewelry", 
      "Beauty", 
      "Personal_Care", 
      "Home", 
      "Kitchen", 
      "Sports", 
      "Outdoors", 
      "Books", 
      "Art", 
      "Garden", 
      "Mobile_Phones", 
      "Electronics_Accessories", 
      "Mobile_Phone_Accessories", 
      "Headphones", 
      "Appliances", 
      "Pet_Supplies", 
      "Baby", 
      "Tools", 
      "Office_Supplies", 
      "Watches"
    ]
    // return [
    //   { item_id: 1, item_text: 'Apple', group : 'F' },
    //   { item_id: 2, item_text: 'Orange', group : 'F' },
    //   { item_id: 3, item_text: 'Potatoes', group : 'V' },
    //   { item_id: 4, item_text: 'Cabbage', group : 'V' },
    //   { item_id: 5, item_text: 'Cauliflower', group : 'V' }
    // ];
  }


  get f() { return this.addProductForm.controls; }

  onSubmit(value: string) {
    this.submitted = true;

    if(this.addProductForm.invalid) {
      alert("Form data invalid");
      return;
    }

    const productToBeAdded: Product = this.getProductDataFromForm();
    productToBeAdded.productImages = this.productImages;

    console.log("Product to be added: ", productToBeAdded);
    
    let addProductSubs = this.productService.addProducts(productToBeAdded).subscribe(data => {
      console.log("Adding Product: ", data);
    })

    this.subscriptions.push(addProductSubs);

    console.log("AddProduct Form Values : ", this.addProductForm.value);
    alert("Added Product Successfully")
    window.location.reload()
  }


  private getProductDataFromForm():Product {
    const formValue = this.addProductForm.value;
    const product = new Product("", "", "", "", "", [], 0, 0, 0, 0, 0, [], [], []);
    
    console.log("Seller id from LS: ", localStorage.getItem('sellerId'));
    
    product.sellerId = localStorage.getItem('sellerId') || '';
    product.aboutProduct = formValue.aboutProduct;
    product.brand = formValue.brand;
    product.productName = formValue.productName;
    product.maxRetailPrice = formValue.maxRetailPrice;
    product.sellingPrice = formValue.sellingPrice;
    product.quantity = formValue.quantity;
    product.productCategories = formValue.productCategories;
    product.productCategories.push("All");
    product.productProperties = formValue.productProperties.split(',') 

    for(let i=0; i<product.productProperties.length; i++) {
      product.productProperties[i]= product.productProperties[i].toLowerCase().trim();
    }

    return product;
  }


  onFileChange(event: any) {
    console.log("On File change called: ");
    let numFiles = event.target.files.length; 

    for(let i=0; i<numFiles; i++) {
      const file = event.target.files[i];
      var reader = new FileReader();
      reader.onload = this._handleReaderLoaded.bind(this);
      reader.readAsBinaryString(file);
    }

    console.log("images: ", this.productImages); 
  }


  _handleReaderLoaded(readerEvt: any) {
    this.binaryString = readerEvt.target.result;
    this.base64textString = btoa(this.binaryString);
    this.productImages.push(this.base64textString);
  }


  ngOnDestroy() {
    this.unsubscribeAll();
  }

  unsubscribeAll() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  
}

