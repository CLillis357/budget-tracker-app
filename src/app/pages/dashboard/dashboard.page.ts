import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RouterModule, Router } from '@angular/router';
import { Firestore, collection, collectionData } from '@angular/fire/firestore';
import { Auth, onAuthStateChanged, signOut } from '@angular/fire/auth';
import { inject } from '@angular/core';

@Component({
  standalone: true,
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
  imports: [CommonModule, IonicModule, RouterModule]
})

// This is the main component class for the page
export class DashboardPage implements OnInit {
  name: string = '';
  income: number = 0;
  goal: number = 0;
  spent: number = 0;
  remaining: number = 0;
  spentPercent: number = 0;
  animatedPercent: number = 0;
  progressColor: string = 'hsl(120, 100%, 40%)';
  circumference: number = 2 * Math.PI * 45;
  additionalIncome: number = 0;

  firestore: Firestore = inject(Firestore);
  auth: Auth = inject(Auth);

  
  // Dependency injection: brings in required services
  constructor(private router: Router) {}

  
  // Lifecycle hook that runs when the component loads
  ngOnInit() {
    const profile = JSON.parse(localStorage.getItem('profile') || '{}');
    this.name = profile.name || 'User';
    this.income = Number(profile.income || 0);
    this.goal = Number(profile.goal || 0);
    this.
  // Loads all transactions for the logged-in user
  loadTransactions();
  }

  
  // Loads all transactions for the logged-in user
  loadTransactions() {
    onAuthStateChanged(this.auth, (user) => {
      if (!user) return;

      const ref = collection(this.firestore, `users/${user.uid}/transactions`);
      collectionData(ref, { idField: 'id' }).subscribe((transactions: any[]) => {
        const incomeEntries = transactions.filter(t => t.type === 'income');
        const expenseEntries = transactions.filter(t => t.type === 'expense');

        const totalIncomeFromEntries = incomeEntries.reduce((sum, t) => sum + Number(t.amount), 0);
        const totalExpenses = expenseEntries.reduce((sum, t) => sum + Number(t.amount), 0);

        const actualIncome = this.income + totalIncomeFromEntries;
        const actualAvailable = actualIncome - this.goal;

        this.additionalIncome = totalIncomeFromEntries;
        this.spent = Math.max(0, totalExpenses - totalIncomeFromEntries);
        this.remaining = actualAvailable - this.spent;

        this.spentPercent = actualAvailable > 0
          ? Number(((this.spent / actualAvailable) * 100).toFixed(2))
          : 0;

        const hue = 120 - (120 * (this.spentPercent / 100));
        this.progressColor = `hsl(${Math.max(0, hue)}, 100%, 40%)`;

        this.animatePercent();
      });
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

  
  // Signs the user out and clears local storage
  async logout() {
    try {
      await signOut(this.auth);
      localStorage.clear();
      this.router.navigateByUrl('/login');
    } catch (error) {
      console.error('Logout error:', error);
      alert('Logout failed. Please try again.');
    }
  }

  goToEditProfile() {
    this.router.navigateByUrl('/start');
  }
}
