import * as kiwi from 'kiwi.js';
import flatMap from 'lodash/flatMap';
import toPairs from 'lodash/toPairs';

function cassowary1(aLeftValue, aWidthValue, pWidthValue, bRightValue)  {
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

  return solver;
}

function cassowary1A(boxes)  {
  // maps `${boxName}.${attr}` to numbers
  const boxesDictionary = boxes.reduce((acc, box) => {
    const attrs = ['left', 'top', 'right', 'bottom', 'width', 'height'];
    attrs.forEach(a => acc[`${box.name}.${a}`] = box[a]);
    return acc;
  }, {});
  // Create a solver
  let solver = new kiwi.Solver();

  const kiwiVars = flatMap(boxes, (b) => {
    const attrs = ['left', 'top', 'right', 'bottom', 'width', 'height'];
    const vars = attrs.map(a => 
      new kiwi.Variable({ name: `${b.name}.${a}`
                        // , value: b[a] || 0
                        })
    );
    return vars;
  });

  // key is boxName.attr: value is a number
  const varByName = kiwiVars.reduce((acc, val) => {
    acc[val.name().name] = val;
    return acc;
  }, {});

  const varsWithValues = kiwiVars.filter(kiwiVar => boxesDictionary[kiwiVar.name().name]);
  varsWithValues.forEach(v => {
    solver.addEditVariable(v, kiwi.Strength.strong);
    solver.suggestValue(v, boxesDictionary[v.name().name]);
  });

  const aRight = varByName["a.right"];
  const aLeft  = varByName["a.left"];
  const aWidth = varByName["a.width"];
  const bWidth = varByName["b.width"];
  const bRight = varByName["b.right"];
  const pWidth = varByName["p.width"];
  const bLeft  = varByName["b.left"]

  let aRightExpr = new kiwi.Expression([-1, aRight], aLeft, aWidth);
  let bLeftExpr  = aLeft.plus(aWidth).plus(100).minus(bLeft);
  let bRightExpr = aRight.plus(100).plus(bWidth).minus(pWidth);
  let containmentExpr = pWidth.minus(bRight);
  
  solver.addConstraint(new kiwi.Constraint(aRightExpr, kiwi.Operator.Eq));
  solver.addConstraint(new kiwi.Constraint(bLeftExpr, kiwi.Strength.required));
  solver.addConstraint(new kiwi.Constraint(bRightExpr, kiwi.Operator.Eq));
  solver.addConstraint(new kiwi.Constraint(containmentExpr, kiwi.Operator.Eq));

  return solver;
}

export {cassowary1, cassowary1A};