const fs = require('fs');
const core = require('@actions/core');
const github = require('@actions/github');

try {
  // input-file and library-file defined in action metadata file
  // If either of these files is missing, do not proceed.
  const inputFile = core.getInput('input-file');
  const libraryFile = core.getInput('library-file');
  const inputFileExists = fs.existsSync(inputFile);
  const libraryFileExists = fs.existsSync(libraryFile);
  if (inputFileExists && libraryFileExists) {
    const newdata = JSON.parse(fs.readFileSync(inputFile))
    const master = JSON.parse(fs.readFileSync(libraryFile))

    console.log('Library/Master file: ' + libraryFile);
    console.log('newData file: ' + inputFile);
    let storeTypeEntries = newdata.about.orchestrator.store_types
    let result = [];

    const names = master.map(storeType => storeType.Name); // Create a list of existing entries by Name
    for (const entry in storeTypeEntries) {
      if (!(names.indexOf(storeTypeEntries[entry].Name) >= 0)) { // If the store_type Name is not found, add it to the set
        result = master.push(storeTypeEntries[entry])
      }
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