import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  imports: [MatFormFieldModule, MatInputModule, MatSelectModule, FormsModule],
})
export class LoginComponent {
  email = '';
  senha = '';
  carregando = false;
  erro = '';

  constructor(private authService: AuthService, private router: Router) { }

  login() {
    this.carregando = true;
    this.erro = '';

    this.authService.login(this.email, this.senha)
      .then(() => {
        this.carregando = false;
        this.router.navigate(['/dashboard']); // redireciona após login
      })
      .catch(err => {
        this.carregando = false;
        this.erro = err.message || 'Erro ao autenticar';
      });
  }
}
