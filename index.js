const express = require('express');
const res = require('express/lib/response');
const app = express();
const Joi = require('joi');

const { v4: uuidv4 } = require('uuid');


app.get('/', (req,res) => {
  res.status.send('Hello Adebambo')
});



const products = [
  {
    id: '1',
    name: 'Orange',
    price: 20,
  },
  {
    id: '2',
    name: 'Apple',
    price: 35,
  },
]

//show list of products
app.get('/api/products',(req,res) =>{
  res.json(products);
})


//show specific product
app.get('/api/products/:id',(req,res) =>{
  const {id} = req.params;
  const product = products.find(prod => prod.id === id);

  if(!product){
    return res.status(404).json({
      error: 'No Product Found with this ID'
    });
  }
  return res.json(product);
});

//Insert a Product data
app.use(express.json());
app.post('/api/products', (req,res) => {
const {error} = validation(req.body);
  if(error){
    return res.status(400).json({
      message: error.details[0].message
    })
  }
  const product ={
    id: uuidv4(),
    name: req.body.name,
    price: req.body.price
  };
  products.push(product);
  return res.json(product)
})


//Update Specific Product Data(Using Put Method)
app.put('/api/products/:id', (req, res) => {
  const {error} = validation(req.body);
  if(error){
    return res.status(400).json({
      message: error.details[0].message
    })
  };

  const index = products.findIndex(prod => prod.id === req.params.id);
  if(index === -1){
    return res.status(400).json({
      message: 'Product is not found with this id'
    })
  };
  products[index].name = req.body.name;
  products[index].price = req.body.price;

  return res.json({
    products: products[index]
  });

})

//Update Specific Product Data(Using Patch Method)
app.patch('/api/products/:id', (req,res) => {
  const index =products.findIndex(prod => prod.id === req.params.id);
  if(index === -1){
    return res.status(404).json({
      message: 'Product is not found with this id'
    })
  };
  let updateProduct = {
    ...products[index],
    ...req.body 
  }
  products[index] = updateProduct;
  return res.json(updateProduct)
 
})


//Delete a specific product data
app.delete('/api/products/:id', (req,res) => {
  const product = products.find(prod => prod.id === req.params.id);
  if(!product){
    return res.status(404).json({
      message: 'Product is not found with this id'
    })
  }

  const index =products.findIndex(prod => prod.id === req.params.id);
  products.splice(index, 1);
  return res.json(product);

})


//Delete All product data
app.delete('/api/products', (req,res) => {
  products.splice(0);
  return res.json(products);
  })



function validation(body){
  const schema = Joi.object({
    name: Joi.string().min(3).max(20).required(),
    price: Joi.number().required()
  });
  return schema.validate(body);

}




app.listen(3000, () => console.log('Server is running at port 3000'));