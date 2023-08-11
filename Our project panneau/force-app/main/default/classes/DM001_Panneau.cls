public with sharing class DM001_Panneau {
    public static List<Product2> getProducts() {
        return [SELECT Id, Name, Type__c, Adresse__c,DisplayUrl,Nb_des_fiches__c,current_ad_num__c	FROM Product2];
    }

    public static Decimal getProductPrice(Id productId) {
        PricebookEntry entry = [SELECT UnitPrice FROM PricebookEntry WHERE Product2Id = :productId LIMIT 1];
        return entry != null ? entry.UnitPrice : null;
    }
   

}
