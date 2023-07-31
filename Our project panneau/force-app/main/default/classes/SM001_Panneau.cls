public with sharing class SM001_Panneau {
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
