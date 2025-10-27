const nombre = require('../models/Product');

async function buscarPorNombre(nombreBusqueda) {
    try{
        const resultados = await Product.find({
            name:{ $regex: nombreBusqueda, $options: 'i' }
    });
    console.log('Resultados de la búsqueda:', resultados);
    }catch (error){
        console.error('Error durante la búsqueda:', error);
    }
}
buscarPorNombre('camisa');
module.exports = { buscarPorNombre };