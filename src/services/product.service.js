'use strict';

const { product, clothing, electronic, furniture } = require('../models/product.model');
const { BadRequestError } = require('../core/error.response');
const {
  findAllDraftShops,
  publishProductByShops,
  findAllPublishShops,
  unpublishProductByShops,
  // deleteProductByShops,
  searchProductByuser,
  findAllProducts,
  findOneProduct,
  updateProductById,
  getProductById,
  updateImageProductById,
} = require('../models/repository/product.repo');
const { removeUndefinedObject, updateNestedObjectPraser } = require('../utils');
const { insertInventory } = require('../models/repository/inventory.repo');
const { cloudinaryUploadImage } = require('../utils/cloudinary');
const fs = require('fs');

class ProductFactory {
  static productRegitry = {};

  static registerProductType(type, classRef) {
    ProductFactory.productRegitry[type] = classRef;
  }

  static async createProduct(type, payload) {
    const productClass = ProductFactory.productRegitry[type];

    if (!productClass) throw new BadRequestError(`Invalid Product Types ${type}`);

    return new productClass(payload).createProduct();
  }

  static async updateProduct(type, productId, payload) {
    const productClass = ProductFactory.productRegitry[type];

    if (!productClass) throw new BadRequestError(`Invalid Product Types ${type}`);

    return new productClass(payload).updateProduct(productId);
  }

  static async publishProductByShops({ product_shop, product_id }) {
    return await publishProductByShops({ product_shop, product_id });
  }

  static async unpublishProductByShops({ product_shop, product_id }) {
    return await unpublishProductByShops({ product_shop, product_id });
  }

  // static async deleteProductByShops({ product_shop, product_id }) {
  //   return await deleteProductByShops({ product_shop, product_id });
  // }

  static async findAllDraftShops({ product_shop, limit = 50, skip = 0 }) {
    const query = { product_shop, isDraft: true };
    return await findAllDraftShops({ query, limit, skip });
  }

  static async findAllPublishShops({ product_shop, limit = 50, skip = 0 }) {
    const query = { product_shop, isPublished: true };
    return await findAllPublishShops({ query, limit, skip });
  }

  static async getListSearchProducts({ keySearch }) {
    return await searchProductByuser({ keySearch });
  }

  static async findAllProducts({ limit = 50, sort = 'ctime', page = 1, filter = { isPublished: true } }) {
    return await findAllProducts({
      limit,
      sort,
      page,
      filter,
      select: ['product_name', 'product_price', 'product_thumb', 'product_shop'],
    });
  }
  static async findOneProduct({ product_id }) {
    const product = await findOneProduct({ product_id, unSelect: ['__v '] });
    return product;
  }

  static async uploadImg({ id, files }) {
    const uploader = (path) => cloudinaryUploadImage(path, 'images');
    const urls = [];

    for (const file of files) {
      const { path } = file;
      const newPath = await uploader(path);

      urls.push(newPath);
      fs.unlinkSync(path);
    }

    const findProducts = await updateImageProductById(id, { product_images: urls });

    console.log(findProducts);
    return findProducts;
  }
}

class Product {
  constructor({
    product_name,
    product_thumb,
    product_description,
    product_price,
    product_quantity,
    product_shop,
    product_attribute,
    product_type,
  }) {
    this.product_name = product_name;
    this.product_thumb = product_thumb;
    this.product_description = product_description;
    this.product_price = product_price;
    this.product_quantity = product_quantity;
    this.product_shop = product_shop;
    this.product_attribute = product_attribute;
    this.product_type = product_type;
  }

  async createProduct(product_id) {
    const newProduct = await product.create({ ...this, _id: product_id });

    if (newProduct) {
      await insertInventory({
        productId: newProduct._id,
        shopId: this.product_shop,
        stock: this.product_quantity,
      });
    }

    return newProduct;
  }

  async updateProduct(productId, bodyUpdate) {
    return await updateProductById({ productId, bodyUpdate, model: product });
  }
}

class Clothing extends Product {
  async createProduct() {
    const newClothing = await clothing.create({
      ...this.product_attribute,
      product_shop: this.product_shop,
    });
    if (!newClothing) throw new BadRequestError('create new Clothing error');

    const newProduct = await super.createProduct(newClothing._id);
    if (!newProduct) throw new BadRequestError('create new product error');

    return newProduct;
  }

  async updateProduct(productId) {
    const objectParams = this;

    if (objectParams.product_attribute) {
      await clothing.findByIdAndUpdate(productId, updateNestedObjectPraser(objectParams.product_attribute));
    }

    const updateProduct = await super.updateProduct(productId, updateNestedObjectPraser(objectParams));
    return updateProduct;
  }
}

class Electronics extends Product {
  async createProduct() {
    const newElectronic = await electronic.create({
      ...this.product_attribute,
      product_shop: this.product_shop,
    });
    if (!newElectronic) throw new BadRequestError('create new Electronics error');

    const newProduct = await super.createProduct(newElectronic._id);
    if (!newProduct) throw new BadRequestError('create new product error');

    return newProduct;
  }

  async updateProduct(productId) {
    const objectParams = this;

    if (objectParams.product_attribute) {
      await electronic.findByIdAndUpdate(productId, updateNestedObjectPraser(objectParams.product_attribute));
    }

    const updateProduct = await super.updateProduct(productId, updateNestedObjectPraser(objectParams));
    return updateProduct;
  }
}

class Furniture extends Product {
  async createProduct() {
    const newFurniture = await furniture.create({
      ...this.product_attribute,
      product_shop: this.product_shop,
    });
    if (!newFurniture) throw new BadRequestError('create new Electronics error');

    const newProduct = await super.createProduct(newFurniture._id);
    if (!newProduct) throw new BadRequestError('create new product error');

    return newProduct;
  }

  async updateProduct(productId) {
    const objectParams = this;

    if (objectParams.product_attribute) {
      await furniture.findByIdAndUpdate(productId, updateNestedObjectPraser(objectParams.product_attribute));
    }

    const updateProduct = await super.updateProduct(productId, updateNestedObjectPraser(objectParams));
    return updateProduct;
  }
}

ProductFactory.registerProductType('Electronics', Electronics);
ProductFactory.registerProductType('Clothing', Clothing);
ProductFactory.registerProductType('Furniture', Furniture);

module.exports = ProductFactory;
