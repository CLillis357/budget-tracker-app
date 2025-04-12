import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { IonicModule} from '@ionic/angular';

@Component({
  standalone: true,
  selector: 'app-add-expense',
  templateUrl: './add-expense.page.html',
  styleUrls: ['./add-expense.page.scss'],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule
  ]
})
export class AddExpensePage {
  name: string = '';
  amount: number | null = null;
  date: string = '';

  constructor(private router: Router) {}

  addExpense() {
    if (this.name && this.amount !== null && this.date) {
      const newExpense = {
        type: 'expense',
        name: this.name,
        amount: this.amount,
        date: this.date
      };

      const stored = JSON.parse(localStorage.getItem('transactions') || '[]');
      stored.push(newExpense);
      localStorage.setItem('transactions', JSON.stringify(stored));

      this.router.navigateByUrl('/dashboard');
    } else {
      alert('Please fill in all fields.');
    }
  }
}
