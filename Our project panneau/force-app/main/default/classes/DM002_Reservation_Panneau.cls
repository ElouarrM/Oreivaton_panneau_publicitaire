public with sharing class DM002_Reservation_Panneau {

    public static List<OpportunityLineItem> getOpportunityLineItem(){
    List<OpportunityLineItem> opportunityLineItems = [
        SELECT DateDeDebut__c, DateDeFin__c
        FROM OpportunityLineItem
    ];
    return opportunityLineItems;
    
}}

