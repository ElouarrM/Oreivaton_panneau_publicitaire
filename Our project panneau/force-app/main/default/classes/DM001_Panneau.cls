public with sharing class DM001_Panneau {
    public static List<Product2> getProducts() {
        return [SELECT Id, Name, Type__c, DisplayUrl FROM Product2];
    }

    public static Decimal getProductPrice(Id productId) {
        PricebookEntry entry = [SELECT UnitPrice FROM PricebookEntry WHERE Product2Id = :productId LIMIT 1];
        return entry != null ? entry.UnitPrice : null;
    }
}
