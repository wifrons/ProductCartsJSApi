import express from "express";
import data from "./data.js"
import productManager from "./productManager.js"
import cartsManager from "./cartManager.js";
let products = [];
let carts = [];
let currentId = 0;

const productFilePath = "./products.json";
const productMgr = new productManager(productFilePath);

const cartfilePath = "./cart.json";
const cartsMgr = new cartsManager(cartfilePath);

const server = express();
server.use(express.json())

//************************ PRODUCTS

//-->GET    /api
server.get("/api/", (req, res) => {
    res.send("Bienvenidos a la API 🤖 de products y carts. \n-> Para hacer peticiones HTTP; por favor utilice las rutas: /api/products/ y /api/cart/");
});

//-->GET    /api/products/
server.get("/api/products/", (req, res) => {

    productMgr.getProducts()
        .then((prd) => {
            products = prd;
            console.log(`get --> products:`)
            console.log(products)
            if (products === undefined) return res.status(404).json({ error: `Hubo un problema al tratar de obtener productos. ☹️` });
            if (products.length > 0) {
                res.json(products);
            } else {
                res.send("No hay productos almacenados. ☹️");
            }
        })
        .catch((err) => {
            console.err(err);
        })
});

//-->GET    /api/products/:pid
server.get("/api/products/:pid", (req, res) => {
    const { pid } = req.params;

    productMgr.getProducts()
        .then((prd) => {
            products = prd;
            if (products === undefined) return res.status(404).json({ error: `Hubo un problema al tratar de obtener productos. ☹️` });
            if (products.length > 0) {
                const product = products.find(f => f.id === parseInt(pid))
                if (!product) return res.status(404).json({ error: `No se encontró el producto con id ${pid}. 😐` });
                res.json(product);
            } else {
                res.send("No hay productos almacenados. ☹️");
            }
        })
        .catch((err) => {
            console.err(`Error in Get:pid --> error: ${err}`);
            res.status(404).json({ error: `Ocurrio un error al obtener el id: ${pid}. 😐` });
        })

});

//-->POST   /api/products/
server.post("/api/products/", (req, res) => {
    const { title, description, code, price, status, stock, category, thumbnails } = req.body;
    const newProduct = { title, description, code, price, status, stock, category, thumbnails };
    let newId = 1;

    productMgr.getProducts()
        .then((prd) => {
            products = prd;

            if (products === undefined) return res.status(404).json({ error: `Hubo un problema al tratar de obtener productos. ☹️` });

            if (products.length > 0) {

                const product = products.find(f => f.code === newProduct.code)
                if (product) {
                    return res.status(400).json({ error: `El producto con el code ${newProduct.code} ya existe. 😐` });
                } else {
                    let maxId = Math.max(...products.map(prd => prd.id));
                    newId = ++maxId;

                    const newProducts = products;

                    newProducts.push({ ...newProduct, id: newId });
                    productMgr.AddProduct(newProducts)
                        .then(() => {
                            products = newProducts;
                            res.json({ messaje: "Producto agregado exitosamente. 🙂" });
                        })
                        .catch((err) => {
                            console.error(`Error in products.post --> error: ${err}`);
                            res.status(400).json({ error: `No se pudo agregar el producto: ${newProduct.code} . 😐` });
                        })
                }
            }
        })
        .catch((err) => {
            console.error(`Error in getProducts mientras se agrega un producto --> error: ${err}`);
            res.status(404).json({ error: `Ocurrio un error al obtener productos cuando se intentaba agregar un nuevo producto. 😐` });
        })
});

//-->PUT    /api/products/:pid
server.put("/api/products/:pid", (req, res) => {

    /* 
        if (products.length > 0) {
            const { pid } = req.params;
            const { description, price, status, stock, category, thumbnails } = req.body;
            const updProduct = { description, price, status, stock, category, thumbnails };
    
            let pfound = products.find(f => f.id === parseInt(pid));
            if (!pfound) return res.status(404).json({ error: `No se encontró el producto con id ${pid}. 😐` });
    
            pfound.description = updProduct.description;
            pfound.price = parseInt(updProduct.price);
            pfound.status = updProduct.status;
            pfound.stock = parseInt(updProduct.stock);
            pfound.category = updProduct.category;
            pfound.thumbnails = updProduct.thumbnails;
    
            res.json({ messaje: "Producto actualizado exitosamente. 🤗" });
        } else {
            res.send("No hay productos almacenados. ☹️");
        }
     */

    //new version
    const { pid } = req.params;
    const { description, code, price, status, stock, category, thumbnails } = req.body;
    //const productUpd = { description, price, status, stock, category, thumbnails };
    productMgr.getProducts()
        .then((prd) => {
            products = prd;
            if (products === undefined) return res.status(404).json({ error: `Hubo un problema al tratar de obtener productos. ☹️` });

            if (products.length > 0) {
                const productId = parseInt(pid, 10);
                const productIndex = products.findIndex(f => f.id === productId);
                console.log("/api/products/:pid -->> productId:")
                console.log(productId);

                if (productIndex === -1) {
                    return res.status(404).json({ error: `No se encontró el producto con id ${pid}. 😐` });
                } else {
                    products[productIndex] = { ...products[productIndex], description, code, price, status, stock, category, thumbnails }
                    console.log('put --> produts:')
                    console.log(products);
                    productMgr.AddProduct(products)
                        .then(() => {
                            res.json({ messaje: "Producto actualizado exitosamente. 🙂" });
                        })
                        .catch((err) => {
                            console.error(`Error in products.put --> error: ${err}`);
                            res.status(400).json({ error: `No se pudo actualizar el producto: ${code} . 😐` });
                        })
                }
            }
        })
        .catch((err) => {
            console.error(`Error in getProducts mientras se actualizar un producto --> error: ${err}`);
            res.status(404).json({ error: `Ocurrio un error al obtener productos cuando se intentaba actualizar un producto. 😐` });
        })
});

