export class RegistrationClass {
  name:string;
  password:string;
  telephone:string;
  email:string;
  constructor(name:string,telephone:string,
              email:string,
              password:string) {
    this.name = name;
    this.telephone = telephone;
    this.email = email;
    this.password = password;
  }
}
