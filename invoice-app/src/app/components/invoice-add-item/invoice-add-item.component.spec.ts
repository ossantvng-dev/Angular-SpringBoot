import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvoiceAddItemComponent } from './invoice-add-item.component';

describe('InvoiceAddItemComponent', () => {
  let component: InvoiceAddItemComponent;
  let fixture: ComponentFixture<InvoiceAddItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InvoiceAddItemComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(InvoiceAddItemComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
