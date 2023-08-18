public with sharing class SM001_Panneau {
    public static List<ProductWrapper> getWrappedProducts() {
        List<Product2> productList = DM001_Panneau.getProducts();
        List<ProductWrapper> productWrappers = new List<ProductWrapper>();
        for (Product2 product : productList) {
           ProductWrapper wrapper = new ProductWrapper();
            wrapper.product = product;
            wrapper.price = DM001_Panneau.getProductPrice(product.Id);
            wrapper.opportunityProducts = DM001_Panneau.getOppProdByProductId(product.Id);
            productWrappers.add(wrapper);
        }
        return productWrappers;
    }

    public class ProductWrapper {
        @AuraEnabled
        public Product2 product { get; set; }
        @AuraEnabled
        public Decimal price { get; set; }
        @AuraEnabled
       public List<OpportunityLineItem> opportunityProducts { get; set; }
    }
    
}
