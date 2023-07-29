public with sharing class SM001_Panneau {
    public SM001_Panneau() {

    }
    @AuraEnabled(cacheable = true)
    public static List<Product2> wiredProducts(){
        List<Product2> Mylist = new List<Product2>();
        Mylist=[Select Id,Name,
                      Type__c,DisplayUrl 
                      from Product2];
                    
        return Mylist;
    }  
}
