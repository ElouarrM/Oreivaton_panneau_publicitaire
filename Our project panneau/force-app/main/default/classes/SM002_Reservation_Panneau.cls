public with sharing class SM002_Reservation_Panneau {
  
    //Fetch startDate and finishDate in one object
    public class DateRange {
        @AuraEnabled
        public Date startDate { get; set; }
        @AuraEnabled
        public Date finishDate { get; set; }
    }
    
       @AuraEnabled(cacheable=true)
    public static List<OpportunityLineItem> getOPL(){

        List<OpportunityLineItem> opportunityProducts = DM002_Reservation_Panneau.getOpportunityLineItem();
            return opportunityProducts ;

    }

 
        @AuraEnabled(cacheable=true)
        public static List<DateRange> opportunityProductDateRange(){
        List<DateRange> dateRanges = new List<DateRange>();

        List<OpportunityLineItem> opportunityProducts = DM002_Reservation_Panneau.getOpportunityLineItem();

        for (OpportunityLineItem opportunityProduct : opportunityProducts) {
            DateRange range = new DateRange();
            range.startDate = opportunityProduct.DateDeDebut__c;
            range.finishDate = opportunityProduct.DateDeFin__c;
            dateRanges.add(range);
        }

        return dateRanges;
     }

    
    //  @AuraEnabled(cacheable=true)
    //  public static List<OpportunityLineItem>  getOppProdByProductIds(){
    //     List<OpportunityLineItem> opps =  DM001_Panneau.getOppProdByProductIds();


    //  }


    
}