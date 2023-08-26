public with sharing class LC001_Panneau {
    @AuraEnabled(cacheable = true)
    public static List<SM001_Panneau.ProductWrapper> wiredProducts(Date dateDebut , Date dateFin) {
        return SM001_Panneau.getWrappedProducts(dateDebut,dateFin);
    }

   
 
}
