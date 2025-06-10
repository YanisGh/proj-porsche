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

  setCurrentUser(user: any) {
    this.currentUser = user;
  }
  getCurrentUser() {
    return this.currentUser;
  }

  logout() {
    this.currentUser = null;
  }
  getGarageCount(): Observable<any> {
    if (!this.currentUser?.email) {
      throw new Error('No user logged in');
    }
    return this.http.post(`${this.apiUrl}/garage/count`, { email: this.currentUser.email });
  }
  addCarToGarage(carData: any): Observable<any> {
    if (!this.currentUser?.email) {
      throw new Error('No user logged in');
    }
    return this.http.post(`${this.apiUrl}/garage/add`, { 
      email: this.currentUser.email, 
      carData 
    });
  }

  getGarageCars(): Observable<any> {
    if (!this.currentUser?.email) {
      throw new Error('No user logged in');
    }
    return this.http.post(`${this.apiUrl}/garage/cars`, { 
      email: this.currentUser.email 
    });
  }
}