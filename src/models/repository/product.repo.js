'use strict';

const { product, electronic, clothing, furniture } = require('../product.model');
const { Types } = require('mongoose');
const { getSelectData, unGetSelectData, converToObjectInMongodb } = require('../../utils/index');
const findAllDraftShops = async ({ query, limit, skip }) => {
  return await queryProduct({ query, limit, skip });
};

const findAllPublishShops = async ({ query, limit, skip }) => {
  return await queryProduct({ query, limit, skip });
};

const findAllProducts = async ({ limit, sort, page, filter, select }) => {
  const skip = (page - 1) * limit;
  const sortBy = sort === 'ctime' ? { _id: -1 } : { _id: 1 };
  const products = await product.find(filter).sort(sortBy).skip(skip).limit(limit).select(getSelectData(select)).lean();

  return products;
};

const findOneProduct = async ({ product_id, unSelect }) => {
  return await product.findById(product_id).select('-__v');
};

const updateProductById = async (productId, bodyUpdate, model, isNew = true) => {
  // console.log({ model: model });

  const updateProduct = await model.findByIdAndUpdate(productId, bodyUpdate, {
    new: isNew,
  });
  // console.log('updateProduct:::', updateProduct);
  return updateProduct;
};

const updateQuantityProduct = async (productId, stock) => {
  const query = { _id: productId },
    updateSet = {
      $inc: { product_quantity: stock },
    },
    options = { upsert: true, new: true };
  const newPoroduct = await product.findOneAndUpdate(query, updateSet, options);
  return newPoroduct;
};

const searchProductByuser = async ({ keySearch }) => {
  const regexSearch = new RegExp(keySearch);
  const results = await product
    .find(
      {
        isPublished: true,
        $text: { $search: regexSearch },
      },
      { score: { $meta: 'textScore' } }
    )
    .sort({ score: { $meta: 'textScore' } })
    .lean();
  return results;
};

const publishProductByShops = async ({ product_shop, product_id }) => {
  const foundShop = await product.findOne({
    product_shop: new Types.ObjectId(product_shop),
    _id: new Types.ObjectId(product_id),
  });

  if (!foundShop) return null;
  foundShop.isDraft = false;
  foundShop.isPublished = true;
  const { modifiedCount } = await foundShop.updateOne(foundShop);
  return modifiedCount;
};

const unpublishProductByShops = async ({ product_shop, product_id }) => {
  const foundShop = await product.findOne({
    product_shop: new Types.ObjectId(product_shop),
    _id: new Types.ObjectId(product_id),
  });
  // console.log('foundShop', foundShop);
  if (!foundShop) return null;
  foundShop.isDraft = true;
  foundShop.isPublished = false;
  const { modifiedCount } = await foundShop.updateOne(foundShop);
  return modifiedCount;
};

const queryProduct = async ({ query, limit, skip }) => {
  return await product
    .find(query)
    .populate('product_shop', 'name email -_id')
    .sort({ update: -1 })
    .skip(skip)
    .limit(limit)
    .lean()
    .exec();
};

const getProductById = async (productId) => {
  return await product.findOne({ _id: converToObjectInMongodb(productId) }).lean();
};

const updateImageProductById = async (productId, { product_images }, isNew = true) => {
  const foundShop = await product.findOne({
    _id: new Types.ObjectId(productId),
  });

  if (!foundShop) return null;

  foundShop.product_images = foundShop.product_images.concat(product_images);

  const updatedProduct = await foundShop.save();
  return updatedProduct;
};

const checkProductByServer = async (products) => {
  return await Promise.all(
    products.map(async (product) => {
      const foundProduct = await getProductById(product.productId);
      if (foundProduct) {
        return {
          price: foundProduct.product_price,
          quantity: product.quantity,
          productId: product.productId,
        };
      }
    })
  );
};
module.exports = {
  findAllDraftShops,
  publishProductByShops,
  findAllPublishShops,
  unpublishProductByShops,
  searchProductByuser,
  findAllProducts,
  findOneProduct,
  updateProductById,
  getProductById,
  checkProductByServer,
  updateQuantityProduct,
  updateImageProductById,
};
