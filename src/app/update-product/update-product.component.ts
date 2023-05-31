import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Product } from '../Models/product';
import { Subscription } from 'rxjs';
import { ProductService } from '../Services/product.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-update-product',
  templateUrl: './update-product.component.html',
  styleUrls: ['./update-product.component.scss']
})
export class UpdateProductComponent {

  updateProductForm: FormGroup;
  submitted = false;

  dropdownList: any;
  dropdownSettings: any;
  selectedCategories: any[] = [];

  currImages: string[] = []; 
  productImages:string[] = [];
  subscriptions:Subscription[] = [];

  base64textString: any
  binaryString: any
  profilePhoto: string = "";


  currentProduct: Product;
  productId: string = "";

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private activatedRoute: ActivatedRoute,
    private router: Router, 
  ) {
    this.updateProductForm = fb.group({
      productName: ['', Validators.required], 
      aboutProduct: ['', Validators.required], 
      brand: ['', Validators.required],
      maxRetailPrice: ['', Validators.required], 
      sellingPrice: ['', Validators.required], 
      productCategories: ['', Validators.required],       
      quantity: ['', Validators.required], 
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

    this.activatedRoute.queryParamMap.subscribe((params) => {
      const productIdReceived = params.get("productId");
      console.log("id received: ", productIdReceived);
      
      if(productIdReceived) {
        this.productId = productIdReceived;
      } else {
        alert("Login to containue");
        return;
      }
    })

    this.productService.getProductById(this.productId).subscribe(data => {
      this.currentProduct = data;
      console.log("current product: ", data);
      this.initializeProductUpdateForm(this.currentProduct);
    })

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
      "Personal Care", 
      "Home", 
      "Kitchen", 
      "Sports", 
      "Outdoors", 
      "Books", 
      "Art", 
      "Garden", 
      "Mobile Phones", 
      "Electronics Accessories", 
      "Mobile Phone Accessories", 
      "Headphones", 
      "Appliances", 
      "Pet Supplies", 
      "Baby", 
      "Tools", 
      "Office Supplies", 
      "Watches"
    ]
  }

  get f() {return this.updateProductForm.controls;}

  onSubmit(value: any) {
    this.submitted = true;

    if(this.updateProductForm.invalid) {
      alert("Form data invalid");
      return;
    }

    const productToBeUpdated: Product = this.getProductDataFromForm();
    productToBeUpdated._id = this.productId;
    productToBeUpdated.productImages = this.productImages;

    console.log("Product to be added: ", productToBeUpdated);
    
    let updateProductSubs = this.productService.updateProduct(productToBeUpdated).subscribe(data => {
      console.log("Upadting Product: ", data);
    })

    this.subscriptions.push(updateProductSubs);

    console.log("AddProduct Form Values : ", this.updateProductForm.value);
    alert("Updated Product Successfully")
    
    this.router.navigate(['sellerDashboard']);
  }

  initializeProductUpdateForm(product: Product) {
    this.updateProductForm.get("productName")?.setValue(product.productName);
    this.updateProductForm.get("aboutProduct")?.setValue(product.aboutProduct);
    this.updateProductForm.get("brand")?.setValue(product.brand);
    this.updateProductForm.get("maxRetailPrice")?.setValue(product.maxRetailPrice);
    this.updateProductForm.get("sellingPrice")?.setValue(product.sellingPrice);
    this.updateProductForm.get("quantity")?.setValue(product.quantity);
    this.productImages = product.productImages

    let categories:string[] = product.productCategories

    for(let i=0; i<categories.length; i++) {
      this.selectedCategories.push({item_id: i, item_name: categories[i]});
    }

    console.log("selected cats: ", this.selectedCategories);
    
  }


  private getProductDataFromForm():Product {
    const formValue = this.updateProductForm.value;
    const product = new Product("", "", "", "", "", [], 0, 0, 0, 0, 0, [], []);
    
    console.log("Seller id from LS: ", localStorage.getItem('sellerId'));
    
    product.sellerId = localStorage.getItem('sellerId') || '';
    product.aboutProduct = formValue.aboutProduct;
    product.brand = formValue.brand;
    product.productName = formValue.productName;
    product.maxRetailPrice = formValue.maxRetailPrice;
    product.sellingPrice = formValue.sellingPrice;
    product.quantity = formValue.quantity;
    product.productCategories = formValue.productCategories;

    return product;
  }


  onFileChange(event: any) {
    console.log("On File change called: ");
    let numFiles = event.target.files.length; 

    this.productImages = [];

    for(let i=0; i<numFiles; i++) {
      const file = event.target.files[i];
      var reader = new FileReader();
      reader.onload = this._handleReaderLoaded.bind(this);
      reader.readAsBinaryString(file);
    }

    console.log("images: ", this.productImages); 
  }

  removeImage(position: number) {
    this.productImages.splice(position, 1);
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


