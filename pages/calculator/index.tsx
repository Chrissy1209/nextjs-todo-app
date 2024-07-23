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
  let [isOperatorClick, setIsOperatorClick] = useState(false); // isOperatorClick will be true when ÷, x, -, +, and = is clicked.

  useEffect(() => {
    console.log(numbers);
  }, [numbers]);

  // handle displayNumber showing, controlled by 0 ~ 9 keyboard
  const handleKeyboardClick = useCallback(
    (e: string) => {
      if (displayNumber === "0") setDisplayNumber(e); // 0 -> 1
      else if (displayNumber === "-0") { // -0 -> -1
        setDisplayNumber("-" + e);
        setIsOperatorClick(false);
      } else if (isOperatorClick) { // if previous step is operator(OperatorClick = true), store previous dNumber(handled by handleOeratorClick) and start a new one.
        setDisplayNumber(e);
        setIsOperatorClick(false);
      } else setDisplayNumber((pre) => pre + e); // in normal cases, add clicke number to displayNumber: 1 -> 12
    },
    [isOperatorClick, displayNumber]
  );

  const handleResetClick = useCallback(() => {
    setDisplayNumber("0");
    setNumbers(["", ""]);
    setMethod(methodType.unset);
    setIsOperatorClick(false);
  }, []);

  // handle plus and minus sign toggle
  const handleToggleSignClick = useCallback(() => {
    if (displayNumber === "0") setDisplayNumber("-0");
    else if (displayNumber === "-0") setDisplayNumber("0");
    else if (isOperatorClick && numbers[1] === "") setDisplayNumber("-0"); // if previous steps is operator(isOperatorClick = true) and NOT being submit, start a new minus dNumber -> -0
    else setDisplayNumber((pre) => String(Number(pre) * -1));
    // p.s. submit will store the displayNumber to numbers[1], which is using to continuous submit process.
  }, [displayNumber, isOperatorClick, numbers]);

  const handlePercentageClick = useCallback(() => {
    setDisplayNumber((pre) => String(Number(pre) / 100));
  }, []);

  // handle displayNumber and numbers[], controlled by operator
  const handleOeratorClick = useCallback(
    (med: string) => {
      setMethod(med);
      // if (isOperatorClick && med === method) return; //FIXME: 3 ++++ should still be 3, not 15
      
      if (numbers[0] === "" || numbers[1] !== "") { // if init state(numbers[0] === "") or previous step is submit(numbers[1] !== ""), store displayNumber to numbers[0] and reset number[1] to "".
        setNumbers([displayNumber, ""]);
      } else {
        let value = handleCalculat();
        setNumbers(([_, pre]) => [String(value), pre]);
      }
      setIsOperatorClick(true);
    },
    [numbers, displayNumber]
  );

  // handle submit(=) click
  const handleSubmitClick = useCallback(() => {
    if (numbers[1] === "") { // using number[0] and displayNumber to calculate
      let value = handleCalculat();
      setNumbers(([_, pre]) => [String(value), pre]);
      setDisplayNumber(String(value));
      setNumbers(([pre, _]) => [pre, displayNumber]); // store the displayNumber to numbers[1], which is using to continuous submit process.
    } else { // if numbers[1] !== "", which means user continuous click submit. using displayNumber and number[1] to calculate  
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
      calculateNumber = parseFloat(calculateNumber.toFixed(5));
      setDisplayNumber(String(calculateNumber));
      setNumbers(([_, pre]) => [String(calculateNumber), pre]);
    }
  }, [method, numbers, displayNumber]);

  // handle calculation, which called by handleOeratorClick and handleSubmitClick(if numbers[1] === "")
  const handleCalculat = useCallback(() => {
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
    return parseFloat(calculateNumber.toFixed(5));
  }, [numbers, method, displayNumber]);

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
            onClick={handleToggleSignClick}
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
