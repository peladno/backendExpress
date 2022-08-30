const fs = require("fs");
const logger = require("../src/logger/logger")

class Container {

    constructor(filename) {
        this.filename = filename
        this.data = []

        try {
            this.read()
        } catch (error) {
            logger.error(`File doesnt exist ${error}`)
            this.write()
        }
    }

    async write() {
        try {
            await fs.promises.writeFile(this.filename, JSON.stringify(this.data, null, 2))
            return console.log('Data saved!')
        } catch (error) {
            logger.error(`Couldn´t write ${error}`)
        }
    }

    async read() {
        try {
            const data = await fs.promises.readFile(this.filename)
            this.data = JSON.parse(data)
            console.log('Data loaded!')
        } catch (error) {
            logger.error(`Erro reading file ${error}`)
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
            logger.error(`Doesn't exist ${error}`)
        };
    }

    async getAll() {
        try {
            const allContent = await fs.promises.readFile(this.filename, 'utf-8')
            const content = JSON.parse(allContent)
            return content;
        } catch (error) {
            logger.error(`error searching ${error}`)
        }
    }

    async deleteById(id) {

        try {
            const allContent = await fs.promises.readFile(this.filename, 'utf-8');
            const content = JSON.parse(allContent);
            const product = content.filter((i) => i.id !== id);
            await fs.promises.writeFile(this.filename, JSON.stringify(product, null, 2));
        } catch (error) {
            logger.error(`Error deleting ${error}`)
        }
    };

    deleteAll() {
        this.data = []
        this.write()
    };

    async randomItems() {
        try {
            const allContent = await fs.promises.readFile(this.filename, 'utf-8');
            const content = JSON.parse(allContent);
            const shuffled = [...content].sort(() => 0.5 - Math.random());
            return shuffled.slice(0, 1)
        } catch (error) {
            logger.error(`error randoming ${error}`)
        }
    }


    async updateItems(product) {
        try {
            const allContent = await fs.promises.readFile(this.filename, 'utf-8');
            const content = JSON.parse(allContent);

            let indx = content.findIndex((item) => item.id === product.id);
            if (indx == -1) {
                return { error }
            } else {
                content[indx].item = product.item;
                content[indx].price = product.price;
                
                await fs.promises.writeFile(this.filename, JSON.stringify(content, null, 2));
            }
        } catch (error) {
            logger.error(`Error updating ${error}`)
        }
    }
};


module.exports = Container;