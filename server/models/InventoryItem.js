var mongoose = require('mongoose');

var inventoryItemSchema = mongoose.Schema({
  name: {
    type: String,
    required: '{PATH} is required!'},
  quantity: {
    type: Number,
    required: '{PATH} is required!'},
  category: {
    type:String,
    required:'{PATH} is required!'},
  price: {
    type: Number,
    required:'{PATH} is required!'},
  imgPath: {
    type:String,
    default: ''
  },
  salePrice: {
    type: Number
  }
});
inventoryItemSchema.index({ name: 1, category: 1 }, { unique: true });

var InventoryItem = mongoose.model('InventoryItem', inventoryItemSchema);
InventoryItem.toInventoryItemData = function(inventoryItem) {
  var data = {};
  data.name = inventoryItem.name;
  data.quantity = inventoryItem.quantity;
  data.category = inventoryItem.category;
  data.price = inventoryItem.price;
  if (inventoryItem.size !== null && inventoryItem.size != undefined) {
    data.size = inventoryItem.size;
  }
  if (inventoryItem.year !== null && inventoryItem.year != undefined) {
    data.year = inventoryItem.year;
  }
  if (inventoryItem.imgPath !== null && inventoryItem.imgPath != undefined) {
    data.imgPath = inventoryItem.imgPath;
  }
  if (inventoryItem.salePrice !== null && inventoryItem.salePrice != undefined) {
    data.salePrice = inventoryItem.salePrice;
  }
  return data;
};

function createDefaultInventoryItems() {
//  InventoryItem.find({}).exec(function(err, collection) {
//    if (collection.length < 2) {
//      console.log('creating default inventory items');
//      InventoryItem.create({
//        name: 'Adventures For the Cure: The Doc',
//        category: 'General',
//        year: '',
//        size: '',
//        quantity: 0,
//        price: 10.00});
//      InventoryItem.create({
//        name: '22oz Water Bottles',
//        category: 'General',
//        year: '', size: '',
//        quantity: 0,
//        price: 7.00});
//      InventoryItem.create({
//        name: '26oz Water Bottles',
//        category: 'General',
//        year: '',
//        size: '',
//        quantity: 0,
//        price: 8.00});
//      InventoryItem.create({
//        name: 'Womens Tri Top',
//        category: 'Hincapie Merchandise',
//        year: '2011',
//        size: 'Medium',
//        quantity: 1,
//        price: 65.00,
//        salePrice: 20.00});
//    }
//  });
}

exports.createDefaultInventoryItems = createDefaultInventoryItems;