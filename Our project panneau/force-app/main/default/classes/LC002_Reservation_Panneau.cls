public with sharing class LC002_Reservation_Panneau {
    @AuraEnabled(cacheable=true)
    public static List<SM002_Reservation_Panneau.DateRange> opportunityProductDateRanges() {

        return  SM002_Reservation_Panneau.opportunityProductDateRange();
    }

    @AuraEnabled(cacheable=true)
    public static List<OpportunityLineItem> opportunityProduct() {

        return  SM002_Reservation_Panneau.getOPL();
    }

}