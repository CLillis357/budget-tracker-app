import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { Firestore, collection, collectionData } from '@angular/fire/firestore';
import { inject } from '@angular/core';
import { Observable } from 'rxjs';


@Component({
  standalone: true,
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
  imports: [CommonModule, IonicModule, RouterModule]
})
export class DashboardPage implements OnInit {
  name: string = '';
  income: number = 0;
  goal: number = 0;
  spent: number = 0;
  remaining: number = 0;
  spentPercent: number = 0;
  additionalIncome: number = 0;
  animatedPercent: number = 0;
  progressColor: string = 'hsl(120, 100%, 40%)';
  circumference: number = 2 * Math.PI * 45;
  firestore: Firestore = inject(Firestore);


  ngOnInit() {
    this.name = localStorage.getItem('name') || 'User';
    this.income = Number(localStorage.getItem('income') || 0);
    this.goal = Number(localStorage.getItem('goal') || 0);
    this.calculateStats();
  }

  calculateStats() {
    const transactionsRef = collection(this.firestore, 'transactions');
  
    collectionData(transactionsRef, { idField: 'id' }).subscribe((transactions: any[]) => {
      const incomeEntries = transactions.filter(t => t.type === 'income');
      const expenseEntries = transactions.filter(t => t.type === 'expense');
  
      const totalIncomeFromEntries = incomeEntries.reduce((sum, t) => sum + Number(t.amount), 0);
      const totalExpenses = expenseEntries.reduce((sum, t) => sum + Number(t.amount), 0);
  
      const actualIncome = this.income + totalIncomeFromEntries;
      const actualAvailable = actualIncome - this.goal;
  
      this.additionalIncome = totalIncomeFromEntries;
      this.spent = totalExpenses;
      this.remaining = actualAvailable - this.spent;
  
      this.spentPercent = actualAvailable > 0
        ? Number(((this.spent / actualAvailable) * 100).toFixed(2))
        : 0;
  
      const hue = 120 - (120 * (this.spentPercent / 100));
      this.progressColor = `hsl(${Math.max(0, hue)}, 100%, 40%)`;
  
      this.animatePercent();
    });
  }
  

  animatePercent() {
    const duration = 1000;
    const steps = 30;
    const interval = duration / steps;
    const increment = this.spentPercent / steps;
    this.animatedPercent = 0;

    const animate = setInterval(() => {
      this.animatedPercent += increment;
      if (this.animatedPercent >= this.spentPercent) {
        this.animatedPercent = this.spentPercent;
        clearInterval(animate);
      }
    }, interval);
  }
}