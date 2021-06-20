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

interface CustomForceLink {
  source: CircleReflexiveDatum;
  target: CircleReflexiveDatum;
  left: boolean;
  right: boolean;
}

/**
 * d3.SubjectPosition has x y props same as d3.SimulaationNodeDatum
 */
interface CircleReflexiveDatum extends d3.SimulationNodeDatum {
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

  // drawD3Chart(baseSvg);
  // drawGraphviz(baseSvg);
  drawD3ForceDirected();
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

  const links: CustomForceLink[] = [
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

function drawD3ForceDirected() {
  // set up SVG for D3
  const width = 960;
  const height = 500;
  const colors = d3.scaleOrdinal(d3.schemeCategory10);

  const svg = d3
    .select("body")
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
    { id: 0, reflexive: false },
    { id: 1, reflexive: true },
    { id: 2, reflexive: false },
  ];
  let lastNodeId = 2;
  const links: CustomForceLink[] = [
    { source: nodes[0], target: nodes[1], left: false, right: true },
    { source: nodes[1], target: nodes[2], left: false, right: true },
  ];

  // init D3 force layout
  const force = createForceSimulation(width, height, tick);

  // init D3 drag support
  const drag = d3
    .drag()
    // Mac Firefox doesn't distinguish between left/right click when Ctrl is held...
    .filter(() => d3.event.button === 0 || d3.event.button === 2)
    .on("start", (d: any) => {
      if (!d3.event.active) force.alphaTarget(0.3).restart();

      d.fx = d.x;
      d.fy = d.y;
    })
    .on("drag", (d: any) => {
      d.fx = d3.event.x;
      d.fy = d3.event.y;
    })
    .on("end", (d: any) => {
      if (!d3.event.active) force.alphaTarget(0);

      d.fx = null;
      d.fy = null;
    });

  // define arrow markers for graph links
  svg
    .append("svg:defs")
    .append("svg:marker")
    .attr("id", "end-arrow")
    .attr("viewBox", "0 -5 10 10")
    .attr("refX", 6)
    .attr("markerWidth", 3)
    .attr("markerHeight", 3)
    .attr("orient", "auto")
    .append("svg:path")
    .attr("d", "M0,-5L10,0L0,5")
    .attr("fill", "#000");

  svg
    .append("svg:defs")
    .append("svg:marker")
    .attr("id", "start-arrow")
    .attr("viewBox", "0 -5 10 10")
    .attr("refX", 4)
    .attr("markerWidth", 3)
    .attr("markerHeight", 3)
    .attr("orient", "auto")
    .append("svg:path")
    .attr("d", "M10,-5L0,0L10,5")
    .attr("fill", "#000");

  // line displayed when dragging new nodes
  const dragLine = svg
    .append("svg:path")
    .attr("class", "link dragline hidden")
    .attr("d", "M0,0L0,0");

  // handles to link and node element groups
  let path = svg.append("svg:g").selectAll("path");
  let circle = svg.append("svg:g").selectAll("g");

  // mouse event vars
  let selectedNode = null;
  let selectedLink = null;
  let mousedownLink = null;
  let mousedownNode = null;
  let mouseupNode = null;

  function resetMouseVars() {
    mousedownNode = null;
    mouseupNode = null;
    mousedownLink = null;
  }

  // update force layout (called automatically each iteration)
  function tick() {
    // draw directed edges with proper padding from node centers
    updateSetMutateForceLayoutDoTickNodeEdgesPositioned(path, circle);
  }

  // update graph (called when needed)
  function restart() {
    // path (link) group
    path = path.data(links);

    // update existing links
    path
      .classed("selected", (d: any) => d === selectedLink)
      .style("marker-start", (d: any) => (d.left ? "url(#start-arrow)" : ""))
      .style("marker-end", (d: any) => (d.right ? "url(#end-arrow)" : ""));

    // remove old links
    path.exit().remove();

    // add new links
    path = path
      .enter()
      .append("svg:path")
      .attr("class", "link")
      .classed("selected", (d: any) => d === selectedLink)
      .style("marker-start", (d: any) => (d.left ? "url(#start-arrow)" : ""))
      .style("marker-end", (d: any) => (d.right ? "url(#end-arrow)" : ""))
      .on("mousedown", (d: any) => {
        if (d3.event.ctrlKey) return;

        // select link
        mousedownLink = d;
        selectedLink = mousedownLink === selectedLink ? null : mousedownLink;
        selectedNode = null;
        restart();
      })
      .merge(path);

    // circle (node) group
    // NB: the function arg is crucial here! nodes are known by id, not by index!
    circle = circle.data(nodes, (d: any) => d.id);

    // update existing nodes (reflexive & selected visual states)
    circle
      .selectAll("circle")
      .style("fill", (d: any) =>
        d === selectedNode
          ? d3.rgb(colors(d.id)).brighter().toString()
          : colors(d.id)
      )
      .classed("reflexive", (d: any) => d.reflexive);

    // remove old nodes
    circle.exit().remove();

    // add new nodes
    const g = circle.enter().append("svg:g");

    g.append("svg:circle")
      .attr("class", "node")
      .attr("r", 12)
      .style("fill", (d: any) =>
        d === selectedNode
          ? d3.rgb(colors(d.id)).brighter().toString()
          : colors(d.id)
      )
      .style("stroke", (d: any) => d3.rgb(colors(d.id)).darker().toString())
      .classed("reflexive", (d: any) => d.reflexive)
      .on("mouseover", function (d: any) {
        if (!mousedownNode || d === mousedownNode) return;
        // enlarge target node
        d3.select(this).attr("transform", "scale(1.1)");
      })
      .on("mouseout", function (d: any) {
        if (!mousedownNode || d === mousedownNode) return;
        // unenlarge target node
        d3.select(this).attr("transform", "");
      })
      .on("mousedown", (d: any) => {
        if (d3.event.ctrlKey) return;

        // select node
        mousedownNode = d;
        selectedNode = mousedownNode === selectedNode ? null : mousedownNode;
        selectedLink = null;

        // reposition drag line
        dragLine
          .style("marker-end", "url(#end-arrow)")
          .classed("hidden", false)
          .attr(
            "d",
            `M${mousedownNode.x},${mousedownNode.y}L${mousedownNode.x},${mousedownNode.y}`
          );

        restart();
      })
      .on("mouseup", function (d: any) {
        if (!mousedownNode) return;

        // needed by FF
        dragLine.classed("hidden", true).style("marker-end", "");

        // check for drag-to-self
        mouseupNode = d;
        if (mouseupNode === mousedownNode) {
          resetMouseVars();
          return;
        }

        // unenlarge target node
        d3.select(this).attr("transform", "");

        // add link to graph (update if exists)
        // NB: links are strictly source < target; arrows separately specified by booleans
        const isRight = mousedownNode.id < mouseupNode.id;
        const source = isRight ? mousedownNode : mouseupNode;
        const target = isRight ? mouseupNode : mousedownNode;

        const link = links.filter(
          (l) => l.source === source && l.target === target
        )[0];
        if (link) {
          link[isRight ? "right" : "left"] = true;
        } else {
          links.push({ source, target, left: !isRight, right: isRight });
        }

        // select new link
        selectedLink = link;
        selectedNode = null;
        restart();
      });

    // show node IDs
    g.append("svg:text")
      .attr("x", 0)
      .attr("y", 4)
      .attr("class", "id")
      .text((d: any) => d.id);

    circle = g.merge(circle);

    // set the graph in motion
    const forceNodesLinkForce: d3.Force<d3.SimulationNodeDatum, any> = force
      .nodes(nodes as any[])
      .force("link");

    (forceNodesLinkForce as any).links(links);

    force.alphaTarget(0.3).restart();
  }

  function mousedown() {
    // because :active only works in WebKit?
    svg.classed("active", true);

    if (d3.event.ctrlKey || mousedownNode || mousedownLink) return;

    // insert new node at point
    const point = d3.mouse(this);
    const node = {
      id: ++lastNodeId,
      reflexive: false,
      x: point[0],
      y: point[1],
    };
    nodes.push(node);

    restart();
  }

  function mousemove() {
    if (!mousedownNode) return;

    // update drag line
    dragLine.attr(
      "d",
      `M${mousedownNode.x},${mousedownNode.y}L${d3.mouse(this)[0]},${d3.mouse(this)[1]
      }`
    );
  }

  function mouseup() {
    if (mousedownNode) {
      // hide drag line
      dragLine.classed("hidden", true).style("marker-end", "");
    }

    // because :active only works in WebKit?
    svg.classed("active", false);

    // clear mouse event vars
    resetMouseVars();
  }

  function spliceLinksForNode(node) {
    const toSplice = links.filter(
      (l) => l.source === node || l.target === node
    );
    for (const l of toSplice) {
      links.splice(links.indexOf(l), 1);
    }
  }

  // only respond once per keydown
  let lastKeyDown = -1;

  function keydown() {
    d3.event.preventDefault();

    if (lastKeyDown !== -1) return;
    lastKeyDown = d3.event.keyCode;

    // ctrl
    if (d3.event.keyCode === 17) {
      circle.call(drag);
      svg.classed("ctrl", true);
      return;
    }

    if (!selectedNode && !selectedLink) return;

    switch (d3.event.keyCode) {
      case 8: // backspace
      case 46: // delete
        if (selectedNode) {
          nodes.splice(nodes.indexOf(selectedNode), 1);
          spliceLinksForNode(selectedNode);
        } else if (selectedLink) {
          links.splice(links.indexOf(selectedLink), 1);
        }
        selectedLink = null;
        selectedNode = null;
        restart();
        break;
      case 66: // B
        if (selectedLink) {
          // set link direction to both left and right
          selectedLink.left = true;
          selectedLink.right = true;
        }
        restart();
        break;
      case 76: // L
        if (selectedLink) {
          // set link direction to left only
          selectedLink.left = true;
          selectedLink.right = false;
        }
        restart();
        break;
      case 82: // R
        if (selectedNode) {
          // toggle node reflexivity
          selectedNode.reflexive = !selectedNode.reflexive;
        } else if (selectedLink) {
          // set link direction to right only
          selectedLink.left = false;
          selectedLink.right = true;
        }
        restart();
        break;
    }
  }

  function keyup() {
    lastKeyDown = -1;

    // ctrl
    if (d3.event.keyCode === 17) {
      circle.on(".drag", null);
      svg.classed("ctrl", false);
    }
  }

  // app starts here
  svg
    .on("mousedown", mousedown)
    .on("mousemove", mousemove)
    .on("mouseup", mouseup);
  d3.select(window).on("keydown", keydown).on("keyup", keyup);
  restart();
}


function updateSetMutateForceLayoutDoTickNodeEdgesPositioned(
  path: d3.Selection<d3.BaseType, unknown, d3.BaseType, unknown>,
  circle: d3.Selection<d3.BaseType, unknown, d3.BaseType, unknown>
) {
  path.attr("d", (d: ForceFlowDatum) => {
    const deltaX = d.target.x - d.source.x;
    const deltaY = d.target.y - d.source.y;
    const dist = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    const normX = deltaX / dist;
    const normY = deltaY / dist;

    // This arbitrary UX pads manually pads out how far away the end of the arrow 
    // the end of the arrow is to the circle outline
    // i.e. A -->    B vs A -->B
    const paddedPaddingWhereExtraPresentTargetRight = 17; /** Refactor this to be 12 + 5 in var terms later. Incremental refactor */
    const nonPaddedPadding = 12;

    const sourcePadding = d.left ? paddedPaddingWhereExtraPresentTargetRight : nonPaddedPadding;
    const targetPadding = d.right ? paddedPaddingWhereExtraPresentTargetRight : nonPaddedPadding;
    const sourceX = d.source.x + sourcePadding * normX;
    const sourceY = d.source.y + sourcePadding * normY;
    const targetX = d.target.x - targetPadding * normX;
    const targetY = d.target.y - targetPadding * normY;

    return `M${sourceX},${sourceY}L${targetX},${targetY}`;
  });

  /**
   * Circle position translation too?!
   *
   * Seems ridiculously redundant
   *
   * Padding positioning BOTH the arrow and the node and the distance of the arrow from node
   *
   * when should really only need to adjust one or the other.
   */
  circle.attr("transform", (d: any) => `translate(${d.x},${d.y})`);
}

function createForceSimulation(
  width: number,
  height: number,
  tick: () => void
) {
  const forceDistance = 150;

  /**
   * Mutate this
   */
  const newSimulation: d3.Simulation<d3.SimulationNodeDatum, undefined>
    = d3.forceSimulation();

  /** 
   * Same reference to the now-mutated object 
   */
  const customisedSimulation = newSimulation
    .force(
      "link",
      d3
        .forceLink()
        .id((d: any) => d.id)
        .distance(forceDistance)
    )
    .force("charge", d3.forceManyBody().strength(-500))
    .force("x", d3.forceX(width / 2))
    .force("y", d3.forceY(height / 2))
    .on("tick", tick);



  return customisedSimulation;
}

