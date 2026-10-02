import { ObjectId } from "mongodb";

export interface Loan {
  _id?: ObjectId;
  bookId: ObjectId;
  userName: string;
  loanDate: Date;
  returnDate?: Date;
  returned: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// bookId y las fechas llegan como string en el JSON y el servicio las convierte
export interface LoanDTO {
  bookId?: string;
  userName?: string;
  loanDate?: string;
  returnDate?: string;
  returned?: boolean;
}