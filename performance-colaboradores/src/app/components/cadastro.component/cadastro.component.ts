import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-cadastro',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  templateUrl: './cadastro.component.html',
  styleUrls: ['./cadastro.component.css']
})
export class CadastroComponent {
  username = '';
  email = '';
  senha = '';
  carregando = false;
  erro = '';
  sucesso = '';

  constructor(private authService: AuthService, private router: Router) { }

  cadastrar() {
    this.carregando = true;
    this.erro = '';
    this.sucesso = '';

    this.authService.signUp(this.username, this.senha, this.email)
      .then(() => {
        this.carregando = false;
        this.sucesso = 'Cadastro realizado com sucesso! Redirecionando para login...';

        // 🔁 Redireciona para /login após 2 segundos
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 2000);
      })
      .catch(err => {
        this.carregando = false;
        this.erro = err.message || 'Erro ao cadastrar usuário.';
      });
  }
}
