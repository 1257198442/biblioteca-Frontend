export interface BookModel{
  bookID: string,
  name: string,
  entryTime: string,
  bookType:BookTypeModel[],
  description: string,
  status: string,
  imgUrl:string,
  author: AuthorModel[],
  publisher:string,
  deposit:number,
  language:string,
  borrowCount:number;
}
export interface BookTypeModel{
  name:string,
  description:string,
}
export interface AuthorModel{
  authorId: string,
  name: string,
  description: string,
  nationality: string,
  imgUrl:string
}
