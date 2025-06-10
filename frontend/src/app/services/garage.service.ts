import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class GarageService {
  private apiUrl = 'http://localhost:3000';

  constructor(private http: HttpClient, private authService: AuthService) {}

  getGarageCount(): Observable<any> {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser?.email) {
      throw new Error('No user logged in');
    }
    return this.http.post(`${this.apiUrl}/garage/count`, {
      email: currentUser.email,
    });
  }

  addCarToGarage(carData: any): Observable<any> {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser?.email) {
      throw new Error('No user logged in');
    }
    return this.http.post(`${this.apiUrl}/garage/add`, {
      email: currentUser.email,
      carData,
    });
  }

  getGarageCars(): Observable<any> {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser?.email) {
      throw new Error('No user logged in');
    }
    return this.http.post(`${this.apiUrl}/garage/cars`, {
      email: currentUser.email,
    });
  }
}
