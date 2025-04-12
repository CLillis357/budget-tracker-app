import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-view-expenses',
  templateUrl: './view-expenses.page.html',
  styleUrls: ['./view-expenses.page.scss'],
  imports: [
    CommonModule,
    IonicModule,
    RouterModule
  ]
})
export class ViewExpensesPage implements OnInit {
  name: string = '';
  transactions: { type: string; name: string; amount: number; date: string }[] = [];

  ngOnInit() {
    this.name = localStorage.getItem('name') || 'User';
    this.loadTransactions();
  }

  loadTransactions() {
    const stored = localStorage.getItem('transactions');
    this.transactions = stored ? JSON.parse(stored) : [];
  }

  deleteTransaction(index: number) {
    this.transactions.splice(index, 1);
    localStorage.setItem('transactions', JSON.stringify(this.transactions));
  }
}
