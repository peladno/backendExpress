const socket = io.connect();

//Messages

const render = (data) => {
  const html = data
    .map((element) => {
      return `
        <p><strong>${element.author}</strong>[${element.date}, ${element.time}]:
        <i>${element.text}</i></p>
    `;
    })
    .join(" ");
  document.getElementById("messages").innerHTML = html;
};

const addMessage = () => {
  const message = {
    author: document.getElementById("username").value,
    text: document.getElementById("text").value,
    date: new Date().toLocaleDateString(),
    time: new Date().toLocaleTimeString(),

  };
  socket.emit("new-message", message);
};

const element = document.getElementById("form");

element.addEventListener("submit", (event) => {
  event.preventDefault();
  addMessage();
});

socket.on("messages", (data) => {
  render(data);
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

