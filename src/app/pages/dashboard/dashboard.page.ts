import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule} from '@ionic/angular';
import { RouterModule } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
  imports: [
    CommonModule,
    IonicModule,
    RouterModule
  ]
})
export class DashboardPage implements OnInit {
  name: string = '';
  income: number = 0;
  goal: number = 0;
  spent: number = 0;
  remaining: number = 0;
  spentPercent: number = 0;

  ngOnInit() {
    this.name = localStorage.getItem('name') || 'User';
    this.income = Number(localStorage.getItem('income') || 0);
    this.goal = Number(localStorage.getItem('goal') || 0);
    this.spent = 0; // This will come from stored expenses later
    this.remaining = this.income - this.goal;
    this.spentPercent = ((this.spent / this.income) * 100).toFixed(2) as unknown as number;
  }
}
