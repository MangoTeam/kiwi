import * as kiwi from 'kiwi.js';

function cassowary2({ "p.left": pLeftValue
                    , "p.right": pRightValue
                    , "p.width": pWidthValue
                    , "a.left": aLeftValue
                    , "a.right": aRightValue
                    , "a.width": aWidthValue
                    , "b.left": bLeftValue
                    , "b.right": bRightValue
                    , "b.width": bWidthValue
                   }) {
  let solver = new kiwi.Solver();

  // Create and add some editable rectangles
  // Parent
  var pLeft = new kiwi.Variable("p.left");
  var pRight = new kiwi.Variable("p.right");
  var pWidth = new kiwi.Variable("p.width");
  solver.addEditVariable(pLeft, kiwi.Strength.strong);
  solver.addEditVariable(pRight, kiwi.Strength.strong);
  solver.addEditVariable(pWidth, kiwi.Strength.strong);

  // Child A
  var aLeft = new kiwi.Variable("a.left");
  var aRight = new kiwi.Variable("a.right");
  var aWidth = new kiwi.Variable("a.width");
  solver.addEditVariable(aLeft, kiwi.Strength.strong);
  solver.addEditVariable(aRight, kiwi.Strength.strong);
  solver.addEditVariable(aWidth, kiwi.Strength.strong);

  // Child B
  var bLeft = new kiwi.Variable("b.left");
  var bRight = new kiwi.Variable("b.right");
  var bWidth = new kiwi.Variable("b.width");
  solver.addEditVariable(bLeft, kiwi.Strength.strong);
  solver.addEditVariable(bRight, kiwi.Strength.strong);
  solver.addEditVariable(bWidth, kiwi.Strength.strong);

  // Suggest some values to the solver
  solver.suggestValue(pLeft, 0);
  solver.suggestValue(pRight, 800);
  solver.suggestValue(pWidth, 800);

  solver.suggestValue(aLeft, 100);
  solver.suggestValue(aRight, 300);
  solver.suggestValue(aWidth, 200);

  solver.suggestValue(bLeft, 400);
  solver.suggestValue(bRight, 700);
  solver.suggestValue(bWidth, 300);

  // Lets solve the problem!
  solver.updateVariables();

  // const variables = solver._varMap.array.map(v => v.first);

  // console.log("Variable Values"); 
  // variables.forEach(v => {
  //   console.log("");
  //   console.log(`${v._name} ${v._value}`);
  // })

  // Create a variable calculated through a constraint

  // a.left - p.left ≥ 10 
  var aLMinusPLGE = new kiwi.Expression([-1, pLeft], aLeft, -10);
  solver.addConstraint(new kiwi.Constraint(aLMinusPLGE, kiwi.Operator.Ge, kiwi.Strength.required));

  // a.left - p.left ≤ 10
  var aLMinusPLLE = new kiwi.Expression([-1, aLeft], pLeft, 10);
  solver.addConstraint(new kiwi.Constraint(aLMinusPLLE, kiwi.Operator.Le, kiwi.Strength.required));

  // b.left - a.right ≥ 10 
  var bLMinusARGE = new kiwi.Expression(bLeft, [-1, aRight], -10);
  solver.addConstraint(new kiwi.Constraint(bLMinusARGE, kiwi.Operator.Ge, kiwi.Strength.required));

  // b.left - a.right ≤ 10
  var bLMinusARLE = new kiwi.Expression(aRight, [-1, bLeft], 10);
  solver.addConstraint(new kiwi.Constraint(bLMinusARLE, kiwi.Operator.Le, kiwi.Strength.required));

  // p.right - b.right ≥ 10 
  var pRMinusBRGE = new kiwi.Expression(pRight, [-1, bRight], -10);
  solver.addConstraint(new kiwi.Constraint(pRMinusBRGE, kiwi.Operator.Ge, kiwi.Strength.required));

  // p.right - b.right ≤ 10
  var pRMinusBRLE = new kiwi.Expression(bRight, [-1, pRight], 10);
  solver.addConstraint(new kiwi.Constraint(pRMinusBRLE, kiwi.Operator.Le, kiwi.Strength.required));

  // a.width ≥ 20 
  var aWidthGE = new kiwi.Expression(aWidth, -20);
  solver.addConstraint(new kiwi.Constraint(aWidthGE, kiwi.Operator.Ge, kiwi.Strength.required));

  // a.width ≤ 20
  var aWidthLE = new kiwi.Expression([-1, aWidth], 20);
  solver.addConstraint(new kiwi.Constraint(aWidthLE, kiwi.Operator.Le, kiwi.Strength.required));

  // b.width ≥ 30 
  var bWidthGE = new kiwi.Expression(bWidth, -30);
  solver.addConstraint(new kiwi.Constraint(bWidthGE, kiwi.Operator.Ge, kiwi.Strength.required));

  // b.width ≤ 30
  var bWidthLE = new kiwi.Expression([-1, bWidth], 30);
  solver.addConstraint(new kiwi.Constraint(bWidthLE, kiwi.Operator.Le, kiwi.Strength.required));
    
    
  // solver.updateVariables();
  return solver;
}

  export {cassowary2}; 