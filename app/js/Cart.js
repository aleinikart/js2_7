class Cart {
    constructor(source, container = '#cart'){
        this.source = source;
        this.container = container;
        this.countGoods = 0; // Общее кол-во товаров
        this.amount = 0; // Общая стоимость товаров
        this.notavalCount = 0; //Сумма товаров в корзине не в наличии
        this.notavalSum = 0; //Сумма товаров в корзине не в наличии
        this.cartItems = []; // Массив товаров
        this._init();
        this._recount();
        this._removePos();
    }
    _render(){
        let $cartItemsDiv = $('<div/>', {
            class: 'cart-items-wrap'
        });
        let $totalCount = $('<div/>', {
            class: 'cart-summary sum-count'
        });
        let $totalPrice = $('<div/>', {
            class: 'cart-summary sum-price'
        });

        $(this.container).text('Корзина');
        $cartItemsDiv.appendTo($(this.container));
        $totalCount.appendTo($(this.container));
        $totalPrice.appendTo($(this.container));
    }
    _init(){
        this._render();
        fetch(this.source)
            .then(result => result.json())
            .then(data => {
                for (let product of data.contents){
                    this.cartItems.push(product);
                    this._renderProduct(product);
                }
                this.amount = data.amount;
                this.countGoods = data.countGoods;
                this._renderSum();
            })
    }
    _renderProduct(product){
        let $container = $('<div/>', {
            class: 'cart-item',
            'data-product': product.id_product
        });
        $container.append($(`<p class="product-name">${product.product_name}</p>`));
        if($('#products').find(`[data-id="${product.id_product}"]`).length){
            $container.addClass('aval');
            $container.append($(`<p class="product-quantity">${product.quantity}</p>`));
            $container.append($(`<p class="product-price">${product.price} руб.</p>`));
            $container.append($('<button class="count add-one">+</button>'));
            if(product.quantity === 1){
                $container.append($('<button class="count delete-one" disabled>-</button>'));
            } else {
                $container.append($('<button class="count delete-one">-</button>'));
            }
        } else {
            $container.append($('<strong class="nalabel">Нет в наличии</strong>'));
            $container.addClass('notaval');
            this.notavalCount += product.quantity;
            this.notavalSum += (product.quantity*product.price);
        }
        $container.append($('<button class="removepos">Удалить</button>'));
        $container.appendTo($('.cart-items-wrap'));
    }
    _renderSum(){
        $('.sum-count').text(`Всего товаров в корзине: ${this.countGoods-this.notavalCount}`);
        $('.sum-price').text(`Общая стоимость: ${this.amount-this.notavalSum}`);
    }
    _updateCart(product){
        let $container = $(`div[data-product="${product.id_product}"]`);
        $container.find('.product-quantity').text(product.quantity);
        $container.find('.product-price').text(`${product.quantity*product.price} руб.`);
        if(product.quantity === 1){
            $container.find('.delete-one').prop('disabled', true);
        } else {
            $container.find('.delete-one').prop('disabled', false);
        }
    }
    addProduct(element){
        let productId = +$(element).data('id');
        let find = this.cartItems.find(product => product.id_product === productId);
        if(find){
            find.quantity++;
            this.countGoods++;
            this.amount += find.price;
            this._updateCart(find);
        } else {
            let product = {
                id_product: productId,
                price: +$(element).data('price'),
                product_name: $(element).data('title'),
                quantity: 1
            };
            this.cartItems.push(product);
            this.amount += product.price;
            this.countGoods += product.quantity;
            this._renderProduct(product);
        }
        this._recountCart();
    }

    //Вместо удаления сделал 2 кнопки, -1 и +1, т.к. для корзины это более логично
    //Так что метод называется не remove, а recount
    //Кнопку полного удаления я тоже сделал
    _recount(){
        $('#cart').on('click', '.count', (e) =>{
            let productId = +$(e.target).parents('.cart-item').data('product');
            for (let item of this.cartItems){
                if(item.id_product === productId){
                    if($(e.target).hasClass('add-one')){
                        item.quantity++;
                        this.countGoods++;
                        this.amount += item.price;
                    }
                    if($(e.target).hasClass('delete-one')){
                        item.quantity--;
                        this.countGoods--;
                        this.amount -= item.price;
                    }
                    this._updateCart(item);
                }
                this._recountCart();
            }
        });
    }
    _removePos(){
        $('#cart').on('click', '.removepos', (e) =>{
            let productId = +$(e.target).parents('.cart-item').data('product');
            for (let item of this.cartItems){
                if(item.id_product === productId){
                    this.countGoods -= item.quantity;
                    this.amount -= item.price*item.quantity;
                    this.cartItems = this.cartItems.filter((item) => item.id_product !== productId);
                    $(`.cart-item[data-product="${item.id_product}"]`).remove();
                }
                this._updateCart(item);
                this._recountCart();
            }

        });
    }
    _recountCart(){
        if($('.cart-item.aval').length){
            let curItems = $('.cart-item.aval');
            let totalCost = 0,
                totalQuant = 0;
            for (let curItem of curItems){
                let curCost = parseInt($(curItem).find('.product-price').text());
                let curQuant = +$(curItem).find('.product-quantity').text();
                totalCost = totalCost+curCost;
                totalQuant = totalQuant+curQuant;
            }
            this.countGoods = totalQuant;
            this.amount = totalCost;
        } else {
            this.countGoods = 0;
            this.amount = 0;
        }
        $('.sum-count').text(`Всего товаров в корзине: ${this.countGoods}`);
        $('.sum-price').text(`Общая стоимость: ${this.amount}`);
    }

}