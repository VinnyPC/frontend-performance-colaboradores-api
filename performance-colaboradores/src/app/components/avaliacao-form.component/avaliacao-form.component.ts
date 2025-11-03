import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HttpClient, HttpHeaders, HttpClientModule } from '@angular/common/http';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { environment } from '../../../evironments/environment.prod';

@Component({
  selector: 'app-avaliacao-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule
  ],
  templateUrl: './avaliacao-form.component.html',
  styleUrls: ['./avaliacao-form.component.css']
})
export class AvaliacaoFormComponent {
  private baseUrl = environment.apiUrl + '/avaliacoes';

  avaliacao: any; // ✅ declaramos mas não inicializamos ainda

  constructor(
    private http: HttpClient,
    private dialogRef: MatDialogRef<AvaliacaoFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    // ✅ agora sim, podemos usar this.data.matricula com segurança
    this.avaliacao = {
      matricula: data.matricula,
      data_avaliacao: new Date().toISOString().split('T')[0],
      comportamental: [
        { numero_questao: 1, descricao: 'Você promove um ambiente colaborativo?', nota: 1 },
        { numero_questao: 2, descricao: 'Você se atualiza e aprende o tempo todo?', nota: 1 },
        { numero_questao: 3, descricao: 'Você utiliza dados para tomar suas decisões?', nota: 1 },
        { numero_questao: 4, descricao: 'Você trabalha com autonomia?', nota: 1 }
      ],
      desafios: [
        { numero_desafio: 1, descricao: 'Desafio Backend Legacy', nota: 1 },
        { numero_desafio: 2, descricao: 'Desafio Integração com API externa', nota: 1 },
        { numero_desafio: 3, descricao: 'Desafio Refatoração de Código', nota: 1 },
        { numero_desafio: 4, descricao: 'Desafio Documentação', nota: 1 }
      ]
    };
  }

  salvar() {
    const token = localStorage.getItem('id_token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    this.http.post(this.baseUrl, this.avaliacao, { headers }).subscribe({
      next: () => {
        alert('✅ Avaliação cadastrada com sucesso!');
        this.dialogRef.close(true);
      },
      error: (err) => {
        console.error('❌ Erro ao cadastrar avaliação:', err);
        alert('Erro ao cadastrar avaliação.');
      }
    });
  }

  fechar() {
    this.dialogRef.close();
  }
}
