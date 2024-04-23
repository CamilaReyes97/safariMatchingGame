$(document).ready(() => {
    // Array of image URLs
    const images = [
      'images/image1.jpg',
      'images/image2.jpg',
      'images/image3.jpg',
      'images/image4.jpg',
      'images/image5.jpg',
      'images/image6.jpg',
      'images/image7.jpg',
      'images/image8.jpg',
    ];
  
    // Background color for cards
    const backgroundColor = '#ccc';
  
    // Game board and counters
    let gameBoard = $('.game-board');
    let moveCounter = $('#move-counter');
    let timerDisplay = $('#timer');
  
    // Arrays to track flipped tiles and game state
    let flippedTiles = [];
    let moves = 0;
    let matchedPairs = 0;
    let countdownInterval;
    let gameTimer;
    let gameStarted = false;
  
    // Function to create the game board
    function createBoard(gridSize) {
      gameBoard.html('');
      moves = 0;
      moveCounter.text(moves);
      flippedTiles = [];
      matchedPairs = 0;
  
      // Randomize the image order
      let shuffledImages = images.concat(images).sort(() => Math.random() - 0.5);
  
      // Create tiles with images and background color
      for (let i = 0; i < gridSize * gridSize; i++) {
        let tile = $('<div class="tile"></div>');
        let frontImage = $('<img src="' + shuffledImages[i] + '" class="hidden">');
        let backColor = $('<div class="back-color"></div>');
  
        tile.append(frontImage);
        tile.append(backColor);
        tile.click(() => flipTile(tile, frontImage)); // Event listener for tile click
        gameBoard.append(tile);
      }
    }
  
    // Function to flip a tile and check for matches
    function flipTile(tile, frontImage) {
      if (!gameStarted) return; // Prevent flipping tiles if the game hasn't started
  
      if (flippedTiles.length === 2) return; // Allow flipping only two tiles at a time
  
      frontImage.toggleClass('hidden');
      tile.toggleClass('flipped');
  
      // Add flipped tile to array and check for match when two tiles are flipped
      if (!flippedTiles.includes(tile)) {
        flippedTiles.push(tile);
        if (flippedTiles.length === 2) {
          setTimeout(() => checkMatch(), 1000);
        }
      }
    }
  
    // Function to check if flipped tiles match
    function checkMatch() {
      let [firstTile, secondTile] = flippedTiles;
      let firstFrontImage = firstTile.find('img:not(.hidden)');
      let secondFrontImage = secondTile.find('img:not(.hidden)');
  
      // If images match, keep tiles open; otherwise, flip them back
      if (firstFrontImage.attr('src') === secondFrontImage.attr('src')) {
        firstTile.addClass('matched');
        secondTile.addClass('matched');
        matchedPairs++;
  
        // Check if all pairs are matched to end the game
        if (matchedPairs === images.length) {
          alert('Congratulations! You won!');
          clearInterval(gameTimer); // Stop the timer when winning
          gameStarted = false;
        }
      } else {
        // Flip back non-matching tiles after a delay
        flippedTiles.forEach(tile => {
          let frontImage = tile.find('img');
          setTimeout(() => {
            frontImage.addClass('hidden');
            tile.removeClass('flipped');
          }, 500);
        });
      }
  
      moves++;
      moveCounter.text(moves);
      flippedTiles = [];
    }
  
    // Event listener for the "Start Game" button
    $('.start-btn').click(() => {
      if (!gameStarted) {
        startGame();
        gameStarted = true;
      }
    });
  
    // Function to start the game
    function startGame() {
      createBoard(4); // Default grid size
      revealImages();
      startCountdown();
      startTimer();
    }
  
    // Function to reveal images temporarily
    function revealImages() {
      $('.tile img.hidden').removeClass('hidden');
      setTimeout(() => {
        $('.tile img').addClass('hidden');
        $('.tile').removeClass('flipped');
      }, 3000); // Hide images after 3 seconds
    }
  
    // Function to start the countdown before hiding images again
    function startCountdown() {
      let countdown = 3;
      countdownInterval = setInterval(() => {
        countdown--;
        if (countdown === 0) {
          clearInterval(countdownInterval);
        }
      }, 1000);
    }
  
    // Function to start the timer for the game duration
    function startTimer() {
      let seconds = 60; // Game duration in seconds
      timerDisplay.text(seconds);
  
      gameTimer = setInterval(() => {
        seconds--;
        timerDisplay.text(seconds);
        if (seconds === 0) {
          clearInterval(gameTimer);
          alert('Time is up! You lose.');
          gameStarted = false;
        }
      }, 1000);
    }
  });
  