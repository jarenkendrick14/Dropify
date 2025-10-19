const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path'); 
const Product = require('../models/Product');


dotenv.config({ path: path.resolve(__dirname, '../.env') });

const products = [

  { name: 'PLAIN BLACK SHIRT', price: 250.00, image: '/images/product-shirt-black-plain.png', category: 'shirts' },
  { name: 'FLOW G SHIRT', price: 350.00, image: '/images/product-shirt-black-2.png', category: 'shirts' },
  { name: 'ADVENTURE MASID SHIRT', price: 2450.00, image: '/imagcs/product-shirt-black-3.png', category: 'shirts' },
  { name: 'BLACK MASID SHIRT', price: 450.00, image: '/images/product-shirt-black-1.png', category: 'shirts' },
  { name: 'WHITE MASID SHIRT', price: 550.00, image: '/images/product-shirt-white-2.png', category: 'shirts' },
  { name: 'WHITE KWENTO SHIRT', price: 450.00, image: '/images/product-shirt-white-3.png', category: 'shirts' },
  { name: 'COZIEST BLACK SHIRT', price: 550.00, image: '/images/coziest-shirt.png', category: 'shirts' },
  { name: 'DBTK FLORAL SHIRT', price: 850.00, image: '/images/DBTK-shirt.png', category: 'shirts' },
  { name: 'BLACK MNLA SHIRT', price: 450.00, image: '/images/mnla-shirt-1.png', category: 'shirts' },
  { name: 'MNLA SHIRT', price: 550.00, image: '/images/mnla-shirt-2.png', category: 'shirts' },
  { name: 'RICHBOYZ FLORAL', price: 550.00, image: '/images/richboyz-shirt.png', category: 'shirts' },

  { name: 'BLACK HOODIE', price: 650.00, image: '/images/product-hoodie-1.png', category: 'hoodies' },
  { name: 'CREAM HOODIE', price: 900.00, image: '/images/product-hoodie-2.png', category: 'hoodies' },
  { name: 'DENIM-STYLE HOODIE', price: 650.00, image: '/images/product-hoodie-3.png', category: 'hoodies' },
  { name: 'ARMY GREEN PH HOODIE', price: 650.00, image: '/images/product-hoodie-4.png', category: 'hoodies' },
  { name: 'BLUE AND CREAM HOODIE', price: 650.00, image: '/images/product-hoodie-5.png', category: 'hoodies' },
  { name: 'RICHBOYZ HOODIE', price: 1150.00, image: '/images/richboyz_hoodie.png', category: 'hoodies' },
  { name: 'TP HOODIE', price: 850.00, image: '/images/tp-hoodie.png', category: 'hoodies' },
  { name: 'MNLA CROPPED GRAY HOODIE', price: 650.00, image: '/images/mnla-hoodie.png', category: 'hoodies' },
  { name: 'MASID HOODIE', price: 650.00, image: '/images/masid-hoodie.png', category: 'hoodies' },
  { name: 'COZIEST BLACK HOODIE', price: 650.00, image: '/images/coziest-hoodie.png', category: 'hoodies' },
  // Caps
  { name: 'BLUE AND CREAM CAP', price: 350.00, image: '/images/product-cap-1.png', category: 'caps' },
  { name: 'BLACK GRAPHIC CAP', price: 250.00, image: '/images/product-cap-2.png', category: 'caps' },
  { name: 'BLUE CLOUDS CAP', price: 330.00, image: '/images/product-cap-3.png', category: 'caps' },
  { name: 'ORANGE PH CAP', price: 350.00, image: '/images/product-cap-4.png', category: 'caps' },
  { name: 'MOSS GREEN PH CAP', price: 300.00, image: '/images/product-cap-5.png', category: 'caps' },
  { name: 'COZIEST CAP', price: 500.00, image: '/images/coziest-cap.png', category: 'caps' },
  { name: 'DBTK BLACK AND GRAY CAP', price: 850.00, image: '/images/dbtk-cap.png', category: 'caps' },
  { name: 'MASID BLACK CAP', price: 450.00, image: '/images/masid-cap.png', category: 'caps' },
  { name: 'RICHBOYZ BLACK CAP', price: 500.00, image: '/images/richboyz-cap.png', category: 'caps' },
  { name: 'MNLA BROWN CAP', price: 400.00, image: '/images/mnla-cap.png', category: 'caps' },
];

const importData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    await Product.deleteMany();
    await Product.insertMany(products);
    console.log('Data Imported!');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

importData();