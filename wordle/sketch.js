// https://dictionaryapi.dev/

async function getwords() {
  const response = await fetch(
    "https://random-words5.p.rapidapi.com/getMultipleRandom?count=19&wordLength=5",
    {
      method: "GET",
      headers: {
        "x-rapidapi-host": "random-words5.p.rapidapi.com",
        "x-rapidapi-key": "555e68e76bmsh3e7c517cf26cc69p1c99e7jsne4ed7a732735",
      },
    }
  );
  const data = await response.json();
  return data;
}

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

let game_over = document.querySelector(".game__end");
let game_won = document.querySelector(".game__won");

function next_word() {
  game_over.style.display = "none";
  game_won.style.display = "none";
  game.cleaning();
}

window.addEventListener("load", () => {
  addingList(uprow, keyboard_up);
  addingList(midrow, keyboard_mid);
  addingList(bottomrow, keyboard_down);
  keyClicked();
});

wordleBtn.addEventListener("click", () => {
  wordleBtn.classList.add("active");
  hangBtn.classList.remove("active");
  game.whichgame = "wordle";
});

hangBtn.addEventListener("click", () => {
  hangBtn.classList.add("active");
  wordleBtn.classList.remove("active");
  game.whichgame = "hangman";
});

instructionsCloseBtn.addEventListener("click", () => {
  console.log("sdasd");
  game.instructions = false;
  instructionsMenu.style.display = "none";
});

instructionsOpen.addEventListener("click", () => {
  game.instructions = true;
});

function addingList(givenArr, givenDiv) {
  givenArr.forEach((key) => {
    let letter = document.createElement("button");
    letter.classList.add("key");
    letter.classList.add(`${key}`);
    letter.innerHTML = key;
    givenDiv.appendChild(letter);
  });
}

let wid;
let hei;
const numOfLettters = 5;

function count(given, param) {
  let count = 0;
  param.forEach((item) => {
    if (item.letter == given) {
      count++;
    }
  });
  return count;
}

function deleteColor(given) {
  let todelete = document.querySelectorAll(`.${given}`);
  todelete.forEach((del) => {
    del.classList.remove(`${given}`);
  });
}

function isAlpha(ch) {
  return (
    typeof ch === "string" &&
    ch.length === 1 &&
    ((ch >= "a" && ch <= "z") || (ch >= "A" && ch <= "Z"))
  );
}

function heart(x, y, size) {
  beginShape();
  vertex(x, y);
  bezierVertex(x - size / 2, y - size / 2, x - size, y + size / 3, x, y + size);
  bezierVertex(x + size, y + size / 3, x + size / 2, y - size / 2, x, y);
  endShape(CLOSE);
}

class Cell {
  constructor(posX, posY, cellWidth) {
    this.x = posX;
    this.y = posY;
    this.cellWidth = cellWidth;
    this.letter = "";
    this.flag = false;
    this.check = "";
  }

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
        game.checkwin();
        change++;
      }
    }
    if (change == 0) given.classList.add("gray");
  }

  cleaning() {
    this.letter = new Cell(40, hei / 2, 60);
    this.won = false;
    this.hearts = 3;
  }
  display() {
    this.letter.display();
    for (let i = 1; i <= this.hearts; i++) {
      fill(255, 50, 0);
      heart(130 + 50 * i, 250, 30);
    }
  }
}

//Wordle part classes

class Letter {
  constructor(posX, posY, cellWidth) {
    this.x = posX;
    this.y = posY;
    this.cellWidth = cellWidth;
    this.letter = "";
    this.flag = false;
    this.check = "";
  }

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

