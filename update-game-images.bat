@echo off
echo Updating game images...

cd apps\web\public\games\images

echo.
echo Current images:
dir *.jpg *.png

echo.
echo Backing up existing images...
if exist math-quiz.jpg copy math-quiz.jpg math-quiz-backup.jpg
if exist tictactoe.jpg copy tictactoe.jpg tictactoe-backup.jpg

echo.
echo Please confirm which image to replace:
echo 1. math-quiz.jpg (Math Quiz game)
echo 2. tictactoe.jpg (Tic Tac Toe game)
echo 3. Both (if you have separate images)

echo.
echo To replace math-quiz.jpg, run:
echo copy 1000704748.png math-quiz.jpg
echo.
echo To replace tictactoe.jpg, run:
echo copy 1000704748.png tictactoe.jpg

pause

