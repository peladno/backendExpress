module.export ={
    PORT: process.env.PORT || 8080,
    mongoLocal: {
        client: mongodb,
        connectionString: 'mongodb://localhost:27017/ecommerce'
}
}