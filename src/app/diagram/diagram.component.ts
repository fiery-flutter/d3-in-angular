import {
  AfterContentInit,
  Component,
  ElementRef,
  Input,
  OnChanges,
  OnInit,
  ViewEncapsulation,
  SimpleChanges,
  ViewChild,
  AfterViewInit,
} from '@angular/core';

import * as d3 from 'd3';

/**
 * Parent element is the html body root page????
 * PElement PDatum
 */
type BaseSvgChartSelection = d3.Selection<SVGSVGElement, number, null, undefined>;


type ChartSize = {
  width: number;
  height: number;
};

@Component({
  selector: 'app-diagram',
  templateUrl: './diagram.component.html',
  styleUrls: ['./diagram.component.scss']
})
export class DiagramComponent implements OnInit, AfterContentInit, AfterViewInit {
  hostElement: HTMLElement; // Native element hosting the SVG container through ElementRef
  altInjectConstructHostElement: HTMLElement;

  // Alt
  @ViewChild('customChart', {
    read: ElementRef,
    static: false,
  })
  chartElement: ElementRef;

  svgChart: BaseSvgChartSelection;

  data;

  constructor(
    public chartElementInject: ElementRef,
  ) {
    this.altInjectConstructHostElement = chartElementInject.nativeElement;

  }

  ngOnInit(): void {

  }


  ngAfterContentInit(): void {




  }

  ngAfterViewInit(): void {

    const viewBoxSize: ChartSize = {
      width: 200,
      height: 100
    }

    const hostElement = this.chartElement.nativeElement;
    this.hostElement = hostElement;

    const chart = setSvgChartDimensions(hostElement, viewBoxSize) as BaseSvgChartSelection;
    this.svgChart = chart;

    const g = addBaseGElement(chart);

    const margin = { left: 10, top: 10, right: 10, bottom: 20 }

    const xScale = d3.scaleLinear()
      .domain([0, 50])
      .range(
        [
          margin.left,
          viewBoxSize.width - margin.right
        ]
      )
      ;

    chart
      .selectAll('circle') // Select all appears to be mandatory. Otherwise ownerDocument null on selection enter() node stacktrace.
      .data([0, 10, 20, 30, 40, 50,])
      .enter() // Should read D3 docs for context. This opaque selection join syntax...
      .append('circle')
      .attr('cx', xScale)
      .attr('cy', 20)
      .attr('r', 5)
      .attr('fill', 'purple')
      ;
  }

}
function createChart() {


}


function setSvgChartDimensions(
  element: HTMLElement = this.hostElement,
  viewBox: ChartSize = {
    width: 200,
    height: 100
  }
): d3.Selection<SVGSVGElement, unknown, null, undefined> {

  // Arbitrary variable declaration as we directly mutate DOM anyway
  const chart: d3.Selection<SVGSVGElement, unknown, null, undefined> = d3.select(element)
    .append('svg')
    .attr('width', '100%')
    .attr('height', '100%')
    .attr('viewBox', `0 0 ${viewBox.width} ${viewBox.height}`)
    ;

  return chart;
}
function addBaseGElement(
  chart: BaseSvgChartSelection = this.svgChart,
): d3.Selection<SVGGElement, number, null, null> {
  return chart.append("g").attr("transform", "translate(0,0)");


}

