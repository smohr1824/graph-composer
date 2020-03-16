import { Component, OnInit } from '@angular/core';
import { Aspect } from './aspect';
import { AspectService } from './aspect.service';

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

}
