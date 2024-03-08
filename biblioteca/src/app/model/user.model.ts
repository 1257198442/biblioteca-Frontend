export class UserClass {
  name: string;
  telephone: string;
  createTime: Date;
  email: string;
  role:string;
  active:boolean;
  constructor(name: string,
              telephone: string,
              createTime: Date,
              email: string,
              role:string,
              active:boolean) {
    this.name = name;
    this.telephone = telephone;
    this.createTime = createTime;
    this.email = email;
    this.role = role;
    this.active = active;
  }
  toString(): string {
    return `Name: ${this.name}, Telephone: ${this.telephone}, Create Time: ${this.createTime}, Email: ${this.email}, Role: ${this.role}`;
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
