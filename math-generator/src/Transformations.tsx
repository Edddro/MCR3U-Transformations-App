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
}

const Transformations = ({ a, k, d, c, f }: VariableProps) => {
  const k_fraction = new Fraction(Math.abs(k));

  const transformations = [
    `${a < 0 ? "Reflected on the x-axis" : ""}`,
    `${
      Math.abs(Number(a)) > 1
        ? "Vertically stretched by a factor of \\(" +
          renderFraction(new Fraction(Math.abs(a))) +
          "\\)"
        : Math.abs(Number(a)) < 1
        ? "Vertically compressed by a factor of \\(" +
          renderFraction(new Fraction(Math.abs(a))) +
          "\\)"
        : ""
    }`,
    `${Number(k) < 0 ? "Reflected on the y-axis" : ""}`,
    `${
      Math.abs(Number(k)) > 1
        ? `Horizontally compressed by a factor of \\(${renderFraction(
            k_fraction.inverse()
          )}\\)`
        : Math.abs(Number(k)) < 1
        ? `Horizontally stretched by a factor of \\(${renderFraction(
            k_fraction.inverse()
          )}\\)`
        : ""
    }`,
    `${
      d !== 0
        ? `${
            f === "cos(x)" || f === "sin(x)"
              ? "Phase shifted"
              : "Horizontally translated"
          } \\(${renderFraction(new Fraction(Math.abs(d)))}\\) units to the ${
            d > 0 ? "right" : "left"
          }`
        : ""
    }`,
    `${
      c !== 0
        ? `${
          f === "cos(x)" || f === "sin(x)"
            ? "Vertically shifted"
            : `Vertically translated`} \\(${renderFraction(
            new Fraction(Math.abs(c))
          )}\\) units ${c > 0 ? "up" : "down"}`
        : ""
    }`,
  ].filter((transformation) => transformation !== "");

  function renderFraction(fraction: Fraction) {
    return (
      (fraction.s == -1 ? "-" : "") +
      (fraction.d === 1
        ? fraction.n.toString()
        : `\\frac{${fraction.n}}{${fraction.d}}`)
    );
  }

  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <MathJaxContext>
        <MathJax dynamic>
          <div>
            <button className="see-button" onClick={() => setIsOpen(!isOpen)}>
              {isOpen ? "Hide" : "Show"} Transformations
            </button>
            {isOpen && (
              <div>
                <p className="transformations-text">
                  {transformations.map((transformation, index) => (
                    <div key={index}>
                      {transformation ? "- " + transformation : ""}
                    </div>
                  ))}
                  {transformations.length === 0 && (
                    <div key={0}>
                      No transformations. Generate a new equation!
                    </div>
                  )}
                </p>
              </div>
            )}
          </div>
        </MathJax>
      </MathJaxContext>
    </>
  );
};

export default Transformations;
