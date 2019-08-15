<script>
import * as kiwi from 'kiwi.js';
import {cassowary1} from './cassowary1.js';
import {cassowary2} from './cassowary2.js';
export let name;


let pWidthValue = 800;

let aLeftValue = 100;
let aRightValue = 100;
let aWidthValue = 200;
 
let bLeftValue = 400;
let bRightValue = 700;
let bWidthValue = 300;

// let problemValues = {
//   "a.left":  100,
//   "a.right": 300,
//   "a.width": 200,
//   "b.left":  400,
//   "b.right": 700,
//   "b.width": 300,
//   "p.width": 800,
// };

// $: cassowaryProblem = cassowary1(problemValues["a.left"]
//                                 ,problemValues["a.width"]
//                                 ,problemValues["p.width"]
//                                 ,problemValues["b.right"]) 

let problemValues = {
  "p.left": 0,
  "p.right": 800,
  "p.width": 800,
  "a.left": 100,
  "a.right": 300,
  "a.width": 200,
  "b.left": 400,
  "b.right": 700,
  "b.width": 300
}

$: solver = cassowary2(problemValues);

// Solve the constraints
let cassowaryVars = [];
function updateVariables() {
  solver.updateVariables();
  // after calling updateVariables, can go in, scrape all variables and post their values
  cassowaryVars = solver._varMap.array.map(({first: v}) => {
   return {name: v.name(), value: v.value()};

  })
  problemValues = cassowaryVars.reduce((acc, {name, value}) => {
    acc[name] = +value;
    return acc;
  }, {});
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
  <label>a.left: {problemValues["a.left"]}</label>
  <input type="range" min="100" max="800" step="10" 
         bind:value={problemValues["a.left"]} 
         on:input={updateVariables}>
  <label>a.width: {problemValues["a.width"]}</label>
  <input type="range" min="100" max="800" step="10" 
         bind:value={problemValues["a.width"]}
         on:input="{updateVariables}">

  <p>a.right: {problemValues["a.right"]}</p>
  <p>b.left: {problemValues["b.left"]}</p>
  <p>b.width: {problemValues["b.width"]}</p>
  <button on:click={updateVariables}>Solve</button>

  <div id="canvas">
    <div id="parent" class="box">
      <div id="a" class="box"
          style="left: {problemValues["a.left"]}px; width: {problemValues["a.width"]}px"></div>
      <div id="b" class="box"
          style="left: {problemValues["b.left"]}px; width: {problemValues["b.width"]}px"></div>
    </div>
  </div>
</div>
