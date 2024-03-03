const express = require('express');
const router = express.Router();

const dotenv = require('dotenv')
dotenv.config()

const jwt = require('jsonwebtoken')

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
let aumentarVisitas = (encontrado) => {
  try {
    usuarios_obj.find(u => u.email == encontrado.email).visitas++
    fs.writeFileSync('./usuarios.json', JSON.stringify(usuarios_obj), 'utf-8')
  } catch (error) {
    console.log(error)
  }
}

// -- ROUTER --
router.get('/', (req, res) => {
  res.render('landing')
})
router.get('/login', (req, res) => {
  res.render('login')
})
router.post('/login', (req, res) => {
  const user = req.body
  const encontrado = usuarios_obj.find(u => u.email == user.email)
  comparar_pass = bcryptjs.compare(user.password, encontrado.password)
  console.log(encontrado.email, ':', comparar_pass)

  if (encontrado.esAdmin && comparar_pass) {
    aumentarVisitas(encontrado)
    res.render('panel', { user: encontrado })
  } 
  else if(encontrado && comparar_pass) {
    aumentarVisitas(encontrado)
    res.render('bienvenido', { user: encontrado })
  }
  else{
    console.log('datos mal, manda a register')
    res.redirect('/register')
  }  
})

router.get('/register', (req, res) => {
  res.render('register')
})
router.post('/register', async (req, res) => {
  const emails_admins = ['admin', 'pedro', 'admin2'] //lista de mail de admins
  const existe_mail = usuarios_obj.find(u => u.email == req.body.email)
  if (existe_mail) {
    res.render('login')
  } 
  else {
    // contraseña hash, nº de saltos en el .env, pasar a int
    const password_hash = await bcryptjs.hash(req.body.password, parseInt(process.env.NUM_SALTOS))
    const imag_default = 'https://img.freepik.com/foto-gratis/retrato-hombre-reir_23-2148859448.jpg?w=740&t=st=1708718902~exp=1708719502~hmac=06f2817e5814f11d5b2aaff09ebb7ac99ca87e6b592ae7a62dc5f4dc82f6193e'
    const valorAdmin = emails_admins.includes(req.body.email) //mira si el mail esta en la lista

    const newUser = {email: req.body.email, password: password_hash, password_sin_hash: req.body.password, imagen: imag_default, esAdmin: valorAdmin, visitas: 0, favoritos: []}

    usuarios_obj.push(newUser)
    console.log(usuarios_obj[usuarios_obj.length-1])
    guardar_JSON_users()
    if (newUser.esAdmin) {
      aumentarVisitas(newUser)
      res.render('panel', {user: newUser})
    } else {
      aumentarVisitas(newUser)
      res.render('bienvenido', {user: newUser})
    }
  }
})

router.post('/allUsers/:email', (req, res) => {
  console.log('solicitando users...')
  const encontr = usuarios_obj.find(u => u.email == req.params.email)
  const esValido = bcryptjs.compare(encontr.password, req.body.clave_hash)

  if (esValido && encontr.esAdmin) {
    res.render('allUsers', {usuarios: usuarios_obj, user: encontr})
  } else {
    res.sendStatus(403)
  }
})
router.post('/deleteUser', (req, res) => {
  // console.log('borrar a', req.body.email_borrar)
  usuarios_obj = usuarios_obj.filter(u => u.email != req.body.email_borrar)
  guardar_JSON_users()
  res.render('login') //borrar a alguien te manda a login, asi puedes borrarte a ti mismo
})
router.get('/allObj', (req, res) => {
  res.render('allObj')
})


module.exports = router;
