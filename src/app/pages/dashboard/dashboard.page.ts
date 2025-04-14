import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';

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

  ngOnInit() {
    this.name = localStorage.getItem('name') || 'User';
    this.income = Number(localStorage.getItem('income') || 0);
    this.goal = Number(localStorage.getItem('goal') || 0);
    this.calculateStats();
  }

  calculateStats() {
    const transactions = JSON.parse(localStorage.getItem('transactions') || '[]');
  
    const totalIncomeFromEntries = transactions
      .filter((t: any) => t.type === 'income')
      .reduce((sum: number, t: any) => sum + Number(t.amount), 0);
  
    const totalExpenses = transactions
      .filter((t: any) => t.type === 'expense')
      .reduce((sum: number, t: any) => sum + Number(t.amount), 0);
  
    const actualIncome = this.income + totalIncomeFromEntries;
    const availableAfterGoal = actualIncome - this.goal;
  
    this.spent = totalExpenses;
    this.additionalIncome = totalIncomeFromEntries;
    this.remaining = availableAfterGoal - this.spent;
  
    this.spentPercent = availableAfterGoal > 0
      ? Number(((this.spent / availableAfterGoal) * 100).toFixed(2))
      : 0;
  
    this.animatePercent();
  }
  

  animatePercent() {
    const duration = 1000; // ms
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
