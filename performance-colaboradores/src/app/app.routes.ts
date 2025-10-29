import { Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard.component/dashboard.component';
import { LoginComponent } from './components/login.component/login.component';
import { AuthGuard } from './guards/auth.guard';
import { CadastroComponent } from './components/cadastro.component/cadastro.component';

export const routes: Routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: 'login', component: LoginComponent },
    { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
    { path: 'cadastro', component: CadastroComponent },
];
