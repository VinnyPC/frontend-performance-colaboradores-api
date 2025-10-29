import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class ColaboradoresService {
    private baseUrl = 'https://4y1tibup6h.execute-api.us-east-1.amazonaws.com/dev';

    constructor(private http: HttpClient) { }

    listar() {
        return this.http.get(`${this.baseUrl}/colaboradores`);
    }

    criar(data: any) {
        return this.http.post(`${this.baseUrl}/colaboradores`, data);
    }
}
