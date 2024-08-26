import {
  average,
  makeNumberList,
} from '../../../../../common';

export function addGridPositionsToTree(tree) {

  let depthIndexed = setNodeDepth(tree);

  setXyFromLeaves(depthIndexed);

  return depthIndexed.flat();
}

function setNodeDepth(node, depthIndexed = [], depth = 0) {
  node.depth = depth;

  if (!depthIndexed[depth]) {
    depthIndexed[depth] = [];
  }
  depthIndexed[depth].push(node);

  node.children
    ?.forEach(n => setNodeDepth(n, depthIndexed, depth + 1));

  return depthIndexed;
}

function nudgeNode(filledLocations: boolean[], node: any, xOptimal: number) {
  let [xNow] = node.xy;
  let count = Math.abs(xOptimal - xNow) + 1;
  let offset = Math.min(xNow, xOptimal);
  let locations = makeNumberList(count, offset)
    .map(x => [x, filledLocations[x]]);

  let nextOpenLocation =
    (xOptimal > xNow ? locations : locations.reverse())
      .at(1);

  if (!nextOpenLocation?.[1]) {
    let nextX = <number>nextOpenLocation[0];
    filledLocations[xNow] = false;
    filledLocations[nextX] = true;
    node.xy[0] = nextX;
    return true;
  }
}

function setXyFromLeaves(depthIndexed: any[]) {
  let maxWidth = Math.max(...depthIndexed.map(r => r.length));
  let y = depthIndexed.length - 1;

  let reversedDepths = depthIndexed.slice().reverse();
  for (let row of reversedDepths) {
    let spread = Math.floor(maxWidth / row.length);

    for (let [i, node] of row.entries()) {
      let x = i * spread;
      node.xy = [Math.floor(x), y];
    }

    y--;
  }

  let i = 0;
  let didChange = true;
  while (didChange) {
    if (++i > 20) {
      break;
    }
    didChange = false;
    for (let row of reversedDepths) {

      let filledLocations: boolean[] = [];
      let nodes = row.map(({xy}) => xy);
      nodes.forEach(([x]) => filledLocations[x] = true);

      for (let node of row) {
        let children = node.children;
        if (children) {
          let xOptimal = Math.floor(average(children.map(({xy: [x]}) => x)));
          if (xOptimal === node.xy[0]) {
            continue;
          }
          didChange = nudgeNode(filledLocations, node, xOptimal) || didChange;

        } else {
          let sibling = node.parent.children.find(c => c !== node);
          let locationDifference = Math.abs(sibling.xy[0] - node.xy[0]);
          if (locationDifference < 2) {
            continue;
          }

          let xOptimal = sibling.xy[0] - 1;
          didChange = nudgeNode(filledLocations, node, xOptimal) || didChange;
        }
      }
    }
  }
}
