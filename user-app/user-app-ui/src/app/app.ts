import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { UserAppComponent } from './components/user-app-component/user-app-component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, UserAppComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('user-app-ui');
}
