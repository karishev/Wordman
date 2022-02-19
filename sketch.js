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

window.addEventListener("load", () => {
  addingList(uprow, keyboard_up);
  addingList(midrow, keyboard_mid);
  addingList(bottomrow, keyboard_down);
  keyClicked();
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
    hei = 60 * 6 + 5 * 7 + 40;
    this.letter = new Cell(40, hei / 2, 60);
    this.won = false;
    this.hearts = 3;
  }

  updating() {
    for (let i = 0; i < this.correctWord.length; i++) {
      if (this.correctWord[i] === this.letter.letter) {
        game.letters[i].letter = this.letter.letter;
        let given = document.querySelector(`.${this.letter.letter}`);
        game.letters[i].check = "Green";
        if (given) given.classList.add("green");
      }
    }
    this.hearts--;
    if (this.hearts == 0) this.won = true;
  }

  display() {
    this.letter.display();
    for (let i = 1; i <= this.hearts; i++) {
      fill(255, 50, 0);
      heart(130 + 50 * i, 250, 30);
    }
  }
}

// function setup() {
//   game = new Hangman("TIGER", numOfLettters);
//   var myCanvas = createCanvas(wid, hei);
//   myCanvas.parent("game");
// }

// function draw() {
//   background(255);
//   game.display();
// }

// function keyPressed() {
//   if (!game.won) {
//     if (isAlpha(key) && game.letter.letter == "") {
//       game.letter.letter = key.toUpperCase();
//     }
//     if (keyCode == BACKSPACE && game.letter.letter != "") {
//       game.letter.letter = "";
//     }
//     if (keyCode == ENTER && game.letter.letter != "") {
//       game.updating();
//       game.letter.letter = "";
//     }
//   }
// }

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
      if (countWin == game.amount) {
        setTimeout(function () {
          deleteColor("green");
          deleteColor("gray");
          deleteColor("yellow");
          game.wordnow++;
          game = new Game(game.dataset, game.amount, game.wordnow);
        }, 1000);

        this.flag = false;
      }
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
    hei = 60 * 6 + 5 * 7;
  }

  creatingRows() {
    let words = [];
    for (let i = 0; i < this.rows; i++) {
      words.push(new Word(this.amount, i));
    }
    return words;
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
  constructor(dataset, amount, wordnow) {
    this.dataset = dataset;
    this.wordnow = wordnow;
    this.amount = amount;
    this.wordle = new Wordle(this.dataset[this.wordnow].toUpperCase(), amount);
    this.Hangman = new Hangman(
      this.dataset[this.wordnow].toUpperCase(),
      amount
    );
    this.letters = this.creatingSlots();
  }

  creatingSlots() {
    let letters = [];
    for (let i = 0; i < this.amount; i++) {
      letters.push(new Cell(8 * i + 60 * i, 30, 60));
    }
    return letters;
  }

  display() {
    this.letters.forEach((letter) => {
      letter.display();
    });
    this.wordle.display();
  }
}

let game;
let wordnow = 0;
let loading = true;
let dataset;
let keyboardnow = "";

function setup() {
  getwords().then((data) => {
    dataset = data;
    loading = false;
    game = new Game(dataset, numOfLettters, 0);
    var myCanvas = createCanvas(wid, hei);
    myCanvas.parent("game");
  });
}

function draw() {
  background(255);
  if (!loading) game.display();
}

function keyPressed() {
  console.log(game.wordle.current);
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
        if (data.title == "No Definitions Found") {
          alert("There is no such word!");
        } else {
          game.wordle.words[game.wordle.current].flag = true;
          game.wordle.current++;
        }
      });
    } else if (
      keyCode == ENTER &&
      game.wordle.words[game.wordle.current].current != game.wordle.amount
    ) {
      alert("Not enough letters");
    }
  }
}

function keyClicked() {
  let keys = document.querySelectorAll(".key");
  keys.forEach((key) => {
    key.addEventListener("click", () => {
      console.log(key.innerHTML);
      nowkey = key.innerHTML;
    });
  });
}
