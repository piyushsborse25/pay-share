@echo off
REM Set error handling to exit on first failure
setlocal enabledelayedexpansion

REM Log the script start time
echo Script started at %date% %time% >> script.log

REM Step 1: Run npm start (Node.js application) in detached mode without opening a new CMD window
echo Starting the Node.js application...
cd "D:\Angular Projects\payshare"
start /b node server.js
if %errorlevel% neq 0 (
    echo ERROR: npm start failed. Exiting... >> script.log
    exit /b 1
)

REM Step 2: Change to the correct drive (D:)
echo Switching to drive D:...
cd /d D:
if %errorlevel% neq 0 (
    echo ERROR: Failed to switch to drive D:. Exiting... >> script.log
    exit /b 1
)

REM Step 3: Change to the project target directory
echo Changing directory to D:\Eclipse Projects\bill-service\target...
cd "D:\Eclipse Projects\bill-service\target"
if %errorlevel% neq 0 (
    echo ERROR: Failed to change directory. Exiting... >> script.log
    exit /b 1
)

REM Step 4: Run the Java application (JAR file)
echo Running the Java application...
call java -jar bill-service-0.0.1-SNAPSHOT.jar
if %errorlevel% neq 0 (
    echo ERROR: Java application failed to start. Exiting... >> script.log
    exit /b 1
)

REM Log the script end time
echo Script completed at %date% %time% >> script.log

REM End of script
endlocal
exit /b 0