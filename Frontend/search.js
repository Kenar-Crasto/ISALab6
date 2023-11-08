const searchForm = document.getElementById('searchForm');

searchForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const word = document.getElementById('searchWord').value;
    
    try {
        const res = await fetchWordDefinition(word);
        
        if (res.message) {
            alert(res.message);
        } else {
            const result = res[0];
            console.log(result);
            
            const definitionElement = document.getElementById('definition');
            const wordLanguageElement = document.getElementById('wordLanguage');
            const definitionLanguageElement = document.getElementById('definitionLanguage');
            
            definitionElement.textContent = result.definition;
            wordLanguageElement.textContent = result.wordLanguage;
            definitionLanguageElement.textContent = result.definitionLanguage;
        }
    } catch (err) {
        console.error(err);
    }
});

async function fetchWordDefinition(word) {
    const options = {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
    };
    
    const response = await fetch(`http://localhost:3000/api/v1/definition/${word}`, options);
    const res = await response.json();
    
    return res;
}
