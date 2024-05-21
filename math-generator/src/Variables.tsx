import Fraction from "fraction.js";
import { MathJaxContext, MathJax } from "better-react-mathjax";

interface VariableProps {
  a: number;
  k: number;
  d: number;
  c: number;
  f: string;
  b?: number;
}

let Variables = ({ a, k, d, c, f, b }: VariableProps) => {
  let a_fraction = new Fraction(a)
  let k_fraction = new Fraction(k)
  let error_equation = Math.random() < 0.5;

  let renderedFn: string = renderNamedFunction("f", a_fraction, k_fraction, d);

  switch (f) {
    case "x":
      renderedFn = renderLinearFunction(a_fraction, k_fraction, d);
      break;
    case "x^2":
      renderedFn = renderPowerFunction(a_fraction, k_fraction, d, 2);
      break;
    case "b^x":
      renderedFn = renderExponentialFunction(a_fraction, k_fraction, d, b || 2);
      break;
    case "√x":
      renderedFn = renderSquareRootFunction(a_fraction, k_fraction, d);
      break;
    case "1/x":
      renderedFn = renderReciprocalFunction(a_fraction, k_fraction, d);
      break;
    case "sin(x)":
      renderedFn = renderNamedFunction("\\sin", a_fraction, k_fraction, d);
      break;
    case "cos(x)":
      renderedFn = renderNamedFunction("\\cos", a_fraction, k_fraction, d);
      break;
  }

  /* if (error_equation) {
     let c_at_a = Math.random() < 0.3;
     let k_unfactored = Math.random() < 1;
 
     if (c_at_a) {
       return (
         <div>
           <h1>
             g(x) ={" "}
             {c !== 0
               ? c > 0
                 ? Math.abs(c) + (Number(a) > 0 ? " + " : " ")
                 : " -" + Math.abs(c) + (Number(a) > 0 ? " + " : " ")
               : ""}
             {Math.abs(a) === 1 ? (Number(a) > 0 ? "" : " - ") : a_fraction}f
             {Math.abs(Number(k)) === 1 ? "" : "["}
             {k === 1 ? "(x" : k === -1 ? "(-x" : k_fraction + "(x"}
             {d !== 0
             ? d * Number(k) > 0
                   ? " - " + Math.abs(d) + ")"
                   : " + " + Math.abs(d) + ")"
             : ")"}
             {Math.abs(Number(k)) === 1 ? "" : "]"}
           </h1>
           <h2>
             Parent Function:{" "}
             {f === "" ? "Not Selected" : b ? f + " - B: " + b : f}
           </h2>
         </div>
       );
     }
 
     if (k_unfactored) {
       return (
         <div>
           <h1>
             g(x) = {a === 1 ? "" : a === -1 ? "-" : a_fraction}f
             {k === 1 ? "(x" : k === -1 ? "(-x" : "(" + k_fraction + "x"}
             {d !== 0
               ? (d * Number(k) > 0 ? " - " : " + ") +
                 new Fraction(Math.abs(d) * Math.abs(k)).toFraction()
               : ")"}
             {Math.abs(Number(k)) === 1 ? ")" : ")"}
             {c !== 0 ? (c > 0 ? " + " : " - ") + Math.abs(c) : ""}
           </h1>
           <h2>
             Parent Function:{" "}
             {f === "" ? "Not Selected" : b ? f + " - B: " + b : f}
           </h2>
         </div>
       );
     }
   } else { */
  return (
    <div>
      <h1>
        {/* g(x) = {a === 1 ? "" : a === -1 ? "-" : a_fraction}f
          {Math.abs(Number(k)) === 1 ? "" : "["}
          {k === 1 ? "(x" : k === -1 ? "(-x" : k_fraction + "(x"}
          {d !== 0
            ? d * Number(k) > 0
                  ? " - " + Math.abs(d) + ")"
                  : " + " + Math.abs(d) + ")"
            : ")"}
          {Math.abs(Number(k)) === 1 ? "" : "]"}
          {c !== 0 ? (c > 0 ? " + " : " - ") + Math.abs(c) : ""} */}
        <MathJaxContext>
          <MathJax>
            {`\\(g\\left(x\\right) = ${renderedFn}${renderCValue(c)}\\)`}
          </MathJax>
        </MathJaxContext>
      </h1>
      <h2>
        Parent Function:{" "}
        {f === "" ? "Not Selected" : b ? f + " - B: " + b : f}
      </h2>
    </div>
  );
  // }
};

