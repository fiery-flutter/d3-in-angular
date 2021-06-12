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
} from "@angular/core";

import * as d3 from "d3";

/**
 * Parent element is the html body root page????
 * PElement PDatum
 */
type BaseSvgChartSelection = d3.Selection<
  SVGSVGElement,
  number,
  null,
  undefined
>;

type CircleDragEvent = d3.D3DragEvent<
  SVGCircleElement,
  CircleDatum,
  d3.DragBehavior<SVGCircleElement, CircleDatum, unknown>
>;

interface CircleDatum {
  (): number;
  /**
   * Placeholder in case xVal is only for initial data
   * as we likely will not update it every tick like the d3 cX cY positioning
   */
  xVal: number;
  yVal: number;
}
type ChartSize = {
  width: number;
  height: number;
};

type RectangleSelection = d3.Selection<SVGRectElement, number, null, undefined>;

@Component({
  selector: "app-diagram",
  templateUrl: "./diagram.component.html",
  styleUrls: ["./diagram.component.scss"],
})
export class DiagramComponent
  implements OnInit, AfterContentInit, AfterViewInit
{
  hostElement: HTMLElement; // Native element hosting the SVG container through ElementRef
  altInjectConstructHostElement: HTMLElement;

  // Alt
  @ViewChild("customChart", {
    read: ElementRef,
    static: false,
  })
  chartElement: ElementRef;

  svgChart: BaseSvgChartSelection;

  data;

  constructor(public chartElementInject: ElementRef) {
    this.altInjectConstructHostElement = chartElementInject.nativeElement;
  }

  ngOnInit(): void {}

  ngAfterContentInit(): void {}

  ngAfterViewInit(): void {
    const viewBoxSize: ChartSize = {
      width: 600,
      height: 600,
    };

    const hostElement = this.chartElement.nativeElement;
    this.hostElement = hostElement;

    const chart = setSvgChartDimensions(
      hostElement,
      viewBoxSize
    ) as BaseSvgChartSelection;
    this.svgChart = chart;

    const g = addBaseGElement(chart);

    const margin = { left: 10, top: 10, right: 10, bottom: 20 };

    const xScale = d3
      .scaleLinear()
      .domain([0, 50])
      .range([margin.left, viewBoxSize.width - margin.right]);
    chart
      .selectAll("circle") // Select all appears to be mandatory. Otherwise ownerDocument null on selection enter() node stacktrace.
      .data([0, 10, 20, 30, 40, 50])
      .enter() // Should read D3 docs for context. This opaque selection join syntax...
      .append("circle")
      .attr("cx", xScale)
      .attr("cy", 20)
      .attr("r", 5)
      .attr("fill", "purple");

    const rectSize = 150;
    const rectangle: RectangleSelection = chart
      .append("rect")
      // ? Arranging in fifths
      .attr("x", (viewBoxSize.width / 5) * 3)
      .attr("y", viewBoxSize.height / 3)
      .attr("width", rectSize * 1.6)
      .attr("height", rectSize);
  }


}
function createChart() {}

function setSvgChartDimensions(
  element: HTMLElement = this.hostElement,
  viewBox: ChartSize = {
    width: 200,
    height: 100,
  }
): d3.Selection<SVGSVGElement, unknown, null, undefined> {
  // Arbitrary variable declaration as we directly mutate DOM anyway
  const chart: d3.Selection<SVGSVGElement, unknown, null, undefined> = d3
    .select(element)
    .append("svg")
    .attr("width", "100%")
    .attr("height", "100%")
    .attr("viewBox", `0 0 ${viewBox.width} ${viewBox.height}`);
  return chart;
}
function addBaseGElement(
  chart: BaseSvgChartSelection = this.svgChart
): d3.Selection<SVGGElement, number, null, null> {
  return chart.append("g").attr("transform", "translate(0,0)");
}

function dragCircle(event: CircleDragEvent) {
  d3.drag().on("drag", dragCircle);
  // event.;
  // const [(x, y)] = d3.pointer(event, svg.node());
  d3.select(this).attr("transform", `translate(${x},${y})`);
}

function overDragTarget(rect: RectangleSelection, x, y) {
  const rectBounds = rect.node().getBBox();
  return contains(rectBounds, { x: x, y: y });
}

function startDragging(event) {
  const isDragging = true;
  d3.select(this).classed("dragging", isDragging).raise(); // SVG elements don't have a z-index so bring the circle to the top
}

function contains(rect, point) {
  return (
    point.x >= rect.x &&
    point.y >= rect.y &&
    point.x <= rect.x + rect.width &&
    point.y <= rect.y + rect.height
  );
}

function setRectDropTargetStyle(

  rect: RectangleSelection,
  isDraggedOver: boolean
) {
  rect.classed("dropTarget", isDraggedOver);

}


// function endDragging(event) {
//   const isDragging = false;

//   const circle = d3.select(this).classed("dragging", isDragging);

//   setRectDropTargetStyle( ,  isDragging);

//   const [x, y] = d3.pointer(event, svg.node());

//   if (overDragTarget(x, y)) {
//     circle
//       .transition()
//       .attr("r", r * 1.2)
//       .transition()
//       .attr("r", 0);
//   }
// }
