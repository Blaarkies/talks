let {
  readFileSync,
  writeFileSync,
  statSync,
} = require('fs');
let {sep} = require('path');

let scriptName = 'CssVarGen >> ';

let variableSetsFilename = 'variable-sets.scss';
let filename = process.argv[2] || variableSetsFilename;
let filePath = [__dirname, filename].join(sep);
let lastScriptUpdate;

function extractCSSVariableName(cssLine) {
  const regex = /--[\w-]+:/;
  const match = cssLine.match(regex);
  if (match) {
    return match[0].replace(':', '');
  }
  return null;
}

function makeFileContents(contents) {
  let variables = [];
  for (let line of contents) {
    if (!line.includes('--')) {
      continue;
    }

    let variableName = extractCSSVariableName(line);
    variables.push(variableName);
  }
  let uniqueVariables = [...new Set(variables)];

  let listSet = [1, 2, 3, 4, 5];
  let variablesWrittenOut = uniqueVariables
    .flatMap(name => listSet.map(k => `${name}-${k}:null;`))
    .join('\n');
  let newFileContents = `/*
  ! AUTO-GENERATED ! 
  Upon running [npm run update-css-vars] or [npm start]
  Dev only, not required for prod
  
  This file helps IDE code completion when using the css variables.
  Make changes to the [./${variableSetsFilename}] file, and run the script to update.
 */
:root {
${variablesWrittenOut}
}
`;
  return newFileContents;
}

function writeNewCssVarsFile() {
  try {
    let contents = readFileSync(filePath, {encoding: 'utf8'}).split('\n');

    let newFileContents = makeFileContents(contents);

    let newFilePath = [__dirname, 'generated-variable-names.scss'].join(sep);
    writeFileSync(newFilePath, newFileContents, {encoding: 'utf8'});
    console.log(`${scriptName}Generated file saved to ${newFilePath}`);
  } catch (error) {
    console.error(`${scriptName}An error occurred: ${error.message}`);
  }
}

let intervalHandle = setInterval(() => {
  if (!lastScriptUpdate) {
    lastScriptUpdate = 0;
  }

  let fileUpdate = statSync(filePath).mtime;
  if (fileUpdate > lastScriptUpdate) {
    lastScriptUpdate = fileUpdate;
    writeNewCssVarsFile();
  }
}, 10e3);

process.on('SIGINT', () => {
  clearInterval(intervalHandle);
  console.log(scriptName + 'Watcher stopped');

  process.exit();
});
