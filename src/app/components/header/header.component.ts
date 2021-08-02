import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  userName = sessionStorage.getItem('userName');
  constructor(private router: Router) { }

  ngOnInit(): void {

  }

  /**
   * Remove the session storage value on logout
  **/
  logout() {
    sessionStorage.removeItem('authorizedUser');
    sessionStorage.removeItem('userName');
    this.router.navigate(['login'])
  }

}
