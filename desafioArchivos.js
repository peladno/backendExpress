
const fs = require("fs");

class Container {

  constructor(filename) {
      this.filename = filename
      this.data = []

      try {
          this.read()
      } catch(error) {
          console.log('File doesn´t exist')
          this.write()
      }
  }

  write() {
      fs.promises.writeFile(this.filename, JSON.stringify(this.data, null,2))
          .then( () => {
              console.log('Data saved!')
          })
          .catch( error => console.log(error) )
  }

  read() {
      fs.promises.readFile(this.filename)
          .then( data => {
              this.data = JSON.parse(data)
              console.log('Data loaded!')
          })
          .catch( error => console.log(error))
  }

  getLastID() {
      const dataLength = this.data.length
      
      if(dataLength < 1) return 0

      return this.data[this.data.length - 1].id
  }

  save(obj) {
      const id = this.getLastID()
      this.data.push({
          ...obj, ...{ id: id + 1 }
      })
      this.write()
  }

  async getByID(id) {
    try {
        const allContent = await fs.promises.readFile(this.filename, 'utf-8');
        const content = JSON.parse(allContent);
        const contentById = content.find((i) => i.id == id);
        return contentById;
    } catch (error) {
        console.log('Hubo un error al buscar por ID', error); 
    };
  }

  async getAll() {
      try {
        const allContent = await fs.promises.readFile(this.filename, 'utf-8')
        const content = this.data = JSON.parse(allContent)
        console.log(content)
      }catch(error){   
        console.log("Hubo error", error)
      }}

  async deleteById(id) {

    try {
        const allContent = await fs.promises.readFile(this.filename, 'utf-8');
        const content = JSON.parse(allContent);
        const product = content.filter((i) => i.id !== id);
        await fs.promises.writeFile(this.filename, JSON.stringify(product));
    }catch(error){
        return('Hubo un error al eliminar el producto con ID ', id)
    }};

  deleteAll() {
      this.data = []
      this.write()
  };

};


module.exports = Container;