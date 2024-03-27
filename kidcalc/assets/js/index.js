const buttonList = document.querySelectorAll(".button--calculator");
const calculatorText = document.querySelector(".js-calcText");
const displayEquation = document.querySelector(".js-displayEquation");
const submit = document.querySelector(".js-submit-answer");
const wins = document.querySelector(".js-count-correct");
let winsNum = 0;
const streak = document.querySelector(".js-count-streak");
let streakNum = 0;
let result;
let currentCalc;
calculatorText.innerText = "";
let overwrite = false;
const user = document.querySelector("#username");

document.querySelector("#theme").addEventListener("change", (e) => {
  let theme = e.target.value;

  // Create a new element to add to the header for the theme
  let themeElement = document.createElement("link");
  themeElement.rel = "stylesheet";
  themeElement.type = "text/css";
  themeElement.href = "assets/css/themes/" + theme + ".css";
  document.getElementsByTagName("head")[0].appendChild(themeElement);
});

const saveToLocal = () => {
  const username = document.querySelector(".js-user").innerText;
  localStorage.setItem(username.toLowerCase() + "wins", winsNum);
  localStorage.setItem(username.toLowerCase() + "streak", streakNum);
};

const loadFromLocal = (username) => {
  let wins = localStorage.getItem(username.toLowerCase() + "wins");
  let streak = localStorage.getItem(username.toLowerCase() + "streak");
  document.querySelector(".js-user").innerText = username;
  if (wins === null || streak === null) {
    winsNum = 0;
    streakNum = 0;
    return;
  }
  winsNum = wins;
  streakNum = streak;
};

document.querySelector(".button--login").addEventListener("click", () => {
  const username = user.value;
  loadFromLocal(username);
  updateStats();
});

const updateStats = () => {
  wins.innerText = winsNum;
  streak.innerText = streakNum;
};

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
      displayEquation.innerText = "";
      currentCalc = undefined;
      document.querySelector(".answer__text").className = "answer__text hide";
      document.querySelector(".answer__bool").className = "answer__bool hide";
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
      if (overwrite) {
        calculatorText.innerText = append;
        overwrite = false;
        break;
      }
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

submit.addEventListener("click", () => {
  let input = document.querySelector(".js-input").value;
  if (currentCalc === undefined) return;
  if (input == currentCalc.result) {
    displayEquation.innerText = "Correct";
    winsNum += 1;
    streakNum += 1;
    calculatorText.innerText = currentCalc.result;
  } else {
    displayEquation.innerText = "Wrong";
    streakNum = 0;
    calculatorText.innerText = currentCalc.result;
  }

  updateStats();
  currentCalc = undefined;
  overwrite = true;
  saveToLocal();
});

document.querySelectorAll(".button--question").forEach((button) => {
  button.addEventListener("click", () => {
    let choice = button.dataset.value;
    let input;

    if (choice === "yes") input = true;
    else if (choice === "no") input = false;
    else return;

    if (currentCalc === undefined) return;
    if (input == currentCalc.result) {
      displayEquation.innerText = "Correct";
      winsNum += 1;
      streakNum += 1;
    } else {
      displayEquation.innerText = "Wrong";
      streakNum = 0;
    }

    updateStats();
    currentCalc = undefined;
    overwrite = true;
    saveToLocal();
  });
});
