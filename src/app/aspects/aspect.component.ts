import { Component, OnInit } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AspectService } from '../shared/aspect.service';
import { Aspect } from '../shared/aspect';

@Component({
  selector: 'app-aspect',
  templateUrl: './aspect.component.html',
  styleUrls: ['./aspect.component.css']
})
export class AspectComponent implements OnInit {
  private title: String = 'Aspects';
  private aspects: Aspect[];

  constructor(private aspectService: AspectService) { }

  ngOnInit() {
    this.aspects = this.aspectService.getAspects();
  }

}
