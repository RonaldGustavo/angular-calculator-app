import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  standalone: true,
  selector: 'app-calculator',
  imports: [CommonModule],
  templateUrl: './calculator.component.html',
  styleUrls: ['./calculator.component.scss'],
})
export class CalculatorComponent {
  displayValue = '0';
  expression = '';
  firstOperand: number | null = null;
  operatorValue: string | null = null;
  waitingForSecondOperand = false;
  maxLength = 12;
  justCalculated = false;

  buttons = [
    ['C', '±', '%', '/'],
    ['7', '8', '9', '*'],
    ['4', '5', '6', '-'],
    ['1', '2', '3', '+'],
    ['0', '.', '='],
  ];

  isOperator(btn: string) {
    return ['/', '*', '-', '+'].includes(btn);
  }

  handleClick(btn: string) {
    if (btn === 'C') return this.clear();
    if (btn === '±') return this.toggleSign();
    if (btn === '%') return this.percent();
    if (btn === '=') return this.calculate();
    if (this.isOperator(btn)) return this.operator(btn);
    return this.appendNumber(btn);
  }

  get displayFontSize(): string {
    const len = this.displayValue.length;
    if (len > 10) return '1.8rem';
    if (len > 7) return '2.4rem';
    return '3rem';
  }

  get operatorSymbol(): string {
    const map: Record<string, string> = { '/': '÷', '*': '×', '-': '−', '+': '+' };
    return this.operatorValue ? (map[this.operatorValue] ?? this.operatorValue) : '';
  }

  appendNumber(number: string) {
    if (this.justCalculated && number !== '.') {
      this.expression = '';
      this.justCalculated = false;
    }

    if (this.waitingForSecondOperand) {
      this.displayValue = number === '.' ? '0.' : number;
      this.waitingForSecondOperand = false;
      return;
    }

    if (this.displayValue.length >= this.maxLength) return;
    if (number === '.' && this.displayValue.includes('.')) return;

    this.displayValue =
      this.displayValue === '0' && number !== '.'
        ? number
        : this.displayValue + number;
  }

  clear() {
    this.displayValue = '0';
    this.expression = '';
    this.firstOperand = null;
    this.operatorValue = null;
    this.waitingForSecondOperand = false;
    this.justCalculated = false;
  }

  operator(nextOperator: string) {
    const inputValue = parseFloat(this.displayValue);
    const sym: Record<string, string> = { '/': '÷', '*': '×', '-': '−', '+': '+' };

    if (this.firstOperand === null) {
      this.firstOperand = inputValue;
      this.expression = `${this.displayValue} ${sym[nextOperator]}`;
    } else if (this.operatorValue) {
      const result = this.calculateResult(this.firstOperand, inputValue, this.operatorValue);
      this.displayValue = this.formatResult(result);
      this.firstOperand = result;
      this.expression = `${this.displayValue} ${sym[nextOperator]}`;
    }

    this.operatorValue = nextOperator;
    this.waitingForSecondOperand = true;
    this.justCalculated = false;
  }

  calculate() {
    if (this.operatorValue === null || this.firstOperand === null) return;

    const inputValue = parseFloat(this.displayValue);
    const sym: Record<string, string> = { '/': '÷', '*': '×', '-': '−', '+': '+' };
    this.expression = `${this.firstOperand} ${sym[this.operatorValue]} ${this.displayValue} =`;

    const result = this.calculateResult(this.firstOperand, inputValue, this.operatorValue);
    this.displayValue = this.formatResult(result);
    this.firstOperand = null;
    this.operatorValue = null;
    this.waitingForSecondOperand = false;
    this.justCalculated = true;
  }

  formatResult(value: number): string {
    if (!isFinite(value)) return 'Error';
    const str = String(value);
    if (str.length > this.maxLength) return parseFloat(value.toPrecision(8)).toString();
    return str;
  }

  calculateResult(a: number, b: number, operator: string) {
    switch (operator) {
      case '+': return a + b;
      case '-': return a - b;
      case '*': return a * b;
      case '/': return b !== 0 ? a / b : 0;
      default: return b;
    }
  }

  toggleSign() {
    const value = parseFloat(this.displayValue);
    this.displayValue = String(value * -1);
  }

  percent() {
    const value = parseFloat(this.displayValue);
    this.displayValue = String(value / 100);
  }
}
