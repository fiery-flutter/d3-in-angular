import { Component, OnInit, OnDestroy, AfterContentInit, ElementRef } from '@angular/core';
import { Router } from '@angular/router';

import { ViewChild } from '@angular/core';

import { DonutChartComponent } from './../donut-chart/donut-chart.component';

import * as HOBBITON from './hobbiton.json';
import { ChartControlsService } from '../chart-controls.service';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { getRandomInt } from '../utils/get-random-int';
export class OrderState {
  state: string;
  stateDisplayValue: string;
  count: number;
}


@Component({
  selector: 'app-order-status',
  templateUrl: './order-status.component.html',
  styleUrls: ['./order-status.component.scss']
})
export class OrderStatusComponent implements OnInit, OnDestroy, AfterContentInit {

  @ViewChild('ordersByStatusChart', { static: true }) chart: DonutChartComponent;

  orderStates: OrderState[];

  chartData: number[] = [];

  displayedColumns = ['legend', 'orderStatus', 'total'];

  refreshInterval: NodeJS.Timeout;

  constructor(private router: Router, public chartControlsService: ChartControlsService) { 
    this.chartControlsService.fullScreen = false;

  }

  ngOnInit() {
  }

  initialize() {
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval);
    }
    this.generateData();
    this.chart.data = [...this.chartData];
    this.refreshInterval = setInterval(() => {
      if (document.hasFocus()) {
        this.updateStates();
        this.chart.data = [...this.chartData];
      }
    }, 1000);

  }

  ngOnDestroy() {
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval);
    }
  }

  ngAfterContentInit() {
    this.initialize();
  }

  generateData() {
    this.orderStates = [];
    HOBBITON.orderStates.forEach((state) => {
      const target = new OrderState();
      target.state = state.state;
      target.stateDisplayValue = state.stateDisplayValue;
      target.count = getRandomInt(0, 100);
      this.orderStates.push(target);
    });
    this.chartData = [];
    this.orderStates.forEach((state) => {
      this.chartData.push(state.count);
    });
  }

  updateStates() {
    const increment = (val: number, plus: number, minus: number) => {
      return val + plus - minus;
    }
    const newOrders = getRandomInt(0, 10);
    const newReady = getRandomInt(0, Math.min(10, this.orderStates[0].count));
    const newTransit = getRandomInt(0, Math.min(10, this.orderStates[1].count));
    const newDelivered = getRandomInt(0, Math.min(10, this.orderStates[2].count));
    this.orderStates[0].count = increment(this.orderStates[0].count, newOrders, newReady);
    this.orderStates[1].count = increment(this.orderStates[1].count, newReady, newTransit);
    this.orderStates[2].count = increment(this.orderStates[2].count, newTransit, newDelivered);
    this.orderStates[3].count = increment(this.orderStates[3].count, newDelivered, 0);
    this.chartData = [];
    this.orderStates.forEach((state) => {
      this.chartData.push(state.count);
    });
  }

  navigateLeft() {
    this.router.navigate(['/delivery']);
  }

  navigateRight() {
    this.router.navigate(['/delivery']);
  }

  toggleData(event: MatSlideToggleChange) {
    this.chartControlsService.showData = event.checked;
  }
}
