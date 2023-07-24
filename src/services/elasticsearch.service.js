'use strict';

const client = require('../dbs/elasticsearch.connection');

async function searchProducts(searchBody) {
  const { searchTerm, product_type, min_price, max_price } = searchBody;
  const query = {
    bool: {
      must: [],
      filter: [],
    },
  };

  if (searchTerm) {
    const wildcardSearchTerm = `*${searchTerm.toLowerCase()}*`;

    query.bool.must.push({
      query_string: {
        query: wildcardSearchTerm,
        fields: ['product_name', 'product_description'],
      },
    });
  }

  if (product_type) {
    query.bool.filter.push({
      term: {
        'product_type.keyword': product_type,
      },
    });
  }

  if (min_price || max_price) {
    const priceRange = {};

    if (min_price) {
      priceRange.gte = min_price;
    }

    if (max_price) {
      priceRange.lte = max_price;
    }

    query.bool.filter.push({
      range: {
        product_price: priceRange,
      },
    });
  }

  const body = await client.search({
    index: 'ecommerce.products',
    body: {
      query: query,
      _source: [
        'product_attribute',
        'product_description',
        'product_images',
        'product_name',
        'product_price',
        'product_quantity',
        'product_slug',
        'product_thumb',
        'product_type',
        'product_variations',
      ],
    },
  });

  const totalCount = body.hits.total.value;
  const hits = body.hits.hits;
  const products = hits.map((item) => item._source);
  return {
    totalCount,
    products,
  };
}

module.exports = {
  searchProducts,
};
