import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class IdService {
  private aspectNextId: number = 0;
  private actorNextId: number = 0;
  private edgeNextId: number = 0;

  constructor() { }

  nextAspectId():number {
    return this.aspectNextId++;
  }

  nextActorId(): number {
    return this.actorNextId++;
  }

  nextEdgeId(): number {
    return this.edgeNextId++;
  }
}
