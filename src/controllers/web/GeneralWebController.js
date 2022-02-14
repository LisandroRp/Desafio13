import ProductTestDao from '../../dao/ProductTestDao.js'
import AuthenticationException from '../../exceptions/AuthenticationException.js'
import MessageDao from '../../dao/MessageDao.js'
import UserDao from '../../dao/UserDao.js'
import bCrypt from "bcrypt"
import User from '../../models/User.js'

class GeneralWebController {

    isValidUser(user, password) {
        return bCrypt.compareSync(password, user.password)
    }
    createHash(password) {
        return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null)
    }

    getAll =  async (req, res) => {
        try {
            let productList = await ProductTestDao.getAll()
            let messages = await MessageDao.getAll()
            res.render('index', { productList, messages })
        }
        catch(err) {
            res.json(err)
        }
    }

    getLogIn =  async (req, res) => {
        res.render('./index/LogIn')
    }

    postLogIn =  async (req, res) => {
        const { username, password } = req.body
        console.log(username, password)
        UserDao.getByUsername(username).then(user => {
            console.log(user)
            console.log(bCrypt.compareSync(password, user.password))
            if(!this.isValidUser(user, password))
                res.render('./messagesScreen/Error', {message: "La contraseña es Incorrecta"})
                //res.json(new AuthenticationException(401, "La contraseña es Incorrecta"))
            else{
                req.session.username = username
                req.session.contador = 0 
                res.redirect('/products')
            }
        }).catch(err => {
            console.log(err)
            res.render('./messagesScreen/Error', {message: err.message})
            //res.json(new AuthenticationException(401, "El usuario no existe"))
        })
    }

    postLogOut =  async (req, res) => {
        res.render('./index/LogOut', {username: req.session.username})
    }

    getRegister =  async (req, res) => {
        res.render('./index/Register')
    }

    postRegister =  async (req, res) => {
        const { username, password } = req.body
        UserDao.verifyUsername(username).then(user => {
            console.log(user)
            if(!user){
                UserDao.save(new User(username, this.createHash(password))).then(() => {
                    res.render('./messagesScreen/Success', {message: "Usuario " + username + " Creado existosamente"})
                }).catch(err => {
                    console.log(err)
                    res.render('./messagesScreen/Error', {message: err.message})
                })
            }
            else{
                res.render('./messagesScreen/Error', {message: "El usuario " + username + " ya existe"})
            }
        }).catch(err => {
            console.log(err)
            res.render('./messagesScreen/Error', {message: err.message})
            //res.json(new AuthenticationException(401, "El usuario no existe"))
        })
    }
}
export default new GeneralWebController();
