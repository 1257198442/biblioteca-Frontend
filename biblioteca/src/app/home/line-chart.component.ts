import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ChartDataset, ChartOptions } from 'chart.js';

@Component({
  selector: 'app-your-component',
  template: `
    <style>
      .box{
        padding: 20px;
      }
      p{
        font-size: 20px;
      }
    </style>
    <div *ngIf="data && data.list" class="box">
      <p>{{data.title}}</p>
      <div class="chart-container">
        <canvas baseChart
                [datasets]="lineChartData"
                [labels]="lineChartLabels"
                [options]="lineChartOptions"
                [legend]="lineChartLegend"
                type="line">
        </canvas>
      </div>
    </div>
  `,
  styles: [`
    .chart-container {
      width: 100%;
      height: 300px;
    }
  `]
})
export class LineChartComponent  {
  public lineChartData: ChartDataset[] = [
    { data: [], label: 'Monthly Lending Counts', borderColor: '#3BAFBE', backgroundColor: '#FFD166',pointBackgroundColor:"#FFD166"}
  ];
  public lineChartLabels:string[]= [];
  public lineChartOptions: ChartOptions = {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true
      }
    }
  };
  public lineChartLegend = true;


  constructor(@Inject(MAT_DIALOG_DATA) public data: { title:"",list: number[] ,label:string[]}) {
    if (data && data.list) {
      this.lineChartData[0].data = data.list;
      this.lineChartLabels = this.data.label;
    }
  }
}
