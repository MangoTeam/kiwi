<script>
import * as kiwi from 'kiwi.js';
export let name;


let pWidthValue = 800;

let aLeftValue = 100;
let aRightValue = 100;
let aWidthValue = 200;

let bLeftValue = 400;
let bRightValue = 700;
let bWidthValue = 300;

$: cassowaryProblem = (() => {
  // Create a solver
  let solver = new kiwi.Solver();

  // Create edit variables
  let aLeft = new kiwi.Variable("a.left");
  let aWidth = new kiwi.Variable("a.width");
  let pWidth = new kiwi.Variable("p.width");
  let bRight = new kiwi.Variable("b.right");

  solver.addEditVariable(aLeft, kiwi.Strength.strong);
  solver.addEditVariable(aWidth, kiwi.Strength.strong);
  solver.addEditVariable(pWidth, kiwi.Strength.strong);
  solver.addEditVariable(bRight, kiwi.Strength.strong);
  solver.suggestValue(aLeft, aLeftValue);
  solver.suggestValue(aWidth, aWidthValue);
  solver.suggestValue(pWidth, pWidthValue);
  solver.suggestValue(bRight, bRightValue);

  // Create and add constraints
  let aRight = new kiwi.Variable("a.right");
  let bLeft  = new kiwi.Variable("b.left");
  let bWidth = new kiwi.Variable("b.width");

  let aRightExpr = new kiwi.Expression([-1, aRight], aLeft, aWidth);
  let bLeftExpr  = aLeft.plus(aWidth).plus(100).minus(bLeft);
  let bRightExpr = aRight.plus(100).plus(bWidth).minus(pWidth);
  let containmentExpr = pWidth.minus(bRight);
  
  solver.addConstraint(new kiwi.Constraint(aRightExpr, kiwi.Operator.Eq));
  solver.addConstraint(new kiwi.Constraint(bLeftExpr, kiwi.Operator.Eq));
  solver.addConstraint(new kiwi.Constraint(bRightExpr, kiwi.Operator.Eq));
  solver.addConstraint(new kiwi.Constraint(containmentExpr, kiwi.Operator.Eq));

  return {solver, aRight, bLeft, bWidth};
})();

// Solve the constraints
let cassowaryVars = [];
function updateVariables() {
  cassowaryProblem.solver.updateVariables();
  // after calling updateVariables, can go in, scrape all variables and post their values
  cassowaryVars = cassowaryProblem.solver._varMap.array.map(({first: v}) => {
   return {name: v.name(), value: v.value()};
  })
  aRightValue = cassowaryProblem.aRight.value();
  bLeftValue = cassowaryProblem.bLeft.value();
  bWidthValue = cassowaryProblem.bWidth.value();
}
</script>

<style>
  h1 {
    color: purple;
  }

  #canvas {
    border: 1px solid seagreen;
    padding: 30px;
    height: 300px;
  }

  #parent {
    height: 200px;
    width: 800px;
    display: flex;
    flex-flow: row nowrap;
    align-items: center;
  }

  .box {
    position: absolute;
    border: 1px solid black;
  }

  #a {
    height: 100px;
  }
  #b {
    height: 100px;
  }
</style>

<div>
  <h1>Hello {name}!</h1>
  <label>a.left: {aLeftValue}</label>
  <input type="range" min="100" max="800" step="10" 
         bind:value={aLeftValue} 
         on:input={updateVariables}>
  <label>a.width: {aWidthValue}</label>
  <input type="range" min="100" max="800" step="10" 
         bind:value={aWidthValue}
         on:input="{updateVariables}">

  <p>a.right: {aRightValue}</p>
  <p>b.left: {bLeftValue}</p>
  <p>b.width: {bWidthValue}</p>
  <button on:click={updateVariables}>Solve</button>

  <div id="canvas">
    <div id="parent" class="box">
      <div id="a" class="box"
          style="left: {aLeftValue}px; width: {aWidthValue}px"></div>
      <div id="b" class="box"
          style="left: {bLeftValue}px; width: {bWidthValue}px"></div>
    </div>
  </div>
</div>
