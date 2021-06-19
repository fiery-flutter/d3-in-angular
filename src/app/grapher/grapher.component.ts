import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import * as d3 from "d3";

interface ForceFlowDatum {
  target: {
    x: number;
    y: number;
  };
  source: {
    x: number;
    y: number;
  };
  left: boolean;
  right: boolean;
}
interface CircleReflexiveDatum extends d3.SubjectPosition {
  id: number;
  reflexive: boolean;
}

const goldenRatio = 1.618;

class EntityRectangle {
  static readonly width: 161.8 = 161.8;
  static readonly height: 100 = 100;
}

@Component({
  selector: "app-grapher",
  templateUrl: "./grapher.component.html",
  styleUrls: ["./grapher.component.scss"],
})
export class GrapherComponent implements OnInit {
  @ViewChild("graphSvg", { static: true })
  graphElementRef!: ElementRef;
  graphElement!: SVGElement;

  constructor() {
    //
  }

  ngOnInit(): void {
    this.graphElement = this.graphElementRef.nativeElement;

    setupGraph(this.graphElement);
  }
}

function setupGraph(baseSvg: SVGElement) {
  // set up SVG for D3
  // Draw using graph provider


  drawD3Chart(baseSvg);
  // drawGraphviz(baseSvg);
}

function drawGraphviz(baseSvg: SVGElement) {
  // graphviz("svg").renderDot("digraph {a -> b}");
  // d3.select(baseSvg).graphviz().renderDot("digraph {a -> b}");
}

function drawD3Chart(baseSvg: SVGElement) {
  const width = 600;
  const height = 300;
  const colors: d3.ScaleOrdinal<string | number, string> = d3.scaleOrdinal(
    d3.schemeCategory10
  );

  const svg: d3.Selection<SVGElement, unknown, null, undefined> = d3
    .select(baseSvg)
    .append("svg")
    .on("contextmenu", () => {
      d3.event.preventDefault();
    })
    .attr("width", width)
    .attr("height", height);

  // set up initial nodes and links
  //  - nodes are known by 'id', not by index in array.
  //  - reflexive edges are indicated on the node (as a bold black circle).
  //  - links are always source < target; edge directions are set by 'left' and 'right'.
  const nodes: CircleReflexiveDatum[] = [
    { id: 0, reflexive: false, x: 100, y: 100 },
    { id: 1, reflexive: true, x: 150, y: 50 },
    { id: 2, reflexive: false, x: 200, y: 100 },
  ];

  let lastNodeId = 2;
  const links = [
    { source: nodes[0], target: nodes[1], left: false, right: true },
    { source: nodes[1], target: nodes[2], left: false, right: true },
  ];

  const gGroup = d3.select(baseSvg).append("g");

  const rectWidth = EntityRectangle.width;
  const rectHeight = EntityRectangle.height;
  const customised: d3.Selection<SVGRectElement, any, null, undefined> = gGroup
    .append("rect")
    .attr("width", rectWidth)
    .attr("height", rectHeight);
}
