'use strict'
//Dependencias NodeJS
const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
var swaggerUi = require('swagger-ui-express'), swaggerDocument = require('./swagger.json');
const Product = require('./models/product')
const app = express()
//-------swagger-------
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

const port = process.env.PORT || 3001

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
//Obtiene todos los productos disponible en la tabla
app.get('/api/producto', (req, res) => {
    try {
        Product.find({}, (err, products) => {
            if (err) return res.status(500).send({ mensaje: "error del servidor" })
            if (!products) return res.status(404).send({ mensaje: "no hay productos" })

            res.status(200).send({ products })


        })

    } catch (e) {
        console.log(" ocurrio un error al obtener todos los productos" + e)
        return res.status(500).send({ messaje: " ocurrio un error al obtener todos los productos" + e })
    }

})
//Obtiene un producto por id
app.get('/api/producto/:productid', (req, res) => {
    try {
        let productID = req.params.productid
        Product.findById(productID, (err, product) => {
            if (err) { if (!product) return res.status(200).send({ mensaje: "el producto no existe" }) }
            res.status(200).send({ product })
        })
    } catch (e) {
        console.log(" ocurrio un error al obtener el producto" + e)
        return res.status(500).send({ messaje: "ocurrio un error al obtener el producto" + e })
    }

})
//Inserta un producto 
app.post('/api/producto', (req, res) => {

    console.log('POST /api/product')
    console.log(req.body)
    try {
        let product = new Product()
        product.nombre = req.body.nombre
        product.precio = req.body.precio
        product.categoria = req.body.categoria
        product.descripcion = req.body.descripcion

        product.save((err, productStored) => {

            if (err) {
                return res.status(500).send({ mensaje: "error al grabar el producto" })
            }
            res.status(200).send({ product: productStored })

        })
    } catch (e) {
        console.log(" ocurrio un error al ingresar el producto" + e)
        return res.status(500).send({ messaje: "ocurrio un error al ingresar el producto" + e })
    }
})
//Realiza una actualizacion de un producto de acuerdo a los parametros de entrada
app.put('/api/producto/:productid', (req, res) => {
    console.log('put /api/product')
    try {
        let update = req.body

        let productID = req.params.productid
        Product.findByIdAndUpdate(productID, update, (err, productUpdated) => {
            if (err) return res.status(500).send({ messaje: "problemas al actualizar" })
            return res.status(200).send({ product: productUpdated })
        })
    } catch (e) {
        console.log(" ocurrio un error al actualizar el producto" + e)
        return res.status(500).send({ messaje: "ocurrio un error al actualizar el producto" + e })
    }

})
//Elimina un producto
app.delete('/api/producto/:productid', (req, res) => {
    console.log('DELETE /api/product')
    try {
        let productID = req.params.productid
        if (mongoose.Types.ObjectId.isValid(productID)) {
            Product.findById(productID, (err, product) => {
                if (err) {
                    console.log('error:' + err)
                    return res.status(500).send({ messaje: `error :` + err })
                } if (!product) {
                    console.log('producto no encontrado')
                    return res.status(200).send({ messaje: `no encontro  el  producto` })
                }
                console.log('producto encontrado')
                product.remove(err => {
                    if (err) return res.status(500).send({ messaje: `Error al Borrar producto ${err}` })
                    return res.status(200).send({ messaje: `Producto borrado` })

                })
            })
        } else {
            console.log("parametro invalido")
            return res.status(200).send({ messaje: "parametro invalido" })
        }
    } catch (e) {
        console.log(" ocurrio un error al borrar el producto" + e)
        return res.status(500).send({ messaje: "ocurrio un error al borrar el producto" + e })
    }
})

//coneccion a la base de datos MongoDB
mongoose.connect('mongodb+srv://app-rest:app-rest@cluster0-t35li.mongodb.net/shop?retryWrites=true&w=majority', { useNewUrlParser: true }, (err, res) => {


    if (err) {
        return console.log("Error conectarse a la BD ")

    }

    console.log("conexión a la base de datos establecida ")


    app.listen(port, () => {
        console.log(`API REST corriendo en http://localhost:${port}`)
    })


})
