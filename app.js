const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

const errorController = require('./controllers/error');
const sequelize=require('./util/database');
const app = express();
const Product=require('./models/product');
const User=require('./models/user');
const Cart=require('./models/cart');
const CartItem=require('./models/cart-item');
const Order=require('./models/order');
const OrderItem=require('./models/order-item');
app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');


app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use((req,res,next)=>{
    User.findById(1)
    .then(user=>{
        // console.log("check",user);
        req.user=user;
        next();
    })
    .catch(err=>{
        console.log(err);
    })
})
app.use('/admin', adminRoutes);
app.use(shopRoutes);
// Cart keeps tracks of every transaction
//CartItem is a link between product and that cart
app.use(errorController.get404);
Product.belongsTo(User,{constraints:true,onDelete:'CASCADE'});
User.hasMany(Product);//Optional
User.hasOne(Cart);
Cart.belongsTo(User);//Optional
Cart.belongsToMany(Product,{through:CartItem});
Product.belongsToMany(Cart,{through:CartItem});    
//Order to User 1 to many
Order.belongsTo(User);
User.hasMany(Order);
Order.belongsToMany(Product,{through:OrderItem});    

sequelize
.sync({force:true})
// .sync()
.then(result=>{
    // console.log(result);
    return User.findById(1);
 }).then(user=>{
     if(!user){
        return User.create({
             name:'asim',
             email:'test@test.com'
         })
     }
     return user;
    //  return Promise.resolve(user);
 }).then(user=>{
     return user.createCart();
 })
 .then(cart=>{
     app.listen(3000);
 })
.catch(err=>{
    console.log(err);
})
