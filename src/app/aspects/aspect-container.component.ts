import { Component, OnInit } from '@angular/core';
import { Aspect } from '../shared/aspect';
import { AspectService } from '../shared/aspect.service';

@Component({
  selector: 'app-aspect-container',
  templateUrl: './aspect-container.component.html',
  styleUrls: ['./aspect-container.component.css']
})
export class AspectContainerComponent implements OnInit {
aspects: Aspect[];
currentAspect: Aspect;

  constructor(private aspectService: AspectService) { }

  ngOnInit() {
    this.aspects = this.aspectService.getAspects();
  }

  selected(aspect: Aspect) {
    this.currentAspect = aspect;
  }

  deleteAspect(id: number) {
    this.aspectService.deleteAspect(id);
    this.aspects = this.aspects.filter((item, _) => item.id != id);
  }

}

