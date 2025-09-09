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
const issueProductsRoute = require('./issue.product.route');
const wholesalerProductsRoute = require('./wholesaler.products.route');
const returnOrderRoute = require('./return.order.route');
const blazerClouserTypeRoute = require('./blazer.clouser.type.route');
const waistTypeRoute = require('./waist.type.route');
const weaveTypeRoute = require('./weave.type.route');
const ethnicdesignRoute = require('./ethnic.design.route');
const sareeStyleRoute = require('./saree.style.route');
const womenStyleRoute = require('./women.style.route');
const womenKurtaLengthRoute = require('./women.kurta.length.route');
const workTypeRoute = require('./work.type.route');
const finishTypeRoute = require('./finish.type.route');
const apparelSilhouetteRoute = require('./apparel.silhouette.route');
const ethnicBottomsStyleRoute = require('./ethnic.bottoms.style.route');
const backStyleRoute = require('./back.style.route');
const braSizeRoute = require('./bra.size.route');
const braStyleRoute = require('./bra.style.route');
const braPadTypeRoute = require('./bra.pad.type.route');
const braClosureRoute = require('./bra.closure.route');
const cupSizeRoute = require('./cup.size.route');
const opacityRoute = require('./opacity.route');
const entitytypeRoute = require('./entity.type.route');
const sizeSetRoute = require('./size.set.route');
const layerCompressionRoute = require('./layer.compression.route');
const waistBandRoute = require('./waistband.route');
const subscriptionRoute = require('./subsription.route');
const subscriptionPlanRoute = require('./subscription.plan.route');
const genderRoute = require('./gender.route');
const countryCodeRoute = require('./country.code.route');
const newCountryRoute = require('./new.country.route');
const stateroute = require('./state.route');
const cityroute = require('./city.route');
const type2Produnct = require('./type2.routes/product.route');
const type2CartRoute = require('./type2.routes/cart.route');
const type2PurchaseOrderRoute = require('./type2.routes/purchase.order.route');
const type2WishListRoute = require('./type2.routes/wishlist.route');
const type2WholesalerPriceRoute = require('./type2.routes/wholesaler.price.route');
const retailertype2CartRoute = require('./type2.routes/retailer.cart.route');
const retailePurchaseOrdertype2Route = require('./type2.routes/purchase.order.retailer.route');
const mnfDeliveryChallanRoute = require('./type2.routes/mnf.delivery.challan.route');
const wholesalerReturnRoute = require('./type2.routes/wholesaler.return.route');
const finalProductWRoute = require('./type2.routes/final.product.w.route');
const whDeliveryChallanRoute = require('./type2.routes/wh.delivery.challan.route');
const cdnPathRoute = require('./cdn.path.routes');
const rtlToMnfCartRoute = require('./type2.routes/rtlToMnf.cart.route');
const rtlToMnfPORoute = require('./type2.routes/rtlToMnf.po.route');
const rtlOrderPRequestRoute = require('./type2.routes/retailer.orderP.request.route');
const performInvoiceRoute = require('./type2.routes/perform.invoice.route');
// new flow apis
const PORetailerToWholesalerRoute = require('./type2.routes/po.retailer.to.wholesaler.route');
const PORetailerToManufactureRoute = require('./type2.routes/po.retailer.to.manufacture.route');
const POWholesalerToManufactureRoute = require('./type2.routes/po.wholesaler.to.manufacture.route');
// performa invoice
const M2RPerformaInvoiceRoute = require('./type2.routes/pi.manufacture.to.retailer.route');
const M2WPerformaInvoiceRoute = require('./type2.routes/pi.manufacture.to.wholesaler.route');
// inventory
const ManufactureInventoryRoute = require('./type2.routes/inventory.manufacture.route');
const WholesalerInventoryRoute = require('./type2.routes/inventory.wholesaler.route');
const RetailerInventoryRoute = require('./type2.routes/inventory.retailer.route');
const ManufactureInventoryLogsRoute = require('./type2.routes/manufacture.inventory.logs.route');
// hsn gst route
const HsnGstRoute = require('./type2.routes/hsn.gst.data.route');
const ReturnReasonRoute = require('./type2.routes/return.reason.master.route');
// credit note
const mToRCreditNoteRoute = require('./type2.routes/credit.note.manufacture.to.retailer.route');

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
  },
  {
    path: '/issue-products',
    route: issueProductsRoute,
  },
  {
    path: '/wholesaler-products',
    route: wholesalerProductsRoute,
  },
  {
    path: '/return-order',
    route: returnOrderRoute,
  },
  {
    path: '/blazerclousertype',
    route: blazerClouserTypeRoute,
  },
  {
    path: '/waisttype',
    route: waistTypeRoute,
  },
  {
    path: '/weavetype',
    route: weaveTypeRoute,
  },
  {
    path: '/ethnicdesign',
    route: ethnicdesignRoute,
  },
  {
    path: '/sareestyle',
    route: sareeStyleRoute,
  },
  {
    path: '/womenstyle',
    route: womenStyleRoute,
  },
  {
    path: '/women-kurta-length',
    route: womenKurtaLengthRoute,
  },
  {
    path: '/worktype',
    route: workTypeRoute,
  },

  {
    path: '/finishtype',
    route: finishTypeRoute,
  },
  {
    path: '/apparelsilhouette',
    route: apparelSilhouetteRoute,
  },
  {
    path: '/ethnic-bottoms-style',
    route: ethnicBottomsStyleRoute,
  },
  {
    path: '/backstyle',
    route: backStyleRoute,
  },
  {
    path: '/brasize',
    route: braSizeRoute,
  },
  {
    path: '/brastyle',
    route: braStyleRoute,
  },
  {
    path: '/brapadtype',
    route: braPadTypeRoute,
  },
  {
    path: '/braclosure',
    route: braClosureRoute,
  },
  {
    path: '/cupsize',
    route: cupSizeRoute,
  },
  {
    path: '/opacity',
    route: opacityRoute,
  },
  {
    path: '/entitytype',
    route: entitytypeRoute,
  },
  {
    path: '/size-set',
    route: sizeSetRoute,
  },
  {
    path: '/layer-compression',
    route: layerCompressionRoute,
  },
  {
    path: '/waistband',
    route: waistBandRoute,
  },
  {
    path: '/subscription',
    route: subscriptionRoute,
  },
  {
    path: '/subscription-plan',
    route: subscriptionPlanRoute,
  },

  // routes for type2 products
  {
    path: '/type2-products',
    route: type2Produnct,
  },
  {
    path: '/type2-cart',
    route: type2CartRoute,
  },
  {
    path: '/type2-purchaseorder',
    route: type2PurchaseOrderRoute,
  },
  {
    path: '/gender',
    route: genderRoute,
  },
  {
    path: '/type2-wishlist',
    route: type2WishListRoute,
  },
  {
    path: '/wholesaler-price-type2',
    route: type2WholesalerPriceRoute,
  },
  {
    path: '/retailer-cart-type2',
    route: retailertype2CartRoute,
  },
  {
    path: '/retailer-purchase-order-type2',
    route: retailePurchaseOrdertype2Route,
  },
  {
    path: '/mnf-delivery-challan',
    route: mnfDeliveryChallanRoute,
  },
  {
    path: '/wholesaler-return',
    route: wholesalerReturnRoute,
  },
  {
    path: '/final-product',
    route: finalProductWRoute,
  },
  {
    path: '/wh-delivery-challan',
    route: whDeliveryChallanRoute,
  },
  {
    path: '/countrycode',
    route: countryCodeRoute,
  },
  {
    path: '/newcountry',
    route: newCountryRoute,
  },
  {
    path: '/state',
    route: stateroute,
  },
  {
    path: '/city',
    route: cityroute,
  },
  {
    path: '/cdn-path',
    route: cdnPathRoute,
  },
  {
    path: '/rtl-toMnf-cart',
    route: rtlToMnfCartRoute,
  },
  {
    path: '/rtl-toMnf-po',
    route: rtlToMnfPORoute,
  },
  {
    path: '/rtl-orderP-request',
    route: rtlOrderPRequestRoute,
  },
  {
    path: '/perform-invoice',
    route: performInvoiceRoute,
  },
  // new flow apis for order flow
  {
    path: '/po-retailer-to-wholesaler',
    route: PORetailerToWholesalerRoute,
  },
  {
    path: '/po-retailer-to-manufacture',
    route: PORetailerToManufactureRoute,
  },
  {
    path: '/po-wholesaler-to-manufacture',
    route: POWholesalerToManufactureRoute,
  },
  // performa invoice
  {
    path: '/pi-manufacture-to-retailer',
    route: M2RPerformaInvoiceRoute,
  },
  {
    path: '/pi-manufacture-to-wholesaler',
    route: M2WPerformaInvoiceRoute,
  },
  // inventory
  {
    path: '/manufacture-inventory',
    route: ManufactureInventoryRoute,
  },
  {
    path: '/wholesaler-inventory',
    route: WholesalerInventoryRoute,
  },
  {
    path: '/retailer-inventory',
    route: RetailerInventoryRoute,
  }, // inventory
  {
    path: '/manufacture-inventory-logs',
    route: ManufactureInventoryLogsRoute,
  },
  {
    path: '/hsn-gst',
    route: HsnGstRoute,
  },
  {
    path: '/return-reason',
    route: ReturnReasonRoute,
  },
  // credit note
  {
    path: '/m-r-credit-note',
    route: mToRCreditNoteRoute,
  },
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
