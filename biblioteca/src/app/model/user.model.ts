export class UserClass {
  name: string;
  telephone: string;
  createTime: Date;
  email: string;
  description:string;
  role:string;
  active:boolean;
  birthdays:string;
  setting:setting;
  constructor(name: string,
              telephone: string,
              createTime: Date,
              email: string,
              description:string,
              role:string,
              active:boolean,
              birthdays:string,
              setting:setting) {
    this.name = name;
    this.telephone = telephone;
    this.createTime = createTime;
    this.email = email;
    this.description = description;
    this.role = role;
    this.active = active;
    this.birthdays = birthdays;
    this.setting = setting;
  }
  toString(): string {
    return `Name: ${this.name}, Telephone: ${this.telephone}, Create Time: ${this.createTime}, Email: ${this.email}, Role: ${this.role}`;
  }
}

export interface User {
  name: string;
  password: string;
  createTime: Date;
  telephone: string;
  email: string;
  description: string;
  admin: string;
}

export class setting {
  emailWhenSuccessfulTransaction:boolean;
  emailWhenOrderIsPaid:boolean;
  emailWhenOrdersAboutToExpire:boolean;
  emailWhenOrdersUpdates:boolean;
  constructor(emailWhenSuccessfulTransaction:boolean,
              emailWhenOrderIsPaid:boolean,
              emailWhenOrdersAboutToExpire:boolean,
              emailWhenOrdersUpdates:boolean) {
    this.emailWhenSuccessfulTransaction=emailWhenSuccessfulTransaction;
    this.emailWhenOrderIsPaid = emailWhenOrderIsPaid;
    this.emailWhenOrdersAboutToExpire = emailWhenOrdersAboutToExpire;
    this.emailWhenOrdersUpdates = emailWhenOrdersUpdates;
  }
}
