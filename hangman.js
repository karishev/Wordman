

let wid;
let hei;

function isAlpha(ch) {
  return (
    typeof ch === "string" &&
    ch.length === 1 &&
    ((ch >= "a" && ch <= "z") || (ch >= "A" && ch <= "Z"))
  );
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
    this.letters = this.creatingSlots();
    this.hearts = 3;
  }

  creatingSlots() {
    let letters = [];
    for (let i = 0; i < this.amount; i++) {
      letters.push(new Cell(8 * i + 60 * i, 30, 60));
    }
    return letters;
  }

  updating() {
    
    for (let i = 0; i < this.correctWord.length; i++) {
      if (this.correctWord[i] === this.letter.letter) {
        this.letters[i].letter = this.letter.letter;
        let given = document.querySelector(`.${this.letter.letter}`);
        this.letters[i].check = "Green";
        if (given) given.classList.add("green");
      }
    }
    this.hearts--;
    if (this.hearts == 0) this.won = true;
  }

  display() {
    this.letters.forEach((letter) => {
      letter.display();
    });
    this.letter.display();
    for (let i = 1; i <= this.hearts; i++) {
      fill(255, 50, 0);
      heart(130 + 50 * i, 250, 30);
    }
  }
}

let numOfLettters = 5;

function setup() {
  game = new Hangman("TIGER", numOfLettters);
  var myCanvas = createCanvas(wid, hei);
  myCanvas.parent("game");
}

function draw() {
  background(255);
  game.display();
}

function keyPressed() {
  if (!game.won) {
    if (isAlpha(key) && game.letter.letter == "") {
      game.letter.letter = key.toUpperCase();
    }
    if (keyCode == BACKSPACE && game.letter.letter != "") {
      game.letter.letter = "";
    }
    if (keyCode == ENTER && game.letter.letter != "") {
      game.updating();
      game.letter.letter = "";
    }
  }
}

function heart(x, y, size) {
  beginShape();
  vertex(x, y);
  bezierVertex(x - size / 2, y - size / 2, x - size, y + size / 3, x, y + size);
  bezierVertex(x + size, y + size / 3, x + size / 2, y - size / 2, x, y);
  endShape(CLOSE);
}
