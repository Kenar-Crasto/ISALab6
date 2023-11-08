document.addEventListener('DOMContentLoaded', function () {
    const entryForm = document.getElementById('entryForm');
    const wordInput = document.getElementById('word');
    const definitionInput = document.getElementById('definition');
    const wordLanguageSelect = document.getElementById('wordLanguage');
    const definitionLanguageSelect = document.getElementById('definitionLanguage');
  
    // Fetch and populate language options
    getLanguages();
  
    entryForm.addEventListener('submit', function (event) {
      event.preventDefault();
  
      const word = wordInput.value;
      const definition = definitionInput.value;
      const wordLanguage = wordLanguageSelect.value;
      const definitionLanguage = definitionLanguageSelect.value;
  
      const entry = {
        word,
        definition,
        wordLanguage,
        definitionLanguage
      };
  
      const options = {
        method: 'POST',
        body: JSON.stringify(entry),
        headers: { 'Content-Type': 'application/json' }
      };
  
      fetch('http://localhost:3000/api/v1/definition', options)
        .then(res => res.json())
        .then(res => {
          console.log(res);
          if (res.action === 'inserted') {
            alert(res.message);
          } else if (res.action === 'update') {
            if (confirm(res.message)) {
              updatePatch(word, definition, wordLanguage, definitionLanguage);
            }
          }
        })
        .catch(err => console.error(err));
    });
  
    function updatePatch(word, definition, wordLanguage, definitionLanguage) {
      const options = {
        method: 'PATCH',
        body: JSON.stringify({ definition, wordLanguage, definitionLanguage }),
        headers: { 'Content-Type': 'application/json' }
      };
      fetch(`http://localhost:3000/api/v1/definition/${word}`, options)
        .then(res => res.json())
        .then(res => {
          if (res.message) alert(res.message);
        })
        .catch(err => console.error(err));
    }
  
    function deleteWord() {
      const word = wordInput.value;
      const options = {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' }
      };
      fetch(`http://localhost:3000/api/v1/definition/${word}`, options)
        .then(res => res.json())
        .then(res => {
          if (res.message) alert(res.message);
        })
        .catch(err => console.error(err));
    }
  
    function getLanguages() {
      fetch('http://localhost:3000/api/v1/languages')
        .then(res => res.json())
        .then(res => {
          res.forEach(language => {
            addLanguageOption(language.language, wordLanguageSelect);
            addLanguageOption(language.language, definitionLanguageSelect);
          });
        })
        .catch(err => console.error(err));
    }
  
    function addLanguageOption(language, selectElement) {
      const option = document.createElement('option');
      option.value = language;
      option.innerText = language;
      selectElement.appendChild(option);
    }
  });
  