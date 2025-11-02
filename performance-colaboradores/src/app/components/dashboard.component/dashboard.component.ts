import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ColaboradorFormComponent } from '../colaborador-form.component/colaborador-form.component';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ColaboradoresService } from '../../services/colaboradores.service';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { AvaliacaoFormComponent } from '../avaliacao-form.component/avaliacao-form.component';
import { AvaliacaoEditFormComponent } from '../avaliacao-edit-form.component/avaliacao-edit-form.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    HttpClientModule,
    FormsModule
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  private baseUrl = '/api';

  colaboradoresArray: any[] = [];
  colaboradorSelecionado: any = null;
  avaliacoesArray: any[] = [];
  avaliacaoSelecionada: any = null;
  aba: 'comportamental' | 'desafio' | 'notas_finais' = 'comportamental';
  carregandoAvaliacoes = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private dialog: MatDialog,
    private colaboradoresService: ColaboradoresService,
    private http: HttpClient
  ) { }

  ngOnInit(): void {
    this.listarColaboradores();
  }

  logOut() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  excluirNotaFinal(id: number) {
    const confirmar = confirm(`Deseja excluir a nota final de ID ${id}?`);
    if (!confirmar) return;

    const token = localStorage.getItem('id_token');
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });

    this.http.delete(`${this.baseUrl}/avaliacoes/nota_final/${id}`, { headers })
      .subscribe({
        next: () => {
          alert('🗑️ Nota final excluída com sucesso!');
          // Remove do array local para atualizar a tabela sem reload
          this.notasFinaisArray = this.notasFinaisArray.filter(n => n.id !== id);
        },
        error: (err) => {
          console.error('❌ Erro ao excluir nota final:', err);
          alert('Erro ao excluir nota final. Verifique o console.');
        }
      });
  }

  //não utilizado no momento
  // editarNotaFinal(nota: any) {
  //   const token = localStorage.getItem('id_token');
  //   const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
  //   const matricula = this.colaboradorSelecionado?.matricula;

  //   if (!matricula) {
  //     alert('Selecione um colaborador antes de editar uma avaliação.');
  //     return;
  //   }

  //   // 🔹 Busca em paralelo os dois tipos de avaliações
  //   const comportamental$ = this.http.get(`${this.baseUrl}/avaliacoes/comportamental?matricula=${matricula}`, { headers });
  //   const desafio$ = this.http.get(`${this.baseUrl}/avaliacoes/desafio?matricula=${matricula}`, { headers });

  //   Promise.all([comportamental$.toPromise(), desafio$.toPromise()])
  //     .then(([comportamental, desafios]: any) => {
  //       // 🔍 Filtra avaliações da data correspondente à nota final selecionada
  //       const dataRef = nota.data_calculo; // a data da nota final
  //       const compFiltradas = comportamental.filter((c: any) => c.data_avaliacao === dataRef);
  //       const desFiltradas = desafios.filter((d: any) => d.data_avaliacao === dataRef);

  //       if (compFiltradas.length === 0 && desFiltradas.length === 0) {
  //         alert('Nenhuma avaliação encontrada para esta data.');
  //         return;
  //       }

  //       console.log('✅ Avaliações carregadas para edição:', {
  //         comportamental: compFiltradas,
  //         desafios: desFiltradas
  //       });

  //       const dialogRef = this.dialog.open(AvaliacaoEditFormComponent, {
  //         width: '600px',
  //         data: {
  //           id: nota.id,
  //           matricula,
  //           data_avaliacao: dataRef,
  //           comportamental: compFiltradas.map((c: any) => ({
  //             numero_questao: c.numero_questao,
  //             descricao: c.descricao,
  //             nota: c.nota
  //           })),
  //           desafios: desFiltradas.map((d: any) => ({
  //             numero_desafio: d.numero_desafio,
  //             descricao: d.descricao,
  //             nota: d.nota
  //           }))
  //         }
  //       });

  //       dialogRef.afterClosed().subscribe((result) => {
  //         if (result) {
  //           this.carregarNotasFinais(matricula);
  //         }
  //       });
  //     })
  //     .catch((err) => {
  //       console.error('❌ Erro ao carregar avaliações para edição:', err);
  //       alert('Erro ao buscar dados da avaliação. Veja o console.');
  //     });
  // }
  editarComportamental(item: any) {
    const matricula = this.colaboradorSelecionado?.matricula;
    const data_avaliacao = item.data_avaliacao;
    const id = item.avaliacao_comportamental_id;

    if (!matricula || !data_avaliacao || !id) {
      alert('Dados insuficientes para editar.');
      return;
    }

    const token = localStorage.getItem('id_token');
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });

    // 1️⃣ Busca todas as questões da mesma avaliação
    this.http.get<any[]>(`${this.baseUrl}/avaliacoes/comportamental?matricula=${matricula}`, { headers })
      .subscribe({
        next: (res: any[]) => {
          const questoesDaAvaliacao = res.filter(c => c.avaliacao_comportamental_id === id);

          if (questoesDaAvaliacao.length === 0) {
            alert('Nenhuma avaliação comportamental encontrada.');
            return;
          }

          // 2️⃣ Abre prompts para editar cada questão
          const questoesEditadas = JSON.parse(JSON.stringify(questoesDaAvaliacao));
          questoesEditadas.forEach((q:any) => {
            const novaNota = prompt(`Nota para "${q.descricao}" (atual: ${q.nota})`, q.nota);
            if (novaNota !== null) q.nota = parseFloat(novaNota);
          });

          // 3️⃣ Monta o body completo
          const body = {
            matricula,
            data_avaliacao,
            comportamental: questoesEditadas.map((q: any) => ({
              numero_questao: q.numero_questao,
              descricao: q.descricao,
              nota: q.nota
            }))
          };

          // 4️⃣ Envia PUT
          this.http.put(`${this.baseUrl}/avaliacoes/${id}`, body, { headers })
            .subscribe({
              next: () => {
                alert('✅ Avaliação comportamental atualizada com sucesso!');
                this.carregarAvaliacoes(matricula);
              },
              error: (err) => {
                console.error('❌ Erro ao atualizar avaliação comportamental:', err);
                alert('Erro ao atualizar avaliação. Veja o console.');
              }
            });
        },
        error: (err) => {
          console.error('❌ Erro ao buscar avaliação comportamental:', err);
          alert('Erro ao buscar dados. Veja o console.');
        }
      });
  }


  editarDesafio(item: any) {
    const matricula = this.colaboradorSelecionado?.matricula;
    const data_avaliacao = item.data_avaliacao;
    const id = item.avaliacao_desafio_id;

    if (!matricula || !data_avaliacao || !id) {
      alert('Dados insuficientes para editar.');
      return;
    }

    const token = localStorage.getItem('id_token');
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });

    // 1️⃣ Busca todos os desafios da mesma avaliação
    this.http.get<any[]>(`${this.baseUrl}/avaliacoes/desafio?matricula=${matricula}`, { headers })
      .subscribe({
        next: (res: any[]) => {
          const desafiosDaAvaliacao = res.filter(d => d.avaliacao_desafio_id === id);

          if (desafiosDaAvaliacao.length === 0) {
            alert('Nenhum desafio encontrado para esta avaliação.');
            return;
          }

          // 2️⃣ Abre um modal com todos os desafios
          const desafiosEditados = JSON.parse(JSON.stringify(desafiosDaAvaliacao)); // cópia
          desafiosEditados.forEach((d:any) => {
            const novaNota = prompt(`Nota para "${d.descricao}" (atual: ${d.nota})`, d.nota);
            if (novaNota !== null) d.nota = parseFloat(novaNota);
          });

          // 3️⃣ Monta o body completo
          const body = {
            matricula,
            data_avaliacao,
            desafios: desafiosEditados.map((d:any) => ({
              numero_desafio: d.numero_desafio,
              descricao: d.descricao,
              nota: d.nota
            }))
          };

          // 4️⃣ Envia PUT
          this.http.put(`${this.baseUrl}/avaliacoes/${id}`, body, { headers })
            .subscribe({
              next: () => {
                alert('✅ Avaliação de desafios atualizada com sucesso!');
                this.carregarAvaliacoes(matricula);
              },
              error: (err) => {
                console.error('❌ Erro ao atualizar desafios:', err);
                alert('Erro ao atualizar desafios. Veja o console.');
              }
            });
        },
        error: (err) => {
          console.error('❌ Erro ao buscar desafios:', err);
          alert('Erro ao buscar desafios. Veja o console.');
        }
      });
  }




  listarColaboradores() {
    this.colaboradoresService.listar().subscribe({
      next: (data) => {
        this.colaboradoresArray = Array.isArray(data) ? data : [];
      },
      error: (err) => {
        console.error('❌ Erro ao buscar colaboradores:', err);
      }
    });
  }

  adicionarColaborador() {
    const dialogRef = this.dialog.open(ColaboradorFormComponent, { width: '400px' });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) this.listarColaboradores();
    });
  }

  editarColaborador(colab: any) {
    const dialogRef = this.dialog.open(ColaboradorFormComponent, {
      width: '400px',
      data: colab
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) this.listarColaboradores();
    });
  }

  excluirColaborador(colab: any) {
    const confirmar = confirm(`Deseja excluir ${colab.nome}?`);
    if (confirmar) {
      this.colaboradoresService.deletar(colab.matricula).subscribe({
        next: () => {
          this.colaboradoresArray = this.colaboradoresArray.filter(
            (c) => c.matricula !== colab.matricula
          );
          alert('Colaborador removido com sucesso!');
        },
        error: (err) => {
          console.error('❌ Erro ao excluir colaborador:', err);
          alert('Erro ao excluir colaborador. Verifique o console.');
        }
      });
    }
  }

  selecionarColaborador(colab: any) {
    this.colaboradorSelecionado = colab;
    this.carregarAvaliacoes(colab.matricula);
  }

  alterarAba(novaAba: 'comportamental' | 'desafio' | 'notas_finais') {
    this.aba = novaAba;

    // Quando muda para "notas_finais", carrega as notas
    if (novaAba === 'notas_finais' && this.colaboradorSelecionado) {
      this.carregarNotasFinais(this.colaboradorSelecionado.matricula);
    }
  }

  carregarAvaliacoes(matricula: string) {
    this.carregandoAvaliacoes = true;
    this.avaliacoesArray = [];
    this.avaliacaoSelecionada = null;

    const token = localStorage.getItem('id_token');
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });

    const endpoint =
      this.aba === 'desafio'
        ? `${this.baseUrl}/avaliacoes/mediaFinalDesafio?matricula=${matricula}`
        : `${this.baseUrl}/avaliacoes/mediaFinalComportamental?matricula=${matricula}`;

    this.http.get(endpoint, { headers }).subscribe({
      next: (res: any) => {
        this.avaliacoesArray = Array.isArray(res) ? res : [res];
        if (this.avaliacoesArray.length > 0) {
          this.avaliacaoSelecionada = this.avaliacoesArray[0];
        }
        this.carregandoAvaliacoes = false;
      },
      error: (err) => {
        console.error(`❌ Erro ao carregar avaliações (${this.aba}):`, err);
        this.carregandoAvaliacoes = false;
      }
    });
  }

  atualizarLista() {
    this.listarColaboradores();
    if (this.colaboradorSelecionado) {
      this.carregarAvaliacoes(this.colaboradorSelecionado.matricula);
    }
  }

  novaAvaliacao(tipo: 'comportamental' | 'desafio') {
    alert(`Nova avaliação ${tipo}`);
  }
  abrirCadastroAvaliacao() {
    if (!this.colaboradorSelecionado) {
      alert('Selecione um colaborador antes de cadastrar uma avaliação.');
      return;
    }

    const dialogRef = this.dialog.open(AvaliacaoFormComponent, {
      width: '600px',
      data: { matricula: this.colaboradorSelecionado.matricula }
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.carregarAvaliacoes(this.colaboradorSelecionado.matricula);
      }
    });
  }
  notasFinaisArray: any[] = [];



  carregarNotasFinais(matricula: string) {
    const token = localStorage.getItem('id_token');
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });

    this.http.get(`${this.baseUrl}/notas_finais/colaborador?matricula=${matricula}`, { headers })
      .subscribe({
        next: (res: any) => {
          this.notasFinaisArray = Array.isArray(res) ? res : [res];
          console.log('📊 Notas finais carregadas:', this.notasFinaisArray);
        },
        error: (err) => {
          console.error('❌ Erro ao carregar notas finais:', err);
        }
      });
  }

}
