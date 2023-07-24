'use strict';

const Discount = require('../models/discount.model');
const Product = require('../models/product.model');
const { BadRequestError, ForbiddenError, NotFoundError } = require('../core/error.response');
const { converToObjectInMongodb } = require('../utils/index');
const { findAllProducts } = require('../models/repository/product.repo');
const {
  findAllDiscountCodesUnselect,
  findAllDiscountCodesSelect,
  checkDiscountExists,
} = require('../models/repository/discount.repo');

class DisCountService {
  static async createDiscountCode(payload) {
    const {
      name,
      discription,
      type,
      value,
      code,
      start_date,
      end_date,
      max_uses,
      uses_count,
      users_used,
      max_uses_per_users,
      min_order_value,
      shopId,
      is_active,
      applies_to,
      product_ids,
    } = payload;

    if (new Date(start_date) >= new Date(end_date)) {
      throw new BadRequestError('Start date must be before end date');
    }

    const findDiscountCode = await Discount.discount
      .findOne({
        discount_code: code,
        discount_shopId: converToObjectInMongodb(shopId),
      })
      .lean();
    console.log(findDiscountCode);
    if (findDiscountCode && findDiscountCode.discount_is_active) {
      throw new BadRequestError('Discount exists');
    }

    const newDiscount = await Discount.discount.create({
      discount_name: name,
      discount_discription: discription,
      discount_type: type,
      discount_value: value,
      discount_code: code,
      discount_start_date: new Date(start_date),
      discount_end_date: new Date(end_date),
      discount_max_uses: max_uses,
      discount_uses_count: uses_count,
      discount_users_used: users_used,
      discount_max_uses_per_users: max_uses_per_users,
      discount_min_order_value: min_order_value || 0,
      discount_shopId: shopId,
      discount_is_active: is_active,
      discount_applies_to: applies_to,
      discount_product_ids: applies_to === 'all' ? [] : product_ids,
    });

    return newDiscount;
  }

  static async updateDiscountCode() {
    //
  }

  static async getAllDiscountCodesWithProduct({ code, shopId, userId, limit, page }) {
    const foundDiscount = await Discount.discount
      .findOne({
        discount_code: code,
        discount_shopId: converToObjectInMongodb(shopId),
      })
      .lean();

    if (!foundDiscount || !foundDiscount.discount_is_active) {
      throw new BadRequestError('Discount not exists');
    }

    const { discount_applies_to, discount_product_ids } = foundDiscount;
    let products;
    if (discount_applies_to === 'all') {
      //get all products
      products = await findAllProducts({
        filter: {
          product_shop: converToObjectInMongodb(shopId),
          isPublished: true,
        },
        limit: +limit,
        page: +page,
        sort: 'ctime',
        select: ['product_name'],
      });
    }

    if (discount_product_ids === 'specific') {
      //get specific products ids
      products = await findAllProducts({
        filter: {
          _id: { $in: discount_product_ids },
          isPublished: true,
        },
        limit: +limit,
        page: +page,
        sort: 'ctime',
        select: ['product_name'],
      });
    }

    return products;
  }

  static async getAllDiscountCodeByShop({ limit, page, shopId }) {
    const discounts = await findAllDiscountCodesSelect({
      filter: {
        discount_shopId: converToObjectInMongodb(shopId),
        discount_is_active: true,
      },
      limit: +limit,
      page: +page,
      select: ['discount_code', 'discount_name'],
      model: Discount.discount,
    });
    return discounts;
  }

  static async getDiscountAmount({ codeId, shopId, products, userId }) {
    const findDiscount = await checkDiscountExists({
      model: Discount.discount,
      filter: {
        discount_code: codeId,
        discount_shopId: converToObjectInMongodb(shopId),
      },
    });

    if (!findDiscount) throw new NotFoundError('Discount does not exist');

    const {
      discount_is_active,
      discount_max_uses,
      discount_min_order_value,
      discount_users_used,
      discount_value,
      start_date,
      end_date,
      discount_max_uses_per_users,
      discount_type,
    } = findDiscount;
    if (!discount_is_active) throw new NotFoundError('Discount expired!');
    if (!discount_max_uses) throw new NotFoundError('Discount are out of range');

    if (new Date() < new Date(start_date) || new Date(end_date) < new Date()) {
      throw new BadRequestError('Discount code has expired');
    }

    let totalOrders = 0;
    if (discount_min_order_value > 0) {
      totalOrders = products.reduce((acc, product) => {
        return acc + product.quantity * product.price;
      }, 0);

      if (totalOrders < discount_min_order_value) {
        throw new NotFoundError(`Discount required a minimum  order value of ${discount_min_order_value}`);
      }
    }

    if (discount_max_uses_per_users > 0) {
      const userUseDiscount = discount_users_used.find((element) => element.equals(userId));

      if (userUseDiscount) {
        return findDiscount;
        // throw new BadRequestError('User has already used the discount');
      }

      const result = await Discount.discount.findByIdAndUpdate(findDiscount._id, {
        $push: {
          discount_users_used: userId,
        },
        $inc: {
          discount_max_uses: -1,
          discount_uses_count: 1,
        },
      });
    }

    const amount = discount_type === 'fixed_amount' ? discount_value : totalOrders * (discount_value / 100);
    return {
      totalOrders,
      discount: amount,
      totalPrice: totalOrders - amount,
    };
  }

  static async deleteDiscountCode({ shopId, codeId }) {
    const deleted = await Discount.discount.findOneAndDelete({
      discount_shopId: converToObjectInMongodb(shopId),
      discount_code: codeId,
    });
    if (!deleted) throw new NotFoundError('Discount not found');
    return deleted;
  }

  static async cancelDiscountCode({ codeId, shopId, userId }) {
    const foundDiscount = await checkDiscountExists({
      model: Discount.discount,
      filter: {
        discount_code: codeId,
        discount_shopId: converToObjectInMongodb(shopId),
        discount_users_used: converToObjectInMongodb(userId),
      },
    });

    if (!foundDiscount) throw new NotFoundError('Discount not found for user ');

    const result = await Discount.discount.findByIdAndUpdate(foundDiscount._id, {
      $pull: {
        discount_users_used: converToObjectInMongodb(userId),
      },
      $inc: {
        discount_max_uses: 1,
        discount_uses_count: -1,
      },
    });

    return result;
  }
}

module.exports = DisCountService;
