# Wordman
Worlde + Hangman = Wordman

This game is a mix of two games: Wordle and Hangman. Using Random Word API for generating the random words for the game, and Word Dictionary for checking if the word written by the user is actually a real word.

## Project progress

At first, I developed the Wordle game. The hardest pat was to adjust the sizes and think about when to fetch the information about the word written by the user to check. I decided to put the checker inside the keyPressed function, since this is the part where everything should be checked. Then I had some problems with fetchin random words from Random Word API. Thanks to the instructor, now it manages the words and uses them as needed. I decided to fetch the words in the setup function for convinience and now the Wordle is working. However, it only imports only 19 words in one go and it automatically transfers you to the nExt word when you guess the word, and there is no lose screen.

After that I implemented the Hangman game and since I already have random words and word checker, it was much easier, since I just needed to check whether the letter is in the word or not. I decided to give the User only 3 guesses so the game wouldn't be too easy. 
