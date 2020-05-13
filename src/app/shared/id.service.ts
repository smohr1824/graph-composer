import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class IdService {
  private static aspectNextId: number = 0;
  private static actorNextId: number = 0;
  private static edgeNextId: number = 0;

  constructor() { }

  nextAspectId():number {
    return IdService.aspectNextId++;
  }

  nextActorId(): number {
    return IdService.actorNextId++;
  }

  nextEdgeId(): number {
    return IdService.edgeNextId++;
  }
}
