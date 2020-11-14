const fs = require('fs');
const path = require('path');


const productsFilePath = path.join(__dirname, '../data/productsDataBase.json');
const products = JSON.parse(fs.readFileSync(productsFilePath, 'utf-8'));


const toThousand = n => n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");

const controller = {
	// Root - Show all products
	index: (req, res) => {
		return res.render('products');
	},

	// Detail - Detail from one product
	detail: (req, res) => {
		let id = req.params.id;
		for(let i = 0; i < products.length; i++) {
			console.log("id producto: " + products[i].id + " id parametro; "+ id)
			if (products[i].id == id) {
				return res.render('detail', { productoEncontrado: products[i] })
			} 
		}
		return res.send("producto no encontrado");
	},

	// Create - Form to create
	create: (req, res) => {
		return res.render('product-create-form');
	},

	// Create -  Method to store
	store: (req, res) => {
		let datosProducto = {
			id: Number(products[products.length - 1].id) + 1,
			...req.body,
			image: req.file.filename
		}
		products.push(datosProducto);
		datosString = JSON.stringify(products, null, 2);
		fs.writeFileSync(path.join(__dirname, '../data/productsDataBase.json'), datosString);
		return res.redirect('/products');
	},

	// Update - Form to edit
	edit: (req, res) => {
		let id = req.params.id;
		let productoEncontado = products.find(function(prod){
			return prod.id == id;
		});
		productoEncontado ? res.render('product-edit-form', {product: productoEncontado}) : res.send("Producto no encontrado");
	},
	// Update - Method to update
	update: (req, res) => {
		let id = req.params.id;
		let imagen = req.file;
		let arrayModificado = products.map(function(prod){
			if(prod.id == id){
				prod = {
					id,
					...req.body,
					image: imagen ? imagen.filename : prod.image
				}
			}
			return prod;
		})
		fs.writeFileSync(productsFilePath, JSON.stringify(arrayModificado, null, 2));
		return res.redirect("/products");
	},

	// Delete - Delete one product from DB
	destroy: (req, res) => {
		let id = req.params.id;
		let arrayFiltrado = products.filter(function(prod){
			return prod.id != id;
		});
		fs.writeFileSync(productsFilePath, JSON.stringify(arrayFiltrado, null, 2));
		return res.redirect("/products");
	}
};

module.exports = controller;