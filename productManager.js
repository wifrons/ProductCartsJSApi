import { access, writeFile, readFile } from 'fs/promises';

class productManager {
    // products = [];

    constructor(productFilePath) {
        this.filePath = productFilePath;
        this.currentId = 0;
        console.log("executing productManager -->> constructor");
    }

    fileExists() {
        try {
            access(this.filePath, constants.F_OK); // Verificar si el archivo es accesible
            return true;
        } catch {
            console.log(`Archivo ${this.filePath} no existe.`);
            return false;
        }
    }

    // Método para obtener todos los productos
    async getProducts() {
        /*         const file = this.fileExists();
                if (!file) return []; */

        try {
            const data = await readFile(this.filePath, 'utf8'); // Leer el archivo JSON
            const productos = JSON.parse(data); // Parsear el contenido del archivo
            // console.log("Productos obtenidos:", productos);
            return productos; // Retornar los productos
        } catch (err) {
            console.error("Error al leer el archivo:", err); // Manejar errores
            throw err; // Relanzar el error si es necesario
        }
    }

    // Método para buscar un producto por id
    getProductById(id) {
        const product = this.getProducts.find(p => p.id === id);
        return product || `No se encontró el producto con id ${id}.`;
    }

    // Método para agregar productos
    async AddProduct(product) {
        const jsonProduct = JSON.stringify(product, null, 2); 
        await writeFile(this.filePath, jsonProduct);
    }

    // Método para agregar productos
    async UpdProduct(product) {
        const jsonProduct = JSON.stringify(product, null, 2); 
        await writeFile(this.filePath, jsonProduct);
    }

}

export default productManager;

