import { Injectable } from '@angular/core';
import {
    AuthenticationDetails,
    CognitoUser,
    CognitoUserAttribute,
    CognitoUserPool
} from 'amazon-cognito-identity-js';

const poolData = {
    UserPoolId: 'us-east-1_XXXXXXXXX', // 👉 seu User Pool ID
    ClientId: '3df0upk6ght86thjidjds4p82b' // 👉 seu App Client ID (sem secret)
};



const userPool = new CognitoUserPool(poolData);

@Injectable({ providedIn: 'root' })
export class AuthService {

    // 🔐 Fazer login
    login(username: string, password: string): Promise<any> {
        const authDetails = new AuthenticationDetails({
            Username: username,
            Password: password
        });

        const user = new CognitoUser({
            Username: username,
            Pool: userPool
        });
 
        user.setAuthenticationFlowType('USER_PASSWORD_AUTH');

        return new Promise((resolve, reject) => {
            user.authenticateUser(authDetails, {
                onSuccess: (result) => {
                    const accessToken = result.getAccessToken().getJwtToken();
                    const idToken = result.getIdToken().getJwtToken();
                    const refreshToken = result.getRefreshToken().getToken();

                    // 💾 Salva os tokens localmente
                    localStorage.setItem('access_token', accessToken);
                    localStorage.setItem('id_token', idToken);
                    localStorage.setItem('refresh_token', refreshToken);

                    resolve(result);
                },
                onFailure: (err) => reject(err)
            });
        });
    }

    // 🔓 Logout
    logout(): void {
        const user = userPool.getCurrentUser();
        if (user) user.signOut();
        localStorage.clear();
    }

    // ✅ Verifica se usuário está logado
    isLoggedIn(): boolean {
        const token = localStorage.getItem('access_token');
        return !!token;
    }

    // 🪪 Retorna token atual
    getToken(): string | null {
        return localStorage.getItem('access_token');
    }

    signUp(username: string, password: string, email: string): Promise<any> {
        return new Promise((resolve, reject) => {
            const attributeList: CognitoUserAttribute[] = [
                new CognitoUserAttribute({
                    Name: 'email',
                    Value: email
                })
            ];

            userPool.signUp(username, password, attributeList, [], (err, result) => {
                if (err) return reject(err);
                resolve(result?.user);
            });
        });
    }

    confirmSignUp(username: string, code: string): Promise<any> {
        const user = userPool.getCurrentUser() ||
            new CognitoUser({ Username: username, Pool: userPool });

        return new Promise((resolve, reject) => {
            user.confirmRegistration(code, true, (err, result) => {
                if (err) return reject(err);
                resolve(result);
            });
        });
    }
}
