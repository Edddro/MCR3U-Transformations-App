import Fraction from "fraction.js";
import { MathJaxContext, MathJax } from "better-react-mathjax";

interface VariableProps {
  a: number;
  k: number;
  d: number;
  c: number;
  f: string;
  b?: number;
  c_in_front_a: boolean;
  k_unfactored: boolean;
}

let Variables = ({ a, k, d, c, f, b, c_in_front_a, k_unfactored }: VariableProps) => {
  let a_fraction = new Fraction(a);
  let k_fraction = new Fraction(k);
  let x = "x";

  if (k_unfactored) {
    x =
      (Math.abs(k) === 1 ? (k < 0 ? "-" : "") : renderFraction(k_fraction)) +
      "x";
    d *= k;
    k = 1;
    k_fraction = new Fraction(1);
  }

  let renderedFn: string = renderNamedFunction("f", a_fraction, k_fraction, d);

  switch (f) {
    case "x":
      renderedFn = renderLinearFunction(a_fraction, k_fraction, d);
      break;
    case "x^2":
      renderedFn = renderPowerFunction(a_fraction, k_fraction, d, 2);
      break;
    case "b^x":
      renderedFn = renderExponentialFunction(
        a_fraction,
        k_fraction,
        d,
        Number(b ? (a === 1 && b < 0 ? `(${b})` : b) : 2)
      );
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

  return (
    <div>
      <h1>
        <MathJaxContext>
          <MathJax>
            {`\\(g\\left(x\\right) = ${renderedFn}${renderCValue(
              c,
              c_in_front_a
            )}\\)`}
          </MathJax>
        </MathJaxContext>
      </h1>
      <h2>
        <MathJaxContext>
          <MathJax>
            {`Parent Function: \\(${renderParentFunction(f)}\\)`}
          </MathJax>
        </MathJaxContext>
      </h2>
    </div>
  );

  function renderFraction(fraction: Fraction) {
    return (
      (fraction.s == -1 ? "-" : "") +
      (fraction.d === 1
        ? fraction.n.toString()
        : `\\frac{${fraction.n}}{${fraction.d}}`)
    );
  }

  function renderFunctionInner(k: Fraction, d: number) {
    // If k is 1, we don't need inner parentheses
    if (k.n === 1 && k.d === 1) {
      return `${x}` + (d !== 0 ? (d > 0 ? " - " : " + ") + renderFraction(new Fraction(Math.abs(d))) : "");
    }

    const renderedK = k.n === -1 && k.d === 1 ? "-" : renderFraction(k);
    return `${renderedK}(${x}${
      d !== 0 ? (d > 0 ? " - " : " + ") + renderFraction(new Fraction(Math.abs(d))) : ""
    })`;
  }

  function renderNamedFunction(f: string, a: Fraction, k: Fraction, d: number) {
    const outerParenOpen = k.n === 1 && k.d === 1 ? "(" : "[";
    const outerParenClose = k.n === 1 && k.d === 1 ? ")" : "]";

    return `${renderAValue(
      a,
      c_in_front_a
    )}${f}${outerParenOpen}${renderFunctionInner(k, d)}${outerParenClose}`;
  }

  function renderPowerFunction(
    a: Fraction,
    k: Fraction,
    d: number,
    exponent: number
  ) {
    const outerParens = outerParenType(k);
    const outerParenOpen =
      a.s * a.n === 1 && a.d === 1 ? "" : `\\left${outerParens[0]}`;
    const outerParenClose =
      a.s * a.n === 1 && a.d === 1 ? "" : `\\right${outerParens[1]}`;

    return `${renderAValue(
      a,
      c_in_front_a
    )}${outerParenOpen}${renderFunctionInner(
      k,
      d
    )}${outerParenClose}^${exponent}`;
  }

  function renderLinearFunction(a: Fraction, k: Fraction, d: number) {
    const outerParens = outerParenType(k);
    const outerParenOpen =
      a.s * a.n === 1 && a.d === 1 ? "" : `\\left${outerParens[0]}`;
    const outerParenClose =
      a.s * a.n === 1 && a.d === 1 ? "" : `\\right${outerParens[1]}`;

    return `${renderAValue(
      a,
      c_in_front_a
    )}${outerParenOpen}${renderFunctionInner(k, d)}${outerParenClose}`;
  }

  function renderReciprocalFunction(a: Fraction, k: Fraction, d: number) {
    let top = renderAValue(a, c_in_front_a) || "1";
    const bottom = renderFunctionInner(k, d);

    if (top === "-") {
      top = "-1";
    }

    return `\\frac{${top} } {${bottom} }`;
  }

  function renderSquareRootFunction(a: Fraction, k: Fraction, d: number) {
    return `${renderAValue(a, c_in_front_a)} \\sqrt{${renderFunctionInner(
      k,
      d
    )} } `;
  }

  function renderExponentialFunction(
    a: Fraction,
    k: Fraction,
    d: number,
    base: number
  ) {
    const aValue = renderAValue(a, c_in_front_a);
    const basePart = aValue === "" ? base : `${aValue}\\left(${base}\\right)`;

    return `${basePart}^{${renderFunctionInner(k, d)}} `;
  }

  function outerParenType(k: Fraction) {
    return k.n === 1 && k.d === 1 ? ["(", ")"] : ["[", "]"];
  }

  function renderCValue(c: number, c_in_front_a: boolean) {
    return c_in_front_a
      ? ""
      : c !== 0
      ? (c > 0 ? " + " : " - ") + Math.abs(c)
      : "";
  }

  function renderAValue(a: Fraction, c_in_front_a: boolean) {
    return c_in_front_a && c !== 0
      ? c +
          (Number(a) == 1
            ? ""
            : Number(a) == -1
            ? "-"
            : Number(a) > 0
            ? " + " + renderFraction(a)
            : renderFraction(a))
      : Number(a) == 1
      ? ""
      : Number(a) == -1
      ? "-"
      : renderFraction(a);
  }

  function renderParentFunction(f: string) {
    return f === ""
      ? "Not Selected"
      : f === "x"
      ? `x`
      : f === "x^2"
      ? `x^2`
      : f === "b^x"
      ? `b^x`
      : f === "√x"
      ? `\\sqrt{x}`
      : f === "1/x"
      ? `\\frac{1}{x}`
      : f === "sin(x)"
      ? `sin(x)`
      : f === "cos(x)"
      ? `cos(x)`
      : "Not Selected";
  }
};
export default Variables;