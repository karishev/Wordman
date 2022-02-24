// Author: Shyngys Karishev
// APIs used:
// https://dictionaryapi.dev/
// https://rapidapi.com/sheharyar566/api/random-words5/

// function to get the words from teh api for randomness (there is a limit for calls, so I should manually change the key for the api)
async function getwords() {
  const response = await fetch(
    "https://random-words5.p.rapidapi.com/getMultipleRandom?count=19&wordLength=5",
    {
      method: "GET",
      headers: {
        "x-rapidapi-host": "random-words5.p.rapidapi.com",
        "x-rapidapi-key": "8c77c25eb1msh4f11a270f840a84p123b1ejsnc07b53f3a8ff",
      },
    }
  );
  const data = await response.json();
  return data;
}

// getting the elements from html
let keyboard_up = document.querySelector(".keyboard__up");
let keyboard_mid = document.querySelector(".keyboard__mid");
let keyboard_down = document.querySelector(".keyboard__down");

let uprow = ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"];
let midrow = ["A", "S", "D", "F", "G", "H", "J", "K", "L"];
let bottomrow = ["ENTER", "Z", "X", "C", "V", "B", "N", "M", "ERASE"];

let wordleBtn = document.querySelector(".wordleBtn");
let hangBtn = document.querySelector(".hangBtn");

let instructionsCloseBtn = document.querySelector(".inctructions__closeBtn");
let instructionsMenu = document.getElementById("instructions");
let instructionsOpen = document.querySelector(".openInstructions");

let scoreboardCloseBtn = document.querySelector(".scoreboard__closeBtn");
let scoreboardMenu = document.getElementById("scoreboard");
let scoreboardOpen = document.querySelector(".openScoreboard");
let scoreboardWins = document.querySelector(".scoreboard__wins");
let scoreboardLoses = document.querySelector(".scoreboard__loses");

let game_over = document.querySelector(".game__end");
let game_won = document.querySelector(".game__won");

// function that tranfers you to the next word if you won/lost game
function next_word() {
  game_over.style.display = "none";
  game_won.style.display = "none";
  game.cleaning();
}

// making the keyboard at the start
window.addEventListener("load", () => {
  addingList(uprow, keyboard_up);
  addingList(midrow, keyboard_mid);
  addingList(bottomrow, keyboard_down);
  keyClicked();
});

// to switch between teh games, this leads to wordle
wordleBtn.addEventListener("click", () => {
  wordleBtn.classList.add("active");
  hangBtn.classList.remove("active");
  game.whichgame = "wordle";
});

// to switch between teh games, this leads to hangman
hangBtn.addEventListener("click", () => {
  hangBtn.classList.add("active");
  wordleBtn.classList.remove("active");
  game.whichgame = "hangman";
});

// to close the instructions
instructionsCloseBtn.addEventListener("click", () => {
  console.log("sdasd");
  game.instructions = false;
  instructionsMenu.style.display = "none";
});

// top opne the instructions
instructionsOpen.addEventListener("click", () => {
  game.instructions = true;
});

// to open the scoreboard (can't open if the game is ended)
scoreboardOpen.addEventListener("click", () => {
  if (addScore) {
    scoreboardWins.innerHTML = `Wins: ${wins}`;
    scoreboardLoses.innerHTML = `Loses: ${loses}`;
    scoreboardMenu.style.display = "flex";
  }
});

// to close the scoreboard
scoreboardCloseBtn.addEventListener("click", () => {
  scoreboardMenu.style.display = "none";
});

// this function is needed only for the keyboard creation, adding to the specific div teh keys in array
function addingList(givenArr, givenDiv) {
  givenArr.forEach((key) => {
    let letter = document.createElement("button");
    letter.classList.add("key");
    letter.classList.add(`${key}`);
    letter.innerHTML = key;
    givenDiv.appendChild(letter);
  });
}

// width and height are defined in the game classes, in case we want to change the amount of letters in a word
let wid;
let hei;
const numOfLettters = 5;

