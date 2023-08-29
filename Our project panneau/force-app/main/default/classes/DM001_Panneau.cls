public with sharing class DM001_Panneau {
    public static List<Product2> getProducts() {
        List<Product2> StaticProducts = [SELECT Id, Name, Type__c, Adresse__c,DisplayUrl,Product__c,Index__c
                                        FROM Product2
                                        WHERE Type__c = 'Statique' 
                                        ORDER BY Index__c ASC
                                        ];
        //liste des ids des pan roulants 
        List<Product2> panneauRoulant = [SELECT Id , Name, Type__c, Adresse__c,DisplayUrl,Nb_des_fiches__c,current_ad_num__c 
                                        FROM Product2 
                                        WHERE Type__c = 'Roulant'];
        
        List<Product2> withParent = new List<Product2>() ;
        List<Product2> withoutParent = new List<Product2>();
        List<Product2>  parents = new List<Product2>();
        Set<Product2> finalList = new Set<Product2>();
        List<Product2> finalProducts = new List<Product2>();
        
        /*On separe les panneaux statiques en ceux ayant un parent
        et les autres n'ayant pas un parent */
        for(Product2 product : StaticProducts ){
                    if(product.Product__c != null){
                            withParent.add(product);
                    }else{
                         withoutParent.add(product);
                    }
            }
            /*On itere sur la liste des parents et on cherche les childs apres on ajoute le parent
            dans le Set si les id sont egaux (pas de duplicats) */
            for(Product2 pro : panneauRoulant){
                for(Product2 product : withParent){
                    if(pro.Id == product.Product__c){
                    finalList.add(pro);
                }
            }
            }   

            for(Product2 product : withoutParent){
                finalList.add(product);
            }
            finalProducts.addAll(finalList);
        return finalProducts ;
    }
    /* Bring all statics signs */
    public static List<Product2> getStaticProducts(){
        List<Product2> StaticProducts = [SELECT Id, Name, Type__c, Adresse__c,DisplayUrl,Nb_des_fiches__c,current_ad_num__c,Product__c
        FROM Product2
        WHERE Type__c = 'Statique' 
        ];
        return StaticProducts;
    }

     /* Bring all statics signs */
     public static List<Product2> getDynamicProducts(){
        List<Product2> DynamicProducts = [SELECT Id, Name, Type__c, Adresse__c,DisplayUrl,Nb_des_fiches__c,current_ad_num__c,Product__c
        FROM Product2
        WHERE Type__c = 'Roulant' 
        ];
        return DynamicProducts;
    }

     /* Bring  statics signs of a specific parent sign */
     public static List<Product2> getStaticProductsById(Id parentId){
     
        List<Product2> StaticProducts = [SELECT Id, Name, Type__c, Adresse__c,DisplayUrl,Product__c,Index__c
        FROM Product2
        WHERE Product__c = :parentId AND Type__c = 'Statique' 
        ];
       
        return StaticProducts;
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
                if((opp.DateDeDebut__c >= dateDebut && opp.DateDeDebut__c <= dateFin) ||
                    (opp.DateDeFin__c >= dateDebut && opp.DateDeFin__c <= dateFin) || 
                    (opp.DateDeDebut__c <= dateDebut && opp.DateDeFin__c >= dateFin)
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
