"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Cart =
/*#__PURE__*/
function () {
  function Cart(source) {
    var container = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '#cart';

    _classCallCheck(this, Cart);

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

  _createClass(Cart, [{
    key: "_render",
    value: function _render() {
      var $cartItemsDiv = $('<div/>', {
        class: 'cart-items-wrap'
      });
      var $totalCount = $('<div/>', {
        class: 'cart-summary sum-count'
      });
      var $totalPrice = $('<div/>', {
        class: 'cart-summary sum-price'
      });
      $(this.container).text('Корзина');
      $cartItemsDiv.appendTo($(this.container));
      $totalCount.appendTo($(this.container));
      $totalPrice.appendTo($(this.container));
    }
  }, {
    key: "_init",
    value: function _init() {
      var _this = this;

      this._render();

      fetch(this.source).then(function (result) {
        return result.json();
      }).then(function (data) {
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
          for (var _iterator = data.contents[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var product = _step.value;

            _this.cartItems.push(product);

            _this._renderProduct(product);
          }
        } catch (err) {
          _didIteratorError = true;
          _iteratorError = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion && _iterator.return != null) {
              _iterator.return();
            }
          } finally {
            if (_didIteratorError) {
              throw _iteratorError;
            }
          }
        }

        _this.amount = data.amount;
        _this.countGoods = data.countGoods;

        _this._renderSum();
      });
    }
  }, {
    key: "_renderProduct",
    value: function _renderProduct(product) {
      var $container = $('<div/>', {
        class: 'cart-item',
        'data-product': product.id_product
      });
      $container.append($("<p class=\"product-name\">".concat(product.product_name, "</p>")));

      if ($('#products').find("[data-id=\"".concat(product.id_product, "\"]")).length) {
        $container.addClass('aval');
        $container.append($("<p class=\"product-quantity\">".concat(product.quantity, "</p>")));
        $container.append($("<p class=\"product-price\">".concat(product.price, " \u0440\u0443\u0431.</p>")));
        $container.append($('<button class="count add-one">+</button>'));

        if (product.quantity === 1) {
          $container.append($('<button class="count delete-one" disabled>-</button>'));
        } else {
          $container.append($('<button class="count delete-one">-</button>'));
        }
      } else {
        $container.append($('<strong class="nalabel">Нет в наличии</strong>'));
        $container.addClass('notaval');
        this.notavalCount += product.quantity;
        this.notavalSum += product.quantity * product.price;
      }

      $container.append($('<button class="removepos">Удалить</button>'));
      $container.appendTo($('.cart-items-wrap'));
    }
  }, {
    key: "_renderSum",
    value: function _renderSum() {
      $('.sum-count').text("\u0412\u0441\u0435\u0433\u043E \u0442\u043E\u0432\u0430\u0440\u043E\u0432 \u0432 \u043A\u043E\u0440\u0437\u0438\u043D\u0435: ".concat(this.countGoods - this.notavalCount));
      $('.sum-price').text("\u041E\u0431\u0449\u0430\u044F \u0441\u0442\u043E\u0438\u043C\u043E\u0441\u0442\u044C: ".concat(this.amount - this.notavalSum));
    }
  }, {
    key: "_updateCart",
    value: function _updateCart(product) {
      var $container = $("div[data-product=\"".concat(product.id_product, "\"]"));
      $container.find('.product-quantity').text(product.quantity);
      $container.find('.product-price').text("".concat(product.quantity * product.price, " \u0440\u0443\u0431."));

      if (product.quantity === 1) {
        $container.find('.delete-one').prop('disabled', true);
      } else {
        $container.find('.delete-one').prop('disabled', false);
      }
    }
  }, {
    key: "addProduct",
    value: function addProduct(element) {
      var productId = +$(element).data('id');
      var find = this.cartItems.find(function (product) {
        return product.id_product === productId;
      });

      if (find) {
        find.quantity++;
        this.countGoods++;
        this.amount += find.price;

        this._updateCart(find);
      } else {
        var product = {
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
    } //Вместо удаления сделал 2 кнопки, -1 и +1, т.к. для корзины это более логично
    //Так что метод называется не remove, а recount
    //Кнопку полного удаления я тоже сделал

  }, {
    key: "_recount",
    value: function _recount() {
      var _this2 = this;

      $('#cart').on('click', '.count', function (e) {
        var productId = +$(e.target).parents('.cart-item').data('product');
        var _iteratorNormalCompletion2 = true;
        var _didIteratorError2 = false;
        var _iteratorError2 = undefined;

        try {
          for (var _iterator2 = _this2.cartItems[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
            var item = _step2.value;

            if (item.id_product === productId) {
              if ($(e.target).hasClass('add-one')) {
                item.quantity++;
                _this2.countGoods++;
                _this2.amount += item.price;
              }

              if ($(e.target).hasClass('delete-one')) {
                item.quantity--;
                _this2.countGoods--;
                _this2.amount -= item.price;
              }

              _this2._updateCart(item);
            }

            _this2._recountCart();
          }
        } catch (err) {
          _didIteratorError2 = true;
          _iteratorError2 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion2 && _iterator2.return != null) {
              _iterator2.return();
            }
          } finally {
            if (_didIteratorError2) {
              throw _iteratorError2;
            }
          }
        }
      });
    }
  }, {
    key: "_removePos",
    value: function _removePos() {
      var _this3 = this;

      $('#cart').on('click', '.removepos', function (e) {
        var productId = +$(e.target).parents('.cart-item').data('product');
        var _iteratorNormalCompletion3 = true;
        var _didIteratorError3 = false;
        var _iteratorError3 = undefined;

        try {
          for (var _iterator3 = _this3.cartItems[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
            var item = _step3.value;

            if (item.id_product === productId) {
              _this3.countGoods -= item.quantity;
              _this3.amount -= item.price * item.quantity;
              _this3.cartItems = _this3.cartItems.filter(function (item) {
                return item.id_product !== productId;
              });
              $(".cart-item[data-product=\"".concat(item.id_product, "\"]")).remove();
            }

            _this3._updateCart(item);

            _this3._recountCart();
          }
        } catch (err) {
          _didIteratorError3 = true;
          _iteratorError3 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion3 && _iterator3.return != null) {
              _iterator3.return();
            }
          } finally {
            if (_didIteratorError3) {
              throw _iteratorError3;
            }
          }
        }
      });
    }
  }, {
    key: "_recountCart",
    value: function _recountCart() {
      if ($('.cart-item.aval').length) {
        var curItems = $('.cart-item.aval');
        var totalCost = 0,
            totalQuant = 0;
        var _iteratorNormalCompletion4 = true;
        var _didIteratorError4 = false;
        var _iteratorError4 = undefined;

        try {
          for (var _iterator4 = curItems[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
            var curItem = _step4.value;
            var curCost = parseInt($(curItem).find('.product-price').text());
            var curQuant = +$(curItem).find('.product-quantity').text();
            totalCost = totalCost + curCost;
            totalQuant = totalQuant + curQuant;
          }
        } catch (err) {
          _didIteratorError4 = true;
          _iteratorError4 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion4 && _iterator4.return != null) {
              _iterator4.return();
            }
          } finally {
            if (_didIteratorError4) {
              throw _iteratorError4;
            }
          }
        }

        this.countGoods = totalQuant;
        this.amount = totalCost;
      } else {
        this.countGoods = 0;
        this.amount = 0;
      }

      $('.sum-count').text("\u0412\u0441\u0435\u0433\u043E \u0442\u043E\u0432\u0430\u0440\u043E\u0432 \u0432 \u043A\u043E\u0440\u0437\u0438\u043D\u0435: ".concat(this.countGoods));
      $('.sum-price').text("\u041E\u0431\u0449\u0430\u044F \u0441\u0442\u043E\u0438\u043C\u043E\u0441\u0442\u044C: ".concat(this.amount));
    }
  }]);

  return Cart;
}();