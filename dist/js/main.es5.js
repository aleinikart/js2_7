"use strict";

$(document).ready(function () {
  //Товары
  var product1 = new Product(123, 'Ноутбук', 45600, './img/notebook.jpg');
  var product2 = new Product(124, 'Mouse', 600, './img/mouse.jpg');
  var product3 = new Product(125, 'Keyboard', 1600, './img/keyboard.jpeg'); // Корзина

  var cart = new Cart('js/getCart.json'); // Добавление товара

  $('.buy-btn').click(function (e) {
    cart.addProduct(e.target);
  });
});