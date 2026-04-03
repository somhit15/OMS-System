import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { User, AuthResponse, UserRole } from '../../shared/models/user.model';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {
    const token = localStorage.getItem('token');
    if (token) {
      this.decodeAndSetUser(token);
    }
  }

  public get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  public get isAdmin(): boolean {
    return this.currentUserValue?.role === UserRole.ADMIN;
  }

  login(username: string, password: string): Observable<AuthResponse> {
    const body = new URLSearchParams();
    body.set('username', username);
    body.set('password', password);

    const options = {
      headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
    };

    return this.http.post<AuthResponse>(`${environment.apiUrl}/auth/login`, body.toString(), options).pipe(
      tap(res => {
        localStorage.setItem('token', res.access_token);
        this.decodeAndSetUser(res.access_token);
      })
    );
  }

  logout() {
    localStorage.removeItem('token');
    this.currentUserSubject.next(null);
  }

  private decodeAndSetUser(token: string) {
    try {
      const decoded: any = jwtDecode(token);
      // In a real app, we might need an extra API call to get full user details
      // But for now, we'll mock it or rely on token payload if it has role info
      // Since our token payload only has 'sub', we'll need an endpoint to get user profile
      // For now, I'll mock the role based on sub or just assume user for now.
      // Wait, let me add role to the token in the backend!
      
      this.currentUserSubject.next({
        id: decoded.sub,
        username: '', // would be better to have this in token or profile
        role: decoded.role || UserRole.USER,
        is_active: true
      });
    } catch (e) {
      this.logout();
    }
  }
}
