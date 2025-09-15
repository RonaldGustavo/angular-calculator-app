import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  standalone: true,
  selector: 'app-calculator',
  imports: [CommonModule],
  templateUrl: './calculator.component.html',
  styleUrls: ['./calculator.component.scss'], // ✅ harus styleUrls (array)
})
export class CalculatorComponent {
  displayValue = '0';
  firstOperand: number | null = null;
  operatorValue: string | null = null;
  waitingForSecondOperand = false;
  maxLength = 12; // batas maksimal karakter

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

  // === FUNGSI CALCULATOR ===
  appendNumber(number: string) {
    // 🔹 Jika sedang menunggu operand kedua
    if (this.waitingForSecondOperand) {
      this.displayValue = number === '.' ? '0.' : number;
      this.waitingForSecondOperand = false;
      return;
    }

    // 🔹 Cegah input lebih dari maxLength
    if (this.displayValue.length >= this.maxLength) return;

    // 🔹 Cegah titik ganda
    if (number === '.' && this.displayValue.includes('.')) return;

    // 🔹 Update display value
    this.displayValue =
      this.displayValue === '0' && number !== '.'
        ? number
        : this.displayValue + number;
  }

  clear() {
    this.displayValue = '0';
    this.firstOperand = null;
    this.operatorValue = null;
    this.waitingForSecondOperand = false;
  }

  operator(nextOperator: string) {
    const inputValue = parseFloat(this.displayValue);

    if (this.firstOperand === null) {
      this.firstOperand = inputValue;
    } else if (this.operatorValue) {
      const result = this.calculateResult(
        this.firstOperand,
        inputValue,
        this.operatorValue
      );
      this.displayValue = String(result);
      this.firstOperand = result;
    }

    this.operatorValue = nextOperator;
    this.waitingForSecondOperand = true;
  }

  calculate() {
    if (this.operatorValue === null || this.firstOperand === null) return;

    const inputValue = parseFloat(this.displayValue);
    const result = this.calculateResult(
      this.firstOperand,
      inputValue,
      this.operatorValue
    );

    this.displayValue = String(result);
    this.firstOperand = null;
    this.operatorValue = null;
    this.waitingForSecondOperand = false;
  }

  calculateResult(a: number, b: number, operator: string) {
    switch (operator) {
      case '+':
        return a + b;
      case '-':
        return a - b;
      case '*':
        return a * b;
      case '/':
        return b !== 0 ? a / b : 0;
      default:
        return b;
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
