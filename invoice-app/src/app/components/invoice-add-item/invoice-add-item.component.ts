import { Component, EventEmitter, Output } from '@angular/core';
import { Item } from '../../models/item';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-invoice-add-item',
  imports: [ReactiveFormsModule],
  templateUrl: './invoice-add-item.component.html',
  styleUrl: './invoice-add-item.component.css',
})
export class InvoiceAddItemComponent {
  @Output() addItem = new EventEmitter<Item>();

  form!: FormGroup;

  constructor(private formBuilder: FormBuilder) {
    this.form = this.formBuilder.group({
      product: ['', Validators.required],
      price: [0, [Validators.required, Validators.min(0)]],
      quantity: [1, [Validators.required, Validators.min(1)]],
    });
  }

  onSubmit(): void {
    if (this.form.invalid) return;

    const item: Item = { 
      id: Number(Date.now().toString().slice(-3)), 
      ...this.form.value 
    };
    
    this.addItem.emit(item);
    this.form.reset({ product: '', price: 0, quantity: 1 });
  }
}
