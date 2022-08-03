const normalizr = require("normalizr");
const normalize = normalizr.normalize;
const schema = normalizr.schema;

const schemaAuthor = new schema.Entity(
  "author",
  {},
  {
    idAttribute: "mail",
  }
);

const schemaMessages = new schema.Entity(
  "messages",
  {
    author: schemaAuthor,
  },
  {
    idAttribute: "id",
  }
);

const schemaAllMessages = new schema.Entity(
  "allMessages",
  {
    messages: [schemaMessages],
  },
  {
    idAttribute: "id",
  }
);

const normalizedMessages = (messages) =>
  normalize(messages, [schemaAllMessages]);

module.exports = { normalizedMessages };
