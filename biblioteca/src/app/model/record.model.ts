export interface Record{
  reference:string;
  purpose:string;
  telephone:string;
  amount:number;
  timestampTime:string;
  transactionDetails:TransactionDetails;
}
export interface TransactionDetails{
  lastName:string;
  firstName:string;
  city:string;
  billingAddress:string;
  postalCode:string;
}
