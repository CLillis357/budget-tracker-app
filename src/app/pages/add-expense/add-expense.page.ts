import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { Firestore, collection, addDoc } from '@angular/fire/firestore';
import { Auth, onAuthStateChanged } from '@angular/fire/auth';
import { inject } from '@angular/core';

@Component({
  standalone: true,
  selector: 'app-add-expense',
  templateUrl: './add-expense.page.html',
  styleUrls: ['./add-expense.page.scss'],
  imports: [CommonModule, FormsModule, IonicModule]
})

// This is the main component class for the page
export class AddExpensePage {
  name: string = '';
  amount: number | null = null;
  date: string = '';

  firestore: Firestore = inject(Firestore);
  auth: Auth = inject(Auth);

  
  // Dependency injection: brings in required services
  constructor(private router: Router) {}

  
  // Handles form submission to add an expense
  async addExpense() {
    if (!this.name || this.amount === null || !this.date) {
      alert('Please fill in all fields.');
      return;
    }

    const newExpense = {
      type: 'expense',
      name: this.name,
      amount: this.amount,
      date: this.date
    };

    onAuthStateChanged(this.auth, async (user) => {
      if (!user) return;

      try {
        const ref = collection(this.firestore, `users/${user.uid}/transactions`);
        await addDoc(ref, newExpense);
        console.log('Expense added to Firestore:', newExpense);
        this.router.navigateByUrl('/dashboard');
      } catch (error) {
        console.error('Error adding expense:', error);
        alert('Failed to add expense. Please try again.');
      }
    });
  }
}