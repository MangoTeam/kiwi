<script>
import * as kiwi from 'kiwi.js';
// import _ from 'lodash';
import keys from 'lodash/keys'
import {cassowary1A} from './cassowary1.js';
import {cassowary2} from './cassowary2.js';

import RectangleDrawer from './RectangleDrawer.svelte';

// let problemValues = {
//   "p.left": 0,
//   "p.right": 800,
//   "p.width": 800,
//   "a.left": 100,
//   "a.right": 300, 
//   "a.width": 200,
//   "b.left": 400,
//   "b.right": 700,
//   "b.width": 300
// }

// $: solver = cassowary2(problemValues);

let problemValues = [
  { name: "a"
  , left: 100
  , right: undefined
  , width: 200
  , height: undefined
  , top: undefined
  , bottom: undefined
  },
  { name: "b"
  , left: undefined
  , right: 800
  , width: undefined
  , height: undefined
  , top: undefined
  , bottom: undefined
  },
  { name: "p"
  , left: undefined
  , right: undefined
  , width: 800
  , height: undefined
  , top: undefined
  , bottom: undefined
  }
];

$: boxesDictionary = problemValues.reduce((acc, box) => {
  const attrs = ['left', 'top', 'right', 'bottom', 'width', 'height'];
  attrs.forEach(a => acc[`${box.name}.${a}`] = box[a]);
  return acc;
}, {});

$: solver = cassowary1A(problemValues) 

// Solve the constraints
let cassowaryVars = [];
function updateVariables() {
  solver.updateVariables();
  // after calling updateVariables, can go in, scrape all variables and post their values
  cassowaryVars = solver._varMap.array.map(({first: v}) => {
   return {varName: v.name().name, value: v._value};

  })
  const boxes = cassowaryVars.reduce((acc, {varName, value}) => {
    let [boxName, attr] = varName.split(".");
    if (!acc[boxName]) acc[boxName] = {};
    acc[boxName][attr] = +value;
    return acc;
  }, {}); 

  problemValues = problemValues.map(box => {
    return Object.assign(box, boxes[box.name]);
  });
  console.log("foo");
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

  .boxes {
    display: flex;
    flex-flow: row nowrap;
  }

  .box-control {
    padding: 15px;
  }
</style>

<div>
  <div class="boxes">
    {#each problemValues as {name, left, right, top, bottom, height, width}, i}
      <div class="box-control">
        <label>{name}.left: {left}</label>
        <input type="range" min="100" max="800" step="10" 
              bind:value={problemValues[i]["left"]} 
              on:input={updateVariables}> 
        <label>{name}.right: {right}</label>
        <input type="range" min="100" max="800" step="10" 
              bind:value={problemValues[i]["right"]} 
              on:input={updateVariables}> 
        <label>{name}.top: {top}</label>
        <input type="range" min="100" max="800" step="10" 
              bind:value={problemValues[i]["top"]} 
              on:input={updateVariables}> 
        <label>{name}.bottom: {bottom}</label>
        <input type="range" min="100" max="800" step="10" 
              bind:value={problemValues[i]["bottom"]} 
              on:input={updateVariables}> 
        <label>{name}.width: {width}</label>
        <input type="range" min="100" max="800" step="10" 
              bind:value={problemValues[i]["width"]} 
              on:input={updateVariables}> 
        <label>{name}.height: {height}</label>
        <input type="range" min="100" max="800" step="10" 
              bind:value={problemValues[i]["height"]} 
              on:input={updateVariables}> 
      </div>
    {/each}
  </div>
  <!-- <label>a.left: {boxesDictionary["a.left"]}</label>
  <input type="range" min="100" max="800" step="10" 
         bind:value={boxesDictionary["a.left"]} 
         on:input={updateVariables}>
  <label>a.width: {boxesDictionary["a.width"]}</label>
  <input type="range" min="100" max="800" step="10" 
         bind:value={boxesDictionary["a.width"]}
         on:input="{updateVariables}">

  <p>a.right: {boxesDictionary["a.right"]}</p>
  <p>b.left: {boxesDictionary["b.left"]}</p>
  <p>b.width: {boxesDictionary["b.width"]}</p>
  <button on:click={updateVariables}>Solve</button> -->

  <div id="canvas">
    <div id="parent" class="box">
      <div id="a" class="box"
          style="left: {boxesDictionary["a.left"]}px; width: {boxesDictionary["a.width"]}px"></div>
      <div id="b" class="box"
          style="left: {boxesDictionary["b.left"]}px; width: {boxesDictionary["b.width"]}px"></div>
    </div>
  </div>
</div>
  