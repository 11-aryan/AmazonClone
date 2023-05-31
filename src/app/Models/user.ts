export class User {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    mobileNumber: string;
    dateOfBirth: Date;
    role: string;

    constructor(
        _id: string, 
        firstName: string, 
        lastName: string,
        email: string, 
        password: string,
        mobileNumber: string, 
        dateOfBirth: Date,
        role: string, 
    ) {
        this._id = _id;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.password = password;
        this.mobileNumber = mobileNumber;
        this.dateOfBirth = dateOfBirth;
        this.role = role;
    }
}