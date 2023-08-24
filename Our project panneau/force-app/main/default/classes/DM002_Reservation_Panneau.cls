public with sharing class DM002_Reservation_Panneau {

    public static List<OpportunityLineItem> getOpportunityLineItem(){
    List<OpportunityLineItem> opportunityLineItems = [
        SELECT DateDeDebut__c, DateDeFin__c,Product2.Type__c ,Product2.Adresse__c 
        FROM OpportunityLineItem
    
    ];
    return opportunityLineItems;
    
 }
         //PricebookEntry p1 = [SELECT Id, UnitPrice FROM PricebookEntry WHERE Id =: opp.PricebookEntryId LIMIT 1];
         private static PricebookEntry getPricebookEntry(Id productId) {
            PricebookEntry pbe = [SELECT id from PricebookEntry WHERE Product2Id = :productId LIMIT 1];
            return pbe ;
         }
    
 @AuraEnabled
 public static void createOpportunityProduct(List<OpportunityLineItem> oppProducts) {
    List<OpportunityLineItem> opps = new List<OpportunityLineItem>();
    for (OpportunityLineItem opp : oppProducts){
        OpportunityLineItem oli = new OpportunityLineItem();
       
        oli.OpportunityId = opp.OpportunityId;
        oli.Quantity = opp.Quantity;
        //System.debug(opp.DateDeDebut__c);
        oli.DateDeDebut__c = opp.DateDeDebut__c; 
        oli.DateDeFin__c = opp.DateDeFin__c;
        oli.Product2Id = opp.Product2Id ;
        //oli.PriceBookEntryId pbe = getPricebookEntry(oli.Product2Id).Id;
    
        oli.UnitPrice = opp.UnitPrice;
        //System.debug(oli.ListPrice);
        //oli.TotalPrice = oli.UnitPrice * oli.Quantity;
        opps.add(oli);
       
    }
    System.debug('##'+opps);
    insert opps;
    /*try{
        System.debug('##'+opps);
        insert opps;
    }catch(Exception e){
        throw new AuraHandledException(e.getMessage());
    }*/
}


}

