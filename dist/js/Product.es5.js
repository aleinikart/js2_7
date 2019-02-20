"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Product =
/*#__PURE__*/
function () {
  function Product(id, title, price) {
    var img = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 'https://placehold.it/200x150';
    var container = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : '#products';

    _classCallCheck(this, Product);

    this.id = id;
    this.title = title;
    this.price = price;
    this.img = img;
    this.container = container;

    this._render();
  }

  _createClass(Product, [{
    key: "_render",
    value: function _render() {
      var $wrapper = $('<div/>', {
        class: 'product'
      });
      var $desc = $('<div/>', {
        class: 'desc'
      });
      var $img = $('<img/>', {
        src: this.img,
        alt: 'Some img'
      });
      var $name = $('<p/>', {
        text: this.title
      });
      var $price = $("<p>\u0426\u0435\u043D\u0430: <span class=\"product-price\">".concat(this.price, "</span></p>"));
      var $buyBtn = $('<button/>', {
        class: 'buy-btn',
        text: 'Купить',
        'data-id': this.id,
        'data-title': this.title,
        'data-price': this.price
      }); // Создаем структуру

      $img.appendTo($wrapper);
      $name.appendTo($desc);
      $price.appendTo($desc);
      $buyBtn.appendTo($desc);
      $desc.appendTo($wrapper);
      $(this.container).append($wrapper);
    }
  }]);

  return Product;
}();