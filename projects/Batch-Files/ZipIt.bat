@echo off
setlocal enabledelayedexpansion

set "folder=%~1"
set "zipfile=!folder!.zip"

powershell -Command "Add-Type -Assembly 'System.IO.Compression.FileSystem'; [System.IO.Compression.ZipFile]::CreateFromDirectory('%folder%', '%zipfile%')"

endlocal
