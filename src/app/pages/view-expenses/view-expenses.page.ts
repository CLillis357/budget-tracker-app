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
export class ViewExpensesPage implements OnInit {
  transactions: Transaction[] = [];
  name: string = '';
  totalIncome: number = 0;
  totalExpenses: number = 0;

  firestore: Firestore = inject(Firestore);
  auth: Auth = inject(Auth);

  ngOnInit() {
    const profile = JSON.parse(localStorage.getItem('profile') || '{}');
    this.name = profile.name || 'User';
    this.loadTransactions();
  }

  loadTransactions() {
    onAuthStateChanged(this.auth, (user) => {
      if (!user) return;

      const ref = collection(this.firestore, `users/${user.uid}/transactions`);
      collectionData(ref, { idField: 'id' }).subscribe((data) => {
        const txs = data as Transaction[];
        this.transactions = txs.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

        this.totalIncome = txs
          .filter(t => t.type === 'income')
          .reduce((sum, t) => sum + Number(t.amount), 0);

        this.totalExpenses = txs
          .filter(t => t.type === 'expense')
          .reduce((sum, t) => sum + Number(t.amount), 0);
      });
    });
  }

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
