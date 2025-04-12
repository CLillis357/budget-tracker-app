import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

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

  constructor(private router: Router) {}

  addIncome() {
    if (this.name && this.amount !== null && this.date) {
      const newIncome = {
        type: 'income',
        name: this.name,
        amount: this.amount,
        date: this.date
      };

      const stored = JSON.parse(localStorage.getItem('transactions') || '[]');
      stored.push(newIncome);
      localStorage.setItem('transactions', JSON.stringify(stored));

      this.router.navigateByUrl('/dashboard');
    } else {
      alert('Please fill in all fields.');
    }
  }
}
