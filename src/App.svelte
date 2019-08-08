<script>
import * as kiwi from 'kiwi.js';
export let name;

let pWidth = 800;

let leftValue = 100;
let widthValue = 400;
$: cassowaryProblem = (() => {
  // Create a solver
  let solver = new kiwi.Solver();

  // Create edit variables
  let aLeft = new kiwi.Variable();
  let aWidth = new kiwi.Variable();

  solver.addEditVariable(aLeft, kiwi.Strength.strong);
  solver.addEditVariable(aWidth, kiwi.Strength.strong);
  solver.suggestValue(aLeft, leftValue);
  solver.suggestValue(aWidth, widthValue);

  // Create and add a constraint
  let aRight = new kiwi.Variable();
  let bLeft  = new kiwi.Variable();

  let aRightExpr = new kiwi.Expression([-1, aRight], aLeft, aWidth);
  let bLeftExpr  = aLeft.plus(aWidth).plus(10).minus(bLeft);
  solver.addConstraint(new kiwi.Constraint(aRightExpr, kiwi.Operator.Eq));
  solver.addConstraint(new kiwi.Constraint(bLeftExpr, kiwi.Operator.Eq));
  return {solver, aRight, bLeft};
})();

// Solve the constraints
let rightValue = 0;
let bLeftValue = 0;
// $: rightValue = cassowaryProblem.right.value();
function updateVariables() {
  cassowaryProblem.solver.updateVariables();
  rightValue = cassowaryProblem.aRight.value();
  bLeftValue = cassowaryProblem.bLeft.value();
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
  <label>a.left: {leftValue}</label>
  <input type="range" min="10" max="800" step="10" 
         bind:value={leftValue} 
         on:input={updateVariables}>
  <label>a.width: {widthValue}</label>
  <input type="range" min="10" max="800" step="10" 
         bind:value={widthValue}
         on:input="{updateVariables}">

  <p>a.right: {rightValue}</p>
  <p>b.left: {bLeftValue}</p>
  <button on:click={updateVariables}>Solve</button>

  <div id="canvas">
    <div id="parent" class="box">
      <div id="a" class="box"
          style="left: {leftValue}px; width: {widthValue}px"></div>
      <div id="b" class="box"
          style="left: {bLeftValue}px; width: {400}px"></div>
    </div>
  </div>
</div>
