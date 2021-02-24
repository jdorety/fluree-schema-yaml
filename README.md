# Convert Fluree schema written in YAML to transactable JSON files

As a software engineer at Fluree PBC, I tend to write a lot of Fluree ledger schemas. These are transacted in JSON, which is readable enough, but I was craving something a little more readable, and with less repetition.

I really enjoy using YAML, and find it easier to read than JSON. I started writing my schemas in YAML, using a format that makes more sense to my brain. Included in this repo is a script that can be used to create transactable JSON files for Fluree.

This method and script currently supports `_predicate` extensions (I did this so that these would always be at the top of the transaction list), and standard collections and predicates. I plan to include formatting rules & support for rules, roles, and smart functions in the future.

## Format Example

```yaml
---
_predicateExtend:
  - name: dateCreated
    type: instant

  - name: longDescription
    type: string

collections:
  - name: foo
    predicates:
      - name: bar
        type: int

  - name: fizz
    predicates:
      - name: buzz
        type: ref
        multi: true

      - name: bang
        type: uri
```

## Usage

In order to use the script, you'll need Node and NPM installed, and be sure to run `npm install` after cloning.

Run the script `convertSchema` in your preferred terminal emulator from this repo's root folder in the following manner

`node convertSchema [source file path] [target directory]`

Currently, the script will output a file named `01_schema.json` in the target directory.

### Output Example

```json
[
  {
    "_id": "_collection",
    "name": "foo"
  },
  {
    "_id": "_collection",
    "name": "fizz"
  },
  {
    "_id": "_predicate",
    "name": "_predicate/dateCreated",
    "type": "instant"
  },
  {
    "_id": "_predicate",
    "name": "_predicate/longDescription",
    "type": "string"
  },
  {
    "_id": "_predicate",
    "name": "foo/bar",
    "type": "int"
  },
  {
    "_id": "_predicate",
    "name": "fizz/buzz",
    "type": "ref",
    "multi": true
  },
  {
    "_id": "_predicate",
    "name": "fizz/bang",
    "type": "uri"
  }
]
```

After that, you can easily copy and paste the contents of the JSON file into your preferred method for making transactions with Fluree.
