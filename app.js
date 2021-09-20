//variables

const cartBtn = document.querySelector(".cart-btn");
const closeCartBtn = document.querySelector(".close-cart");
const clearCartBtn = document.querySelector(".clear-cart");
const cartDOM = document.querySelector(".cart");
const cartOverlay = document.querySelector(".cart-overlay");
const cartItems = document.querySelector(".cart-items");
const cartTotal = document.querySelector(".cart-total");
const cartContent = document.querySelector(".cart-content");
const productsDOM = document.querySelector(".products-center");
//cart
let cart = [];

//buttons
let buttonsDOM = [];

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
      console.log(error);
    }
  }
}

//display products
class UI {
  displayProducts(products) {
    let result = "";
    products.forEach((product) => {
      result += `<!--single product-->
        <article class="product">
            <div class="img-container">
                <img src="${product.image}" alt="product" class="product-img">
                <button class="bag-btn" data-id="${product.id}">
                    <i class="fas fa-shopping-cart"></i>
                    add to bag
                </button>
            </div>
            <h3>${product.title}</h3>
            <h4>$${product.price}</h4>
        </article>
        <!--end of single product-->`;
    });
    //display the pice of html above
    productsDOM.innerHTML = result;
  }
  //on image buttons added after the actual item creation
  getBagButtons() {
    const buttons = [...document.querySelectorAll(".bag-btn")];
    buttonsDOM = buttons;
    //getting id from the attribute
    buttons.forEach(button => {
      let id = button.dataset.id;
      let inCart = cart.find(item => item.id === id);
      //check if item is already in cart
      if (inCart) {
        button.innerText = "In cart";
        button.disable = true;
      }
      button.addEventListener("click", event => {
        //when you click an "add to bag" btn
        event.target.innerText = "In cart";
        event.target.disabled = true;
        //get product from products based on ID
        //adding property "amount"
        let cartItem = { ...Storage.getProduct(id), amount: 1 };

        //add product to the cart
        cart = [...cart, cartItem];
        //save cart ih local storage
        Storage.saveCart(cart);
        //set cart values
        this.setCartValues(cart);
        //display cart item OR add item to the DOM
        this.addCartItem(cartItem);
        //show the cart
        this.showCart();
      });
    });
  }
  setCartValues(cart) {
    let tempTotal = 0;
    let itemsTotal = 0;
    cart.map(item => {
      tempTotal += item.price * item.amount;
      itemsTotal += item.amount;
    });
    cartTotal.innerText = parseFloat(tempTotal.toFixed(2));
    cartItems.innerText = itemsTotal;
  }
  addCartItem(item) {
    const div = document.createElement("div");
    div.classList.add("cart-item");
    div.innerHTML = `<img src=${item.image} alt="product" />
    <div>
        <h4>${item.title}</h4>
        <h5>$${item.price}</h5>
        <span class="remove-item" data-id=${item.id}>remove</span>
      </div>
      <div>
          <i class="fas fa-chevron-up" data-id=${item.id}></i>
          <p class="item-amount">${item.amount}</p>
          <i class="fas fa-chevron-down" data-id=${item.id}></i>
      </div>
    </div>`;
    //append the element into the parent so the html is displayed properly
    cartContent.appendChild(div);
  }
  showCart() {
    cartOverlay.classList.add("transparentBcg");
    cartDOM.classList.add("showCart");
  }
  setupAPP(){
    //I updated the cart from local storage
    cart = Storage.getCart();
    this.setCartValues(cart);
    this.populateCart(cart);
    cartBtn.addEventListener('click', this.showCart);
    closeCartBtn.addEventListener('click', this.hideCart)
  }
  //each and every item that is in the cart, will be added to a cartDOM
  populateCart(cart){
    cart.forEach(item => this.addCartItem(item));
  }
  hideCart(){
    cartOverlay.classList.remove('transparentBcg');
    cartDOM.classList.remove('showCart');
  }
}

//local storage
class Storage {
  //you dont need to create an isntance bc of the static
  static saveProducts(products) {
    //needs to be an string
    localStorage.setItem("products", JSON.stringify(products));
  }
  //get items from storage
  static getProduct(id) {
    //JSON parse bc store them as string
    let products = JSON.parse(localStorage.getItem("products"));
    return products.find((product) => product.id === id);
  }
  //save the cart in local storage
  static saveCart(cart) {
    //needs to be an string
    localStorage.setItem("cart", JSON.stringify(cart));
  }
  //checking if we have something saved in local storage
  static getCart(){
    return localStorage.getItem('cart')?JSON.parse
    (localStorage.getItem):[];
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const ui = new UI();
  const products = new Products();
//setup app
ui.setupAPP();
  //get all products
  products
    .getProducts()
    .then((products) => {
      ui.displayProducts(products);
      //items saved on local storage
      //no need to create an instance of the Storage class(static)
      Storage.saveProducts(products);
    })
    .then(() => {
      ui.getBagButtons();
    });
});