  update(answer) {
    if (this.flag) {
      let countWin = 0;
      for (let i = 0; i < this.word.length; i++) {
        let nowlet = document.querySelector(`.${this.word[i].letter}`);
        if (answer.includes(this.word[i].letter)) {
          if (answer[i] == this.word[i].letter) {
            nowlet.classList.add("green");
            this.word[i].check = "Green";
            game.letters[i].letter = answer[i];
            game.letters[i].check = "Green";
            countWin++;
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
      game.checkwin();
    }
  }

  display() {
    this.word.forEach((letter) => letter.display());
  }
}

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

  creatingRows() {
    let words = [];
    for (let i = 0; i < this.rows; i++) {
      words.push(new Word(this.amount, i));
    }
    return words;
  }

  cleaning() {
    this.current = 0;
    this.rows = 4;
    this.words = this.creatingRows();
    this.won = false;
  }

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
    this.whichgame = "wordle";
    this.letters = this.creatingSlots();
    this.instructions = instructions;
    this.won = false;
  }

  checkwin() {
    let count = 0;
    this.letters.forEach((letter) => {
      if (letter.letter != "") count++;
    });
    if (count == 5) {
      this.showwin();
    } else if (this.wordle.won && this.hangman.won) {
      this.showlose();
    }
  }

  cleaning() {
    deleteColor("green");
    deleteColor("gray");
    deleteColor("yellow");
    this.won = false;
    this.wordnow++;
    this.wordle.answer = this.dataset[this.wordnow].toUpperCase();
    this.wordle.cleaning();
    this.hangman.cleaning();
    this.hangman.correctWord = this.dataset[this.wordnow].toUpperCase();
    this.letters = this.creatingSlots();
  }

  creatingSlots() {
    let letters = [];
    for (let i = 0; i < this.amount; i++) {
      letters.push(new Cell(8 * i + 60 * i, 30, 60));
    }
    return letters;
  }

  showinstructions() {
    let instructions = document.getElementById("instructions");
    instructions.style.display = "block";
  }

  showwin() {
    let game_won = document.querySelector(".game__won");
    game_won.style.display = "flex";
  }

  showlose() {
    let game_end = document.querySelector(".game__end");
    let correctword = document.querySelector(".game__end-correct");
    correctword.innerHTML = `${game.wordle.answer}`;
    game_end.style.display = "flex";
  }

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
let wordnow = 0;
let loading = true;
let dataset;
let keyboardnow = "";
let prevkey = "";
let nowkey = "";

function setup() {
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

function keyPressed() {
  if (game.whichgame == "wordle") {
    if (game.wordle.current < game.wordle.rows && !game.wordle.won) {
      if (
        isAlpha(key) &&
        game.wordle.words[game.wordle.current].current < game.wordle.amount
      ) {
        game.wordle.words[game.wordle.current].word[
          game.wordle.words[game.wordle.current].current
        ].letter = key.toUpperCase();
        game.wordle.words[game.wordle.current].current++;
      }
      if (
        keyCode == BACKSPACE &&
        game.wordle.words[game.wordle.current].current > 0
      ) {
        game.wordle.words[game.wordle.current].current--;
        game.wordle.words[game.wordle.current].word[
          game.wordle.words[game.wordle.current].current
        ].letter = "";
      }
      if (
        keyCode == ENTER &&
        game.wordle.words[game.wordle.current].current == game.wordle.amount
      ) {
        game.wordle.words[game.wordle.current].checkword().then((data) => {
          if (data.title != "No Definitions Found") {
            game.wordle.words[game.wordle.current].flag = true;
            game.wordle.current++;
            if (game.wordle.current == game.wordle.rows) game.wordle.won = true;
          }
        });
      }
    }
  } else {
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
            game.wordle.words[game.wordle.current].current > 0
          ) {
            game.wordle.words[game.wordle.current].current--;
            game.wordle.words[game.wordle.current].word[
              game.wordle.words[game.wordle.current].current
            ].letter = "";
          }
          if (
            check == "ENTER" &&
            game.wordle.words[game.wordle.current].current == game.wordle.amount
          ) {
            game.wordle.words[game.wordle.current].checkword().then((data) => {
              if (data.title != "No Definitions Found") {
                game.wordle.words[game.wordle.current].flag = true;
                game.wordle.current++;
                if (game.wordle.current == game.wordle.rows)
                  game.wordle.won = true;
              }
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
