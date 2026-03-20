import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvoiceCardComponent } from './invoice-card.component';

describe('InvoiceCardComponent', () => {
  let component: InvoiceCardComponent;
  let fixture: ComponentFixture<InvoiceCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InvoiceCardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(InvoiceCardComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
