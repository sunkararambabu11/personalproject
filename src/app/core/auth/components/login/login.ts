import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Auth } from '../../auth';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule,RouterModule],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login  implements  OnInit {
 loginForm!: FormGroup;
 loginInfo:any;
 loginErrorMsg:string='';
constructor(private fb: FormBuilder,private readonly auth: Auth, private router: Router,) {

}
ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['' ],
      password: ['']
    });
  }

   onLogin() {
    const request = {
      email: this.loginForm.get('email')?.value,
      password: this.loginForm.get('password')?.value,
    };

    this.auth.login({
      data: {
        body: request
      },
      success: (res: any) => {
        console.log(' Login Success:', res);
        this.loginInfo = res;
        this.loginErrorMsg = this.loginInfo.message || '';

        if(res.user){
          localStorage.setItem('token', res.user.user_id || 'dummy-token'); 
          this.router.navigate(['/home']);
        }
      },
      failure: (error: any) => {
        console.error(' Login Failed:', error);
        this.loginErrorMsg = 'login failed please check credentials';
      }
    });
  }
  onSubmit(){
    this.onLogin();
  }
}