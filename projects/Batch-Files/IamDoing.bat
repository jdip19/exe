@echo off

set /p "batScriptPath=Enter the full path to ZipIt.bat: "

:: Create "ZipIt" key under HKEY_CLASSES_ROOT\Directory\shell
reg add HKEY_CLASSES_ROOT\Directory\shell\ZipIt /ve /t REG_SZ /d "ZipIt" /f

:: Create "command" key under HKEY_CLASSES_ROOT\Directory\shell\ZipIt
reg add HKEY_CLASSES_ROOT\Directory\shell\ZipIt\command /ve /t REG_SZ /d "\"%batScriptPath%\" \"%1\"" /f

echo "Registry entries added for ZipIt context menu option."
pause
