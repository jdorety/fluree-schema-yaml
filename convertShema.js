const yaml = require("yaml");
const fs = require("fs");

const sourcePath = process.argv[2];
const targetPath = process.argv[3];

const sourceFile = fs.readFileSync(sourcePath, "utf8");
const yamlDoc = yaml.parseDocument(sourceFile);
// const yamlDoc = new yaml.Document(sourceFile)

const JSONdoc = yamlDoc.toJSON();
console.log(JSON.stringify(JSONdoc, null, 2))

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
if (JSONdoc._predicateExtend) {
  for (let pred of JSONdoc._predicateExtend) {
    predicates.push(createPredicate("_predicate", pred));
  }
}

if (JSONdoc._collectionExtend) {
  for (let collection of JSONdoc._collectionExtend) {
    for (let pred of collection.predicates) {
      predicates.push(createPredicate(collection.name, pred));
    }
  }
}

for (let collection of JSONdoc.collections) {
  collections.push(createCollection(collection.name));
  for (let predicate of collection.predicates) {
    predicates.push(createPredicate(collection.name, predicate));
  }
}

const schemaTransactions = [...collections, ...predicates];

const targetFolder = targetPath;
try {
  fs.writeFileSync(
    (targetFolder ? targetFolder + "/" : "") + "01_schema.json",
    JSON.stringify(schemaTransactions, null, 2)
  );
} catch (err) {
  console.log("Make sure the directory you're writing to exists");
  console.log(err);
}
