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

const TransformationSteps = ({ a, k, d, c, f }: VariableProps) => {
  const steps = [
    `\\((x, y) \\rightarrow\\ (\\frac{x}{k} + d, ay + c)\\)`,
    `\\((x, y) \\rightarrow\\ ${
      Math.abs(k) === 1
        ? k > 0
          ? "x"
          : "-x"
        : `\\frac{x}{${renderFraction(new Fraction(k))}}`
    } ${
      d > 0
        ? "+" + renderFraction(new Fraction(Math.abs(d)))
        : d === 0
        ? ""
        : "-" + renderFraction(new Fraction(Math.abs(d)))
    }, ${
      Math.abs(a) !== 1 ? renderFraction(new Fraction(a)) : a === -1 ? "-" : ""
    }y ${
      c > 0
        ? "+" + renderFraction(new Fraction(Math.abs(c)))
        : c === 0
        ? ""
        : "-" + renderFraction(new Fraction(Math.abs(c)))
    })\\)`,
    `\\begin{array}{|c|c|c|c|}
    \\hline
    ${
      Math.abs(k) === 1
        ? k > 0
          ? "x"
          : "-x"
        : `\\frac{x}{${renderFraction(new Fraction(k))}}`
    } ${
      d > 0
        ? "+" + renderFraction(new Fraction(Math.abs(d)))
        : d === 0
        ? ""
        : "-" + renderFraction(new Fraction(Math.abs(d)))
    } & x & y & ${
      Math.abs(a) !== 1 ? renderFraction(new Fraction(a)) : a === -1 ? "-" : ""
    }y ${
      c > 0
        ? "+" + renderFraction(new Fraction(Math.abs(c)))
        : c === 0
        ? ""
        : "-" + renderFraction(new Fraction(Math.abs(c)))
    } \\\\ \\hline
    1 & x & y & 2 \\\\ \\hline
    1 & x & y & 2 \\\\ \\hline
    1 & x & y & 2 \\\\ \\hline
    1 & x & y & 2 \\\\ \\hline
    1 & x & y & 2 \\\\ \\hline
    1 & x & y & 2 \\\\ \\hline
    \\end{array}`,
  ];

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
        <MathJax>
          <div>
            <button className="see-button" onClick={() => setIsOpen(!isOpen)}>
              {isOpen ? "Hide" : "Show"} Transformation Steps
            </button>
            {isOpen && (
              <div>
                <p className="transformations-text">
                  Coming soon!
                  {steps.map((steps, index) => (
                    <div key={index}>{steps}</div>
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

export default TransformationSteps;
