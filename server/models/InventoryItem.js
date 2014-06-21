var mongoose = require('mongoose');

var inventoryItemSchema = mongoose.Schema({
  name: {
    type: String,
    required: '{PATH} is required!'},
  quantity: {
    type: Number,
    default: -1},
  year: {
    type: String},
  category: {
    type:String,
    required:'{PATH} is required!'},
  size: {
    type:String},
  price: {
    type:String,
    required:'{PATH} is required!'},
  salePrice: {
    type:String}
});

var InventoryItem = mongoose.model('InventoryItem', inventoryItemSchema);

function createDefaultInventoryItems() {
  console.log("removing all inventory items from the database");
  InventoryItem.remove({}, function(err) {
    console.log('removed all inventory items');
  });

  console.log("creating default inventory items");
  InventoryItem.create({name:'Adventures For the Cure: The Doc', category: 'General', year: '', size: '', quantity: -1, price: '$10.00', salePrice: ''});
  InventoryItem.create({name:'22oz Water Bottles', category: 'General', year: '', size: '', quantity: -1, price: '$7.00', salePrice: ''});
  InventoryItem.create({name:'26oz Water Bottles', category: 'General',  year: '', size: '', quantity: -1, price: '$8.00', salePrice: ''});
  InventoryItem.create({name:'Womens Tri Top', category: 'Hincapie Merchandise', year: '2011', size: 'Medium', quantity: 1, price: '$65.00', salePrice: '$20.00'});
  InventoryItem.create({name:'Womens Tri Shorts', category: 'Hincapie Merchandise', year: '2011', size: 'Medium', quantity: 1, price: '$68.00', salePrice: '$25.00'});
  InventoryItem.create({name:'Womens Short Sleeve V-Neck T-Shirt', category: 'Hincapie Merchandise', year: '2011', size: 'Large', quantity: 1, price: '$30.00', salePrice: '$10.00'});
};

exports.createDefaultInventoryItems = createDefaultInventoryItems;