export class Category {
    _id: string; 
    categoryName: string;
    brands: string[]; 
    colors: string[]; 
    priceRanges: string[]; 
    sellerIds: string[]; 
    properties: { [key: string]: any[] };

    constructor(
        _id: string,
        categoryName: string,
        brands: string[], 
        colors: string[], 
        priceRanges: string[], 
        sellerIds: string[],
        properties: { [key: string]: any[] },

    ) {
        this._id = _id;
        this.categoryName = categoryName;
        this.brands = brands;
        this.colors = colors; 
        this.priceRanges = priceRanges;
        this.sellerIds = sellerIds;
        this.properties = properties;
    }

}