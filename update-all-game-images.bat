@echo off
echo ========================================
echo    UPDATE GAME IMAGES - BITGAME
echo ========================================
echo.

cd apps\web\public\games\images

echo Current game images:
echo.
dir *.jpg *.png
echo.

echo ========================================
echo Available options:
echo ========================================
echo 1. Math Quiz - Current: math-quiz.jpg
echo 2. Tic Tac Toe - Current: tictactoe.jpg  
echo 3. Bitcoin Quiz - Current: bitcoin-quiz.jpg
echo 4. Snake - Current: snake.jpg
echo.

echo To replace an image:
echo copy NEW_IMAGE_FILE.jpg math-quiz.jpg
echo copy NEW_IMAGE_FILE.jpg tictactoe.jpg
echo copy NEW_IMAGE_FILE.jpg bitcoin-quiz.jpg
echo copy NEW_IMAGE_FILE.jpg snake.jpg
echo.

echo To create thumbnails:
echo copy math-quiz.jpg ..\math-quiz-thumb.png
echo copy tictactoe.jpg ..\tictactoe-thumb.png
echo copy bitcoin-quiz.jpg ..\bitcoin-quiz-thumb.png
echo copy snake.jpg ..\snake-thumb.png
echo.

pause

