class Container {

    constructor(database, table){
        this.database = database
        this.table = table 
    }

    async save(product) {
        const knex = require('knex')(this.database)
        try {
            await knex(this.table).insert(product)
        }catch (error) {
        console.log(error);
    }}

    async getByID(id) {
        const knex = require('knex')(this.database)
        try {
            const contentById = await knex.select().from(this.table).where("id", id)
            !contentById? "Product not found" : contentById
        } catch (error) {
            console.log(error);
        };
    }

    async getAll() {
        const knex = require('knex')(this.database)
        try {
            const list = await knex.select("*").from(this.table)
            return list
        } catch (error) {
            console.log(error)
        }
    }

    async deleteById(id) {

        try {
            const knex = require('knex')(this.database)
            const deleted = await knex.del().table(this.table).where("id", id)
            !deleted? "Product deleted error" : deleted
        } catch (error) {
            console.log(error)
        }
    };

    async deleteAll() {
        const knex = require('knex')(this.database)
        const deleted = await knex.del().table(this.table)
        !deleted? "Database deleted error" : "Database successfully deleted"
    };

    async updateItems(id, product) {
        try {
            const update = await knex.update(item).table(this.table).where("id", id)
            !update? "Product updated error" : update
            } catch (error) {
            console.log(error)
        }
    }
};

module.exports = Container;