// for counting the amount of the given letter in a word
function count(given, param) {
  let count = 0;
  param.forEach((item) => {
    if (item.letter == given) {
      count++;
    }
  });
  return count;
}

// delete the colors of the words (gray, yellow, green)
// needed for cleaning the game
function deleteColor(given) {
  let todelete = document.querySelectorAll(`.${given}`);
  todelete.forEach((del) => {
    del.classList.remove(`${given}`);
  });
}

// function to check whther the input is an english letter
function isAlpha(ch) {
  return (
    typeof ch === "string" &&
    ch.length === 1 &&
    ((ch >= "a" && ch <= "z") || (ch >= "A" && ch <= "Z"))
  );
}

// function to draw hearts for hangman
function heart(x, y, size) {
  beginShape();
  vertex(x, y);
  bezierVertex(x - size / 2, y - size / 2, x - size, y + size / 3, x, y + size);
  bezierVertex(x + size, y + size / 3, x + size / 2, y - size / 2, x, y);
  endShape(CLOSE);
}

// Cell class for Hangman and for Game
class Cell {
  constructor(posX, posY, cellWidth) {
    this.x = posX;
    this.y = posY;
    this.cellWidth = cellWidth;
    this.letter = "";
    this.flag = false;
    this.check = "";
  }
  // looks same to the letter class in Wordle, but only shows the line beneath the word. It is needed for the Game and for Hangman  
  display() {
    strokeWeight(2);
    switch (this.check) {
      case "Gray":
        stroke(165);
        fill(165);
        break;
      case "Yellow":
        stroke(163, 138, 1);
        fill(233, 190, 0);
        break;
      case "Green":
        stroke(61, 120, 61);
        fill(87, 172, 87);
        break;
      default:
        stroke(165);
        fill(255);
    }
    line(
      this.x,
      this.y + this.cellWidth,
      this.x + this.cellWidth,
      this.y + this.cellWidth
    );
    textAlign(CENTER, CENTER);
    if (!this.flag) {
      stroke(0);
      fill(0);
    } else {
      stroke(255);
      fill(255);
    }
    textSize(30);
    text(this.letter, this.x + this.cellWidth / 2, this.y + this.cellWidth / 2);
  }
}

// hangman game class
class Hangman {
  constructor(correct, amount) {
    this.correctWord = correct;
    this.amount = amount;
    wid = 60 * amount + 5 * (amount + 1);
    hei = 60 * 6 + 5 * 7;
    this.letter = new Cell(40, hei / 2, 60);
    this.won = false;
    this.hearts = 3;
  }

  // updating when the person write a letter and tries to check it
  updating() {
    this.hearts--;
    if (this.hearts == 0) this.won = true;
    let change = 0;
    let given = document.querySelector(`.${this.letter.letter}`);
    for (let i = 0; i < this.correctWord.length; i++) {
      if (this.correctWord[i] === this.letter.letter) {
        game.letters[i].letter = this.letter.letter;
        game.letters[i].check = "Green";
        given.classList.add("green");
        change++;
      }
    }
    game.checkwin();
    if (change == 0) given.classList.add("gray");
  }

  // cleaning all the stuff to return to the initial state
  cleaning() {
    this.letter = new Cell(40, hei / 2, 60);
    this.won = false;
    this.hearts = 3;
  }

  // displaying the letters
  display() {
    this.letter.display();
    for (let i = 1; i <= this.hearts; i++) {
      fill(255, 50, 0);
      heart(130 + 50 * i, 250, 30);
    }
  }
}

//Wordle part classes

