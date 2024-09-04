const express = require('express');
const authRoute = require('./auth.route');
const userRoute = require('./user.route');
const docsRoute = require('./docs.route');
const config = require('../../config/config');
const manufactureRoute = require('./manufacture.route');
const invitationsRoute = require('./invitation.route');
const wholesalerRoute = require('./wholesaler.route');
const clothingMensRoute = require('./clothing.mens.route');
const materialRoute = require('./material.route');
const patternRoute = require('./pattern.route');

const fitTypeRoute = require('./fit.type.route');
const sleeveCutStyleRoute = require('./sleev.cut.style.route');
const pocketDiscriptionRoute = require('./pocket.discription.route');
const sleeveLengthRoute = require('./sleeve.length.route');
const careInstructionRoute = require('./care.instruction.route');
const specialFeatureRoute = require('./special.feature.route');
const occasionRoute = require('./occasion.route');
const menStandardSizeRoute = require('./men.standard.size.route');
const socksSizeRoute = require('./socks.size.route');
const socksStyleRoute = require('./socks.style.route');
const seasonRoute = require('./season.route');
const lengthWomenDressRoute = require('./length.women.dress.route');
const womenDressStyleRoute = require('./women.dress.style.route');
const elasticRoute = require('./elastic.route');
const includeComponentRoute = require('./include.component.route');
const collarStyleRoute = require('./collar.style.route');
const neckStyleRoute = require('./neck.style.route');
const closureTypeRoute = require('./closure.type.route');
const lifestyleRoute = require('./lifestyle.route');
const productRoute = require('./product.route');
const brandRoute = require('./brand.route');
const subCategoryRoute = require('./sub.category.route');
const retailersRoute = require('./retailer.route');
const discountCategoryRoute = require('./wholesaler.category.route');
const retailerCategoryRoute = require('./retailer.category.route');
const currencyRoute = require('./currency.route');
const wishlistRoute = require('./wishlist.route');
const cartRoute = require('./cart.route');
const requestRoute = require('./request.route');
const dockRoute = require('./doc.route');
const mappingRoute = require('./mapping.route');
const productTypeRoute = require('./product.type.route');
const womenSleeveTypeRoute = require('./women.sleeve.type.route');
const topstyleRoute = require('./top.style.route');
const embellishmentFeatureRoute = require('./embellishment.feature.route');
const noOfPocketsRoute = require('./no.of.pockets.route');
const coinPocketRoute = require('./coin.pocket.route');
const waistSizeSetRoute = require('./waist.size.set.route');
const trouserFitTypeRoute = require('./trouser.fit.type.route');
const riseStyleRoute = require('./rise.style.route');
const trouserStyleRoute = require('./trouser.style.route');
const trouserPocketRoute = require('./trouser.pocket.route');
const shirtSizeSetRoute = require('./shirt.size.set.route');
const productOrderRoute = require('./product.order.route');
const dileveryOrderRoute = require('./dilevery.order.route');
const courierRoute = require('./courier.route');

const router = express.Router();

const defaultRoutes = [
  {
    path: '/auth',
    route: authRoute,
  },
  {
    path: '/users',
    route: userRoute,
  },
  {
    path: '/manufacturers',
    route: manufactureRoute,
  },
  {
    path: '/invitations',
    route: invitationsRoute,
  },
  {
    path: '/wholesaler',
    route: wholesalerRoute,
  },
  {
    path: '/clothing-mens',
    route: clothingMensRoute,
  },
  {
    path: '/material',
    route: materialRoute,
  },
  {
    path: '/pattern',
    route: patternRoute,
  },
  {
    path: '/fit-type',
    route: fitTypeRoute,
  },
  {
    path: '/sleev-cut-style',
    route: sleeveCutStyleRoute,
  },
  {
    path: '/pocket-discription',
    route: pocketDiscriptionRoute,
  },
  {
    path: '/sleeve-length',
    route: sleeveLengthRoute,
  },
  {
    path: '/care-instruction',
    route: careInstructionRoute,
  },
  {
    path: '/special-feature',
    route: specialFeatureRoute,
  },
  {
    path: '/occasion',
    route: occasionRoute,
  },
  {
    path: '/men-standard-size',
    route: menStandardSizeRoute,
  },
  {
    path: '/socks-size',
    route: socksSizeRoute,
  },
  {
    path: '/socks-style',
    route: socksStyleRoute,
  },
  {
    path: '/products',
    route: productRoute,
  },
  {
    path: '/season',
    route: seasonRoute,
  },
  {
    path: '/currency',
    route: currencyRoute,
  },
  {
    path: '/producttype',
    route: productTypeRoute,
  },

  {
    path: '/length-women-dress',
    route: lengthWomenDressRoute,
  },
  {
    path: '/women-dress-style',
    route: womenDressStyleRoute,
  },
  {
    path: '/elastic',
    route: elasticRoute,
  },
  {
    path: '/include-componenet',
    route: includeComponentRoute,
  },
  {
    path: '/collar-style',
    route: collarStyleRoute,
  },
  {
    path: '/neck-style',
    route: neckStyleRoute,
  },
  {
    path: '/closure-type',
    route: closureTypeRoute,
  },
  {
    path: '/lifestyle',
    route: lifestyleRoute,
  },
  {
    path: '/brand',
    route: brandRoute,
  },
  {
    path: '/sub-category',
    route: subCategoryRoute,
  },
  {
    path: '/retailer',
    route: retailersRoute,
  },
  {
    path: '/wholesaler-category',
    route: discountCategoryRoute,
  },
  {
    path: '/retailer-category',
    route: retailerCategoryRoute,
  },
  {
    path: '/wishlist',
    route: wishlistRoute,
  },
  {
    path: '/cart',
    route: cartRoute,
  },
  {
    path: '/request',
    route: requestRoute,
  },
  {
    path: '/doc',
    route: dockRoute,
  },
  {
    path: '/womensleevetype',
    route: womenSleeveTypeRoute,
  },
  {
    path: '/topstyle',
    route: topstyleRoute,
  },
  {
    path: '/embellishmentfeature',
    route: embellishmentFeatureRoute,
  },
  {
    path: '/noofpockets',
    route: noOfPocketsRoute,
  },
  {
    path: '/coinpocket',
    route: coinPocketRoute,
  },
  {
    path: '/waistsizeset',
    route: waistSizeSetRoute,
  },
  {
    path: '/trouserfittype',
    route: trouserFitTypeRoute,
  },
  {
    path: '/risestyle',
    route: riseStyleRoute,
  },
  {
    path: '/trouserstyle',
    route: trouserStyleRoute,
  },
  {
    path: '/trouserpocket',
    route: trouserPocketRoute,
  },
  {
    path: '/shirt-size-set',
    route: shirtSizeSetRoute,
  },
  {
    path: '/mapping',
    route: mappingRoute,
  },
  {
    path: '/product-order',
    route: productOrderRoute,
  },
  {
    path: '/dilevery-order',
    route: dileveryOrderRoute,
  },
  {
    path: '/courier',
    route: courierRoute,
  }
];

const devRoutes = [
  // routes available only in development mode
  {
    path: '/docs',
    route: docsRoute,
  },
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

/* istanbul ignore next */
if (config.env === 'development') {
  devRoutes.forEach((route) => {
    router.use(route.path, route.route);
  });
}

module.exports = router;
