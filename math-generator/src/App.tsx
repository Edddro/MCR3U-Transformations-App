import { useState } from "react";
import "./index.css";
import Variables from "./Variables";
import Transformations from "./Transformations";
import Rearrangements from "./Rearrangements";
import TransformationSteps from "./TransformationSteps";

function App() {
  function getRandomDecimal() {
    const generateValidValue = () => {
      const isFraction = Math.random() < 0.3;
      if (isFraction) {
        const numerator = Math.floor(Math.random() * 20) + 1;
        const denominator = Math.floor(Math.random() * 20) + 1;
        return numerator / denominator;
      } else {
        let randomInt = Math.floor(Math.random() * 21) - 10;
        while (randomInt === 0 || randomInt > 15 || randomInt < -15) {
          randomInt = Math.floor(Math.random() * 21) - 10;
        }
        return randomInt;
      }
    };

    let value = generateValidValue();
    return value;
  }

  const [f, setF] = useState("");
  const [a, setA] = useState(getRandomDecimal());
  const [k, setK] = useState(getRandomDecimal());
  const [d, setD] = useState(f !== "cos(x)" && f !== "sin(x)" ?
    Math.floor(
      Math.random() * (Math.floor(10) - Math.ceil(-5) + 1) + Math.ceil(-5)
    ) : Math.random() < 0.5 ? 0 - Math.floor(Math.random() * 67) * 15 : 0 + Math.floor(Math.random() * 67) * 15);
  const [c, setC] = useState(
    Math.floor(
      Math.random() * (Math.floor(15) - Math.ceil(-5) + 1) + Math.ceil(-5)
    )
  );
  const [b, setB] = useState(() => {
    if (f === "b^x") {
      return Math.floor(
        Math.random() * (Math.floor(15) - Math.ceil(-5) + 1) + Math.ceil(-5)
      );
    } else {
      return undefined;
    }
  });
  if (b === 0) {
    setB(
      Math.floor(
        Math.random() * (Math.floor(15) - Math.ceil(-5) + 1) + Math.ceil(-5)
      )
    );
  }
  let c_in_front_a = Math.random() < 0.2;
  let k_unfactored = Math.random() < 0.3;

  return (
    <>
      <div>
        <Variables
          a={a}
          b={b}
          k={k}
          d={d}
          c={c}
          f={f}
          c_in_front_a={c_in_front_a}
          k_unfactored={k_unfactored}
        />
      </div>
      <div>
        <select
          value={f}
          onChange={(e) => {
            setF(e.target.value);
            if (e.target.value !== "b^x") {
              setB(undefined);
            } else {
              setB(
                Math.floor(
                  Math.random() * (Math.floor(15) - Math.ceil(-5) + 1) +
                    Math.ceil(-5)
                )
              );
            }
          }}
          className="dropdown"
        >
          <option value="" disabled hidden>
            Select Parent Function
          </option>
          <option value="x">x</option>
          <option value="x^2">x²</option>
          <option value="√x">√x</option>
          <option value="1/x">1/x</option>
          <option value="b^x">b^x</option>
          <option value="sin(x)">sin(x)</option>
          <option value="cos(x)">cos(x)</option>
        </select>
        <button onClick={() => setA(getRandomDecimal())}>Generate A</button>
        {f === "b^x" ? (
          <button
            onClick={() =>
              setB(
                Math.floor(
                  Math.random() * (Math.floor(15) - Math.ceil(-5) + 1) +
                    Math.ceil(-5)
                )
              )
            }
          >
            Generate B
          </button>
        ) : (
          ""
        )}
        <button onClick={() => setK(getRandomDecimal())}>Generate K</button>
        <button
          onClick={() =>
            setD(f !== "cos(x)" && f !== "sin(x)" ?
            Math.floor(
              Math.random() * (Math.floor(10) - Math.ceil(-5) + 1) + Math.ceil(-5)
            ) : Math.random() < 0.5 ? 0 - Math.floor(Math.random() * 67) * 15 : 0 + Math.floor(Math.random() * 67) * 15)
          }
        >
          Generate D
        </button>
        <button
          onClick={() =>
            setC(
              Math.floor(
                Math.random() * (Math.floor(15) - Math.ceil(-5) + 1) +
                  Math.ceil(-5)
              )
            )
          }
        >
          Generate C
        </button>
        <button
          onClick={() => {
            setA(getRandomDecimal());
            setK(getRandomDecimal());
            setD(f !== "cos(x)" && f !== "sin(x)" ?
            Math.floor(
              Math.random() * (Math.floor(10) - Math.ceil(-5) + 1) + Math.ceil(-5)
            ) : Math.random() < 0.5 ? 0 - Math.floor(Math.random() * 67) * 15 : 0 + Math.floor(Math.random() * 67) * 15);
            setC(
              Math.floor(
                Math.random() * (Math.floor(15) - Math.ceil(-5) + 1) +
                  Math.ceil(-5)
              )
            );

            f === "b^x"
              ? setB(Math.floor(Math.random() * 21) - 10)
              : setB(undefined);
          }}
        >
          Generate All
        </button>
      </div>
      <div>
        <input
          type="number"
          placeholder={"Set Value For A"}
          onChange={(e) => {
            const value = Number(e.target.value);
            if (!isNaN(value) && value !== 0 && value <= 100 && value >= -100) {
              setA(value);
            }
          }}
          className="input-box"
        />
        <input
          type="number"
          placeholder={"Set Value For K"}
          onChange={(e) => {
            const value = Number(e.target.value);
            if (!isNaN(value) && value !== 0 && value <= 100 && value >= -100) {
              setK(value);
            }
            }}
            className="input-box"
          />
          <input
            type="number"
            placeholder={"Set Value For D"}
            onChange={(e) => {
            const value = Number(e.target.value);
            if (!isNaN(value)) {
              if (f !== "cos(x)" && f !== "sin(x)") {
              if (value <= 100 && value >= -100) {
                if (Number.isInteger(value)) {
                setD(value);
                } else {
                setD(Math.floor(value));
                }
              }
              } else {
              if (value <= 1000 && value >= -1000) {
                if (Number.isInteger(value)) {
                setD(value);
                } else {
                setD(Math.floor(value));
                }
              }
              }
            }
            }}
            className="input-box"
          />
          <input
            type="number"
            placeholder={"Set Value For C"}
            onChange={(e) => {
            const value = Number(e.target.value);
            if (!isNaN(value) && value <= 100 && value >= -100) {
              if (Number.isInteger(value)) {
                setC(value);
              } else {
                setC(Math.floor(value));
              }
            }
          }}
          className="input-box"
        />
      </div>
      <div>
        <Transformations a={a} k={k} d={d} c={c} f={f} />
      </div>
      <div>
        <Rearrangements
          a={a}
          k={k}
          d={d}
          c={c}
          f={f}
          b={b}
          c_in_front_a={c_in_front_a}
          k_unfactored={k_unfactored}
        />
      </div>
      <div>
        <TransformationSteps
          a={a}
          k={k}
          d={d}
          c={c}
          f={f}
          b={b}
        />
      </div>
    </>
  );
}

export default App;
