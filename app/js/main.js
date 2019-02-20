$(document).ready(() => {
    //Товары
    let product1 = new Product(123, 'Ноутбук', 45600, './img/notebook.jpg');
    let product2 = new Product(124, 'Mouse', 600, './img/mouse.jpg');
    let product3 = new Product(125, 'Keyboard', 1600, './img/keyboard.jpeg');

    // Корзина
    let cart = new Cart('js/getCart.json');

    // Добавление товара
    $('.buy-btn').click(e => {
        cart.addProduct(e.target);
    })
});