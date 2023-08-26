public with sharing class SM001_Panneau {
    public static List<ProductWrapper> getWrappedProducts(Date dateDebut , Date dateFin) {
        List<Product2> productList = DM001_Panneau.getProducts();
        List<ProductWrapper> productWrappers = new List<ProductWrapper>();
        for (Product2 product : productList) {
           ProductWrapper wrapper = new ProductWrapper();
            wrapper.product = product;
            wrapper.price = DM001_Panneau.getProductPrice(product.Id);
            if(dateDebut ==  null && dateFin == null){
                wrapper.opportunityProducts = DM001_Panneau.getOppProdByProductIds(product.Id);

            }else{wrapper.opportunityProducts = DM001_Panneau.getOppProdByProductId(product.Id,dateDebut,dateFin);
            }
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
