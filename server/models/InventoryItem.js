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
    type:Number,
    required:'{PATH} is required!'},
  imageUrl: {
    type:String
  },
  salePrice: {
    type:Number
  }
});

var InventoryItem = mongoose.model('InventoryItem', inventoryItemSchema);

function createDefaultInventoryItems() {
  console.log('removing all inventory items from the database');
  InventoryItem.remove({}, function() {
    console.log('removed all inventory items');
  });

  console.log('creating default inventory items');
  InventoryItem.create({
    name:'Adventures For the Cure: The Doc',
    category: 'General',
    year: '',
    size: '',
    quantity: -1,
    price: 10.00,
    salePrice: -1});
  InventoryItem.create({
    name:'22oz Water Bottles',
    category: 'General',
    year: '', size: '',
    quantity: -1,
    price: 7.00,
    salePrice: -1});
  InventoryItem.create({
    name:'26oz Water Bottles',
    category: 'General',
    year: '',
    size: '',
    quantity: -1,
    price: 8.00,
    salePrice: -1});
  InventoryItem.create({
    name:'Womens Tri Top',
    category: 'Hincapie Merchandise',
    year: '2011',
    size: 'Medium',
    quantity: 1,
    price: 65.00,
    salePrice: 20.00});
}

exports.createDefaultInventoryItems = createDefaultInventoryItems;