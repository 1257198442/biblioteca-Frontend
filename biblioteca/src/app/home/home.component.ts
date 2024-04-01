import {Component, ViewChild} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {endPoints} from "../endPoints";
import {MatDialog} from "@angular/material/dialog";
import {BookPageComponent} from "./book-page/book-page.component";
import {MatSnackBar} from "@angular/material/snack-bar";
import {MatPaginator} from "@angular/material/paginator";
import {Router} from "@angular/router";
import {Borrow} from "../model/borrow.model";
import {DatePipe} from "@angular/common";
import {LineChartComponent} from "./line-chart.component";
import {authService} from "../authService";


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  storedToken:any;
  userTelephone="";
  userAdmin="";
  currentDate: Date = new Date()
  randomBook:any;
  monthAbbreviations: { [key: number]: string } = {
    1: "Jan",
    2: "Feb",
    3: "Mar",
    4: "Apr",
    5: "May",
    6: "Jun",
    7: "Jul",
    8: "Aug",
    9: "Sep",
    10: "Oct",
    11: "Nov",
    12: "Dec"
  };
  lendingStatistics:any;
  currentTime: string = '';
  weather:any;
  weatherImg:string="";
  lendingMonthlyCounts=[];
  lendingWeeklyCounts=[];
  lendingYearlyCounts=[];
  lendingList:Borrow[]=[];
  low=['reference','bookID','limitTime'];
  componentPage = 0;
  totalPages = 1;

  constructor(private http:HttpClient,
              private dialog:MatDialog,
              private snackBar: MatSnackBar,
              private datePipe: DatePipe,
              private user:authService,
              private router:Router,) {
    setInterval(() => {
      this.updateTime();
    }, 1000);

    // setInterval(() => {
    //   this.nextPage();
    // }, 10000);

    setInterval(() => {
      const currentToken = sessionStorage.getItem('jwtToken');
      if (currentToken !== this.storedToken) {
        this.storedToken = currentToken!=null?currentToken:"";
        if(currentToken){
          const [header, payload, signature] = this.storedToken.split('.');
          const decodedPayload = JSON.parse(atob(payload));
          this.userTelephone = decodedPayload.user;
          this.userAdmin = decodedPayload.role;
          if(this.userAdmin=="CLIENT"){
            this.totalPages=2;
            this.getLendingData();
          }
          if (this.isAdmin()){
            this.totalPages=2;
            this.getLendingStatistics();
          }
        }
      }
    }, 1000);
    this.getRandomBook();
    this.getWeather()
  }

  getRandomBook(){
    this.http.get(endPoints.book+"/random").subscribe((data:any)=>{
      this.randomBook = data;
    },error => this.showError(error.status+error.message))
  }

  formatNumber(value: number): string {
    if (value >= 1000) {
      const formattedValue = (value / 1000).toFixed(1);
      return `${formattedValue}k`;
    }
    return value.toString();
  }

  prevPage() {
    this.componentPage = (this.componentPage - 1 + this.totalPages) % this.totalPages;
  }

  nextPage() {
    this.componentPage = (this.componentPage + 1) % this.totalPages;
  }

  openTableOfMonth(){
    if(this.isAdmin()) {
      const title = "Table analyzing this year's data";
      const list = this.lendingMonthlyCounts;
      const label = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      this.openLineChartPage(title,list,label)
    }
  }
  openTableOfWeek(){
    if(this.isAdmin()){
      const  title = "Table analyzing this Week‘s data";
      const list = this.lendingWeeklyCounts;
      const label = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
      this.openLineChartPage(title,list,label)
    }
  }
  openTableOfYear(){
    if(this.isAdmin()){
      const  title = "Table analyzing this Week‘s data";
      const list = this.lendingYearlyCounts;
      const label=this.generateYearArray(this.lendingYearlyCounts.length);
      this.openLineChartPage(title,list,label)
    }
  }

  isAdmin(){
    return this.userAdmin=="ROOT"||this.userAdmin=="ADMINISTRATOR"
  }

  getWeather(){
    this.http.get(endPoints.weather).subscribe((data:any)=>{
      this.weather=data;
      console.log(data)
    },error => this.showError(error.status+error.message))
  }

  updateTime(): void {
    let time = new Date();
    this.currentTime = this.datePipe.transform(time, 'HH:mm:ss')!;
    const currentHour: number = time.getHours();
    if (currentHour >= 5 && currentHour < 10) {
      this.weatherImg="../../assets/image/morning.png"; // 5:00 - 11:59
    } else if (currentHour >= 10 && currentHour < 18) {
      this.weatherImg="../../assets/image/am.png"; // 12:00 - 17:59
    } else if (currentHour >= 18 && currentHour < 21) {
      this.weatherImg="../../assets/image/pm.png"; // 18:00 - 20:59
    } else {
      this.weatherImg="../../assets/image/evening.png"; // 21:00 - 4:59
    }
  }

  generateYearArray(years: number): string[] {
    const currentYear = new Date().getFullYear();
    const startYear = currentYear - years + 1;
    const result = [];
    for (let year = startYear; year <= currentYear; year++) {
      result.push(year.toString());
    }
    return result;
  }

  getLendingStatistics(){
    this.http.get(endPoints.lending + "/lending_statistics",this.user.optionsAuthorization2()).subscribe((data:any)=>{
      this.lendingStatistics = data.body;
    })
    this.http.get(endPoints.lending + "/monthly_counts",this.user.optionsAuthorization2()).subscribe((data:any)=>{
      this.lendingMonthlyCounts = data.body;
    })
    this.http.get(endPoints.lending + "/weekly_counts",this.user.optionsAuthorization2()).subscribe((data:any)=>{
      this.lendingWeeklyCounts = data.body;
    })
    this.http.get(endPoints.lending + "/yearly_counts",this.user.optionsAuthorization2()).subscribe((data:any)=>{
      this.lendingYearlyCounts = data.body;
    })
  }

  getLendingData(){
    this.http.get(endPoints.lending+"/no_return/search?telephone="+encodeURIComponent(this.userTelephone),this.user.optionsAuthorization2())
      .subscribe((data:any)=>{
        this.lendingList=data.body;
      },error => this.showError(error.status+error.message))
  }

  openBookPage(bookId:string){
    this.dialog.open(BookPageComponent,{
      width:"800px",
      minWidth:"800px",
      height:"auto",
      maxHeight:"600px",
      data:{
        bookId:bookId
      }
    })
  }
  openLineChartPage(title:string,list:never[],label:string[]){
    this.dialog.open(LineChartComponent,{
      width:'500px',
      data:{
        title:title,
        list:list,
        label:label
      }
    })
  }


  toBorrowPage(){
    this.router.navigateByUrl('/borrow', { skipLocationChange: true }).then(() => this.router.navigate(['/borrow']));
  }

  public showError(notification: string): void {
    this.snackBar.open(notification, 'Error', {duration: 5000});
  }

}
