import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import {
  
  IonicModule
} from '@ionic/angular';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-start',
  templateUrl: './start.page.html',
  styleUrls: ['./start.page.scss'],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    
  ],
})
export class StartPage {
  name: string = '';
  income: number | null = null;
  goal: number | null = null;

  constructor(private router: Router) {}

  startCalculation() {
    if (this.name && this.income !== null && this.goal !== null) {
      localStorage.setItem('name', this.name);
      localStorage.setItem('income', this.income.toString());
      localStorage.setItem('goal', this.goal.toString());
      this.router.navigateByUrl('/dashboard');
    } else {
      alert('Please fill in all fields.');
    }
  }
}
