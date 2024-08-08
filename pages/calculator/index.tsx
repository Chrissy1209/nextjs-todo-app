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

const Calculator = () => {
  let [numbers, setNumbers] = useState<string[]>(["", ""]);
  let [displayNumber, setDisplayNumber] = useState("0");
  let [method, setMethod] = useState(methodType.unset);
  // isOperatorClick will be true when ÷, x, -, +, and = is clicked.
  let [isOperatorClick, setIsOperatorClick] = useState(false); 
  // isOperatorOccupied will be true when ÷, x, -, + is clicked.
  let [isOperatorOccupied, setIsOperatorOccupied] = useState(false); 

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
      } else if (isOperatorClick) {
        // if previous step is operator(OperatorClick = true), store previous dNumber(handled by handleOperatorClick) and start a new one.
        setDisplayNumber(e);
        setIsOperatorClick(false);
        setIsOperatorOccupied(false);
      } else setDisplayNumber((pre) => pre + e); // in normal cases, add clicke number to displayNumber: 1 -> 12
    },
    [isOperatorClick, displayNumber]
  );

  const handleResetClick = useCallback(() => {
    setDisplayNumber("0");
    setNumbers(["", ""]);
    setMethod(methodType.unset);
    setIsOperatorClick(false);
    setIsOperatorOccupied(false);
  }, []);

  // handle plus and minus sign toggle
  const handleToggleSignClick = useCallback(() => {
    if (displayNumber === "0") setDisplayNumber("-0");
    else if (displayNumber === "-0") setDisplayNumber("0");
    else if (isOperatorClick && numbers[1] === "") setDisplayNumber("-0"); // if previous steps is operator(isOperatorClick = true) and NOT yet submited, start a new minus dNumber -> -0
    else setDisplayNumber((pre) => String(Number(pre) * -1));
    // p.s. submit will store the displayNumber to numbers[1], which is used to continuous submit process.
  }, [displayNumber, isOperatorClick, numbers]);

  const handlePercentageClick = useCallback(() => { // TODO: up to 12 digits
    // display section is up to 12 digits
    // e.g. 33.3333 / 100 = 0.3333..
    const num = Number(displayNumber) / 100;
    console.log(num);
    const length = String(num).length;
    if (length > 13) setDisplayNumber(String(num.toExponential(2)));
    else setDisplayNumber(String(num));
  
    // if (num.toFixed(12 - length) === "0.000000000") setDisplayNumber(String(num));
    // else setDisplayNumber(String(num.toFixed(12 - length)));
  }, [displayNumber]);

    // handle calculation, which called by handleOperatorClick and handleSubmitClick(if numbers[1] === "")
    const calculateResult = useCallback(
      (num1: number, num2: number, med: string) => {
      let result = num1;
      switch (med) {
        case methodType.divide:
          result /= num2;
          break;
        case methodType.multiply:
          result *= num2;
          break;
        case methodType.subtract:
          result -= num2;
          break;
        case methodType.add:
          result += num2;
          break;
        default:
          break;
      }
      // display section is up to 12 digits
      const integerPartLength  = String(Math.floor(result)).length;
      
      // if integerPartLength > 12, convert to scientific notation
      if (integerPartLength > 12) {
        return result.toExponential(2);
      } else {
        // else, e.g. 33.3333333...
        const decimalPlaces = 12 - integerPartLength;
        return parseFloat(result.toFixed(decimalPlaces));
      }
    }, []);

  // handle displayNumber and numbers[], controlled by operator
  const handleOperatorClick = useCallback(
    (med: string) => {
      setMethod(med);
      if(isOperatorOccupied) return;
      
      if (numbers[0] === "" || numbers[1] !== "") {
        // if init state(numbers[0] === "") or previous step is submit(numbers[1] !== ""), store displayNumber to numbers[0] and reset number[1] to "".
        setNumbers([displayNumber, ""]);
      } else {
        // continuous operator process
        const value = calculateResult(Number(numbers[0]), Number(displayNumber), method);
        setNumbers(([_, pre]) => [String(value), pre]);
      }
      setIsOperatorClick(true);
      setIsOperatorOccupied(true);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [numbers, displayNumber, isOperatorOccupied, calculateResult]
  );

  // handle submit(=) click
  const handleSubmitClick = useCallback(() => {
    setIsOperatorOccupied(false);
    if (numbers[1] === "") {
      // using number[0] and displayNumber to calculate
      const value = calculateResult(Number(numbers[0]), Number(displayNumber), method);
      setDisplayNumber(String(value));

      // store the displayNumber to numbers[1], which is using to continuous submit process.
      setNumbers([String(value), displayNumber]); 
    } else {
      // if numbers[1] !== "", which means user continuous click submit. using displayNumber and number[1] to calculate  
      const value = calculateResult(Number(displayNumber), Number(numbers[1]), method);
      setDisplayNumber(String(value));

      setNumbers(([_, pre]) => [String(value), pre]);
    }
  }, [method, numbers, displayNumber, calculateResult]);

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
            className={`${styles.item} ${styles.operator}`}
            onClick={() => handleOperatorClick(methodType.divide)}
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
            className={`${styles.item} ${styles.operator}`}
            onClick={() => handleOperatorClick(methodType.multiply)}
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
            className={`${styles.item} ${styles.operator}`}
            onClick={() => handleOperatorClick(methodType.subtract)}
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
            className={`${styles.item} ${styles.operator}`}
            onClick={() => handleOperatorClick(methodType.add)}
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
            className={`${styles.item} ${styles.operator}`}
            onClick={handleSubmitClick}
          >
            =
          </div>
        </div>
      </div>
    </div>
  );
};

export default Calculator;
