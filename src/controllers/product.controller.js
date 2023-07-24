'use strict';

const ProductServiceV2 = require('../services/product.service');
const SearchService = require('../services/elasticsearch.service');
const { SuccesResponse } = require('../core/success.response');

class ProductController {
  createProduct = async (req, res, next) => {
    new SuccesResponse({
      message: 'Create new product success!',
      metadata: await ProductServiceV2.createProduct(req.body.product_type, {
        ...req.body,
        product_shop: req.user.userId,
      }),
    }).send(res);
  };

  //update product

  updateProduct = async (req, res, next) => {
    new SuccesResponse({
      message: 'Update product success!',
      metadata: await ProductServiceV2.updateProduct(
        //can truyen type of product, product_id de xac dinh product and payload
        req.body.product_type,
        req.params.productId,
        {
          ...req.body,
          product_shop: req.user.userId,
        }
      ),
    }).send(res);
  };

  publishProductByShops = async (req, res, next) => {
    new SuccesResponse({
      message: 'Pubish Product By Shop success!',
      metadata: await ProductServiceV2.publishProductByShops({
        product_shop: req.user.userId,
        product_id: req.params.id,
      }),
    }).send(res);
  };

  unpublishProductByShops = async (req, res, next) => {
    new SuccesResponse({
      message: 'Unpubish Product By Shop success!',
      metadata: await ProductServiceV2.unpublishProductByShops({
        product_shop: req.user.userId,
        product_id: req.params.id,
      }),
    }).send(res);
  };

  deleteProductByShops = async (req, res, next) => {
    new SuccesResponse({
      message: 'Unpubish Product By Shop success!',
      metadata: await ProductServiceV2.deleteProductByShops({
        product_shop: req.user.userId,
        product_id: req.params.id,
      }),
    }).send(res);
  };

  //QUERY

  /**
   * get All products
   * @param {Number} limit
   * @param {Number} skip
   * @retrurn {JSON} res
   */
  getAllDraftShop = async (req, res, next) => {
    new SuccesResponse({
      message: 'Get list draft success!',
      metadata: await ProductServiceV2.findAllDraftShops({
        product_shop: req.user.userId,
      }),
    }).send(res);
  };

  getAllPublishShop = async (req, res, next) => {
    new SuccesResponse({
      message: 'Get list published success!',
      metadata: await ProductServiceV2.findAllPublishShops({
        product_shop: req.user.userId,
      }),
    }).send(res);
  };
  getListSearchProduct = async (req, res, next) => {
    new SuccesResponse({
      message: 'Get List Search Product success!',
      metadata: await ProductServiceV2.getListSearchProducts(req.params),
    }).send(res);
  };

  findAllProduct = async (req, res, next) => {
    new SuccesResponse({
      message: 'Find All Product success!',
      metadata: await ProductServiceV2.findAllProducts(req.query),
    }).send(res);
  };

  findOneProduct = async (req, res, next) => {
    new SuccesResponse({
      message: 'Find One Product success!',
      metadata: await ProductServiceV2.findOneProduct({
        product_id: req.params.productId,
      }),
    }).send(res);
  };

  uploadImg = async (req, res, next) => {
    const { id } = req.params;
    console.log(id);
    const files = req.files;
    new SuccesResponse({
      message: 'Upload image of product success!',
      metadata: await ProductServiceV2.uploadImg({
        id,
        files: files,
      }),
    }).send(res);
  };

  //saerch product

  searchProduct = async (req, res, next) => {
    new SuccesResponse({
      message: 'Search Products success!',
      metadata: await SearchService.searchProducts(req.body),
    }).send(res);
  };
  //END QUERY
}

module.exports = new ProductController();
