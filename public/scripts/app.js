document.getElementById('scrape-form').addEventListener('submit', async (event) => {
    event.preventDefault();

    const url = document.getElementById('url-input').value;

    try {
        const response = await fetch('/scrape', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ url })
        });

        const result = await response.json();
        if (response.ok) {
            document.getElementById('result-message').textContent = result.message;
            displayParagraphs(result.paragraphs);
            displayLinks(result.links);

            document.getElementById('result-container').style.display = 'block';
            document.getElementById('download-buttons').style.display = 'block';
        } else {
            document.getElementById('result-message').textContent = 'Error: ' + result.message;
        }
    } catch (error) {
        console.error('Error:', error);
        document.getElementById('result-message').textContent = 'An error occurred while scraping data';
    }
});

function displayParagraphs(paragraphs) {
    const resultContainer = document.getElementById('results-container');
    resultContainer.innerHTML = ''; 
    paragraphs.forEach(paragraph => {
        const paragraphElement = document.createElement('p');
        paragraphElement.textContent = paragraph.text;
        resultContainer.appendChild(paragraphElement);
    });
}

function displayLinks(links) {
    const linksContainer = document.getElementById('links-container');
    linksContainer.innerHTML = ''; 
    links.forEach(link => {
        const linkElement = document.createElement('a');
        linkElement.href = link;
        linkElement.textContent = link;
        linkElement.target = '_blank'; 
        linksContainer.appendChild(linkElement);
        linksContainer.appendChild(document.createElement('br')); 
    });
}

document.getElementById('download-json').addEventListener('click', () => {
    const url = document.getElementById('url-input').value;
    window.location.href = `/download?url=${encodeURIComponent(url)}&format=json`;
});

document.getElementById('download-csv').addEventListener('click', () => {
    const url = document.getElementById('url-input').value;
    window.location.href = `/download?url=${encodeURIComponent(url)}&format=csv`;
});
