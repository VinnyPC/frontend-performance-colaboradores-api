import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatDialogModule } from '@angular/material/dialog';
import { environment } from '../../../evironments/environment.prod';

@Component({
  selector: 'app-avaliacao-edit-form',
  standalone: true,
  imports: [CommonModule, FormsModule, MatButtonModule, MatInputModule, MatDialogModule],
  template: `
    <h2>Editar Avaliação (ID: {{ data.id }})</h2>

    <form (ngSubmit)="salvar()" #form="ngForm">
      <label>Data da Avaliação</label>
      <input type="date" [(ngModel)]="data.data_avaliacao" name="data_avaliacao" required />

      <h3>Comportamental</h3>
      <div *ngFor="let q of data.comportamental; let i = index">
        <label>{{ q.descricao }}</label>
        <input type="number" [(ngModel)]="q.nota" name="c{{ i }}" min="1" max="5" />
      </div>

      <h3>Desafios</h3>
      <div *ngFor="let d of data.desafios; let j = index">
        <label>{{ d.descricao }}</label>
        <input type="number" [(ngModel)]="d.nota" name="d{{ j }}" min="1" max="5" />
      </div>

      <div class="acoes">
        <button mat-raised-button color="primary" type="submit">Salvar</button>
        <button mat-button mat-dialog-close>Cancelar</button>
      </div>
    </form>
  `,
  styles: [`
    form {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }
    h3 { margin-top: 1rem; color: #ff6200; }
    label { font-weight: 500; }
    input { width: 100%; padding: 0.4rem; }
    .acoes { display: flex; justify-content: flex-end; gap: 1rem; margin-top: 1rem; }
  `]
})
export class AvaliacaoEditFormComponent {
  private baseUrl = environment.apiUrl;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<AvaliacaoEditFormComponent>,
    private http: HttpClient
  ) { }

  salvar() {
    const token = localStorage.getItem('id_token');
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });

    // Monta o body sem o campo "id"
    const body = {
      matricula: this.data.matricula,
      data_avaliacao: this.data.data_avaliacao,
      comportamental: this.data.comportamental,
      desafios: this.data.desafios
    };

    this.http.put(`${this.baseUrl}/avaliacoes/${this.data.id}`, body, { headers }).subscribe({
      next: () => {
        alert('✅ Avaliação atualizada com sucesso!');
        this.dialogRef.close(true);
      },
      error: (err) => {
        console.error('❌ Erro ao atualizar avaliação:', err);
        alert('Erro ao atualizar avaliação. Veja o console.');
      }
    });
  }
}
