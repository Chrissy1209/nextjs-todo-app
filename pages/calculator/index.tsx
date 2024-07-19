import { useCallback, useEffect, useState } from "react";
import styles from "./calculator.module.scss";

const methodType = {
  add: "add",
  subtract: "subtract",
  multiply: "multiply",
  divide: "divide",
  submit: "submit",
  unset: "unset",
};

const calculator = () => {
  let [numbers, setNumbers] = useState<string[]>(["", ""]);
  let [displayNumber, setDisplayNumber] = useState("0");

  let [method, setMethod] = useState(methodType.unset);
  let [isOperatorClick, setIsOperatorClick] = useState(false);

  useEffect(() => {
    console.log(numbers);
  }, [numbers]);

  const handleKeyboardClick = useCallback(
    (e: string) => {
      if (displayNumber === "0") setDisplayNumber(e);
      else if (displayNumber === "-0") {
        setDisplayNumber("-" + e);
        setIsOperatorClick(false);
      } else if (isOperatorClick) {
        setDisplayNumber(e);
        setIsOperatorClick(false);
      } else setDisplayNumber((pre) => pre + e);
    },
    [isOperatorClick, displayNumber]
  );

  const handleResetClick = useCallback(() => {
    setDisplayNumber("0");
    setNumbers(["", ""]);
    setMethod(methodType.unset);
    setIsOperatorClick(false);
  }, []);

  const handleSignClick = useCallback(() => {
    if (isOperatorClick) {
      setDisplayNumber("-0");
      return;
    }

    if (displayNumber === "0") setDisplayNumber("-0");
    else if (displayNumber === "-0") setDisplayNumber("0");
    else setDisplayNumber((pre) => String(Number(pre) * -1));
  }, [displayNumber, isOperatorClick]);

  const handlePercentageClick = useCallback(() => {
    setDisplayNumber((pre) => String(Number(pre) / 100));
  }, []);

  const handleOeratorClick = useCallback(
    (med: string) => {
      setMethod(med);
      // if (isOperatorClick) return;
      // if (isOperatorClick && med === method) return; //FIXME: 3 ++++++ -> 3 not 27

      if (numbers[0] === "" || numbers[1] !== "") {
        setNumbers(([_, pre]) => [displayNumber, pre]);
      } else {
        let value = handleCalculat();
        setNumbers(([_, pre]) => [String(value), pre]);
      }
      setNumbers(([pre, _]) => [pre, ""]);
      setIsOperatorClick(true);
    },
    [isOperatorClick, method, numbers, displayNumber]
  );

  const handleSubmitClick = useCallback(() => {
    setIsOperatorClick(true);

    if (numbers[1] === "") {
      setNumbers(([pre, _]) => [pre, displayNumber]);

      let value = handleCalculat();
      setNumbers(([_, pre]) => [String(value), pre]);
      setDisplayNumber(String(value));
    } else {
      let calculateNumber = Number(displayNumber);
      switch (method) {
        case methodType.divide:
          calculateNumber /= Number(numbers[1]);
          break;
        case methodType.multiply:
          calculateNumber *= Number(numbers[1]);
          break;
        case methodType.subtract:
          calculateNumber -= Number(numbers[1]);
          break;
        case methodType.add:
          calculateNumber += Number(numbers[1]);
          break;
        default:
          break;
      }
      setDisplayNumber(String(calculateNumber));
      setNumbers(([_, pre]) => [String(calculateNumber), pre]);
    }
  }, [method, numbers, displayNumber]);

  const handleCalculat = () => {
    let calculateNumber = Number(numbers[0]);
    switch (method) {
      case methodType.divide:
        calculateNumber /= Number(displayNumber);
        break;
      case methodType.multiply:
        calculateNumber *= Number(displayNumber);
        break;
      case methodType.subtract:
        calculateNumber -= Number(displayNumber);
        break;
      case methodType.add:
        calculateNumber += Number(displayNumber);
        break;
      default:
        break;
    }
    return calculateNumber;
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Here is your online calculator!</h1>
      <div className={styles.calculator}>
        <div className={styles.display}>{displayNumber}</div>

        <div className={styles.keyboard}>
          <div
            className={`${styles.item} ${styles.lightgray}`}
            onClick={handleResetClick}
          >
            C
          </div>
          <div
            className={`${styles.item} ${styles.lightgray}`}
            onClick={handleSignClick}
          >
            +/-
          </div>
          <div
            className={`${styles.item} ${styles.lightgray}`}
            onClick={handlePercentageClick}
          >
            %
          </div>
          <div
            className={`${styles.item} ${styles.operator} ${
              method === methodType.divide && styles.action
            }`}
            onClick={() => handleOeratorClick(methodType.divide)}
          >
            ÷
          </div>
          <div className={styles.item} onClick={() => handleKeyboardClick("7")}>
            7
          </div>
          <div className={styles.item} onClick={() => handleKeyboardClick("8")}>
            8
          </div>
          <div className={styles.item} onClick={() => handleKeyboardClick("9")}>
            9
          </div>
          <div
            className={`${styles.item} ${styles.operator} ${
              method === methodType.multiply && styles.action
            }`}
            onClick={() => handleOeratorClick(methodType.multiply)}
          >
            x
          </div>
          <div className={styles.item} onClick={() => handleKeyboardClick("4")}>
            4
          </div>
          <div className={styles.item} onClick={() => handleKeyboardClick("5")}>
            5
          </div>
          <div className={styles.item} onClick={() => handleKeyboardClick("6")}>
            6
          </div>
          <div
            className={`${styles.item} ${styles.operator} ${
              method === methodType.subtract && styles.action
            }`}
            onClick={() => handleOeratorClick(methodType.subtract)}
          >
            -
          </div>
          <div className={styles.item} onClick={() => handleKeyboardClick("1")}>
            1
          </div>
          <div className={styles.item} onClick={() => handleKeyboardClick("2")}>
            2
          </div>
          <div className={styles.item} onClick={() => handleKeyboardClick("3")}>
            3
          </div>
          <div
            className={`${styles.item} ${styles.operator} ${
              method === methodType.add && styles.action
            }`}
            onClick={() => handleOeratorClick(methodType.add)}
          >
            +
          </div>
          <div className={styles.item} onClick={() => handleKeyboardClick("0")}>
            0
          </div>
          <div className={styles.item} onClick={() => handleKeyboardClick("0")}>
            0
          </div>
          <div className={styles.item}>.</div>
          <div
            className={`${styles.item} ${styles.operator} ${
              method === methodType.submit && styles.action
            }`}
            onClick={handleSubmitClick}
          >
            =
          </div>
        </div>
      </div>
    </div>
  );
};

export default calculator;
