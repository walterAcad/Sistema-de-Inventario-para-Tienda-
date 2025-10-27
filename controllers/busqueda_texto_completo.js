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
//buscarPorNombre('camisa');
module.exports = { buscarPorNombre };

//Busqueda Filtrado por múltiples criterios 
async function buscarPorCriterios(filtros) {
    try {
        const resultados = await Product.find(filtros);
        console.log('Resultados de la búsqueda por criterios:', resultados);
    } catch (error) {
        console.error('Error durante la búsqueda por criterios:', error);
    }
}

// Ejemplo de uso
// buscarPorCriterios({ category: 'camisas', price: { $lt: 50 } });