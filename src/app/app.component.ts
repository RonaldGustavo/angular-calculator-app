import { Component } from '@angular/core';
import { CalculatorComponent } from './calculator/calculator.component';
// import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  // imports: [RouterOutlet],
  imports: [CalculatorComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'angular-calculator-app';
}
