import {BookModel} from "./book.model";
import {User} from "./user.model";

export interface Borrow{
  reference: string;
  book: BookModel;
  user: User;
  lendingTime: Date;
  limitTime: Date;
  status: boolean;
}
