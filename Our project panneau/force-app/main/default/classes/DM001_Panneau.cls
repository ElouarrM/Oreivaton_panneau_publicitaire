public with sharing class DM001_Panneau {
    public static List<Product2> getProducts() {
        return [SELECT Id, Name, Type__c, Adresse__c,DisplayUrl,Nb_des_fiches__c,current_ad_num__c	FROM Product2];
    }

    public static Decimal getProductPrice(Id productId) {
        PricebookEntry entry = [SELECT UnitPrice FROM PricebookEntry WHERE Product2Id = :productId LIMIT 1];
        return entry != null ? entry.UnitPrice : null;
    }
    
    @AuraEnabled(cacheable = true)
    public static List<OpportunityLineItem> getOppProdByProductId(Id productId) {
        if (productId == null) {
            return new List<OpportunityLineItem>();
        }
        List<OpportunityLineItem> relatedOpportunityProducts = new List<OpportunityLineItem>();
        
        // Find Opportunity Products related to the specific Product using SOQL
        List<Product2> products = [SELECT Id FROM Product2 WHERE Id = :productId LIMIT 1];
        if (!products.isEmpty()) {
            Id prodId = products[0].Id;
            
            relatedOpportunityProducts = [SELECT Id, Name, OpportunityId, Product2Id ,DateDeDebut__c ,DateDeFin__c
                                          FROM OpportunityLineItem
                                          WHERE Product2Id = :prodId
                                          ORDER BY DateDeDebut__c DESC];
        }
        
        return relatedOpportunityProducts;
    }

    // @AuraEnabled(cacheable = true)
    // public static List<ProductWrapper> getProductsAndOpportunityProducts() {
    //     List<ProductWrapper> productWrappers = new List<ProductWrapper>();
        
    //     List<Product2> products = [SELECT Id, Name FROM Product2];
        
    //     Map<Id, List<OpportunityLineItem>> productToOpportunityItemsMap = new Map<Id, List<OpportunityLineItem>>();
        
    //     for (OpportunityLineItem oli : [SELECT Id, Name, OpportunityId, Product2Id, DateDeDebut__c, DateDeFin__c
    //                                     FROM OpportunityLineItem
    //                                     ORDER BY DateDeDebut__c DESC]) {
    //         if (!productToOpportunityItemsMap.containsKey(oli.Product2Id)) {
    //             productToOpportunityItemsMap.put(oli.Product2Id, new List<OpportunityLineItem>());
    //         }
    //         productToOpportunityItemsMap.get(oli.Product2Id).add(oli);
    //     }
        
    //     for (Product2 product : products) {
    //         ProductWrapper wrapper = new ProductWrapper();
    //         wrapper.product = product;
    //         wrapper.opportunityProducts = productToOpportunityItemsMap.get(product.Id);
    //         productWrappers.add(wrapper);
    //     }
        
    //     return productWrappers;
    // }
    
    public class ProductWrapper {
        @AuraEnabled
        public Product2 product { get; set; }
        
        @AuraEnabled
        public List<OpportunityLineItem> opportunityProducts { get; set; }
    }

    

}
