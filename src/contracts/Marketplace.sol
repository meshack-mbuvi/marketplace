pragma solidity >=0.5.0;

contract Marketplace {
  string public name;
  uint public productCount = 0;
  mapping(uint => Product) public products;

  struct Product {
    uint id;
    string name;
    uint price;
    address owner;
    bool purchased;
  }

  constructor () public {
    name = "Dapp University Marketplace";
  }

  event ProductCreated(
    uint id,
    string name,
    uint price,
    address owner,
    bool purchased
    );

  function createProduct(
    string memory _name, uint _price) public {
    require(bytes(_name).length > 0);
    require(_price > 0 );

    // increment product count
    productCount++;
    // create the product
    products[productCount] = Product(productCount, _name, _price, msg.sender, false);
    
    // Triger an event
    emit ProductCreated(
      productCount,
      _name,
      _price,
      msg.sender,
      false
      );

  }
}

