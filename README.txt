Metodos HTTP implementados

//************************************************ PRODUCTS
//-->GET    /api/products/
Obtiene todos los productos

//-->GET    /api/products/:pid
Obtiene el producto indicado en el parametro

//-->POST   /api/products/
Agrega un producto

//-->PUT    /api/products/:pid
Actualiza un producto

//-->DELETE /api/products/:pid
Elimina un producto indicado en el parametro

//************************************************ CARTS
//-->GET    /api/carts/
Obtiene todos los carritos

//-->GET    /api/carts/:cid
Obtiene el carrito indicado en el parametro

//-->POST   /api/carts/
Agrega un carrito

//-->PUT   	/api/carts/:cid
Actualiza un carrito con los parametros indicados

//-->DELETE /api/carts/:cid
Elimina un carrito indicado en el parametro

//************************************************ MODELO JSON DE PRODUCTS
[
  {
    "title": "Notebook Lenovo Gamming",
    "description": "Notebook Lenovo Gamming",
    "code": "NbLeGa",
    "price": 10,
    "status": true,
    "stock": 20,
    "category": "compu",
    "thumbnails": [
      "./NbLeId01.png",
      "./NbLeId02.png"
    ],
    "id": 1
  },
  {
    "title": "Notebook HP ProBook",
    "description": "Notebook HP ProBook",
    "code": "NbHpPb",
    "price": 10,
    "status": true,
    "stock": 20,
    "category": "compu",
    "thumbnails": [
      "./NbHpPb01.png",
      "./NbHpPb02.png"
    ],
    "id": 2
  }
]

//************************************************ MODELO JSON DE CARTS

[
  {
    "id": 1,
    "products": [
      {
        "id": 1,
        "quantity": 8
      }
    ]
  }
]