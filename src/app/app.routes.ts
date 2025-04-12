import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'start',
    loadComponent: () => import('./pages/start/start.page').then( m => m.StartPage)
  },
  {
    path: '',
    redirectTo: 'start',
    pathMatch: 'full',
  },
  
  {
    path: 'dashboard',
    loadComponent: () => import('./pages/dashboard/dashboard.page').then( m => m.DashboardPage)
  },
  {
    path: 'add-income',
    loadComponent: () => import('./pages/add-income/add-income.page').then( m => m.AddIncomePage)
  },
  {
    path: 'add-expense',
    loadComponent: () => import('./pages/add-expense/add-expense.page').then( m => m.AddExpensePage)
  },
  {
    path: 'view-expenses',
    loadComponent: () => import('./pages/view-expenses/view-expenses.page').then( m => m.ViewExpensesPage)
  },
 
];
