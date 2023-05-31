export class Address {
   
    country: string; 
    fullName: string; 
    mobileNumber: string; 
    pincode: string;    
    line1: string; 
    line2: string; 
    landmark: string; 
    city: string; 
    state: string; 


    constructor(
        country: string, 
        fullName: string, 
        mobileNumber: string, 
        pincode: string,    
        line1: string, 
        line2: string, 
        landmark: string, 
        city: string, 
        state: string,
    ) {
        this.country = country;
        this.fullName = fullName;
        this.mobileNumber = mobileNumber;
        this.pincode = pincode;
        this.line1 = line1;
        this.line2 = line2; 
        this.landmark = landmark;
        this.city = city;
        this.state = state;
    }   

}