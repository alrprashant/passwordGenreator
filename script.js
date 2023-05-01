const inputSlider=document.querySelector("[data-lengthSlider]");
const lengthDisplay=document.querySelector("[data-lengthNumber]");
const passwordDisplay=document.querySelector("[data-passwordDisplay]");
const copyMsg=document.querySelector("[data-copyMsg]");
const copyBtn=document.querySelector("[data-copy]");
const uppercaseCheck=document.querySelector("#uppercase");
const lowercaseCheck=document.querySelector("#lowercase");
const numbersCheck=document.querySelector("#numbers");
const symbolsCheck=document.querySelector("#symbols");
const allCheckBox=document.querySelectorAll("input[type=checkbox]");
const indicator=document.querySelector("[data-indicator]");
const symbols = '~`!@#$%^&*()_-+={[}]|:;"<,>.?/';

const generateBtn =document.querySelector(".generateBtn");











// initialing values
let passwordLength=10;
let checkCount=0;
let password="";
setIndicator("#ccc");





// slider handle
function handleSlider(){
    inputSlider.value=passwordLength;
    lengthDisplay.innerText=passwordLength;

    // not working 
    const min = inputSlider.min;
    const max = inputSlider.max;
    inputSlider.style.backgroundSize = ( (passwordLength - min)*100/(max - min)) + "% 100%"

}
handleSlider();



// we have to put a  eventlistener over input slider 
inputSlider.addEventListener("input", ()=>{
    passwordLength=inputSlider.value;
    handleSlider();
    console.log("value taken from slider");



})





// copy content 
async function copyContent(){
    try {
        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMsg.innerText="copied";
        
    } catch (e) {
        copyMsg.innerText="failed";
    }

    // to show msg "copied"
    copyMsg.classList.add("active");

    // it's need to hide too in 2 sec
    setTimeout(() => {

        copyMsg.classList.remove("active");
        
    }, 2000);
    
}

// to copy content we have to put eventlistener over 
copyBtn.addEventListener("click" , ()=>{
    console.log("copybtn pressed")
    if(passwordDisplay.value)
    copyContent();

});


// checkCount 

function handleCheckBoxChange(){
    checkCount=0;
    allCheckBox.forEach((checkbox)=>{
       if(checkbox.checked)
       checkCount++;
    });

    if(passwordLength<checkCount)
    passwordLength=checkCount;
    handleSlider();
}

// we have to put Event listeners over all check boxes 

allCheckBox.forEach((checkbox)=>{
    checkbox.addEventListener("change",handleCheckBoxChange);
});

// // sating indicator of strength
function setIndicator(color){
    indicator.style.background=color;
    console.log("indicator performed");
    indicator.style.boxShadow = `0px 0px 12px 1px ${color}`;



    
}



// calculating strength
function calcStrength() {
    let hasUpper = false;
    let hasLower = false;
    let hasNum = false;
    let hasSym = false;
    if (uppercaseCheck.checked) hasUpper = true;
    if (lowercaseCheck.checked) hasLower = true;
    if (numbersCheck.checked) hasNum = true;
    if (symbolsCheck.checked) hasSym = true;
  
    if (hasUpper && hasLower && (hasNum || hasSym) && passwordLength >= 8) {
      setIndicator("#0f0");
    } else if (
      (hasLower || hasUpper) &&
      (hasNum || hasSym) &&
      passwordLength >= 6
    ) {
      setIndicator("#ff0");
    } else {
      setIndicator("#f00");
    }
}

//  processing password making
function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

function generateRandomNumber() {
    return getRndInteger(0,9);
}

function generateLowerCase() {  
       return String.fromCharCode(getRndInteger(97,123));
}

function generateUpperCase() {  
    return String.fromCharCode(getRndInteger(65,91));
}

function generateSymbol() {
    const randNum = getRndInteger(0, symbols.length);
    return symbols.charAt(randNum);
}

function shufflePassword(array){
    //Fisher Yates Method
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
      }
    let str = "";
    array.forEach((el) => (str += el));
    return str;
}


function generatePassword(){
    if(checkCount==0) return;

    // let start the journey 
    console.log("start the journey");

    // remove old password
    password="";

    // putting the stuff mentioned by checkbox
    let funcArr=[];

    if(uppercaseCheck.checked)
    funcArr.push(generateUpperCase);
    if(lowercaseCheck.checked)
    funcArr.push(generateLowerCase);
    if(numbersCheck.checked)
    funcArr.push(generateRandomNumber);
    if(symbolsCheck.checked)
    funcArr.push(generateSymbol);
     

    //  compulsory addition
    for(let i=0;i<funcArr.length;i++){
     password+=funcArr[i]();
    }
    console.log("Compulsory addition done");

    // remaining addition 
    for(let i=0;i<passwordLength-funcArr.length;i++){
    let randIndex=getRndInteger(0,funcArr.length);
    password+=funcArr[randIndex]();
    }
    console.log("remainig additon done");
  
    // shuffle password
    password=shufflePassword(Array.from(password));

    // show in UI
    passwordDisplay.value=password;
    // calcStrength
    calcStrength();
}

generateBtn.addEventListener("click",generatePassword);