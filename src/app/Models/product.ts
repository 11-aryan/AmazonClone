import { Review } from "./review";

export class Product {
    _id: string;
    productName: string;
    aboutProduct: string; 
    sellerId: string; 
    brand: string;
    maxRetailPrice: number;
    sellingPrice: number;
    quantity: number;
    unitsSold: number
    productCategories: string[]; 
    averageRating:  number;
    productImages: string[];   
    reviews: Review[];

    constructor(
        _id: string,
        productName: string,
        aboutProduct: string,
        sellerId: string, 
        brand: string,
        productCategories: string[],
        maxRetailPrice: number,
        sellingPrice: number,
        quantity: number,
        unitsSold: number, 
        averageRating:  number,
        productImages: string[], 
        reviews: Review[]
    ) {
        this._id = _id;
        this.productName = productName;
        this.aboutProduct = aboutProduct;
        this.sellerId = sellerId;
        this.brand = brand;
        this.maxRetailPrice = maxRetailPrice;
        this.sellingPrice = sellingPrice;
        this.quantity = quantity;
        this.unitsSold = unitsSold;
        this.productCategories = productCategories;
        this.averageRating = averageRating;
        this.productImages = productImages;
        this.reviews = reviews;
    }

}