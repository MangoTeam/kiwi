import * as kiwi from 'kiwi.js';
import flatMap from 'lodash/flatMap';

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
  // Create a solver
  let solver = new kiwi.Solver();

  const kiwiVars = flatMap(boxes, (b) => {
    const attrs = ['left', 'top', 'right', 'bottom', 'width', 'height'];
    const vars = attrs.map(a => 
      new kiwi.Variable({ name: `${b.name}.left`
                        , value: b[a]
                        })
    );
    return vars;
  });

  const varByName = kiwiVars.reduce((acc, val) => {
    acc[val.name()] = val;
  }, {});

  const varsWithValues = kiwiVars.filter(v => v.value());
  varsWithValues.forEach(v => {
    solver.addEditVariable(v, kiwi.Strength.strong);
    solver.suggestValue(v, v.value());
  });

  const aRight = varByName["a.right"];
  const aLeft  = varByName["a.left"];
  const aWidth = varByName["a.width"];
  const bWidth = varByName["b.width"];
  const bRight = varByName["b.right"];
  const pWidth = varByName["p.width"];
  // let aRightExpr = new kiwi.Expression([-1, aRight], aLeft, aWidth);
  // let bLeftExpr  = aLeft.plus(aWidth).plus(100).minus(bLeft);
  // let bRightExpr = aRight.plus(100).plus(bWidth).minus(pWidth);
  // let containmentExpr = pWidth.minus(bRight);
  
  // solver.addConstraint(new kiwi.Constraint(aRightExpr, kiwi.Operator.Eq));
  // solver.addConstraint(new kiwi.Constraint(bLeftExpr, kiwi.Operator.Eq));
  // solver.addConstraint(new kiwi.Constraint(bRightExpr, kiwi.Operator.Eq));
  // solver.addConstraint(new kiwi.Constraint(containmentExpr, kiwi.Operator.Eq));

  return solver;
}

export {cassowary1, cassowary1A};