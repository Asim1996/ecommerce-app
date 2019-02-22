const db= require('../util/database');
const Cart = require('./cart');





module.exports = class Product {
  constructor(id, title, imageUrl, description, price) {
    this.id = id;
    this.title = title;
    this.imageUrl = imageUrl;
    this.description = description;
    this.price = price;
  }

  save() {
    return db.execute('INSERT into products(title,description,price,imageUrl) values(?,?,?,?)',
    [this.title,this.description,this.price,this.imageUrl]);
  }

  static deleteById(id) {
   
  }

  static fetchAll() {
  return db.execute('Select * from products');
  }

  static findById(id) {
  return db.execute('Select * from products where products.id=?',[id]);
  }
};
