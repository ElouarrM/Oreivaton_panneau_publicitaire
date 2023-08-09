public with sharing class LC001_Panneau {
    @AuraEnabled(cacheable = true)
    public static List<ProductWrapper> wiredProducts() {
        return SM001_Panneau.getWrappedProducts();
    }

    public class ProductWrapper {
        @AuraEnabled
        public Product2 product { get; set; }
        @AuraEnabled
        public Decimal price { get; set; }
    }
/*
    @AuraEnabled(cacheable=true)
    public static List<String> getProductAddresses() {
        return SM001_Panneau.getProductAddresse();
    }*/
}
