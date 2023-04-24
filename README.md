# shop-backend

## endpoints:

GET - https://j7x45oqwpa.execute-api.us-east-1.amazonaws.com/dev/products
GET - https://j7x45oqwpa.execute-api.us-east-1.amazonaws.com/dev/products/{productId}
GET - https://j7x45oqwpa.execute-api.us-east-1.amazonaws.com/dev/products/7567ec4b-b10c-48c5-9345-fc73c48a80aa
POST - https://j7x45oqwpa.execute-api.us-east-1.amazonaws.com/dev/products

GET - https://n9zlsoj84h.execute-api.us-east-1.amazonaws.com/dev/import
      https://n9zlsoj84h.execute-api.us-east-1.amazonaws.com/dev/import?name=testUpload

GET - https://zkgwe722q6.execute-api.us-east-1.amazonaws.com/dev/swagger
## functions:

getProductsList: product-service-dev-getProductsList
getProductsById: product-service-dev-getProductsById
importFileParser: import-service-dev-importFileParser
importProductsFile: import-service-dev-importProductsFile
