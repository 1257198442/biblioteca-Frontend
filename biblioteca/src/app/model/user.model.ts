export class UserClass {
  name: string;
  telephone: string;
  createTime: Date;
  email: string;
  admin:string;
  active:boolean;
  constructor(name: string,
              telephone: string,
              createTime: Date,
              email: string,
              admin:string,
              active:boolean) {
    this.name = name;
    this.telephone = telephone;
    this.createTime = createTime;
    this.email = email;
    this.admin = admin;
    this.active = active;
  }
  toString(): string {
    return `Name: ${this.name}, Telephone: ${this.telephone}, Create Time: ${this.createTime}, Email: ${this.email}, Admin: ${this.admin}`;
  }
}


export class Login{
  telephone: string;
  password:string;
  constructor(telephone: string,
              password:string) {
    this.telephone=telephone;
    this.password=password;
  }
}
