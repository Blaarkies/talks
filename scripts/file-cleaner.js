let {
  readFileSync,
  writeFileSync,
  statSync,
  globSync,
} = require('fs');
let {sep} = require('path');
let {EOL} = require('os');

let scriptName = 'FileCleaner >> ';

const [major, minor, patch] = process.versions.node.split('.');
if (major < 22) {
  throw new Error(scriptName
    + 'Requires Nodejs 22 or higher for `glob` support');
}

let jobType = {
  ripChangeDetection: 1,
};

let srcPath = process.argv[2] || 'src';
let job = jobType[process.argv[3]] || jobType.ripChangeDetection;

switch (job) {
  case jobType.ripChangeDetection:
    return ripChangeDetection();
}

async function ripChangeDetection() {
  let filePaths = globSync([srcPath, '**', '*.component.ts'].join(sep));

  let successStories = [];
  for (let path of filePaths) {
    try {
      let fileContent = readFileSync(path, {encoding: 'utf8'});
      let lines = fileContent.split(EOL);
      if (lines.length === 1) {
        lines = fileContent.split('\n');
      }
      let rippedLines = lines.map(l => {
        let lineSafe =
          l.replace(/\s*changeDetection:\s*ChangeDetectionStrategy\.OnPush(?:,|$)|\b\s?ChangeDetectionStrategy(?:,|$)\s?/g, '');

        if (lineSafe.length === l.length) {
          return l;
        }

        return lineSafe.trim().length ? lineSafe : null;
      })
        .filter(l => l !== null);

      if (lines.length === rippedLines.length) {
        continue;
      }

      let newContents = rippedLines.join(EOL);
      writeFileSync(path, newContents, {encoding: 'utf8'});
    } catch (error) {
      console.error(`${scriptName}An error occurred: ${error.message}`);
    }
    successStories.push(path);

    await sleep();
  }

  if (successStories.length) {
    console.info(`${scriptName}Successfully ripped [ChangeDetectionStrategy] from`
      + ` [${successStories.length}] files`);
  } else {
    console.info(`${scriptName}No files contained [ChangeDetectionStrategy]`);
  }
}

process.on('SIGINT', () => {
  console.log(scriptName + 'Stopped');

  process.exit();
});

process.exit();


async function sleep(duration = 0) {
  return new Promise(r => setTimeout(() => r(), duration));
}