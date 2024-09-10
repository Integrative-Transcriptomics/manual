document.addEventListener('DOMContentLoaded', function() {
    const studyButtons = document.querySelectorAll('.study-button');
    const difficultyFilter = document.getElementById('difficulty-filter');
    const tiles = document.querySelectorAll('.course-tile');
    
    // Define containers for each topic
    const mathContainer = document.getElementById('math-container');
    const mlContainer = document.getElementById('ml-container');
    const applicationsContainer = document.getElementById('applications-container');

    // Sort courses based on their topic
    function sortCoursesByTopic() {
        tiles.forEach(tile => {
            const topic = tile.getAttribute('data-topic');
            // Remove tile from its current position
            tile.parentElement.removeChild(tile);

            // Append tile to the correct topic container
            if (topic === 'Mathematics') {
                mathContainer.appendChild(tile);
            } else if (topic === 'Machine Learning') {
                mlContainer.appendChild(tile);
            } else if (topic === 'Applications') {
                applicationsContainer.appendChild(tile);
            }
        });
    }

    // Call this function on page load to sort courses initially
    sortCoursesByTopic();

    // Function to filter tiles based on both study program and difficulty level
    function filterTiles() {
        const activeStudyButton = document.querySelector('.study-button.active');
        const selectedDifficulty = difficultyFilter.value;
        
        tiles.forEach(tile => {
            const hasStudyFilter = activeStudyButton ? tile.classList.contains(activeStudyButton.classList[1]) : true;
            const hasDifficultyFilter = selectedDifficulty === 'all' || tile.classList.contains(selectedDifficulty);
            
            if (hasStudyFilter && hasDifficultyFilter) {
                tile.style.display = 'flex';
            } else {
                tile.style.display = 'none';
            }
        });
    }

    // Set up click event listeners for study buttons
    studyButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Toggle active class
            studyButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Apply filter
            filterTiles();
        });
    });

    // Set up change event listener for difficulty filter
    difficultyFilter.addEventListener('change', filterTiles);

    // Show all courses
    document.querySelector('.study-button.all').addEventListener('click', function() {
        studyButtons.forEach(button => button.classList.remove('active'));
        filterTiles(); // No active study button, so show all courses based on difficulty
    });

    // Show popup and populate accordion sections
    document.querySelectorAll('.course-tile').forEach(tile => {
        tile.addEventListener('click', function() {
            // Show popup
            const popup = document.getElementById('popup');
            popup.style.display = 'block';
            
            // Set course name
            document.getElementById('course-name').textContent = this.querySelector('.course-header').textContent;

            // Populate accordion sections
            const accordionData = this.getAttribute('data-accordion').split('|');
            const accordionContainer = document.querySelector('.accordion');
            
            // Clear previous accordion content
            accordionContainer.innerHTML = '';

            accordionData.forEach((item) => {
                const [sectionName, sectionDetails] = item.split(':');
                
                // Create accordion button
                const button = document.createElement('button');
                button.classList.add('accordion-button');
                button.textContent = sectionName;
                
                // Create accordion panel
                const panel = document.createElement('div');
                panel.classList.add('panel');
                panel.innerHTML = `<p>${sectionDetails}</p>`;
                
                // Append button and panel to accordion container
                accordionContainer.appendChild(button);
                accordionContainer.appendChild(panel);
            });

            // Initialize accordion functionality
            document.querySelectorAll('.accordion-button').forEach(button => {
                button.addEventListener('click', function() {
                    this.classList.toggle('active');
                    const panel = this.nextElementSibling;
                    if (panel.style.display === 'block') {
                        panel.style.display = 'none';
                    } else {
                        panel.style.display = 'block';
                    }
                });
            });
        });
    });

    // Close popup and collapse accordion panels
    function closePopup() {
        document.getElementById('popup').style.display = 'none';
        // Collapse all accordion panels
        document.querySelectorAll('.accordion .panel').forEach(panel => {
            panel.style.display = 'none';
        });
        document.querySelectorAll('.accordion-button').forEach(button => {
            button.classList.remove('active');
        });
    }

    // Attach the closePopup function to the close button
    document.querySelector('.popup .close').addEventListener('click', closePopup);

    // Function to generate and download the CSV file
    function downloadSelectedCourses() {
        const selectedCourses = Array.from(tiles)
            .filter(tile => tile.style.display !== 'none')
            .map(tile => tile.querySelector('.course-header').textContent);
        
        if (selectedCourses.length === 0) {
            alert('No courses selected for download.');
            return;
        }
        
        const csvContent = 'data:text/csv;charset=utf-8,' + 
            'Course Name\n' + 
            selectedCourses.join('\n');
        
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement('a');
        link.setAttribute('href', encodedUri);
        link.setAttribute('download', 'selected_courses.txt');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    // Set up click event listener for download button
    downloadButton.addEventListener('click', downloadSelectedCourses);
});
