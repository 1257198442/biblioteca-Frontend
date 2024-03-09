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

export class setting {
  emailWhenOrderIsGenerated:boolean;
  hideMyProfile:boolean;
  constructor(emailWhenOrderIsGenerated:boolean,
              hideMyProfile:boolean) {
    this.emailWhenOrderIsGenerated=emailWhenOrderIsGenerated;
    this.hideMyProfile = hideMyProfile;
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
