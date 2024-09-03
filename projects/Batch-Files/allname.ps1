$folderPath = "C:\Users\user\Downloads\fwdcontentofregulatoryservices" # Replace with your folder path
$outputFile = $folderPath + "\allname.txt" # Replace with your desired output file path

# Get all files
$files = Get-ChildItem -Path $folderPath -Recurse | Where-Object { -not $_.PSIsContainer }

# Output file names to allname.txt
$files | ForEach-Object { $_.Name } | Out-File -FilePath $outputFile

# Display the count of files processed
Write-Host ($files.Count+" Files Found" )
