import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface PorscheModel {
  make: string;
  basemodel: string;
  model: string;
  fueltype: string;
  city_mpg: number;
  highway_mpg: number;
  combined_mpg: number;
  cylinders: number;
  displ: number;
  drive: string;
  transmission: string;
  vclass: string;
  year: number;
}

@Injectable({ providedIn: 'root' })
export class ModelsService {
  private apiUrlBase = 'http://localhost:3000/';

  constructor(private http: HttpClient) {}

  getModels(): Observable<{ success: boolean; models: PorscheModel[] }> {
    return this.http.get<{ success: boolean; models: PorscheModel[] }>(this.apiUrlBase + 'models');
  }

  getBaseModels(): Observable<{ success: boolean; field: string; values: string[] }> {
    return this.http.get<{ success: boolean; field: string; values: string[] }>(this.apiUrlBase + 'fields/base_model');
    
  }

  findModelsByModelName(model: string): Observable<{ success: boolean; results: PorscheModel[] }> {
    return this.http.post<{ success: boolean; results: PorscheModel[] }>(
      this.apiUrlBase + 'models/find',
      { model }
    );
  }
}
