const getHistory = () => document.querySelector('.history').innerText;

const putToHistory = (expr) =>  document.querySelector('.history').innerText = expr;

const getExpression = ()=> document.querySelector('.answer-box').innerText;

const printAnswer = (ans) => document.querySelector('.answer-box').innerText = formatAnswerValue(ans);

const setToEmpty = () => document.querySelector('.answer-box').innerText = "";

// const myEvilMathFunction = (fn) => new Function('return ' + fn)();

const formatAnswerValue = (num) => {                              //Formats output to separated commas
    if (num == "-") {                                            // if backspace is clicked when the output contains negative single value then return 0
        return 0;
    }
   // return Number(num).toLocaleString('en-US');                  // Using toLocaleString() rounds up the decimal part and is less faster than Regex

    let numSeparatedByDot = num.toString().split(".");             // Split the answer(if float) by dot
    numSeparatedByDot[0] = numSeparatedByDot[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");     //Format the first part of the float value
    return numSeparatedByDot.join(".");                            // Then join integer part and the decimal part (Mantisa)
}

const revertFormattedAnswer = (num) => Number(num.replace(/,/g, ''));    //Reverse formatted output for normal JS logic operation

//Operator Buttons
let operators = document.querySelectorAll('.operator');           //Get all the operator buttons

operators.forEach(operator => operator.addEventListener('click', () => { 

    if (operator.id == 'clearAll') {                              //if the operator button is C
        putToHistory("");
        printAnswer("");
    } else if (operator.id == 'cls') {                            //if the operator button is CE
        printAnswer("");
    } else if (operator.id == 'bckspace') {                       //if the operator button is backspace
        let expr = revertFormattedAnswer(getExpression()).toString();
        if (expr) {                                               //if there is any output,
            expr = expr.substr(0, expr.length - 1);              //then remove the last element value
            printAnswer(expr);
        }
    } else if (operator.id == 'negate') {                        //if the operator button is the negation button ('+/-')

        let output = getExpression();
        if (output != "" && output[0] != "-" && output != '0') {  
            output = '-' + output;
            document.querySelector('.answer-box').innerText = output;
        } else if (output[0] == "-") {
            output = output.substr(1);
            document.querySelector('.answer-box').innerText = output;
        }

    } else {                                                     //if the operator button is normal mathematical operand

        let output = getExpression();
        let history = getHistory();

        if (output == "" && history != "") {
            if (isNaN(history[history.length - 1])) {             // To check if the last value in the history is an operator,
                history = history.substr(0, history.length - 1); // then Remove the last operator in the history/expression before evaluating
            }
        }

        if (output != "" || history != "") {                      // Condition to be able to change the last operator and evaluate answer
            output = output == "" ? output : revertFormattedAnswer(output);  // Return reverse formatted output if the output is not empty or otherwise
            history = history + output;

            if (operator.id == 'answer') {                       //To evaluate an expression in the history if clicked on answer
                let result = eval(history);
                printAnswer(result);
                putToHistory("");
            } else {                                             // To insert an operator in history
                history = history + operator.id;
                putToHistory(history);
                setToEmpty();
            }
        }
    }
}));


// Number Buttons
let numbers = document.querySelectorAll('.number');                 //Get all the number buttons

numbers.forEach(number => number.addEventListener('click', () => {
    let output = revertFormattedAnswer(getExpression());
    if (output != NaN) {                                           //To check if an expression/output is  a number,
        output = output.toString();  
        if(output[0] == '0'){                                      //A bug output issue, this removes the zero from non-zero number when a number operator is clicked
            output = output.substring(1);
        }                                        
        output = output + number.innerText;                        //Then put the number into history
        printAnswer(output);
    }
}));