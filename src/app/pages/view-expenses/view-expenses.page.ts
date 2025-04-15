import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { Firestore, collection, collectionData, deleteDoc, doc } from '@angular/fire/firestore';
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
  firestore: Firestore = inject(Firestore);

  ngOnInit() {
    this.name = localStorage.getItem('name') || 'User';
    this.loadTransactions();
  }

  loadTransactions() {
    const ref = collection(this.firestore, 'transactions');
    collectionData(ref, { idField: 'id' }).subscribe((data) => {
      this.transactions = (data as Transaction[]).sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      );
    });
  }

  async deleteTransaction(id: string) {
    try {
      const docRef = doc(this.firestore, `transactions/${id}`);
      await deleteDoc(docRef);
      console.log('Deleted transaction:', id);
    } catch (error) {
      console.error('Error deleting transaction:', error);
    }
  }
}
