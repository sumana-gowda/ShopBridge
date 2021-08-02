import { Component, OnChanges } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  isUserAuthorized = sessionStorage.getItem('authorizedUser') == '1';
  showHeader: boolean = false;
  title = 'shop-bridge-project';

  constructor(private router: Router) {
    /** On load if user is authorized then load 'home' page
     * else load login page
     */
    if(this.isUserAuthorized) {
      this.router.navigate(['home'])
    } else {
      this.router.navigate(['login'])
    }

    //show header only for loged-in user
    this.router.events.subscribe((event: any) => {
      if (event instanceof NavigationEnd) {
        if (event.url === '/login') {
          this.showHeader= false;
        } else {
          this.showHeader= true;
        }
      }
    });
  }
}
