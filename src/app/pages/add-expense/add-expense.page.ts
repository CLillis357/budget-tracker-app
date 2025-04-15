import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { Firestore, collection, addDoc } from '@angular/fire/firestore';
import { inject } from '@angular/core';

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

  firestore: Firestore = inject(Firestore);

  constructor(private router: Router) {}

  async addExpense() {
    if (this.name && this.amount !== null && this.date) {
      const newExpense = {
        type: 'expense',
        name: this.name,
        amount: this.amount,
        date: this.date
      };

      try {
        const ref = collection(this.firestore, 'transactions');
        await addDoc(ref, newExpense);
        console.log('Expense added to Firestore:', newExpense);
        this.router.navigateByUrl('/dashboard');
      } catch (error) {
        console.error('Error adding expense:', error);
        alert('Failed to add expense. Please try again.');
      }
    } else {
      alert('Please fill in all fields.');
    }
  }
}