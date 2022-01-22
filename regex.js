const Path = require("path");
const FS = require("fs");

let Files = [];
let regRedux = new RegExp(/redux/g);
let regCombineReducer = new RegExp(/combineReducer/g);
let regWithinBracket = new RegExp(/\(([^)]+)\)/g);

function ThroughDirectory(Directory) {
  FS.readdirSync(Directory).forEach((File) => {
    const Absolute = Path.join(Directory, File);
    if (FS.statSync(Absolute).isDirectory()) {
      return ThroughDirectory(Absolute);
    } else return Files.push(Absolute);
  });
}

function readIndiFile(indiFile) {
  let fileString = FS.readFileSync(indiFile, (err, files) => {
    if (err) console.log(err);
  }).toString();

  let match = regCombineReducer.exec(fileString);

  // contains combineReducer
  if (match != null) {
    console.log(
      "\nFiles that contain 'combineReducer' module:",
      indiFile,
      match[0]
    );
    match = regWithinBracket.exec(fileString);
    console.log("text within combineReducer functions", match[0], "\n");
  }

  match = regRedux.exec(fileString);
  // contains modules from redux
  if (match != null) {
    console.log("Files that contain imports from redux package:", indiFile);
  }
}

ThroughDirectory("./src/");

Files.map((f) => {
  readIndiFile(f);
});
