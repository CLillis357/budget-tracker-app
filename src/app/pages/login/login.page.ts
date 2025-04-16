import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { Auth, signInWithEmailAndPassword } from '@angular/fire/auth';
import { Firestore, doc, getDoc } from '@angular/fire/firestore';
import { inject } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonicModule
  ]
})

// This is the main component class for the page
export class LoginPage {
  email: string = '';
  password: string = '';

  auth: Auth = inject(Auth);
  firestore: Firestore = inject(Firestore);

  
  // Dependency injection: brings in required services
  constructor(private router: Router) {}

  
  // Handles user login and profile loading
  async login() {
    if (!this.email || !this.password) {
      alert('Please enter both email and password.');
      return;
    }

    try {
      const userCredential = await signInWithEmailAndPassword(this.auth, this.email, this.password);
      const user = userCredential.user;

      const userDocRef = doc(this.firestore, `users/${user.uid}`);
      const userSnapshot = await getDoc(userDocRef);

      if (userSnapshot.exists()) {
        const profileData = userSnapshot.data();
        localStorage.setItem('profile', JSON.stringify(profileData));
        this.router.navigateByUrl('/dashboard');
      } else {
        // No profile found, send to start to create one
        this.router.navigateByUrl('/start');
      }
    } catch (error: any) {
      console.error('Login error:', error);
      alert(error.message || 'Login failed.');
    }
  }

  goToRegister() {
    this.router.navigateByUrl('/register');
  }
}