function renderFraction(fraction: Fraction) {
  return (fraction.s == -1 ? "-" : "") + (fraction.d === 1 ? fraction.n.toString() : `\\frac{${fraction.n}}{${fraction.d}}`);
}

function renderFunctionInner(k: Fraction, d: number) {
  // If k is 1, we don't need inner parentheses
  if (k.n === 1 && k.d === 1) {
    return "x" + (d !== 0 ? (d > 0 ? " - " : " + ") + Math.abs(d) : "");
  }

  const renderedK = (k.n === -1 && k.d === 1) ? "-" : renderFraction(k);
  return `${renderedK}(x${d !== 0 ? (d > 0 ? " - " : " + ") + Math.abs(d) : ""})`;
}

function renderNamedFunction(f: string, a: Fraction, k: Fraction, d: number) {
  const outerParenOpen = (k.n === 1 && k.d === 1) ? "(" : "[";
  const outerParenClose = (k.n === 1 && k.d === 1) ? ")" : "]";

  return `${renderAValue(a)}${f}${outerParenOpen}${renderFunctionInner(k, d)}${outerParenClose}`
}

function renderPowerFunction(a: Fraction, k: Fraction, d: number, exponent: number) {
  const outerParens = outerParenType(k);
  const outerParenOpen = (a.s * a.n === 1 && a.d === 1) ? "" : `\\left${outerParens[0]}`;
  const outerParenClose = (a.s * a.n === 1 && a.d === 1) ? "" : `\\right${outerParens[1]}`;

  return `${renderAValue(a)}${outerParenOpen}${renderFunctionInner(k, d)}${outerParenClose}^${exponent}`;
}

function renderLinearFunction(a: Fraction, k: Fraction, d: number) {
  const outerParens = outerParenType(k);
  const outerParenOpen = (a.s * a.n === 1 && a.d === 1) ? "" : `\\left${outerParens[0]}`;
  const outerParenClose = (a.s * a.n === 1 && a.d === 1) ? "" : `\\right${outerParens[1]}`;

  return `${renderAValue(a)}${outerParenOpen}${renderFunctionInner(k, d)}${outerParenClose}`;
}

function renderReciprocalFunction(a: Fraction, k: Fraction, d: number) {
  let top = renderAValue(a) || "1";
  const bottom = renderFunctionInner(k, d);

  if (top === "-") {
    top = "-1";
  }

  return `\\frac{${top} } {${bottom} } `;
}

function renderSquareRootFunction(a: Fraction, k: Fraction, d: number) {
  return `${renderAValue(a)} \\sqrt{${renderFunctionInner(k, d)} } `;
}

function renderExponentialFunction(a: Fraction, k: Fraction, d: number, base: number) {

  const aValue = renderAValue(a);
  const basePart = aValue === "" ? base : `${aValue}\\left(${base}\\right)`;

  return `${basePart}^{${renderFunctionInner(k, d)}} `;
}

function outerParenType(k: Fraction) {
  return k.n === 1 && k.d === 1 ? ["(", ")"] : ["[", "]"];
}

function renderCValue(c: number) {
  return c !== 0 ? (c > 0 ? " + " : " - ") + Math.abs(c) : "";
}

function renderAValue(a: Fraction) {
  return Number(a) == 1 ? "" : Number(a) == -1 ? "-" : renderFraction(a);
}


export default Variables;
