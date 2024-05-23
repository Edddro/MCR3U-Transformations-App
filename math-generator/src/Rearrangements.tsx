import { useState } from "react";
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

const Rearrangements = ({
  a,
  k,
  d,
  c,
  f,
  b,
  c_in_front_a,
  k_unfactored,
}: VariableProps) => {
  const a_fraction = new Fraction(a);
  let k_fraction = new Fraction(k);

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
      );0
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
      return (
        "x" +
        (d !== 0
          ? (d > 0 ? " - " : " + ") + renderFraction(new Fraction(Math.abs(d)))
          : "")
      );
    }

    const renderedK = k.n === -1 && k.d === 1 ? "-" : renderFraction(k);
    return `${renderedK}(x${
      d !== 0
        ? (d > 0 ? " - " : " + ") + renderFraction(new Fraction(Math.abs(d)))
        : ""
    })`;
  }

  function renderNamedFunction(f: string, a: Fraction, k: Fraction, d: number) {
    const outerParenOpen = k.n === 1 && k.d === 1 ? "(" : "[";
    const outerParenClose = k.n === 1 && k.d === 1 ? ")" : "]";

    return `${renderAValue(a)}${f}${outerParenOpen}${renderFunctionInner(
      k,
      d
    )}${outerParenClose}`;
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

    return `${renderAValue(a)}${outerParenOpen}${renderFunctionInner(
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

    return `${renderAValue(a)}${outerParenOpen}${renderFunctionInner(
      k,
      d
    )}${outerParenClose}`;
  }

  function renderReciprocalFunction(a: Fraction, k: Fraction, d: number) {
    let top = renderAValue(a) || "1";
    const bottom = renderFunctionInner(k, d);

    if (top === "-") {
      top = "-1";
    }

    return `\\frac{${top} } {${bottom} }`;
  }

  function renderSquareRootFunction(a: Fraction, k: Fraction, d: number) {
    return `${renderAValue(a)} \\sqrt{${renderFunctionInner(k, d)} } `;
  }

  function renderExponentialFunction(
    a: Fraction,
    k: Fraction,
    d: number,
    base: number
  ) {
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

  function renderAWithC(a: Fraction, c: number) {
    return c_in_front_a && c !== 0
      ? c +
          (Number(a) > 0
            ? " + "
            : "")
      : "";
  }

  function renderCValueWithA(c: number) {
    return k_unfactored && c_in_front_a ? "" : c === 0 ? "" : (c > 0 ? " + " : " - ") + Math.abs(c);
  }

  const rearrangements = [
    `${
      k_unfactored && k !== 1
        ? "- Factor out k from the x and d values: " +
          `\\(g\\left(x\\right) = ${renderAWithC(a_fraction, c)}${renderedFn}${renderCValueWithA(c)}\\)`
        : ""
    }`,
    `${
      c_in_front_a && c !== 0
        ? "- Move the value of c to the end of the equation: " +
          `\\(g\\left(x\\right) = ${renderedFn}${renderCValue(c)}\\)`
        : ""
    }`,
    `${
      !c_in_front_a && !k_unfactored
        ? "The equation is already properly arranged!"
        : ""
    }`,
  ];

  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <MathJaxContext>
        <MathJax>
          <div>
            <button className="see-button" onClick={() => setIsOpen(!isOpen)}>
              {isOpen ? "Hide" : "Show"} Rearrangements
            </button>
            {isOpen && (
              <div>
                <p className="transformations-text">
                  {rearrangements.map((rearrangements, index) => (
                    <div key={index}>
                      {rearrangements ? rearrangements : ""}
                    </div>
                  ))}
                </p>
              </div>
            )}
          </div>
        </MathJax>
      </MathJaxContext>
    </>
  );
};

export default Rearrangements;
