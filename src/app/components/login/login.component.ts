import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { userDetail } from 'src/app/app.constant';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginInvalid: boolean = false;
  login: FormGroup;
  userDetail = userDetail;

  constructor(public router: Router) {
    this.login = new FormGroup({
      username: new FormControl(null, [Validators.required]),
      password: new FormControl(null, [Validators.required])
    });
  }

  ngOnInit(): void {
  }

  onSubmit() {
    console.log(this.login.controls.username.value);
    console.log(this.login.controls.password.value);
    if(this.login.controls.username.value == userDetail.username && this.login.controls.password.value == userDetail.password) {
      sessionStorage.setItem('authorizedUser', '1')
      this.loginInvalid = false;
      this.router.navigate(['home']);
    } else {
      this.loginInvalid = true;
    }
  }
}
