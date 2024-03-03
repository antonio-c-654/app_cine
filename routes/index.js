const express = require('express');
const router = express.Router();

const dotenv = require('dotenv')
dotenv.config()

const fs = require('fs')

let usuarios_json = fs.readFileSync('./usuarios.json', 'utf-8')
let usuarios_obj = JSON.parse(usuarios_json)

// let peliculas_json = fs.readFileSync('./peliculas.json', 'utf-8')
// let peliculas_obj = JSON.parse(peliculas_json)

const bcryptjs = require('bcryptjs')

// -- Funciones --
let guardar_JSON_users = () => {
  try {
    fs.writeFileSync('./usuarios.json', JSON.stringify(usuarios_obj), 'utf-8')
  } catch (error) {
    console.log(error)
  }
}
// let guardar_JSON_productos = () => {
//   try {
//     fs.writeFileSync('./peliculas.json', JSON.stringify(usuarios_obj), 'utf-8')
//   } catch (error) {
//     console.log(error)
//   }
// }

// -- ROUTER --
router.get('/', (req, res) => {
  res.render('landing')
})
router.get('/login', (req, res) => {
  res.render('login')
})
router.get('/register', (req, res) => {
  res.render('register')
})



module.exports = router;
