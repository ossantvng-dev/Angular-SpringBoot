import { NgTemplateOutlet } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Counter } from './counter/counter';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NgTemplateOutlet, Counter],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements OnInit {
  //protected readonly title = signal('angular-first-app');

  title = 'Hola Mundo Angular desde Componente!';

  subTitle = 'Contador con estado de sesión';

  users: string[] = ['user1', 'user2', 'user3', 'user4'];

  visible: boolean = false;

  showOrHideBtnTitle = 'Mostrar';

  counter: number = 0;

  ngOnInit(): void {
    this.counter = Number(sessionStorage.getItem('counter')) || 0;
  }

  setVisible(): void {
    this.visible = !this.visible;
    this.showOrHideBtnTitle = this.visible ? 'Ocultar' : 'Mostrar';
    console.log('Hemos hecho click en setVisible');
  }

  setCounter(event: number): void {
    this.counter = event;
  }
}
