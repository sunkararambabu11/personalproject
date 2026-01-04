import { Routes } from '@angular/router';
import { Login } from './core/auth/components/login/login';
import { Signup } from './core/auth/components/signup/signup';
import { Home } from './core/home/home';
import { NewPolicy } from './core/policy/new-policy/new-policy';
import { AllPolicies } from './core/policy/all-policies/all-policies';
import { EditPolicy } from './core/policy/edit-policy/edit-policy';
import { Layout } from './core/layout/layout';
import { AuthGuard } from './core/auth/data-access/auth.gaurd';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: Login },
  { path: 'signup', component: Signup },
  { 
    path: '', 
    component: Layout,
    canActivate: [AuthGuard],
    children: [
      { path: 'home', component: Home },
      { path: 'policy/new', component: NewPolicy },
      { path: 'policy/list', component: AllPolicies },
      { path: 'policy/edit/:policyNumber', component: EditPolicy },
    ]
  }
];

