public with sharing class Panneau_SM {
    public static List<SM001_Panneau.ProductWrapper> getWrappedProducts() {
        List<Product2> productList = Panneau_DM.getProducts();
        List<SM001_Panneau.ProductWrapper> productWrappers = new List<SM001_Panneau.ProductWrapper>();
        for (Product2 product : productList) {
            SM001_Panneau.ProductWrapper wrapper = new SM001_Panneau.ProductWrapper();
            wrapper.product = product;
            wrapper.price = Panneau_DM.getProductPrice(product.Id);
            productWrappers.add(wrapper);
        }
        return productWrappers;
    }
}
