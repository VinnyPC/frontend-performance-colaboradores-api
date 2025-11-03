import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { environment } from '../../evironments/environment.prod';

@Injectable({ providedIn: 'root' })
export class ColaboradoresService {
    private baseUrl = environment.apiUrl;

    constructor(private http: HttpClient) { }

    atualizar(matricula: string, data: any) {
        
        const token = localStorage.getItem('id_token');
        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        });


        const payload = { ...data };
        delete payload.id;

        console.log('📦 Enviando PUT para:', `${this.baseUrl}/colaboradores?matricula=${matricula}`);
        console.log('🧾 Corpo enviado:', JSON.stringify(payload, null, 2));

        return this.http.put(`${this.baseUrl}/colaboradores?matricula=${matricula}`, payload, { headers });
    }



    listar() {
        const token = localStorage.getItem('id_token'); // ✅ usa o idToken do Cognito
        if (!token) {
            console.warn('⚠️ Nenhum token encontrado no localStorage!');
        }

        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` // 🔐 adiciona o token
        });

        console.log('📡 Enviando requisição GET para:', `${this.baseUrl}/colaboradores`);

        return this.http.get(`${this.baseUrl}/colaboradores`, { headers }).pipe(
            catchError(err => {
                console.error('❌ Erro ao listar colaboradores:', err);
                if (err.status === 401) {
                    console.warn('🔒 Token inválido ou expirado. Redirecionar para login?');
                }
                return throwError(() => err);
            })
        );
    }

    criar(data: any) {
        const token = localStorage.getItem('id_token');
        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        });

        console.log('📤 Enviando POST:', data);

        return this.http.post(`${this.baseUrl}/colaboradores`, data, { headers }).pipe(
            catchError(err => {
                console.error('❌ Erro ao criar colaborador:', err);
                return throwError(() => err);
            })
        );
    }
    deletar(matricula: string) {
        const token = localStorage.getItem('id_token');
        const headers = new HttpHeaders({
            Authorization: `Bearer ${token}`
        });

        // 👉 endpoint tipo /colaboradores?matricula=161020
        return this.http.delete(`${this.baseUrl}/colaboradores?matricula=${matricula}`, { headers });
    }
}
