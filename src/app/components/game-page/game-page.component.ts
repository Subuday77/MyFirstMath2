import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { Action } from 'src/app/models/action';
import { ServiceService } from 'src/app/service.service';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-game-page',
  templateUrl: './game-page.component.html',
  styleUrls: ['./game-page.component.css']
})
export class GamePageComponent implements OnInit {

  constructor(private spinner: NgxSpinnerService, private router: Router, private service: ServiceService, private cdr: ChangeDetectorRef) { }

  ngAfterContentChecked(): void {
    this.cdr.detectChanges();
  }

  username: string;
  actions = new Array<Action>();
  points: number = 0;
  pointsWord: string = "очков.";
  answersWord: string = "х ответов"
  allowNegative: boolean = false;
  taskToDo: string = "";
  correctResult: number;
  result: string = "";
  answersCounter: number = 0;
  commonCounter: number = 0;
  isAnswerGiven: boolean = false;
  isAnswerCorrect: number = -1;
  upToStar: number = 20;
  starsArray = [];


  ngOnInit(): void {
    if (this.service.username != undefined && this.service.username != "" && this.service.username != null) {
      this.username = this.service.username;
      this.service.username = undefined;
    } else {
      this.router.navigate(['']);
    }
    this.createActions();
  }

  createActions() {
    this.actions = new Array();
    var actionNames = ["Сложение", "Вычитание", "Умножение", "Деление"];
    actionNames.forEach(name => {
      var temp = new Action();
      switch (name) {
        case "Сложение":
          temp.isSelected = true;
          temp.name = name;
          temp.bonus = 1;
          temp.fee = 3;
          temp.sign = "+";
          temp.maxFirstNum = 50;
          temp.maxSecondNum = 50;
          break;
        case "Вычитание":
          temp.isSelected = true;
          temp.name = name;
          temp.bonus = 1;
          temp.fee = 2;
          temp.sign = "-";
          temp.maxFirstNum = 100;
          temp.maxSecondNum = 100;
          break;
        case "Умножение":
          temp.isSelected = false;
          temp.name = name;
          temp.bonus = 2;
          temp.fee = 1;
          temp.sign = "*";
          temp.maxFirstNum = 10;
          temp.maxSecondNum = 10;
          break;
        case "Деление":
          temp.isSelected = false;
          temp.name = name;
          temp.bonus = 3;
          temp.fee = 1;
          temp.sign = "/";
          temp.maxFirstNum = 100;
          temp.maxSecondNum = 10;
          break;
        default:
          break;
      }
      this.actions.push(temp);
    });
  }
  generateTask() {
    if (this.actions.every(x => x.isSelected === false)) {
      Swal.fire({
        title: "Выбери хотя бы одно действие!",
        confirmButtonColor: "#4F7A8C",
        icon: 'warning',
        confirmButtonText: 'OK'
      });
      return false;
    }
    this.points = this.isAnswerGiven || this.taskToDo === "" ? this.points : this.points - 2;
    var actualActions = [];
    this.result = "";
    this.isAnswerGiven = false;
    this.isAnswerCorrect = -1;
    this.actions.forEach(action => {
      if (action.isSelected) {
        actualActions.push(action);
      }
    });
    this.taskToDo = this.buildExpression(actualActions[Math.random() * actualActions.length | 0]);
  }

  buildExpression(action: Action) {
    var num1 = Math.random() * action.maxFirstNum | 0;
    var num2 = Math.random() * action.maxSecondNum | 0;
    var actionSign = action.sign;
    if (action.sign === "*") {
      actionSign = "×"
    }
    if (action.sign === "/") {
      actionSign = "÷"
    }
    while (!this.checkExpression(num1, num2, action.sign)) {
      var num1 = Math.random() * action.maxFirstNum | 0;
      var num2 = Math.random() * action.maxSecondNum | 0;
    }
    var expressionString = num1.toString() + " " + actionSign + " " + num2.toString() + " ="
    this.correctResult = eval(num1 + action.sign + num2);
    return expressionString
  }

