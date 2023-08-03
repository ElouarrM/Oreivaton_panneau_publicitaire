public with sharing class SM001_Panneau {
    public static List<LC001_Panneau.ProductWrapper> getWrappedProducts() {
        List<Product2> productList = DM001_Panneau.getProducts();
        List<LC001_Panneau.ProductWrapper> productWrappers = new List<LC001_Panneau.ProductWrapper>();
        for (Product2 product : productList) {
            LC001_Panneau.ProductWrapper wrapper = new LC001_Panneau.ProductWrapper();
            wrapper.product = product;
            wrapper.price = DM001_Panneau.getProductPrice(product.Id);
            productWrappers.add(wrapper);
        }
        return productWrappers;
    }
}
