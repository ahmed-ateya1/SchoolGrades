import { Routes } from '@angular/router';
import { adminGuard } from './guards/admin.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/home/home').then(m => m.HomeComponent),
    title: 'الرئيسية - نتيجة الشهادة الثانوية'
  },
  {
    path: 'result/:seatNumber',
    loadComponent: () => import('./pages/result/result').then(m => m.ResultComponent),
    title: 'نتيجة الطالب - نتيجة الشهادة الثانوية'
  },
  {
    path: 'admin/login',
    loadComponent: () => import('./pages/login/login').then(m => m.LoginComponent),
    title: 'تسجيل الدخول - نتيجة الشهادة الثانوية'
  },
  {
    path: 'login',
    redirectTo: 'admin/login',
    pathMatch: 'full'
  },
  {
    path: 'admin',
    canActivate: [adminGuard],
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      },
      {
        path: 'dashboard',
        loadComponent: () => import('./pages/admin/admin').then(m => m.AdminComponent),
        title: 'لوحة التحكم - نتيجة الشهادة الثانوية'
      },
      {
        path: '**',
        redirectTo: 'dashboard'
      }
    ]
  },
  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full'
  }
];
