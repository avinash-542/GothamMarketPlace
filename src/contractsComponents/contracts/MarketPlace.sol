// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/math/SafeMath.sol";

contract Marketplace {
    using SafeMath for uint256;


    struct Item {
        uint256 id;
        string title;
        string description;
        uint256 price;
        string imgUrl;
        address payable seller;
        address payable owner;
        bool isSold;
    }

    //mapping(uint256 => Item) public items;
    Item[] public items;
    uint256 public nextItemId;


    event ItemListed(uint256 id, string title, uint256 price, address indexed seller);
    event ItemPurchased(uint256 id, address indexed buyer);



    function listItem(string memory _title, string memory _description, uint256 _price, string memory _imgUrl) external {
        require(_price > 0, "Price must be greater than zero");
        items.push(Item({
            id: nextItemId,
            title: _title,
            description: _description,
            price: _price,
            imgUrl: _imgUrl,
            seller: payable(msg.sender),
            owner:  payable(msg.sender),
            isSold: false
        }));
        //items[nextItemId] = Item(nextItemId, _title, _description, _price, _imgUrl, payable(msg.sender), owner, false);
        emit ItemListed(nextItemId, _title, _price, msg.sender);
        nextItemId++;
    }

    function purchaseItem(uint256 _itemId) external payable {
        Item storage item = items[_itemId];
        require(item.id != 0, "Item not found");
        require(!item.isSold, "Item already sold");
        require(msg.value >= item.price, "Insufficient funds");
        item.seller.transfer(item.price);
        item.owner = payable(msg.sender);
        item.isSold = true;

        emit ItemPurchased(_itemId, msg.sender);
    }

    
    function viewAllItems() external view returns (Item[] memory) {
        return items;
    }
}
