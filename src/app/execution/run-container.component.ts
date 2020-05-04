import { Component, OnInit, OnDestroy } from '@angular/core';
import { MultilayerCognitiveConceptState } from './state';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Store, select } from '@ngrx/store';
import * as fromNetwork from '../network/state';
import { take, takeWhile } from 'rxjs/operators';

@Component({
  selector: 'app-run-container',
  templateUrl: './run-container.component.html',
  styleUrls: ['./run-container.component.css']
})
export class RunContainerComponent implements OnInit {
  private states: MultilayerCognitiveConceptState[];
  private netName: string;
  private componentActive: boolean = true;
  private genCt: number;

  constructor(private store: Store<fromNetwork.NetworkState>, private http: HttpClient) { }

  ngOnInit() {
    this.store.pipe(select(fromNetwork.getNetworkName), take(1)).subscribe(name => { 
      this.netName = name;
    });
    this.store.pipe(select(fromNetwork.getNetworkName), takeWhile(() => this.componentActive)).subscribe(name => this.netName = name);
  } 

  ngOnDestroy() {
    this.componentActive = false;
  }

  runNetwork() {
    console.log('in run with generation ' + this.genCt + ' ' + this.netName);
    if (this.netName === '') {
      return;
    }
    
    let xUrl = '/' + this.netName + '/execute?generations=' + this.genCt.toFixed();
    console.log(environment.apiUrl + xUrl);
    this.http.get(environment.apiUrl + xUrl, {
      headers: new HttpHeaders({
        'X-Version': '1.0'
      })
    }).subscribe((data: any[]) => {
      console.log(data);
      this.states = <MultilayerCognitiveConceptState[]>data;
    });

  }

}
