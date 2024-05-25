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

const TransformationSteps = ({ a, k, d, c, f, b }: VariableProps) => {
  let points: number[][] = [];

  switch (f) {
    case "":
      points = [];
      break;
    case "x":
      points = [
        [-2, -2],
        [-1, -1],
        [0, 0],
        [1, 1],
        [2, 2],
      ];
      break;
    case "x^2":
      points = [
        [-2, 4],
        [-1, 1],
        [0, 0],
        [1, 1],
        [2, 4],
      ];
      break;
    case "b^x":
      b = b || 2;
      points = [
        [-2, b ** -2],
        [-1, b ** -1],
        [0, 1],
        [1, b],
        [2, b ** 2],
      ];
      break;
    case "√x":
      points = [
        [0, 0],
        [1, 1],
        [4, 2],
        [9, 3],
        [16, 4],
      ];
      break;
    case "1/x":
      points = [
        [-3, -0.333333333],
        [-2, -0.5],
        [-1, -1],
        [1, 1],
        [2, 0.5],
        [3, 0.333333333],
      ];
      break;
    case "sin(x)":
      points = [
        [0, 0],
        [90, 1],
        [180, 0],
        [270, -1],
        [360, 0],
      ];
      break;
    case "cos(x)":
      points = [
        [0, 1],
        [90, 0],
        [180, -1],
        [270, 0],
        [360, 1],
      ];
      break;
  }

  const steps = [
    `\\((x, y) \\rightarrow\\ (\\frac{x}{k} + d, ay + c)\\)`,
    `\\((x, y) \\rightarrow\\ ${
      Math.abs(k) === 1
        ? k > 0
          ? "(x"
          : "(-x"
        : `(\\frac{x}{${renderFraction(new Fraction(k))}}`
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
    `${
      new Fraction(k).d !== 1 && k !== -1
        ? `\\((x, y) \\rightarrow\\ ${
            new Fraction(k).n === 1
              ? `(${new Fraction(k).d * new Fraction(k).s}x`
              : `(\\frac{${new Fraction(k).d * new Fraction(k).s} x}{${
                  new Fraction(k).n
                }}`
          } ${
            d > 0
              ? "+" + renderFraction(new Fraction(Math.abs(d)))
              : d === 0
              ? ""
              : "-" + renderFraction(new Fraction(Math.abs(d)))
          }, ${
            Math.abs(a) !== 1
              ? renderFraction(new Fraction(a))
              : a === -1
              ? "-"
              : ""
          }y ${
            c > 0
              ? "+" + renderFraction(new Fraction(Math.abs(c)))
              : c === 0
              ? ""
              : "-" + renderFraction(new Fraction(Math.abs(c)))
          })\\)`
        : ""
    }`,
    `${
      b
        ? `The parent function is \\(b^x\\) and the value of b is ${b} \\(\\therefore\\) \\(y = ${b}^x\\)`
        : ""
    }`,
    `${
      f === ""
        ? "No parent function selected!"
        : `\\begin{array}{|c|c|c|c|}
    \\hline
    ${
      Math.abs(k) === 1
        ? k > 0
          ? `x ${
              d > 0
                ? "+" + renderFraction(new Fraction(Math.abs(d)))
                : d === 0
                ? ""
                : "-" + renderFraction(new Fraction(Math.abs(d)))
            }`
          : `-x ${
              d > 0
                ? "+" + renderFraction(new Fraction(Math.abs(d)))
                : d === 0
                ? ""
                : "-" + renderFraction(new Fraction(Math.abs(d)))
            }`
        : new Fraction(k).d !== 1 && k !== -1
        ? `${
            new Fraction(k).n === 1
              ? `${new Fraction(k).d * new Fraction(k).s}x`
              : `\\frac{${new Fraction(k).d * new Fraction(k).s} x}{${
                  new Fraction(k).n
                }}`
          } ${
            d > 0
              ? "+" + renderFraction(new Fraction(Math.abs(d)))
              : d === 0
              ? ""
              : "-" + renderFraction(new Fraction(Math.abs(d)))
          }`
        : `${`\\frac{x}{${renderFraction(new Fraction(k))}}`} ${
            d > 0
              ? "+" + renderFraction(new Fraction(Math.abs(d)))
              : d === 0
              ? ""
              : "-" + renderFraction(new Fraction(Math.abs(d)))
          }`
    } & x & y & ${
            Math.abs(a) !== 1
              ? renderFraction(new Fraction(a))
              : a === -1
              ? "-"
              : ""
          }y ${
            c > 0
              ? "+" + renderFraction(new Fraction(Math.abs(c)))
              : c === 0
              ? ""
              : "-" + renderFraction(new Fraction(Math.abs(c)))
          } \\\\ \\hline
    ${renderFraction(new Fraction(points[0][0] / k + d))} & ${renderFraction(
            new Fraction(points[0][0])
          )} & ${renderFraction(new Fraction(points[0][1]))} & ${renderFraction(
            new Fraction(a * points[0][1] + c)
          )} \\\\ \\hline
    ${renderFraction(new Fraction(points[1][0] / k + d))} & ${renderFraction(
            new Fraction(points[1][0])
          )} & ${renderFraction(new Fraction(points[1][1]))} & ${renderFraction(
            new Fraction(a * points[1][1] + c)
          )} \\\\ \\hline
    ${renderFraction(new Fraction(points[2][0] / k + d))} & ${renderFraction(
            new Fraction(points[2][0])
          )} & ${renderFraction(new Fraction(points[2][1]))} & ${renderFraction(
            new Fraction(a * points[2][1] + c)
          )} \\\\ \\hline
    ${renderFraction(new Fraction(points[3][0] / k + d))} & ${renderFraction(
            new Fraction(points[3][0])
          )} & ${renderFraction(new Fraction(points[3][1]))} & ${renderFraction(
            new Fraction(a * points[3][1] + c)
          )} \\\\ \\hline
    ${renderFraction(new Fraction(points[4][0] / k + d))} & ${renderFraction(
            new Fraction(points[4][0])
          )} & ${renderFraction(new Fraction(points[4][1]))} & ${renderFraction(
            new Fraction(a * points[4][1] + c)
          )} \\\\ \\hline
    ${
      points[5]
        ? `${renderFraction(
            new Fraction(points[5][0] / k + d)
          )} & ${renderFraction(new Fraction(points[5][0]))} & ${renderFraction(
            new Fraction(points[5][1])
          )} & ${renderFraction(
            new Fraction(a * points[5][1] + c)
          )} \\\\ \\hline`
        : ""
    }
    \\end{array}`
    }`,
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
        <MathJax dynamic>
          <div>
            <button className="see-button" onClick={() => setIsOpen(!isOpen)}>
              {isOpen ? "Hide" : "Show"} Transformation Steps
            </button>
            {isOpen && (
              <div>
                <p className="transformations-text">
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
