//variables

const cartBtn = document.querySelector(".cart-btn");
const closecCartBtn = document.querySelector(".close-cart");
const clearCartBtn = document.querySelector(".clear-cart");
const cartDOM = document.querySelector(".cart");
const cartOverlay = document.querySelector(".cart-overlay");
const cartItem = document.querySelector(".cart-items");
const cartTotal = document.querySelector(".cart-total");
const cartContent = document.querySelector(".cart-content");
const productsDOM = document.querySelector(".products-center");

let cart = [];

//getting the products
class Products {
  async getProducts() {
    try {
      // once the objects are ready the data will be stored
      let result = await fetch("products.json");
      let data = await result.json();

      let products = data.items;
      //iterate over every item, we reconstructing the objects
      products = products.map((item) => {
        //title and price are in fields
        const { title, price } = item.fields;
        //id is in sys
        const { id } = item.sys;
        //image well...
        const image = item.fields.image.fields.file.url;
        //now just arrange ur new clean object
        return { title, price, id, image };
      });
      //enjoy
      return products;
    } catch (error) {
      console.log();
    }
  }
}

//display products
class UI {
    displayProducts(products){

    }
}

//local storage
class Storage {}

document.addEventListener("DOMContentLoaded", () => {
  const ui = new UI();
  const products = new Products();

  //get all products
  products.getProducts().then((products) => ui.displayProducts(products));
});
