const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const errorController = require('./controllers/error');
const User = require('./models/user');
const mongoConnect=require('./util/database');
const session=require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const csrf = require('csurf');
const flash = require('connect-flash');
// const sequelize=require('./util/database');
const app = express();
const store= new MongoDBStore({
  uri:'mongodb://localhost:27017/ecommerce',
  collection:'sessions'
})
// const Product=require('./models/product');
// const User=require('./models/user');
// const Cart=require('./models/cart');
// const CartItem=require('./models/cart-item');
// const Order=require('./models/order');
// const OrderItem=require('./models/order-item');
const csrfProtection = csrf();
app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(
session({secret:'top secret',resave:false,saveUninitialized:false,store:store})
);
app.use(csrfProtection);
app.use(flash());
// app.use((req,res,next)=>{
//     User.findById(1)
//     .then(user=>{
//         // console.log("check",user);
//         req.user=user;
//         next();
//     })
//     .catch(err=>{
//         console.log(err);
//     })
// })
app.use((req, res, next) => {
  if (!req.session.user) {
    return next();
  }
  User.findById(req.session.user._id)
    .then(user => {
      req.user = user;
      next();
    })
    .catch(err => console.log(err));
});
app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn;
  res.locals.csrfToken = req.csrfToken();
  next();
});
app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);
// Cart keeps tracks of every transaction
//CartItem is a link between product and that cart
app.use(errorController.get404);
// Product.belongsTo(User,{constraints:true,onDelete:'CASCADE'});
// User.hasMany(Product);//Optional
// User.hasOne(Cart);
// Cart.belongsTo(User);//Optional
// Cart.belongsToMany(Product,{through:CartItem});
// Product.belongsToMany(Cart,{through:CartItem});    
// //Order to User 1 to many
// Order.belongsTo(User);
// User.hasMany(Order);
// Order.belongsToMany(Product,{through:OrderItem});    

// sequelize
// .sync({force:true})
// // .sync()
// .then(result=>{
//     // console.log(result);
//     return User.findById(1);
//  }).then(user=>{
//      if(!user){
//         return User.create({
//              name:'asim',
//              email:'test@test.com'
//          })
//      }
//      return user;
//     //  return Promise.resolve(user);
//  }).then(user=>{
//      return user.createCart();
//  })
//  .then(cart=>{
//      app.listen(3000);
//  })
// .catch(err=>{
//     console.log(err);
// })

// mongoConnect(client =>{
//     console.log(client);
//     app.listen(3000);
// })
mongoose
  .connect(
    'mongodb://localhost:27017/ecommerce'
  )
  .then(result => {
    app.listen(3000);
  })
  .catch(err => {
    console.log(err);
  });