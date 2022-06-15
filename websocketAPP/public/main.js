const socket = io.connect();

//Messages
//const date = new Date().toLocaleDateString();
//const time = new Date().toLocaleTimeString();

const render = (data) => {
  const html = data
    .map((element) => {
      return `
      <div>
        <strong>${element.author}[${element.date}, ${element.time}]:</strong>
        <em>${element.text}</em>
      </div>
    `;
    })
    .join(" ");
  document.getElementById("messages").innerHTML = html;
};

socket.on("messages", (data) => {
  render(data);
});

const addMessage = (event) => {
  const message = {
    author: document.getElementById("username").value,
    text: document.getElementById("text").value,
    date: new Date().toLocaleDateString(),
    time: new Date().toLocaleTimeString()

  };
  socket.emit("new-message", message);
  return false;
};

const element = document.getElementById("form");

element.addEventListener("submit", (event) => {
  event.preventDefault();
  addMessage();
});

//products

socket.on('show', () => {
  fetch('/products')
      .then(response => response.text())
      .then(html => {
          const div = document.getElementById("products")
          div.innerHTML = html
      })
      .catch(e => alert(e))
})


const addProduct = (event) => {
  const item = document.getElementById("item").value;
  const price = document.getElementById("price").value;
  const url = document.getElementById("url").value;
  socket.emit("add", { item, price, url });
}


const products = document.getElementById("productForm");

products.addEventListener("submit", (event) => {
  event.preventDefault();
  addProduct();
});

