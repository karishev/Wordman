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

function keyClicked() {
  let keys = document.querySelectorAll(".key");
  keys.forEach((key) => {
    key.addEventListener("click", () => {
      console.log(key.innerHTML);
      nowkey = key.innerHTML;
    });
  });
}
