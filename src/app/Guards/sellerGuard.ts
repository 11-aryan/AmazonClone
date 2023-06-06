import { CanActivate } from "@angular/router";

var role = "user"

export class SellerGuard implements CanActivate {
    canActivate(){
        const sellerId = localStorage.getItem("sellerId");
        if(role=='seller' && sellerId!=null) {
            return true;
        } else {
            alert("Page not accessible!!");
            return true;
        }
    }
}
