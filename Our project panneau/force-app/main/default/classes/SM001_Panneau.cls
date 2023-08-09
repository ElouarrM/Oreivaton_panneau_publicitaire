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
/*
    @AuraEnabled(cacheable=true)
    public static List<String> getProductAddresse() {
        List<Product2> products = DM001_Panneau.getProducts();
        List<String> addresses = new List<String>();
        for (Product2 product : products) {
            addresses.add(product.Adresse__c);
        }
        return addresses;
    }
*/


}
