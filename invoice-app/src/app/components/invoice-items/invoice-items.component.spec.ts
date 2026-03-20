import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvoiceItemsComponent } from './invoice-items.component';

describe('InvoiceItemsComponent', () => {
  let component: InvoiceItemsComponent;
  let fixture: ComponentFixture<InvoiceItemsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InvoiceItemsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(InvoiceItemsComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
