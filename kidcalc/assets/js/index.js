const buttonList = document.querySelectorAll(".button--calculator");
const calculatorText = document.querySelector(".js-calcText");
const displayEquation = document.querySelector(".js-displayEquation");
let result;
let currentCalc;
calculatorText.innerText = "";

// Functional version of objects
const calculatorObject = (operator, num1, num2, result) => {
  return {
    operator: operator,
    num1: num1,
    num2: num2,
    result: result,
  };
};

const calculatorTokenize = (input) => {
  let operator = "";

  switch (true) {
    case input.includes("+"):
      operator = "+";
      break;
    case input.includes("-"):
      operator = "-";
      break;
    case input.includes("<"):
      operator = "<";
      break;
    case input.includes(">"):
      operator = ">";
      break;
    default:
      console.error("Tokenize fail");
      return;
  }

  let segments = input.split(operator);
  let num1 = parseInt(segments[0]);
  let num2 = parseInt(segments[1]);
  if (operator == "" || isNaN(num1) || isNaN(num2)) {
    console.error("Tokenize fail");
    return;
  }

  return calculatorObject(operator, num1, num2);
};

const calculatorParse = (calcText) => {
  const calculator = calculatorTokenize(calcText);
  if (calculator === undefined) return;

  switch (calculator.operator) {
    case "+":
      calculator.result = calculator.num1 + calculator.num2;
      break;
    case "-":
      calculator.result = calculator.num1 - calculator.num2;
      break;
    case ">":
      calculator.result = calculator.num1 > calculator.num2;
      break;
    case "<":
      calculator.result = calculator.num1 < calculator.num2;
      break;
    default:
      console.error("Parse Fail");
      return;
  }

  return calculator;
};

const calculatorInput = (append) => {
  switch (append) {
    case "C":
      calculatorText.innerText = "";
      currentCalc = undefined;
      break;
    case "1":
    case "2":
    case "3":
    case "4":
    case "5":
    case "6":
    case "7":
    case "8":
    case "9":
    case "0":
      calculatorText.innerText += append;
      break;
    case "+":
    case "-":
    case ">":
    case "<":
      // Only allow one operator
      if (
        calculatorText.innerText.includes("+") ||
        calculatorText.innerText.includes("-") ||
        calculatorText.innerText.includes(">") ||
        calculatorText.innerText.includes("<")
      )
        break;

      calculatorText.innerText += append;
      break;
    case "=":
      currentCalc = calculatorParse(calculatorText.innerText);
      displayEquation.innerText = `${currentCalc.num1} ${currentCalc.operator} ${currentCalc.num2}`;
      switch (currentCalc.operator) {
        case "+":
        case "-":
          document.querySelector(".answer__text").className = "answer__text";
          document.querySelector(".answer__bool").className =
            "answer__bool hide";
          break;
        case ">":
        case "<":
          document.querySelector(".answer__text").className =
            "answer__text hide";
          document.querySelector(".answer__bool").className = "answer__bool";
          break;
      }
      break;
  }
};

buttonList.forEach((button) => {
  button.addEventListener("click", () => {
    calculatorInput(button.innerText);
  });
});