//-->DELETE /api/products/:pid
server.delete("/api/products/:pid", (req, res) => {
    /*     if (products.length > 0) {
            const { pid } = req.params;
            let pfound = products.find(f => f.id === parseInt(pid));
            if (!pfound) return res.status(404).json({ error: `No se encontró el producto con id ${pid}. 😐` });
            products = products.filter((p) => p.id !== parseInt(pid));
            res.json({ messaje: "Producto eliminado exitosamente. 😵" });
        } else {
            res.send("No hay productos almacenados. ☹️");
        } */


    //new version
    const { pid } = req.params;
    productMgr.getProducts()
        .then((prd) => {
            products = prd;
            if (products === undefined) return res.status(404).json({ error: `Hubo un problema al tratar de obtener productos. ☹️` });

            if (products.length > 0) {
                let pfound = products.find(f => f.id === parseInt(pid));
                if (!pfound) return res.status(404).json({ error: `No se encontró el producto con id ${pid}. 😐` });

                let newProducts = products.filter((p) => p.id !== parseInt(pid));
                productMgr.AddProduct(newProducts)
                    .then(() => {
                        products = newProducts;
                        res.json({ messaje: "Producto eliminado exitosamente. 😵" });
                    })
                    .catch((err) => {
                        console.error(`Error in products.delete --> error: ${err}`);
                        res.status(400).json({ error: `No se pudo borrar el producto: ${code} . 😐` });
                    })
            }
        })
        .catch((err) => {
            console.error(`Error in getProducts mientras se borrar un producto --> error: ${err}`);
            res.status(404).json({ error: `Ocurrio un error al obtener productos cuando se intentaba borrar un producto. 😐` });
        })
});

//************************CARTS
//-->GET    /api/carts/
server.get("/api/carts/", (req, res) => {

    cartsMgr.getCarts()
        .then((crts) => {
            carts = crts;
            console.log(`get --> carts:`)
            console.log(carts)
            if (carts === undefined) return res.status(404).json({ error: `Hubo un problema al tratar de obtener carritos. ☹️` });
            if (carts.length > 0) {
                res.json(carts);
            } else {
                res.send("No hay carritos almacenados. ☹️");
            }
        })
        .catch((err) => {
            console.err(`Error in Get:/api/carts/ --> error: ${err}`);
            res.status(404).json({ error: `Get:/api/carts/ -->> Ocurrio un error al obtener todos los carritos. 😐` });
        })
});

//-->GET    /api/carts/:cid
server.get("/api/carts/:cid", (req, res) => {
    const { cid } = req.params;

    cartsMgr.getCarts()
        .then((crts) => {
            carts = crts;
            if (carts === undefined) return res.status(404).json({ error: `Hubo un problema al tratar de obtener carritos. ☹️` });
            if (carts.length > 0) {
                const cart = carts.find(f => f.id === parseInt(cid))
                if (!cart) return res.status(404).json({ error: `No se encontró el carrito con id ${cid}. 😐` });
                res.json(cart);
            } else {
                res.send("No hay carritos almacenados. ☹️");
            }
        })
        .catch((err) => {
            console.err(`Error in Get:/api/carts/:cid --> error: ${err}`);
            res.status(404).json({ error: `Get:/api/carts/:cid -->> Ocurrio un error al obtener el carrito con id: ${cid}. 😐` });
        })
});

