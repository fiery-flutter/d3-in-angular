import {
  Component,
  OnInit,
  ElementRef,
  ViewEncapsulation,
  Input,
  SimpleChanges,
  OnChanges,
} from "@angular/core";

import * as d3 from "d3";

type SomeChartSVGSelection = d3.Selection<
  SVGSVGElement,
  unknown,
  null,
  undefined
>;

type GSelection = d3.Selection<SVGGElement, unknown, null, undefined>;

@Component({
  selector: "app-area-chart",
  encapsulation: ViewEncapsulation.None,
  templateUrl: "./area-chart.component.html",
  styleUrls: ["./area-chart.component.scss"],
})
export class AreaChartComponent implements OnInit, OnChanges {
  @Input() transitionTime = 1000;
  @Input() xmax = 45;
  @Input() ymax = 200;
  @Input() hticks = 60;
  @Input() data: number[];
  @Input() showLabel = 1;
  hostElement: any; // Native element hosting the SVG container
  svg: SomeChartSVGSelection; // Top level SVG element
  g: GSelection;
  colorScale: d3.ScaleOrdinal<string, string>; // D3 color provider
  /**
   * ! Unclear where this typing is from. thresholds(this.x.ticks))
   *
   */
  x: d3.AxisScale<d3.AxisDomain> | d3.ScaleLinear<number, number> | any; // X-axis graphical coordinates d3.ScaleLinear<number, number> |
  y: d3.AxisScale<d3.AxisDomain>; // Y-axis graphical coordinates d3.ScaleLinear<number, number> |
  colors = d3.scaleOrdinal(d3.schemeCategory10);
  bins: any[]; // Array of frequency distributions - one for each area chaer
  paths: any[]; // Path elements for each area chart
  area: d3.Area<[number, number]>; // For D3 area function
  histogram: d3.HistogramGeneratorNumber<number, number>; // For D3 histogram function

  constructor(private elRef: ElementRef) {
    this.hostElement = this.elRef.nativeElement;
  }

  ngOnInit() {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes.data) {
      this.updateChart(changes.data.currentValue);
    }
  }

  private createChart(data: number[]) {
    this.removeExistingChartFromParent();

    this.setChartDimensions();

    this.setColorScale();

    this.addGraphicsElement();

    this.createXAxis();

    this.createYAxis();

    // d3 area and histogram functions  has to be declared after x and y functions are defined
    this.area = d3
      .area()
      .x((datum: any) => this.x(d3.mean([datum.x1, datum.x2])))
      .y0(this.y(0))
      .y1((datum: any) => this.y(datum.length));

    type SomeTickyTypeUndocumented = {
      ticks: (count: number) => number;
    };

    const ticky: SomeTickyTypeUndocumented = this.x;

    this.histogram = d3
      .histogram()
      .value((datum) => datum)
      .domain([0, this.xmax])
      .thresholds(ticky.ticks(this.hticks));

    // data has to be processed after area and histogram functions are defined
    this.processData(data);

    this.createAreaCharts();
  }

  private processData(data: any[]) {
    this.bins = [];
    data.forEach((row: any) => {
      this.bins.push(this.histogram(row));
    });
  }

  private setChartDimensions() {
    let viewBoxHeight = 100;
    let viewBoxWidth = 200;
    this.svg = d3
      .select(this.hostElement)
      .append("svg")
      .attr("width", "100%")
      .attr("height", "100%")
      .attr("viewBox", "0 0 " + viewBoxWidth + " " + viewBoxHeight);
  }

  private addGraphicsElement() {
    this.g = this.svg.append("g").attr("transform", "translate(0,0)");
  }

  private setColorScale() {
    this.colorScale = d3.scaleOrdinal(d3.schemeCategory10);
    // Below is an example of using custom colors
    // this.colorScale = d3.scaleOrdinal().domain(["0","1","2","3"]).range(['#1f77b4', '#ff7f0e', '#2ca02c', '#d62728']);
  }

  private createXAxis() {
    this.x = d3.scaleLinear().domain([0, this.xmax]).range([30, 170]);
    this.g
      .append("g")
      .attr("transform", "translate(0,90)")
      .attr("stroke-width", 0.5)
      .call(
        d3
          .axisBottom(this.x)
          .tickSize(0)
          .tickFormat(<any>"")
      );

    this.g
      .append("g")
      .attr("transform", "translate(0,90)")
      .style("font-size", "6")
      .style("stroke-dasharray", "1,1")
      .attr("stroke-width", 0.1)
      .call(d3.axisBottom(this.x).ticks(10).tickSize(-80));
  }

  private createYAxis() {
    this.y = d3.scaleLinear().domain([0, this.ymax]).range([90, 10]);
    this.g
      .append("g")
      .attr("transform", "translate(30,0)")
      .attr("stroke-width", 0.5)
      .call(
        d3
          .axisLeft(this.y)
          .tickSize(0)
          .tickFormat(<any>"")
      );
    this.g
      .append("g")
      .attr("transform", "translate(30,0)")
      .style("stroke-dasharray", "1,1")
      .attr("stroke-width", 0.1)
      .call(d3.axisLeft(this.y).ticks(4).tickSize(-140))
      .style("font-size", "6");

    if (this.showLabel === 1) {
      this.g
        .append("text")
        .attr("text-anchor", "middle")
        .attr("transform", "translate(10,50) rotate(-90)")
        .style("font-size", 8)
        .text("Frequency");
    }
  }
  private createAreaCharts() {
    this.paths = [];
    this.bins.forEach((row: any, index: number) => {
      this.paths.push(
        this.g
          .append("path")
          .datum(row)
          .attr("fill", this.colorScale("" + index))
          .attr("stroke-width", 0.1)
          .attr("opacity", 0.5)
          .attr("d", (datum: any) => this.area(datum))
      );
    });
  }

  public updateChart(data: number[]) {
    if (!this.svg) {
      this.createChart(data);
      return;
    }

    this.processData(data);

    this.updateAreaCharts();
  }

  private updateAreaCharts() {
    this.paths.forEach((
      path: SomeChartSVGSelection /* ? */,
      index: string | number
    ) => {
      path
        .datum(this.bins[index])
        .transition()
        .duration(this.transitionTime)
        .attr(
          "d",
          d3
            .area()
            .x((datum: any) => this.x(d3.mean([datum.x1, datum.x2])))
            .y0(this.y(0))
            .y1((datum: any) => this.y(datum.length))
        );
    });
  }

  private removeExistingChartFromParent() {
    // !!!!Caution!!!
    // Make sure not to do;
    //     d3.select('svg').remove();
    // That will clear all other SVG elements in the DOM
    d3.select(this.hostElement).select("svg").remove();
  }
}
