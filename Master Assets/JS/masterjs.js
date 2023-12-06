function genLink(){
    // Get the UL element where you want to add the links
    const projectList = document.getElementById('project-list');
    
    // Define your project folder names
    const projectFolders = ['Meal-Management', 'Front-End', 'IAN','Fig-Plugin'];

    // Iterate over the project folders and create links
    projectFolders.forEach(folderName => {
        const listItem = document.createElement('li');
        const link = document.createElement('a');
        link.href = `./projects/${folderName}/index.html`;
        link.textContent = folderName;
        listItem.appendChild(link);
        projectList.appendChild(listItem);
    });
}