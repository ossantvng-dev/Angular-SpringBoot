import { Component, Input } from '@angular/core';
import { Company } from '../../models/company';

@Component({
  selector: 'app-company-card',
  imports: [],
  templateUrl: './company-card.component.html',
  styleUrl: './company-card.component.css',
})
export class CompanyCardComponent {
  @Input() company!: Company;
}
