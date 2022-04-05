import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ServiceService } from 'src/app/service.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css']
})
export class LoginPageComponent implements OnInit {

  constructor(private spinner: NgxSpinnerService, private router: Router, private service: ServiceService) { }

  ngOnInit(): void {
    this.requestUsername();
  }

  async requestUsername() {
  const { value: username } = await Swal.fire({
    title: 'Как тебя зовут?',
    input:'text',
    icon: 'question',
    confirmButtonColor: "#4F7A8C",
    confirmButtonText: 'OK',
    allowEscapeKey:false,
    allowOutsideClick:false,
    backdrop:false,
    inputValidator: (value) => {
      if (!value) {
        return 'Представься, пожалуйста!'
      }
    }
  });
  Swal.fire({
    title: 'Привет, '+ username + "!",
    html: 'Поиграем?',
    confirmButtonColor: "#4F7A8C",
    confirmButtonText: 'Да!',
    showDenyButton: true,
    denyButtonText: 'Нет',
    allowEscapeKey:false,
    allowOutsideClick:false,
    backdrop:false
  }).then((result)=>{
    if (result.isDenied) {
      this.requestUsername();
    } else {
      this.service.username = username.trim();
      this.navigate();
    }
  });
}
  navigate(){
    this.router.navigate(['game-page']);
  }
}
