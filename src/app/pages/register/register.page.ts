import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';
import { Auth, createUserWithEmailAndPassword } from '@angular/fire/auth';
import { inject } from '@angular/core';

@Component({
  selector: 'app-register',
  standalone: true,
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  imports: [CommonModule, FormsModule, IonicModule],
})

// This is the main component class for the page
export class RegisterPage {
  email: string = '';
  password: string = '';
  confirmPassword: string = '';

  auth: Auth = inject(Auth);

  
  // Dependency injection: brings in required services
  constructor(private router: Router) {}

  
  // Handles user registration with Firebase Auth
  async register() {
    if (!this.email || !this.password || !this.confirmPassword) {
      alert('Please fill in all fields.');
      return;
    }

    if (this.password !== this.confirmPassword) {
      alert('Passwords do not match.');
      return;
    }

    try {
      await createUserWithEmailAndPassword(this.auth, this.email, this.password);
      this.router.navigateByUrl('/start');
    } catch (error: any) {
      console.error('Registration error:', error);
      alert(error.message || 'Registration failed.');
    }
  }

  goToLogin() {
    this.router.navigateByUrl('/login');
  }
}
