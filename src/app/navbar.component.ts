import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'nav-bar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  navbarOpen = false;


  constructor() { }

  ngOnInit() {
  }
  
  toggleNavbar() {
    this.navbarOpen = !this.navbarOpen;
  }
}
