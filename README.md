# shop-backend

## endpoints:

GET - https://m0v60z1nwf.execute-api.us-east-1.amazonaws.com/dev/products
GET - https://m0v60z1nwf.execute-api.us-east-1.amazonaws.com/dev/products/{productId}
GET - https://m0v60z1nwf.execute-api.us-east-1.amazonaws.com/dev/products/7567ec4b-b10c-48c5-9345-fc73c48a80aa
POST - https://m0v60z1nwf.execute-api.us-east-1.amazonaws.com/dev/products

GET - https://n9zlsoj84h.execute-api.us-east-1.amazonaws.com/dev/import
      https://n9zlsoj84h.execute-api.us-east-1.amazonaws.com/dev/import?name=testUpload

GET - https://5r12ppkv1k.execute-api.us-east-1.amazonaws.com/dev/swagger
## functions:

getProductsList: product-service-dev-getProductsList
getProductsById: product-service-dev-getProductsById
createProduct: product-service-dev-createProduct
catalogBatchProcess: product-service-dev-catalogBatchProcess 
importFileParser: import-service-dev-importFileParser
importProductsFile: import-service-dev-importProductsFile
basicAuthorizer: authorization-service-dev-basicAuthorizer