server.post("/api/carts/", (req, res) => {
    const { cid } = req.params; // id del carrito
    //No hay carritos
    cartsMgr.getCarts()
        .then((crts) => {
            carts = crts;
            if (carts === undefined) return res.status(404).json({ error: `Hubo un problema al tratar de obtener carritos. ☹️` });
            if (carts.length > 0) {
                const cartIndex = carts.findIndex(f => f.id === parseInt(cid))
                if (!cart) {
                    //No hay carritos
                    carts.push = ({ id: carts[cartIndex].id + 1});
                    cartsMgr.AddCarts(carts)
                        .then(() => {
                            //res.json({ messaje: "Carrito actualizado exitosamente. 🙂" });
                            res.status(200).json({ messaje: "Carrito Creado exitosamente. 🙂", carts: carts });
                        })
                        .catch((err) => {
                            console.error(`Error in put /api/carts/:cid --> error: ${err}`);
                            res.status(400).json({ error: `No se pudo agregar el carrito con id: ${cid} en el carrito. 😐` });
                        })
                } else {

                    return res.status(404).json({ error: `Carrito con id: ${cid}, ya existe. 😐` });
                }
                res.json(cart);
            } else {
                carts = [];
                carts.push = ({ id: 1});
                cartsMgr.AddCarts(carts)
                    .then(() => {
                        //res.json({ messaje: "Carrito actualizado exitosamente. 🙂" });
                        res.status(200).json({ messaje: "Carrito Creado exitosamente. 🙂", carts: carts });
                    })
                    .catch((err) => {
                        console.error(`Error in put /api/carts/:cid --> error: ${err}`);
                        res.status(400).json({ error: `No se pudo agregar el carrito con id: ${ cid } en el carrito. 😐` });
                    })
                res.send("No hay carritos almacenados. ☹️");
            }
        })
        .catch((err) => {
            console.err(`Error in Get:/api/carts/:cid --> error: ${err}`);
            res.status(404).json({ error: `Get:/api/carts/:cid -->> Ocurrio un error al obtener el carrito con id: ${cid}. 😐` });
        })
});

//-->PUT   /api/carts/:cid
server.put("/api/carts/:cid", (req, res) => {
    const { cid } = req.params; // id del carrito
    const { id, quantity } = req.body; // datos del producto

    cartsMgr.getCarts()
        .then((crts) => {
            carts = crts;

            if (carts === undefined) return res.status(404).json({ error: `Hubo un problema al tratar de obtener carritos. ☹️` });

            if (carts.length > 0) {
                //Si hay carritos
                const cartIndex = carts.findIndex((f) => f.id === parseInt(cid));
                if (cartIndex !== -1) {
                    //Encontro el Carrito cid
                    const cartProducts = carts[cartIndex].products;
                    console.log(cartProducts);

                    const cartProductIndex = cartProducts.findIndex((f) => f.id === parseInt(id))

                    if (cartProductIndex !== -1) {
                        //Encontro producto en el carrito
                        carts[cartIndex].products[cartProductIndex].quantity = carts[cartIndex].products[cartProductIndex].quantity + quantity;
                        cartsMgr.UpdCarts(carts)
                            .then(() => {
                                res.json({ messaje: "Carrito actualizado exitosamente. 🙂" });
                            })
                            .catch((err) => {
                                console.error(`Error in put /api/carts/:cid --> error: ${err}`);
                                res.status(400).json({ error: `No se pudo actualizar el producto con id: ${carts[cartIndex].products[cartProductIndex].id} en el carrito. 😐` });
                            })
                    }
                    else {
                        //No Encontro producto en el carrito
                        let newCarts = carts;
                        newCarts[cartIndex].products.push({ ...newCarts[cartIndex].products, quantity: quantity });
                        cartsMgr.UpdCarts(newCarts)
                            .then(() => {
                                carts = newCarts;
                                res.json({ messaje: "Carrito actualizado exitosamente. 🙂" });
                            })
                            .catch((err) => {
                                console.error(`Error in put /api/carts/:cid --> error: ${err}`);
                                res.status(400).json({ error: `No se pudo agregar el producto con id: ${carts[cartIndex].products[cartProductIndex].id} en el carrito. 😐` });
                            })
                    }
                } else {
                    //No Encontro el carrito cid
                    console.log("else cartIndex !== -1");
                    carts.push({ ...carts, id: cid, products: { id, quantity } })
                    console.log(carts);
                    cartsMgr.UpdCarts(carts)
                        .then(() => {
                            //res.json({ messaje: "Carrito actualizado exitosamente. 🙂" });
                            res.status(200).json({ messaje: "Carrito actualizado exitosamente. 🙂", carts: carts });
                        })
                        .catch((err) => {
                            console.error(`Error in put /api/carts/:cid --> error: ${err}`);
                            res.status(400).json({ error: `No se pudo agregar el producto con id: ${carts[cartIndex].products[cartProductIndex].id} en el carrito. 😐` });
                        })
                }
            } else {
                //No hay carritos
                console.log("else carts.length > 0");
                carts = [];
                carts.push = ({ id: cid, products: { id, quantity } })
                cartsMgr.AddCarts(carts)
                    .then(() => {
                        //res.json({ messaje: "Carrito actualizado exitosamente. 🙂" });
                        res.status(200).json({ messaje: "Carrito Creado exitosamente. 🙂", carts: carts });
                    })
                    .catch((err) => {
                        console.error(`Error in put /api/carts/:cid --> error: ${err}`);
                        res.status(400).json({ error: `No se pudo agregar el carrito con id: ${carts[cartIndex].products[cartProductIndex].id} en el carrito. 😐` });
                    })
            }
            res.json(carts);
        })
        .catch((err) => {
            console.error(`Error in Get:/api/carts/ --> error: ${err}`);
            res.status(404).json({ error: `Get:/api/carts/ -->> Ocurrio un error al obtener todos los carritos. 😐` });
        })
});

server.listen(8080, () => console.log("Online Server, port 8080."));