  checkExpression(num1: number, num2: number, actionSign: string) {
    switch (actionSign) {
      case "+":
        return true;
      case "-":
        return this.allowNegative === false && num2 > num1 ? false : true;
      case "*":
        return true;
      case "/":
        if (num2 === 0) {
          return false;
        }
        if (num1 / num2 != Math.floor(num1 / num2)) {
          return false;
        }
        return true;
      default:
        return true;
    }
  }
  checkInput() {
    if (Number.isNaN(parseInt(this.result)) && this.result.length > 0) {
      this.result = "";
      return false;
    }
    if (Number.parseInt(this.result).toString().length != this.result.length && this.result.length > 0) {
      this.result = "";
      return false;
    }
  }
  checkAnswer() {
    if (this.result.length === 0) {
      Swal.fire({
        title: "Пожалуйста, дай ответ!",
        confirmButtonColor: "#4F7A8C",
        icon: 'warning',
        confirmButtonText: 'OK'
      });
      this.clearResult();
      return false;
    }
    if (Number.isNaN(parseInt(this.result))) {
      Swal.fire({
        title: "В ответе используй только цифры!",
        confirmButtonColor: "#4F7A8C",
        icon: 'warning',
        confirmButtonText: 'OK'
      });
      this.clearResult();
      return false;
    }
    if (Number.parseInt(this.result).toString().length != this.result.length && this.result.length > 0) {
      Swal.fire({
        title: "В ответе используй только цифры!",
        confirmButtonColor: "#4F7A8C",
        icon: 'warning',
        confirmButtonText: 'OK'
      });
      this.clearResult();
      return false;
    }
    var actionSign = this.taskToDo.split(" ")[1].trim();
    if (actionSign === "×") {
      actionSign = "*"
    }
    if (actionSign === "÷") {
      actionSign = "/";
    }
    this.actions.forEach(action => {
      if (actionSign === action.sign) {
        if (Number.parseInt(this.result) === this.correctResult) {
          this.points = this.points + action.bonus;
          this.answersCounter++;          
          if (this.upToStar === this.answersCounter) {
            this.starsArray.push("star");
          }
          this.upToStar = this.upToStar === this.answersCounter ? this.upToStar * 2 : this.upToStar;
          this.isAnswerCorrect = 0;
          this.resultAnimation(action.bonus);
        } else {
          this.points = this.points - action.fee;
          this.isAnswerCorrect = 1;
          this.resultAnimation(-action.fee);
        }
      }
    });
    var leftToStar = (this.upToStar - this.answersCounter).toString();
    if (leftToStar.endsWith("1") && !leftToStar.endsWith("11")) {
      this.answersWord = "й ответ";
    } else if (leftToStar.endsWith("2") && !leftToStar.endsWith("12") || leftToStar.endsWith("3") && !leftToStar.endsWith("13") || leftToStar.endsWith("4") && !leftToStar.endsWith("14")) {
      this.answersWord = "х ответа";
    }
    else {
      this.answersWord = "х ответов";
    }
    this.commonCounter++;
    this.isAnswerGiven = true;
    var pointsQuantity = this.points.toString();
    if (pointsQuantity.endsWith("1") && !pointsQuantity.endsWith("11")) {
      this.pointsWord = "очко."
    }
    else if (pointsQuantity.endsWith("2") && !pointsQuantity.endsWith("12") || pointsQuantity.endsWith("3") && !pointsQuantity.endsWith("13") || pointsQuantity.endsWith("4") && !pointsQuantity.endsWith("14")) {
      this.pointsWord = "очка."
    }
    else {
      this.pointsWord = "очков."
    }
  }

  clearResult() {
    this.result = "";
  }

  placeAnswer() {
    var temp = {};
    if (this.taskToDo.length === 8) {
      temp = { 'left': '230px' };
    }
    if (this.taskToDo.length === 7) {
      temp = { 'left': '200px' };
    }
    return temp;
  }
  resultAnimation(number: number) {
    if (number > 0) {
      Swal.fire({
        title: `<p style="font-size:300%;color:black;text-align:center;-webkit-text-stroke: 2px rgb(255, 255, 255);">+` + number + `</p>`,
        toast: true,
        showConfirmButton: false,
        width: 250,
        timer: 1500,
        background: 'green',
        showClass: {
          popup: 'animate__animated animate__fadeInUp'
        },
        hideClass: {
          popup: 'animate__animated animate__fadeOut'
        }
      });
    } else {
      Swal.fire({
        title: `<p style="font-size:300%;color:black;text-align:center;-webkit-text-stroke: 2px rgb(255, 255, 255);">` + number + `</p>`,
        toast: true,
        showConfirmButton: false,
        width: 250,
        timer: 1000,
        background: 'red',
        showClass: {
          popup: 'animate__animated animate__fadeInDown'
        },
        hideClass: {
          popup: 'animate__animated animate__fadeOut'
        }
      });
    }
  }
  answerBackground() {
    return this.isAnswerCorrect === 0 ? { 'background-color': 'green' } : this.isAnswerCorrect === 1 ? { 'background-color': 'red' } : {};
  }
  out() {
    Swal.fire({
      title: 'Уверен?',
      confirmButtonColor: "#4F7A8C",
      confirmButtonText: 'Да!',
      showDenyButton: true,
      denyButtonText: 'Нет',
      showClass: {
        popup: 'animate__animated animate__jackInTheBox'
      },
      hideClass: {
        popup: 'animate__animated animate__rollOut'
      }
    }).then(async (result)=>{
      if (result.isConfirmed) {
        await this.delay(1000);
        this.navigate();
      }
    });
  }
  navigate() {
    this.router.navigate(['']);
  }
  delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
