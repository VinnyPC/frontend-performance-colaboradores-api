// import { Injectable } from '@angular/core';
// import { HttpClient, HttpHeaders } from '@angular/common/http';
// import { catchError, throwError } from 'rxjs';

// @Injectable({ providedIn: 'root' })
// export class AvaliacoesService {

//     carregarAvaliacoes(matricula: string) {
//         this.carregandoAvaliacoes = true;
//         this.avaliacoesArray = [];

//         const token = localStorage.getItem('id_token');
//         const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });

//         this.http.get(
//             `https://097o2hnb48.execute-api.us-east-1.amazonaws.com/dev/notas_finais/colaborador?matricula=${matricula}`,
//             { headers }
//         ).subscribe({
//             next: (res: any) => {
//                 this.avaliacoesArray = Array.isArray(res) ? res : [res];
//                 console.log('📊 Avaliações carregadas:', this.avaliacoesArray);
//                 this.carregandoAvaliacoes = false;
//             },
//             error: (err) => {
//                 console.error('❌ Erro ao carregar avaliações:', err);
//                 this.carregandoAvaliacoes = false;
//             }
//         });
//     }
// }
