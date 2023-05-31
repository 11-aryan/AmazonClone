export class Review {
    _id: string;
    customerId: string; 
    productId: string; 
    rating: number; 
    headline: string;
    description: string; 
    votes: number; 
    reviewImages: string[];

    constructor(
        _id: string, 
        customerId: string, 
        productId: string, 
        rating: number, 
        headline: string,
        description: string, 
        votes: number, 
        reviewImages: string[],
    ) {
        this._id = _id;
        this.customerId = customerId;
        this.productId = productId;
        this.rating = rating;
        this.headline = headline;
        this.description = description;
        this.votes = votes;
        this.reviewImages = reviewImages;
    }

}