//Letter class for each of the letters in the words
class Letter {
  constructor(posX, posY, cellWidth) {
    this.x = posX;
    this.y = posY;
    this.cellWidth = cellWidth;
    // at first it is "" bec cause we need to add content there afterwards
    this.letter = "";
    this.flag = false;
    this.check = "";
  }
  //displaying the content of the letter and position 
  display() {
    strokeWeight(2);
    switch (this.check) {
      case "Gray":
        stroke(165);
        fill(165);
        break;
      case "Yellow":
        stroke(163, 138, 1);
        fill(233, 190, 0);
        break;
      case "Green":
        stroke(61, 120, 61);
        fill(87, 172, 87);
        break;
      default:
        stroke(165);
        fill(255);
    }
    rect(this.x, this.y, this.cellWidth, this.cellWidth);
    textAlign(CENTER, CENTER);
    if (!this.flag) {
      stroke(0);
      fill(0);
    } else {
      stroke(255);
      fill(255);
    }
    textSize(30);
    text(this.letter, this.x + this.cellWidth / 2, this.y + this.cellWidth / 2);
  }
}

// word class for each of the rows of words we have
class Word {
  constructor(amount, row) {
    this.amountLetter = amount;
    this.row = row;
    this.current = 0;
    this.cellWidth = 60;
    this.won = false;
    this.flag = false;
    this.word = this.creatingWord();
  }
  // creating the 5 letter words with the coordinates
  creatingWord() {
    let word = [];
    for (let i = 0; i < this.amountLetter; i++) {
      word.push(
        new Letter(
          i * this.cellWidth + 5 * (i + 1),
          5 * (this.row + 1) + this.cellWidth * this.row + 60 + 60,
          this.cellWidth,
          this.cellWidth
        )
      );
    }
    return word;
  }
  //  function that checks if teh word exists or not 
  async checkword() {
    let word = "";
    this.word.forEach((letter) => {
      word = word += letter.letter;
    });
    console.log(word);
    let url = "https://api.dictionaryapi.dev/api/v2/entries/en/";
    const response = await fetch(url + word);
    const data = await response.json();
    return data;
  }

  // updating the conditions of the word, shows if the letter will be gray, yellow, or green
  update(answer) {
    if (this.flag) {
      for (let i = 0; i < this.word.length; i++) {
        let nowlet = document.querySelector(`.${this.word[i].letter}`);
        if (answer.includes(this.word[i].letter)) {
          if (answer[i] == this.word[i].letter) {
            nowlet.classList.add("green");
            this.word[i].check = "Green";
            game.letters[i].letter = answer[i];
            game.letters[i].check = "Green";
            // countWin++;
          } else {
            nowlet.classList.add("yellow");
            this.word[i].check = "Yellow";
          }
        } else {
          nowlet.classList.add("gray");
          this.word[i].check = "Gray";
        }
        this.word[i].flag = true;
      }
      
    }
  }

  // displating the words
  display() {
    this.word.forEach((letter) => letter.display());
  }
}

//class for the wordle game
class Wordle {
  constructor(answer, amount) {
    this.answer = answer;
    this.amount = amount;
    this.current = 0;
    this.rows = 4;
    this.words = this.creatingRows();
    this.won = false;
    wid = 60 * amount + 5 * (amount + 1);
    hei = 60 * 6 + 5 * 7 - 20;
  }

  // creatinf the rows of empty words slots of 5 letters
  creatingRows() {
    let words = [];
    for (let i = 0; i < this.rows; i++) {
      words.push(new Word(this.amount, i));
    }
    return words;
  }

  // to return to the inital point for restarting the game
  cleaning() {
    this.current = 0;
    this.rows = 4;
    this.words = this.creatingRows();
    this.won = false;
  }

  // displaying everything and updating words if needed
  display() {
    this.words.forEach((word) => {
      word.update(this.answer);
      word.display();
    });
  }
}

//final game adding wordle and hangman

class Game {
  constructor(dataset, amount, wordnow, instructions) {
    this.dataset = dataset;
    this.wordnow = wordnow;
    this.amount = amount;
    this.wordle = new Wordle(this.dataset[this.wordnow].toUpperCase(), amount);
    this.hangman = new Hangman(
      this.dataset[this.wordnow].toUpperCase(),
      amount
    );
    // to display a game first
    this.whichgame = "wordle";
    this.letters = this.creatingSlots();
    this.instructions = instructions;
    this.won = false;
  }

