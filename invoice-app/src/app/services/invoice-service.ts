import { Injectable } from '@angular/core';
import { Invoice } from '../models/invoice';
import { invoices as invoicesMockData } from '../data/invoice.data';

@Injectable({
  providedIn: 'root',
})
export class InvoiceService {

  private invoices: Invoice[] = invoicesMockData;
  
  constructor() {}

  getInvoices(): Invoice[] {
    return this.invoices;
  }

  getInvoiceTotal(invoice: Invoice): number {
    return invoice.items.reduce((total, item) => {
      return total + (item.price * item.quantity);
    }, 0);
  }

  /*
    Elimina un item de la factura.
    
    Nota: esto modifica el array en memoria (mutabilidad).
    Angular detecta el cambio porque cambia la longitud del array.
    El total NO se almacena, se recalcula automáticamente mediante 
    un getter en el componente invoice-total 
  */
  removeItem(invoice: Invoice, itemIndex: number): void {
    invoice.items.splice(itemIndex, 1);
  }

}
