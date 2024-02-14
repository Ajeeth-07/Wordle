const inputs = document.querySelectorAll('.letter');
const answerLength = 5;

async function init(){

    let currentGuess = '';
    let currentRow = 0;
    const Rounds = 6;
    const res = await fetch("https://words.dev-apis.com/word-of-the-day");
    const resObj = await res.json();
    const word = resObj.word.toUpperCase();
    // console.log(word);
    const wordParts = word.split("");
    const map = makeMap(wordParts);
    let done = false;


    function addLetter(letter){
        if (currentGuess.length < answerLength) {
            //add letter to the end 
          currentGuess += letter;
        } else {
            //replace the last letter
          currentGuess.substring(0, currentGuess.length - 1) + letter;
        }

        inputs[answerLength*currentRow + currentGuess.length - 1].innerText = letter;
    }

    async function commit(){
        if(currentGuess.length !== answerLength){
            //do nothing
            return;
        }

        //validate the guess

        if(currentGuess === word){
            //they won
            alert("You won!!");
            done = true;
            return;
        }

        //if the letter is wrong, close or correct
        const guessParts = currentGuess.split("");

        for(let i = 0; i < answerLength; i++){
            //mark as correct
            if(guessParts[i] === wordParts[i]){
                inputs[currentRow*answerLength + i].classList.add("correct");
                map[guessParts[i]]--;
            }
        }


        for(let i=0; i<answerLength; i++){
            if(guessParts[i] === wordParts[i]){
                //do nothing we already marked it as correct
            }else if(wordParts.includes(guessParts[i]) && map[guessParts[i]] > 0){
                inputs[currentRow*answerLength + i].classList.add("close");
            }else{
                inputs[currentRow * answerLength + i].classList.add("wrong");
            }
        }
        

        currentRow++;
        currentGuess = "";

         // did they lose
         if(currentRow === Rounds){
            alert(`You Lost!, the word was ${word}`);
            done = true;
         }

        
    }

    function clear(){
        currentGuess = currentGuess.substring(0, currentGuess.length - 1);
        inputs[answerLength*currentRow + currentGuess.length].innerText = "";
    }
    

    document.addEventListener('keydown', function handleKeyPress(event){
        const action = event.key;

        console.log(action);

        if(action === 'Enter'){
            commit();
        }else if(action === 'Backspace'){
            clear();
        }else if(isLetter(action)){
            addLetter(action.toUpperCase());
        }else {
            //do nothing
        }
    })
}

function isLetter(letter){
    return /^[a-zA-Z]$/.test(letter);
}

function makeMap(array){
    const obj = {};
    for(let i = 0; i<array.length; i++){
        const letter = array[i];
        if(obj[letter]){
            obj[letter]++;
        }else{
            obj[letter] = 1;
        }
    }

    return obj;
}

init();