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
    //console.log(master);
    console.log('newData file: ' + inputFile);
    //console.log(newdata);
    let a2 = newdata.about.orchestrator.store_types
    // let a1 = master.about.orchestrator.store_types
    let a1 = master
    let result = {};
    let key;

    // First remap the resulting json. This will be the lookup json in the actions repo
    for (key in a1) {
      if (a1.hasOwnProperty(key)) {
        result[key] = a1[key];
      }
    }

    // Then overlay the new json info.
    // This will overwrite the object if it exists
    for (key in a2) {
      if (a2.hasOwnProperty(key)) {
        result[key] = a2[key];
      }
    }
    console.log(result)
    fs.writeFile(libraryFile, JSON.stringify(result, null, 2), (err) => {
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