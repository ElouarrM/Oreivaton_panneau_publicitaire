public with sharing class Panneau_LC {
    @AuraEnabled(cacheable = true)
    public static List<ProductWrapper> wiredProducts() {
        return Panneau_SM.getWrappedProducts();
    }

    public class ProductWrapper {
        @AuraEnabled
        public Product2 product { get; set; }
        @AuraEnabled
        public Decimal price { get; set; }
    }
}
