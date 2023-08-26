public with sharing class DM001_Panneau {
    public static List<Product2> getProducts() {
        return [SELECT Id, Name, Type__c, Adresse__c,DisplayUrl,Nb_des_fiches__c,current_ad_num__c	
                FROM Product2
                 ];
    }

    public static Decimal getProductPrice(Id productId) {
        PricebookEntry entry = [SELECT UnitPrice FROM PricebookEntry WHERE Product2Id = :productId LIMIT 1];
        return entry != null ? entry.UnitPrice : null;
    }
    
    @AuraEnabled(cacheable = true)
    public static List<OpportunityLineItem> getOppProdByProductId(Id productId ,Date dateDebut ,Date dateFin) {
        if (productId == null) {
            return new List<OpportunityLineItem>();
        }
        List<OpportunityLineItem> relatedOpportunityProducts = new List<OpportunityLineItem>();
        List<OpportunityLineItem> olis = new List<OpportunityLineItem>();                              

        // Find Opportunity Products related to the specific Product using SOQL
        Product2 products = [SELECT Id FROM Product2 WHERE Id = :productId LIMIT 1];
        if (products != null) {
            Id prodId = products.Id;
            
            relatedOpportunityProducts = [SELECT Id, Name, OpportunityId, Product2Id ,DateDeDebut__c ,DateDeFin__c ,Opportunity.Name
                                          FROM OpportunityLineItem
                                          WHERE Product2Id = :prodId 
                                          ORDER BY DateDeDebut__c DESC];
            for(OpportunityLineItem opp :relatedOpportunityProducts){
                if((opp.DateDeDebut__c > dateDebut && opp.DateDeDebut__c < dateFin) ||
                    (opp.DateDeFin__c > dateDebut && opp.DateDeFin__c < dateFin) || 
                    (opp.DateDeDebut__c < dateDebut && opp.DateDeFin__c > dateFin)
                     ){
                     olis.add(opp) ;}
            }
        }
        
        return olis;
    }
    @AuraEnabled(cacheable = true)
    public static List<OpportunityLineItem> getOppProdByProductIds(Id productId) {
        if (productId == null) {
            return new List<OpportunityLineItem>();
        }
        List<OpportunityLineItem> relatedOpportunityProducts = new List<OpportunityLineItem>();

        // Find Opportunity Products related to the specific Product using SOQL
        Product2 products = [SELECT Id FROM Product2 WHERE Id = :productId LIMIT 1];
        if (products != null) {
            Id prodId = products.Id;
            
            relatedOpportunityProducts = [SELECT Id, Name, OpportunityId, Product2Id ,DateDeDebut__c ,DateDeFin__c ,Opportunity.Name
                                          FROM OpportunityLineItem
                                          WHERE Product2Id = :prodId 
                                          ORDER BY DateDeDebut__c DESC];
         
        }
        
        return relatedOpportunityProducts;
    }

   
   

}
