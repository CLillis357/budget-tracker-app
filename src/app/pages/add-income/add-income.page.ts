import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Firestore, collection, addDoc } from '@angular/fire/firestore';
import { Auth } from '@angular/fire/auth';
import { inject } from '@angular/core';

@Component({
  standalone: true,
  selector: 'app-add-income',
  templateUrl: './add-income.page.html',
  styleUrls: ['./add-income.page.scss'],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule
  ]
})
export class AddIncomePage {
  name: string = '';
  amount: number | null = null;
  date: string = '';

  firestore: Firestore = inject(Firestore);
  auth: Auth = inject(Auth);

  constructor(private router: Router) {}

  async addIncome() {
    if (this.name && this.amount !== null && this.date) {
      const newIncome = {
        type: 'income',
        name: this.name,
        amount: this.amount,
        date: this.date
      };

      try {
        const user = this.auth.currentUser;
        if (!user) return;

        const ref = collection(this.firestore, `users/${user.uid}/transactions`);
        await addDoc(ref, newIncome);
        console.log('Income added to Firestore:', newIncome);
        this.router.navigateByUrl('/dashboard');
      } catch (error) {
        console.error('Error adding income:', error);
        alert('Failed to add income. Please try again.');
      }
    } else {
      alert('Please fill in all fields.');
    }
  }
}