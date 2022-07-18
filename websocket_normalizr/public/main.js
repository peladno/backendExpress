const socket = io.connect();
const denormalize = normalizr.denormalize;
const schema = normalizr.schema;


const schemaAuthor = new schema.Entity(
  "author",
  {},
  {
    idAttribute: "mail",
  }
);
const schemaMessage = new schema.Entity(
  "message",
  {
    schemaAuthor,
  },
  {
    idAttribute: "id",
  }
);
const schemaAllMessages = new schema.Entity(
  "allMessages",
  {
    messages: [schemaMessage],
  },
  {
    idAttribute: "id",
  }
);

//Messages

/*const render = (data) => {
  const html = data
    .map((element) => {
      return `
        <p><strong>${element.author.mail}</strong>[${element.date}]:<i>${element.text}</i></p>
    `;
    })
    .join(" ");
  document.getElementById("messages").innerHTML = html;
};*/



socket.on("messages", (data) => {
  const denormalizedData = denormalize(
    data.result,
    schemaAllMessages,
    data.entities
  );

  console.log(denormalizedData);
  //render(denormalizedData.);
});

const addMessage = (event) => {
  const message = {
    author: {
      mail: document.getElementById("email").value,
      age: document.getElementById("age").value,
      name: document.getElementById("name").value,
      avatar: document.getElementById("avatar").value,
    },
    text: document.getElementById("text").value,
    date: new Date().toLocaleString(),
  };
  socket.emit("new-message", message);
};

const element = document.getElementById("form");

element.addEventListener("submit", (event) => {
  event.preventDefault();
  addMessage();
});

//products

socket.on("show", () => {
  fetch("/products")
    .then((response) => response.text())
    .then((html) => {
      const div = document.getElementById("products");
      div.innerHTML = html;
    })
    .catch((e) => alert(e));
});

const addProduct = (event) => {
  const item = document.getElementById("item").value;
  const price = document.getElementById("price").value;
  const url = document.getElementById("url").value;
  socket.emit("add", { item, price, url });
};

const products = document.getElementById("productForm");

products.addEventListener("submit", (event) => {
  event.preventDefault();
  addProduct();
});
