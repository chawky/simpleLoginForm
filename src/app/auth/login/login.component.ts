import {afterNextRender, Component, DestroyRef, inject, OnDestroy, viewChild} from '@angular/core';
import {FormsModule, NgForm} from "@angular/forms";
import {debounceTime} from "rxjs";

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  imports: [
    FormsModule
  ]
})
export class LoginComponent implements OnDestroy{
  email: string = '';
  password: string = '';
  form = viewChild.required<NgForm>('form');
  destroyRef = inject(DestroyRef)

  constructor() {
    afterNextRender(() => {
      const savedForm = window.localStorage.getItem('saved-login-form');
      if (savedForm) {
        setTimeout(()=>{
          this.form().controls['email'].setValue(JSON.parse(savedForm).email)
        },1)
      }
      const formSub = this.form()?.valueChanges?.pipe(debounceTime(500))
      .subscribe({
        next: (val) => {
          window.localStorage.setItem('saved-login-form', JSON.stringify({email: val.email}))
        }
      })
      this.destroyRef.onDestroy(() => {

        formSub?.unsubscribe
      })
    });
  }


  handleLogin(form: NgForm) {
    if (!form.valid) {
      window.alert("invalid credentials")
    }
    this.email = form.value.email;
    this.password = form.value.password;

    form.resetForm();

  }

  ngOnDestroy() {
    localStorage.removeItem('saved-login-form');
  }
}
