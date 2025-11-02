import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ColaboradoresService } from '../../services/colaboradores.service';
import { HttpClientModule } from '@angular/common/http';

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
export class ColaboradorFormComponent implements OnInit {
  colaborador = {
    matricula: '',
    nome: '',
    data_admissao: '',
    cargo: ''
  };

  carregando = false;
  editando = false;

  constructor(
    private dialogRef: MatDialogRef<ColaboradorFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private colaboradoresService: ColaboradoresService
  ) { }

  ngOnInit(): void {
    if (this.data) {
      this.editando = true;
      this.colaborador = { ...this.data };
    }
  }

  fechar() {
    this.dialogRef.close();
  }

  salvar() {
    this.carregando = true;

    if (this.editando) {
      this.colaboradoresService.atualizar(this.colaborador.matricula, this.colaborador).subscribe({
        next: () => {
          alert('✅ Colaborador atualizado com sucesso!');
          this.dialogRef.close(true);
        },
        error: (err) => {
          console.error('❌ Erro ao atualizar:', err);
          alert('Erro ao atualizar colaborador.');
          this.carregando = false;
        }
      });
    } else {
      this.colaboradoresService.criar(this.colaborador).subscribe({
        next: () => {
          alert('✅ Colaborador cadastrado com sucesso!');
          this.dialogRef.close(true);
        },
        error: (err) => {
          console.error('❌ Erro ao cadastrar:', err);
          alert('Erro ao cadastrar colaborador.');
          this.carregando = false;
        }
      });
    }
  }
}
