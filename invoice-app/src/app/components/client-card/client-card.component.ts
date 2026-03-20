import { Component, Input } from '@angular/core';
import { Client } from '../../models/client';

@Component({
  selector: 'app-client-card',
  imports: [],
  templateUrl: './client-card.component.html',
  styleUrl: './client-card.component.css',
})
export class ClientCardComponent {
  @Input() client!: Client;
}