  // checking the win conditions, if satisfied, we do the checking
  checkwin() {
    let count = 0;
    this.letters.forEach((letter) => {
      if (letter.letter != "") count++;
    });
    if (count == 5) {
      this.showwin();
      if (addScore) {
        wins++;
        addScore = false;
      }
    } else if (this.wordle.won && this.hangman.won && count != 5) {
      this.showlose();
      if (addScore) {
        loses++;
        addScore = false;
      }
    }
  }

  // cleaning is basically making the game in the intiial state
  cleaning() {
    deleteColor("green");
    deleteColor("gray");
    deleteColor("yellow");
    addScore = true;
    this.won = false;
    this.wordnow++;
    if (this.wordnow == this.dataset.length) {
      loading = true;
      getwords().then((data) => {
        this.dataset = data;
        loading = false;
        this.wordnow = 0;
        this.wordle.answer = this.dataset[this.wordnow].toUpperCase();
        this.hangman.correctWord = this.dataset[this.wordnow].toUpperCase();
      });
    } else {
      this.wordle.answer = this.dataset[this.wordnow].toUpperCase();
      this.hangman.correctWord = this.dataset[this.wordnow].toUpperCase();
    }
    this.wordle.cleaning();
    this.hangman.cleaning();
    this.letters = this.creatingSlots();
  }

  // slots are created for the game at the top of the game for the correct positions of the letters
  creatingSlots() {
    let letters = [];
    for (let i = 0; i < this.amount; i++) {
      letters.push(new Cell(8 * i + 60 * i, 30, 60));
    }
    return letters;
  }

  // showing instructions if needed
  showinstructions() {
    let instructions = document.getElementById("instructions");
    instructions.style.display = "block";
  }

  // showing the win screen
  showwin() {
    let game_won = document.querySelector(".game__won");
    game_won.style.display = "flex";
  }

  // showing the lose screen
  showlose() {
    let game_end = document.querySelector(".game__end");
    let correctword = document.querySelector(".game__end-correct");
    correctword.innerHTML = `${game.wordle.answer}`;
    game_end.style.display = "flex";
  }

  // displaying the game
  display() {
    this.letters.forEach((letter) => {
      letter.display();
    });
    if (this.instructions) this.showinstructions();
    else {
      if (this.whichgame == "wordle") this.wordle.display();
      else this.hangman.display();
    }
  }
}

let game;
// wordnow is needed to traverse throught the list that the random words api gives us
let wordnow = 0;
// loading is for checking if everything is fetched
let loading = true;
let dataset;
let keyboardnow = "";
let prevkey = "";
let wins = 0;
let loses = 0;
// addscore is to understand when do we need to add to wins and loses
let addScore = true;
// fetching is needed for checking whether the check for existing word is finished or not
// so the backspace button wouldn't work in that case
let fetching = true;

function setup() {
  // we allow ot draw everything only after we fetch the info
  getwords().then((data) => {
    dataset = data;
    loading = false;
    game = new Game(dataset, numOfLettters, 0, true);
    var myCanvas = createCanvas(wid, hei);
    myCanvas.parent("game");
  });
}

function draw() {
  background(255);
  if (!loading) game.display();
}

