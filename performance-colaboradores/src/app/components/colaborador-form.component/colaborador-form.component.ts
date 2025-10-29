import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-colaborador-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    HttpClientModule
  ],
  templateUrl: './colaborador-form.component.html',
  styleUrls: ['./colaborador-form.component.css']
})
export class ColaboradorFormComponent {
  colaborador = {
    matricula: '',
    nome: '',
    data_admissao: '',
    cargo: ''
  };

  carregando = false;

  constructor(
    private dialogRef: MatDialogRef<ColaboradorFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private http: HttpClient
  ) { }

  fechar() {
    this.dialogRef.close();
  }

  salvar() {
    this.carregando = true;

    const token = localStorage.getItem('id_token');

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });

    this.http.post(
      'https://097o2hnb48.execute-api.us-east-1.amazonaws.com/dev/colaboradores',
      this.colaborador,
      { headers }
    ).subscribe({
      next: () => {
        alert('Colaborador cadastrado com sucesso!');
        this.carregando = false;
        this.dialogRef.close(true);
      },
      error: (err) => {
        console.error('Erro ao cadastrar:', err);
        alert('Erro ao cadastrar colaborador.');
        this.carregando = false;
      }
    });
  }
}
