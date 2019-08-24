'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ProductSchema = Schema({
    "nombre": String,
    "precio": { type: Number, default:0},
    //"categoria": { type: String, enum: ['computador', 'audifonos', 'accesorio'] },
    "categoria": String,
	"descripcion": String

}) 

module.exports = mongoose.model('Product',ProductSchema)