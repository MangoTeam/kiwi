$: cassowaryProblem2 = (() => {
  // Create a solver
  let solver = new kiwi.Solver();

  // Create edit variables
  let aLeft = new kiwi.Variable("a.left");
  let aRight = new kiwi.Variable("a.right");
  let aWidth = new kiwi.Variable("a.width");

  let pLeft = new kiwi.Variable("p.left");
  let pRight = new kiwi.Variable("p.right");
  let pWidth = new kiwi.Variable("p.width");

  let bLeft  = new kiwi.Variable("b.left");
  let bRight = new kiwi.Variable("b.right");
  let bWidth = new kiwi.Variable("b.width");

  solver.addEditVariable(aLeft, kiwi.Strength.strong);
  solver.addEditVariable(aWidth, kiwi.Strength.strong);
  solver.addEditVariable(pWidth, kiwi.Strength.strong);
  solver.addEditVariable(bRight, kiwi.Strength.strong);
  solver.suggestValue(aLeft, aLeftValue);
  solver.suggestValue(aWidth, aWidthValue);
  solver.suggestValue(pWidth, pWidthValue);
  solver.suggestValue(bRight, bRightValue);

  // Create and add constraints

  let pRightExpr = new kiwi.Expression(pRight.minus(bRight).minus(100));

  let aLeftExpr = new kiwi.Expression(aLeft.minus(pLeft).minus(100));
  let aRightExpr = new kiwi.Expression([-1, aRight], aLeft, aWidth);
  let aWidthExpr = new new kiwi.Expression(aWidth.minus(200));
  
  let bLeftExpr  = aLeft.plus(aWidth).plus(100).minus(bLeft);
  let bRightExpr = aRight.plus(100).plus(bWidth).minus(pWidth);
  let aWidthExpr = new new kiwi.Expression(bWidth.minus(300));

  let containmentExpr = pWidth.minus(bRight);

  solver.addConstraint(new kiwi.Constraint(aRightExpr, kiwi.Operator.Eq));
  solver.addConstraint(new kiwi.Constraint(bLeftExpr, kiwi.Operator.Eq));
  solver.addConstraint(new kiwi.Constraint(bRightExpr, kiwi.Operator.Eq));
  solver.addConstraint(new kiwi.Constraint(containmentExpr, kiwi.Operator.Eq));

  return {solver, aRight, bLeft, bWidth};
})();