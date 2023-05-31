import { AbstractControl } from "@angular/forms";



export function passwordStrengthValidator(control: AbstractControl): { [key: string]: boolean } | null {
    const password = control.get('password');
    const passwordStr = password?.value;

    let specialChars = ['$', '@', '%', '^', '&', '#']

    let isWeak = false; 
    let minLengthRequired = 5;
    let hasUpperCase = false;
    let hasLowerCase = false; 
    let hasNumber = false;
    let hasSpecialChar = false;

    
    for(let i=0; i<passwordStr.length; i++) {
        let curChar = passwordStr[i];
        if(curChar>='A' && curChar<='Z') {
            hasUpperCase = true;
        }
        if(curChar>='a' && curChar<='z') {
            hasLowerCase = true;
        }
        if(curChar>='0' && curChar<='9') {
            hasNumber = true;
        }
        if(specialChars.indexOf(curChar) > -1) {
            hasSpecialChar = true;
        }
    }
    
    if((passwordStr.length < minLengthRequired) || (!hasLowerCase) || (!hasUpperCase) || (!hasSpecialChar) || (!hasNumber)) {
        isWeak = true;
    }

    return isWeak ? {weakPassword : true} : null
}