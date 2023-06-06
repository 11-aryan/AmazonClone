import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'priceRange'
})
export class PriceRangePipe implements PipeTransform {

  transform(value: string, ...args: unknown[]): unknown {
    let result = "";

    let splitRange = value.split('-');
    let lowerPrice = splitRange[0];
    let upperPrice = splitRange[1];
    

    result += "₹" + lowerPrice + " - " + "₹" + upperPrice;

    if(lowerPrice=="0") {
      result = "Below  ₹" + upperPrice;
    }
    
    if(upperPrice=="inf") {
      result = "Above  ₹" + lowerPrice;
    }

    if(lowerPrice=="inf" || this.isPriceInvalid(lowerPrice) || this.isPriceInvalid(upperPrice)) {
      result = "Invalid price";
    }
    
    return result;
  }

  isPriceInvalid(priceString: string) {
    let price = parseInt(priceString);
    if(price<0 || price>1000000000) {
      return true;
    }
    return false;
  }

}
