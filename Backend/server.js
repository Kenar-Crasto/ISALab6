const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const db = require('./db');

const app = express();
const port = 3000;

const serverMsg = "Server is running on port";
const updateMsg = "Dictionary Entry Successfully Updated";
const wordExistsMsg = "Word already exists in the Dictionary. Do you want to update the definition of the word?";
const wordNotFoundMsg = "Word is not in Dictionary";
const update = "update";
const insert = "inserted";
const dbCheck = "DB check result is ";

app.use(bodyParser.json());
app.use(cors());

const definitionRoute = '/api/v1/definition';
const wordDefinitionRoute = '/api/v1/definition/:word';
const getLanguageRoute = '/api/v1/languages';

// Create a new dictionary entry or update if the word exists
app.post(definitionRoute, async (req, res) => {
  const newEntry = req.body;

  if (await db.wordExists(newEntry.word)) {
    return res.status(200).json({
      message: wordExistsMsg,
      word: newEntry.word,
      action: update,
    });
  } else {
    db.insertWord(newEntry.word, newEntry.definition, newEntry.wordLanguage, newEntry.definitionLanguage)
    res.status(201).json({ message: updateMsg, entry: newEntry, action: insert })
  }

  console.log(dbCheck + db.wordExists(newEntry.word));
});

// Handle the update when the user confirms
app.patch(wordDefinitionRoute, async (req, res) => {
  const wordToUpdate = req.params.word;
  const newDefinition = req.body.definition;
  const newWordLanguage = req.body.wordLanguage;
  const newDefinitionLanguage = req.body.definitionLanguage;

  const result = await db.updateWord(wordToUpdate, newDefinition, newWordLanguage, newDefinitionLanguage);

  if (result) {
    res.status(200).json({ message: updateMsg });
  } else {
    res.status(404).json({ message: wordNotFoundMsg });
  }
});

// Retrieve the definition of a word
app.get(wordDefinitionRoute, async (req, res) => {
  const wordToRetrieve = req.params.word;
  const wordExists = await db.wordExists(wordToRetrieve);

  if (wordExists) {
    const definition = await db.getDefinition(wordToRetrieve);
    res.status(200).json(definition);
  } else {
    res.status(404).json({ message: wordNotFoundMsg });
  }
});

// Remove the word and its definition
app.delete(wordDefinitionRoute, async (req, res) => {
  const wordToDelete = req.params.word;
  const result = await db.deleteWord(wordToDelete);

  if (result) {
    res.status(204).send();
  } else {
    res.status(404).json({ message: wordNotFoundMsg });
  }
});

// Retrieve supported languages
app.get(getLanguageRoute, async (req, res) => {
  const supportedLanguages = await db.getLanguages();
  res.status(200).json(supportedLanguages);
});

app.listen(port, () => {
  console.log(serverMsg + port);
});
