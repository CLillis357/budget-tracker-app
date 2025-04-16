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
  // Loads all transaction data for the logged-in user and updates budget calculations
loadTransactions() {
  // Wait for Firebase to confirm the user's authentication state
  onAuthStateChanged(this.auth, (user) => {
    if (!user) return; // Exit if no user is logged in

    // Reference the user's personal Firestore transaction collection
    const ref = collection(this.firestore, `users/${user.uid}/transactions`);

    // Subscribe to real-time updates from that collection
    collectionData(ref, { idField: 'id' }).subscribe((transactions: any[]) => {
      // Separate transactions into income and expenses
      const incomeEntries = transactions.filter(t => t.type === 'income');
      const expenseEntries = transactions.filter(t => t.type === 'expense');

      // Sum all income and expense entries
      const totalIncomeFromEntries = incomeEntries.reduce((sum, t) => sum + Number(t.amount), 0);
      const totalExpenses = expenseEntries.reduce((sum, t) => sum + Number(t.amount), 0);

      // Add any income added via entries to the original profile income
      const actualIncome = this.income + totalIncomeFromEntries;

      // Subtract monthly savings goal from total income to get available amount
      const actualAvailable = actualIncome - this.goal;

      // Store additional income for display
      this.additionalIncome = totalIncomeFromEntries;

      // Calculate net spent (capped to 0 to avoid negative numbers)
      this.spent = Math.max(0, totalExpenses - totalIncomeFromEntries);

      // Calculate remaining amount, ensure it never goes below 0
      this.remaining = Math.max(0, actualAvailable - this.spent);

      // Calculate the percentage of the budget that’s been spent, capped at 100%
      this.spentPercent = actualAvailable > 0
        ? Math.min(100, Number(((this.spent / actualAvailable) * 100).toFixed(2)))
        : 0;

      // Adjust the circular chart color based on spending level (green to red)
      const hue = 120 - (120 * (this.spentPercent / 100));
      this.progressColor = `hsl(${Math.max(0, hue)}, 100%, 40%)`;

      // Start the animation for the circular progress chart
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
