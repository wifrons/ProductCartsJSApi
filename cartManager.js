import { readFile } from 'fs/promises';

class cartsManager {

    constructor(cartFilePath) {
        this.filePath = cartFilePath;
        console.log("executing cartManager -->> constructor");
    }

    async getCarts() {
        try {
            const data = await readFile(this.filePath, 'utf8'); // Leer el archivo JSON
            const carts = JSON.parse(data); // Parsear el contenido del archivo
            // console.log("Productos obtenidos:", productos);
            return carts; // Retornar los productos
        } catch (err) {
            console.error("Error al leer el archivo:", err); // Manejar errores
            throw err; // Relanzar el error si es necesario
        }
    }

    // Método para buscar un producto por id
    getCartsById(id) {
        const cart = this.getProducts.find(p => p.id === id);
        return cart || `No se encontró el carrito con id ${id}.`;
    }

    // Método para agregar Carritos
    async AddCarts(carts) {
        const jsonCarts = JSON.stringify(carts, null, 2);
        await writeFile(this.filePath, jsonCarts);
    }

    // Método para agregar Carritos
    async UpdCarts(carts) {
        const jsonCarts = JSON.stringify(carts, null, 2);
        await writeFile(this.filePath, jsonCarts);
    }

}


export default cartsManager;