// getinf teh popup for incorrect user written words
let incorrectword = document.getElementById("noword__popup");
function keyPressed() {
  // if condition to check what game we have right now displayed
  if (game.whichgame == "wordle") {
    // if the game is not finished and the user has more choices
    if (game.wordle.current < game.wordle.rows && !game.wordle.won) {
      // checking if the key pressed is possible to write inside on the cells
      if (isAlpha(key) && game.wordle.words[game.wordle.current].current < game.wordle.amount) {
        game.wordle.words[game.wordle.current].word[
          game.wordle.words[game.wordle.current].current
        ].letter = key.toUpperCase();
        game.wordle.words[game.wordle.current].current++;
      }
      // if we want to delete a letter 
      if (keyCode == BACKSPACE && game.wordle.words[game.wordle.current].current > 0 && fetching) {
        game.wordle.words[game.wordle.current].current--;
        game.wordle.words[game.wordle.current].word[
          game.wordle.words[game.wordle.current].current
        ].letter = "";
      }
      // if the user wants to check the word by pressing the enter key
      if (keyCode == ENTER && game.wordle.words[game.wordle.current].current == game.wordle.amount && fetching) {
        fetching = false;
        game.wordle.words[game.wordle.current].checkword().then((data) => {
          // if the word exists -> we check everything
          if (data.title != "No Definitions Found") {
            game.wordle.words[game.wordle.current].flag = true;
            game.wordle.current++;
            if (game.wordle.current == game.wordle.rows) {
              game.wordle.words[game.wordle.current-1].update(game.wordle.answer);
              game.wordle.won = true;
              game.checkwin();
            }
            game.wordle.words[game.wordle.current-1].update(game.wordle.answer);
            game.checkwin();
          } else { //if there is no such word, then it shoes the pop up that states that there is no such word
            incorrectword.style.display = "block";
            setTimeout(() => {
              incorrectword.style.display = "none";
            }, 2000);
          }
          fetching = true;
        });
      }
    }
  } else {
    // teh same logic as above for the hangman part
    if (!game.hangman.won) {
      if (isAlpha(key) && game.hangman.letter.letter == "") {
        game.hangman.letter.letter = key.toUpperCase();
      }
      if (keyCode == BACKSPACE && game.hangman.letter.letter != "") {
        game.hangman.letter.letter = "";
      }
      if (keyCode == ENTER && game.hangman.letter.letter != "") {
        game.hangman.updating();
        game.hangman.letter.letter = "";
      }
    }
  }
}

// the same as keyPressed just for the kyes on the virtual keyboard
function keyClicked() {
  let keys = document.querySelectorAll(".key");
  keys.forEach((key) => {
    key.addEventListener("click", () => {
      console.log(key.innerHTML);
      let check = key.innerHTML;
      if (game.whichgame == "wordle") {
        if (game.wordle.current < game.wordle.rows && !game.wordle.won) {
          if (
            isAlpha(check) &&
            game.wordle.words[game.wordle.current].current < game.wordle.amount
          ) {
            game.wordle.words[game.wordle.current].word[
              game.wordle.words[game.wordle.current].current
            ].letter = check;
            game.wordle.words[game.wordle.current].current++;
          }
          if (
            check == "ERASE" &&
            game.wordle.words[game.wordle.current].current > 0 &&
            fetching
          ) {
            game.wordle.words[game.wordle.current].current--;
            game.wordle.words[game.wordle.current].word[
              game.wordle.words[game.wordle.current].current
            ].letter = "";
          }
          if (
            check == "ENTER" &&
            game.wordle.words[game.wordle.current].current ==
              game.wordle.amount &&
            fetching
          ) {
            fetching = false;
            game.wordle.words[game.wordle.current].checkword().then((data) => {
              if (data.title != "No Definitions Found") {
                game.wordle.words[game.wordle.current].flag = true;
                game.wordle.current++;
                if (game.wordle.current == game.wordle.rows) {
                  game.wordle.words[game.wordle.current-1].update(game.wordle.answer);
                  game.wordle.won = true;
                  game.checkwin();
                }
              } else {
                incorrectword.style.display = "block";
                setTimeout(() => {
                  incorrectword.style.display = "none";
                }, 2000);
              }
              fetching = true;
            });
          }
        }
      } else {
        if (!game.hangman.won) {
          if (isAlpha(check) && game.hangman.letter.letter == "") {
            game.hangman.letter.letter = check;
          }
          if (check == "ERASE" && game.hangman.letter.letter != "") {
            game.hangman.letter.letter = "";
          }
          if (check == "ENTER" && game.hangman.letter.letter != "") {
            game.hangman.updating();
            game.hangman.letter.letter = "";
          }
        }
      }
    });
  });
}
