export abstract class CustomError extends Error {
  abstract statusCode : number;
  
  constructor(message: string){
    super(message);       //membuat pesan/log error di console server, memastikan perilaku Class Error tetap diakomodir oleh turunananya
    Object.setPrototypeOf(this, CustomError.prototype);
  }

  //tanda tanya berarti prop tsb bersifat opsional (boleh ada blh tidak)
  abstract serializeErrors() : { message: string; field?: string }[];
}