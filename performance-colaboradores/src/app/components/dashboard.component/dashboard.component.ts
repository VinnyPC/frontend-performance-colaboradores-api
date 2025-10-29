import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ColaboradorFormComponent } from '../colaborador-form.component/colaborador-form.component';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule, MatDialogModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {
  constructor(private authService: AuthService, private router: Router, private dialog: MatDialog) { }

  logOut() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
  // 🔸 Aba ativa: 'comportamental' ou 'desafio'
  aba: 'comportamental' | 'desafio' = 'comportamental';

  // 🔸 Mock de colaboradores (exemplo)
  colaboradores = [
    { nome: 'Vinicius Silva', cargo: 'Engenheiro de Software', matricula: '12345' },
    { nome: 'Rodrigo Santos', cargo: 'Coordenador', matricula: '161020' }
  ];

  // 🔹 Métodos simulados
  adicionarColaborador() {
    const dialogRef = this.dialog.open(ColaboradorFormComponent, {
      width: '400px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Atualiza lista após cadastro bem-sucedido
        this.atualizarLista();
      }
    });
  }

  editarColaborador(colab: any) {
    alert(`Editar colaborador: ${colab.nome}`);
  }

  excluirColaborador(colab: any) {
    const confirmar = confirm(`Deseja excluir ${colab.nome}?`);
    if (confirmar) {
      this.colaboradores = this.colaboradores.filter(c => c !== colab);
      alert('Colaborador removido!');
    }
  }

  atualizarLista() {
    alert('Lista atualizada!');
  }

  novaAvaliacao(tipo: 'comportamental' | 'desafio') {
    alert(`Nova avaliação ${tipo}`);
  }
}
