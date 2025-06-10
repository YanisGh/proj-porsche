import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface SignupData {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3000';
  private currentUser: any = null;

  constructor(private http: HttpClient) { }

  login(email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/logintest`, { email, password });
  }

  signup(userData: SignupData): Observable<any> {
    return this.http.post(`${this.apiUrl}/signup`, userData);
  }

  getUserBasicData(email: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/user`, { email });
  }

  setCurrentUser(user: any) {
    this.currentUser = user;
  }
  getCurrentUser() {
    return this.currentUser;
  }

  logout() {
    this.currentUser = null;
  }
}