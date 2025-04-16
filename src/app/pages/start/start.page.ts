import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';
import { Firestore, doc, setDoc } from '@angular/fire/firestore';
import { Auth } from '@angular/fire/auth';
import { getDoc } from '@angular/fire/firestore';
import { inject } from '@angular/core';

@Component({
  selector: 'app-start',
  standalone: true,
  templateUrl: './start.page.html',
  styleUrls: ['./start.page.scss'],
  imports: [CommonModule, FormsModule, IonicModule]
})
export class StartPage implements OnInit {
  name: string = '';
  income: number = 0;
  goal: number = 0;

  firestore: Firestore = inject(Firestore);
  auth: Auth = inject(Auth);

  constructor(private router: Router) {}

  ngOnInit() {
    const profile = JSON.parse(localStorage.getItem('profile') || '{}');
    this.name = profile.name || '';
    this.income = profile.income || 0;
    this.goal = profile.goal || 0;
  }

  async startCalculation() {
    if (!this.name || !this.income || !this.goal) {
      alert('Please fill in all fields.');
      return;
    }

    const user = this.auth.currentUser;
    if (!user) {
      alert('No user signed in');
      return;
    }

    const userDocRef = doc(this.firestore, `users/${user.uid}`);
    await setDoc(userDocRef, {
      name: this.name,
      income: this.income,
      goal: this.goal
    });

    const updatedSnapshot = await getDoc(userDocRef);
    if (updatedSnapshot.exists()) {
      localStorage.setItem('profile', JSON.stringify(updatedSnapshot.data()));
    }

    const profile = {
      name: this.name,
      income: this.income,
      goal: this.goal
    };
    localStorage.setItem('profile', JSON.stringify(profile));

    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      window.location.href = '/dashboard';
    });
  }
}
