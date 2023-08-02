public with sharing class Panneau_SM {
    public static List<Panneau_LC.ProductWrapper> getWrappedProducts() {
        List<Product2> productList = Panneau_DM.getProducts();
        List<Panneau_LC.ProductWrapper> productWrappers = new List<Panneau_LC.ProductWrapper>();
        for (Product2 product : productList) {
            Panneau_LC.ProductWrapper wrapper = new Panneau_LC.ProductWrapper();
            wrapper.product = product;
            wrapper.price = Panneau_DM.getProductPrice(product.Id);
            productWrappers.add(wrapper);
        }
        return productWrappers;
    }
}
