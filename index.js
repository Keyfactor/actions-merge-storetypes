const fs = require('fs');
const core = require('@actions/core');
const github = require('@actions/github');

try {
  // input-file and library-file defined in action metadata file
  // If either of these files is missing, do not proceed.
  const inputFile = core.getInput('input-file') || 'integration-manifest.json';
  const libraryFile = core.getInput('library-file') || 'master.json';
  const inputFileExists = fs.existsSync(inputFile);
  const libraryFileExists = fs.existsSync(libraryFile);
  if (inputFileExists && libraryFileExists) {
    const newdata = JSON.parse(fs.readFileSync(inputFile))
    const master = JSON.parse(fs.readFileSync(libraryFile))

    console.log('Library/Master file: ' + libraryFile);
    console.log('newData file: ' + inputFile);
    let storeTypeEntries = newdata.about.orchestrator.store_types
    let result = [];

    const names = master.map(storeType => storeType.ShortName); // Create a list of existing entries by Name
    for (const entry in storeTypeEntries) {
      var index = names.indexOf(storeTypeEntries[entry].ShortName) 
      if ((index) >= 0) { // Look for existing entries
        console.log(`${storeTypeEntries[entry].ShortName} found. Removing old entry before updating`);
        master.splice(master[index], 1) // Remove old entry
      }
      console.log(`Adding ${storeTypeEntries[entry].ShortName}`)
      master.push(storeTypeEntries[entry]) // Add new or updated entry
      

    }
    fs.writeFile(libraryFile, JSON.stringify(master, null, 2), (err) => {
      if (err)
        console.log(err);
      else {
        console.log("File written successfully\n");
      }
    });
  } else {
    if (!inputFileExists) console.log('Missing ' + inputFile + ' json source file');
    if (!libraryFileExists) console.log('Missing ' + libraryFile + ' json source file');

  }
} catch (error) {
  core.setFailed(error.message);
}