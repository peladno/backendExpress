const fs = require("fs");

class Container {

    constructor(filename) {
        this.filename = filename
        this.data = []

        try {
            this.read()
        } catch (error) {
            console.log('File doesnt exist')
            this.write()
        }
    }

    async write() {
        try {
            await fs.promises.writeFile(this.filename, JSON.stringify(this.data, null, 2))
            return console.log('Data saved!')
        } catch (error) {
            return console.log(error)
        }
    }

    async read() {
        try {
            const data = await fs.promises.readFile(this.filename)
            this.data = JSON.parse(data)
            console.log('Data loaded!')
        } catch (e) {
            console.log(e)
        }
    }

    getLastID() {
        const dataLength = this.data.length
        if (dataLength < 1) return 0
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
            return ('Hubo un error al buscar por ID', error);
        };
    }

    async getAll() {
        try {
            const allContent = await fs.promises.readFile(this.filename, 'utf-8')
            const content = JSON.parse(allContent)
            return content;
        } catch (error) {
            return ('Hubo error', error)
        }
    }

    async deleteById(id) {

        try {
            const allContent = await fs.promises.readFile(this.filename, 'utf-8');
            const content = JSON.parse(allContent);
            const product = content.filter((i) => i.id !== id);
            await fs.promises.writeFile(this.filename, JSON.stringify(product, null, 2));
        } catch (error) {
            return ('Hubo un error al eliminar el producto con ID ', id)
        }
    };

    deleteAll() {
        this.data = []
        this.write()
    };

    async randomItems() {
        const allContent = await fs.promises.readFile(this.filename, 'utf-8');
        const content = JSON.parse(allContent);
        const shuffled = [...content].sort(() => 0.5 - Math.random());
        return shuffled.slice(0, 1)
    }

};


module.exports = Container;