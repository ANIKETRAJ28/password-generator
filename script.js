const dispPass = document.querySelector(".passBox");
const passCopy = document.querySelector("[passDisplayNumber]");
const passCopyShow = document.querySelector("[passCopy]");
const slider = document.querySelector("[passStrengthSlider]");
const passLen = document.querySelector("[passLengthNumber]");
const uppercase = document.querySelector("#uppercase");
const lowercase = document.querySelector("#lowercase");
const numbers = document.querySelector("#numbers");
const symbols = document.querySelector("#symbols");
const generatePass = document.querySelector(".generateButton");
const passwordStrengthIndicator = document.querySelector(".strengthIndiacator");
const allCheckbox = document.querySelectorAll('input[type="checkbox"]');
const symbol = "!@#$%^&*?/_-+=:;'{[}]|>.<~`";

let passwordLength = 8;
let password = "";
let checkCount = 0;

// the handleSlider() function will set the displaying password length to the passwordLength and by default the slider value is also set to the password length
function handleSlider() {
  slider.value = passwordLength;
  passLen.innerText = passwordLength;
}
handleSlider();

// the changeIndicatorColor() function will set the strength of the indicator of the color given
function changeIndicatorColor(color) {
  passwordStrengthIndicator.style.backgroundColor = color;
}

// getRandom() function will generate random no. between the given two inputs
function getRandom(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

function generateRandomNumber() {
  return getRandom(0, 9);
}

function generateRandomUppercase() {
  return String.fromCharCode(getRandom(65, 91));
}

function generateRandomLowercase() {
  return String.fromCharCode(getRandom(97, 122));
}

function generateRandomSymbols() {
  const randomNumber = getRandom(0, symbol.length - 1);
  return symbol[randomNumber];
}

// calculateStrength() function will calculate the strength of the password and set the indicator to the color
function calculateStrength() {
  let hasUpper = false;
  let hasLower = false;
  let hasNumber = false;
  let hasSymbol = false;

  // firstly it will set all the types of fields to false, then it will check the fields
  // if they are ticked then it will make then true and proceed the further procedure

  if (uppercase.checked) {
    hasUpper = true;
  }
  if (lowercase.checked) {
    hasLower = true;
  }
  if (numbers.checked) {
    hasNumber = true;
  }
  if (symbols.checked) {
    hasSymbol = true;
  }
  if (hasNumber && hasLower && hasUpper && hasSymbol && passwordLength >= 8) {
    changeIndicatorColor("green");
  } else if (hasNumber && hasLower && hasUpper && passwordLength >= 6) {
    changeIndicatorColor("orange");
  } else {
    changeIndicatorColor("red");
  }
}

// this async function copyClipboard() is a asynchronous function which returns a promise and the navigator.clipboard.writeText() uses the api and copies the text/ value to the clipboard
async function copyClipboard() {
  try {
    await navigator.clipboard.writeText(dispPass.value);
    passCopy.innerText = "copied";
    passCopy.classList.add("active");
  } catch (e) {
    passCopy.innerText = "falied";
  }

  // setTimeout(() => {
  //   passCopy.classList.remove("active");
  // }, 2000);
}

// the handleCheckbox() function checkes and count the no. of checkboxes which are checked
function handleCheckbox() {
  checkCount = 0;
  allCheckbox.forEach((checkbox) => {
    if (checkbox.checked) {
      checkCount++;
    }
  });

  // the edgecase is handled if the checkboxes are more than the password length
  // for example if the count of checkboxes are 4 and password length is 2 then it is not possible to insert 4 types of character in 2 digit password
  // in that case the password length is set to the checkbox count
  if (passwordLength < checkCount) {
    passwordLength = checkCount;
    handleSlider();
  }
}

// this loop will iterate to all the checkboxes and adds the eventlistner of the function that we discusses just before
allCheckbox.forEach((checkbox) => {
  checkbox.addEventListener("change", handleCheckbox);
});

function shufflePassword(array) {
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    let temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
  let finalPass = "";
  array.forEach((e) => (finalPass += e));
  return finalPass;
}

// it will add the eventlistner which changes the password length to the slider's value and the handleSlider() function sets the slider's value again to the password length which we changed just now and change the password which is displaying to the password length
slider.addEventListener("input", (e) => {
  passwordLength = e.target.value;
  handleSlider();
});

// this adds the eventlistner to copy the output password if it's not empty
passCopy.addEventListener("click", () => {
  if (dispPass.value) copyClipboard();
});

// the final button by which everything will be executed
generatePass.addEventListener("click", () => {
  // this will againadds the eventlistner to the checkboxes
  allCheckbox.forEach((el) => {
    el.addEventListener("change", handleCheckbox());
  });
  if (checkCount <= 0) return;
  if (passwordLength < checkCount) {
    passwordLength = checkCount;
    handleSlider();
  }
  password = "";
  // this funcArr is an array of multiple functions
  // which are added if the checkboxes are checked
  let funcArr = [];
  if (uppercase.checked) funcArr.push(generateRandomUppercase);
  if (lowercase.checked) funcArr.push(generateRandomLowercase);
  if (numbers.checked) funcArr.push(generateRandomNumber);
  if (symbols.checked) funcArr.push(generateRandomSymbols);
  // this loop will iterate to the indices of the funcArr and and adds the random generated character to the password
  for (let i = 0; i < funcArr.length; i++) {
    password += funcArr[i]();
  }
  // this loop will work if the password length is greater than the checkboxes length
  // the randomIndex will generate any random index of the fucArr and then the function at that index is called
  for (let i = 0; i < passwordLength - funcArr.length; i++) {
    let randomIndex = getRandom(0, funcArr.length);
    password += funcArr[randomIndex]();
  }
  // the shufflePassword is a function which shuffles the elements in the password string using fisher yates principal
  // Array.from(password) method is used to convert the passed parameter to the array
  password = shufflePassword(Array.from(password));
  // calculateStrength() calculates the strength of the password
  calculateStrength();
  // finally sets the password to the value of the dispPass
  dispPass.value = password;
});
