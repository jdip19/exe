function genLink() {
    // Get the UL element where you want to add the links
    const projectList = document.getElementById('project-list');
    
    // Define your project folder names and their corresponding ZIP file names
    const projectFolders = [
        { folderName: 'Meal-Management', zipFile: 'Meal-Management.zip' },
        { folderName: 'Front-End', zipFile: 'Front-End.zip' },
        { folderName: 'IAN', zipFile: 'IAN.zip' },
        { folderName: 'Fig-Plugin', zipFile: 'Fig-Plugin.zip' },
        { folderName: 'Batch-Files', zipFile: 'Batch-Files.zip' },
        { folderName: 'ClockSheet', zipFile: 'ClockSheet.zip' },
        { folderName: 'my-static-website', zipFile: 'my-static-website.zip' },
        { folderName: 'hidiary', zipFile: 'hidiary.zip' },
        { folderName: 'J-K-Provision', zipFile: 'J-K-Provision.zip' },
        { folderName: 'JS-L', zipFile: 'JS-L.zip' },
        { folderName: 'UDownloader', zipFile: 'UDownloader.zip' }
    ];

    // Iterate over the project folders and create links
    projectFolders.forEach(project => {
        const icon = document.createElement('i');
        icon.className = "fi fi-rr-arrow-small-right";
        const listItem = document.createElement('li');
        const link = document.createElement('a');
        link.href = `./projects/${project.zipFile}`;  // Point to the ZIP file
        link.download = project.zipFile; // Set the download attribute for the link
        link.textContent = project.folderName;
        listItem.appendChild(icon);
        listItem.appendChild(link);
        projectList.appendChild(listItem);
    });
}
