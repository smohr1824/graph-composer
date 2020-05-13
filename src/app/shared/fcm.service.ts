import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { MultilayerCognitiveConceptState } from './cognitivestate';

@Injectable({
  providedIn: 'root'
})
export class FcmService {

  constructor(private http: HttpClient) { }

  loadMap(netName: string, GML: string, existing: boolean): Observable<Object> {
      let exUrl = environment.apiUrl + '/' + netName;
      if (!existing) {
        return this.http.post(exUrl, GML, {
          headers: new HttpHeaders({
            'X-Version': '1.0'
          })});
      } else {
        return this.http.put(exUrl, GML, {
          headers: new HttpHeaders({
            'X-Version': '1.0'
          })});
      }
  }

  runGenerations(netName: string, generations: number): Observable<MultilayerCognitiveConceptState[]> {
    if (netName === '') {
      return;
    }
    
    let xUrl = '/' + netName + '/execute?generations=' + generations.toFixed();
    return this.http.get<MultilayerCognitiveConceptState[]>(environment.apiUrl + xUrl, {
      headers: new HttpHeaders({
        'X-Version': '1.0'
      })
    });
  }

  deleteMapFromServer(netName: string) {
    let exUrl = environment.apiUrl + '/' + netName;
      return this.http.delete(exUrl, {
        headers: new HttpHeaders({
          'X-Version': '1.0'
        })});
  }
}
