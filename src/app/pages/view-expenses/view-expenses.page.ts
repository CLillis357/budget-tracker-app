import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { Firestore, collection, collectionData, deleteDoc, doc } from '@angular/fire/firestore';
import { Auth, onAuthStateChanged } from '@angular/fire/auth';
import { inject } from '@angular/core';

interface Transaction {
  id: string;
  type: string;
  name: string;
  amount: number;
  date: string;
}

@Component({
  standalone: true,
  selector: 'app-view-expenses',
  templateUrl: './view-expenses.page.html',
  styleUrls: ['./view-expenses.page.scss'],
  imports: [CommonModule, IonicModule, RouterModule]
})

// This is the main component class for the page
export class ViewExpensesPage implements OnInit {
  transactions: Transaction[] = [];
  name: string = '';
  totalIncome: number = 0;
  totalExpenses: number = 0;

  firestore: Firestore = inject(Firestore);
  auth: Auth = inject(Auth);

  
  // Lifecycle hook that runs when the component loads
  ngOnInit() {
    const profile = JSON.parse(localStorage.getItem('profile') || '{}');
    this.name = profile.name || 'User';
    this.
  // Loads all transactions for the logged-in user
  loadTransactions();
  }

  
  
  // Loads all transactions from Firestore for the currently logged-in user
loadTransactions() {
  // Wait for the user's auth state to be fully loaded
  onAuthStateChanged(this.auth, (user) => {
    if (!user) return; 

    // Reference the Firestore collection for this user's transactions
    const ref = collection(this.firestore, `users/${user.uid}/transactions`);

    // Listen to changes in the user's transactions collection
    collectionData(ref, { idField: 'id' }).subscribe((data) => {
      // Cast the data to expected Transaction[] structure
      const txs = data as Transaction[];

      // Sort transactions by date (most recent first)
      this.transactions = txs.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

      // Calculate the total income by summing all 'income' type amounts
      this.totalIncome = txs
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + Number(t.amount), 0);

      // Calculate the total expenses by summing all 'expense' type amounts
      this.totalExpenses = txs
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + Number(t.amount), 0);
    });
  });
}

// Deletes a transaction from Firestore by ID
  async deleteTransaction(id: string) {
    try {
      const docRef = doc(this.firestore, `users/${this.auth.currentUser?.uid}/transactions/${id}`);
      await deleteDoc(docRef);
      console.log('Deleted transaction:', id);
    } catch (error) {
      console.error('Error deleting transaction:', error);
    }
  }
}
