const yaml = require("yaml");
const fs = require("fs");

const sourcePath = process.argv[2];
const targetPath = process.argv[3];

console.log(sourcePath);

const sourceFile = fs.readFileSync(sourcePath, "utf8");
const yamlDoc = yaml.parseDocument(sourceFile);
// const yamlDoc = new yaml.Document(sourceFile)

const JSONdoc = yamlDoc.toJSON();

const collections = [];
const predicates = [];

function createCollection(name) {
  return {
    _id: "_collection",
    name,
  };
}

function createPredicate(collection, predicate) {
  return {
    _id: "_predicate",
    ...predicate,
    name: `${collection}/${predicate.name}`,
  };
}

for (let collection of JSONdoc.collections) {
  collections.push(createCollection(collection.name));
  for (let predicate of collection.predicates) {
    predicates.push(createPredicate(collection.name, predicate));
  }
}

const transactions = [...collections, ...predicates];
console.log(JSON.stringify(transactions, null, 2));