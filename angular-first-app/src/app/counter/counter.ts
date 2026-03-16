import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-counter',
  imports: [],
  templateUrl: './counter.html',
  styleUrl: './counter.css',
})
export class Counter implements OnInit {

  counter: number = 0;

  // Input viende desde el padre. Parametro de entrada
  @Input() title!: string;

  // Para pasar del hijo al padre
  @Output() counterEmit: EventEmitter<number> = new EventEmitter();

  ngOnInit(): void {
    this.counter = Number(sessionStorage.getItem('counter')) || 0;
    //this.counter = Number(localStorage.getItem('counter')) || 0;
    console.log('Creando componente');
  }

  setCounter(): void {
    this.counter++;
    sessionStorage.setItem('counter', this.counter.toString());
    //localStorage.setItem('counter', this.counter.toString())
    this.counterEmit.emit(this.counter);
  }

}
