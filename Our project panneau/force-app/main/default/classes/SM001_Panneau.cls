public with sharing class SM001_Panneau {
    public static List<ProductWrapper> getWrappedProducts(Date dateDebut , Date dateFin) {
        List<Product2> productList = DM001_Panneau.getProducts();
        List<ProductWrapper> productWrappers = new List<ProductWrapper>();
        for (Product2 product : productList) {
           ProductWrapper wrapper = new ProductWrapper();
            wrapper.product = product;
            wrapper.price = DM001_Panneau.getProductPrice(product.Id);
            if(dateDebut ==  null && dateFin == null){
                wrapper.opportunityProducts = DM001_Panneau.getOppProdByProductIds(product.Id);

            }else{wrapper.opportunityProducts = DM001_Panneau.getOppProdByProductId(product.Id,dateDebut,dateFin);
            }
            productWrappers.add(wrapper);
        }
        return productWrappers;
    }

    //la liste de tout les panneaux statiques
    public static List<ProductWrapper> getWrappedStaticProducts(Date dateDebut , Date dateFin) {
        List<Product2> productList = DM001_Panneau.getStaticProducts();
        List<ProductWrapper> productWrappers = new List<ProductWrapper>();
        for (Product2 product : productList) {
           ProductWrapper wrapper = new ProductWrapper();
            wrapper.product = product;
            wrapper.price = DM001_Panneau.getProductPrice(product.Id);
        
            if(dateDebut ==  null && dateFin == null){
                wrapper.opportunityProducts = DM001_Panneau.getOppProdByProductIds(product.Id);

            }else{wrapper.opportunityProducts = DM001_Panneau.getOppProdByProductId(product.Id,dateDebut,dateFin);
            }
            
            productWrappers.add(wrapper);
        }
        return productWrappers;
    }

     //la liste de tout les panneaux statiques
     public static List<ProductWrapper> getWrappedDynamicProducts() {
        List<Product2> productList = DM001_Panneau.getDynamicProducts();
        List<ProductWrapper> productWrappers = new List<ProductWrapper>();
        for (Product2 product : productList) {
           ProductWrapper wrapper = new ProductWrapper();
            wrapper.product = product;
            wrapper.price = DM001_Panneau.getProductPrice(product.Id);
        
            wrapper.opportunityProducts = DM001_Panneau.getOppProdByProductIds(product.Id);

            
            productWrappers.add(wrapper);
        }
        return productWrappers;
    }

    /* Bring all static signs childs of a dynamic one*/
    @AuraEnabled(cacheable=true)
    public static List<ProductWrapper> getWrappedStaticProductsById(Id parentId ,Date dateDebut , Date dateFin) {
        List<Product2> productList = DM001_Panneau.getStaticProductsById(parentId);
        
    
        //List<Product2> productList = DM001_Panneau.getOppProdByProductId()
        List<ProductWrapper> productWrappers = new List<ProductWrapper>();
        for (Product2 product : productList) {
           ProductWrapper wrapper = new ProductWrapper();
            wrapper.product = product;
            wrapper.price = DM001_Panneau.getProductPrice(product.Id);
            
            if(dateDebut ==  null && dateFin == null){
                wrapper.opportunityProducts = DM001_Panneau.getOppProdByProductIds(product.Id);

            }else{
                wrapper.opportunityProducts = DM001_Panneau.getOppProdByProductId(product.Id,dateDebut,dateFin);
            }
                       productWrappers.add(wrapper);
        }
        return productWrappers;
    }
    /*Le filtre*/
    @AuraEnabled
    public static List<ProductWrapper> getFilteredProducts(String adresse ,String type , Date sDate , Date fDate){
        List<ProductWrapper> productsFilteredAd = new List<ProductWrapper>();
        Set<ProductWrapper> productsFilteredDate = new Set<ProductWrapper>();
        Set<ProductWrapper> productsFiltered = new Set<ProductWrapper>();

        List<ProductWrapper> finalList = new List<ProductWrapper>();
        //la liste des panneaux statiques 
        List<ProductWrapper> products = getWrappedStaticProducts(null,null);
        List<ProductWrapper> byType = new List<ProductWrapper>();
        List<ProductWrapper> parents = getWrappedDynamicProducts() ;

        

        //liste des panneaux statiques
        
        if(adresse != null){
                    
                    for(ProductWrapper product : products){
                        if(adresse.toLowerCase() == product.product.Adresse__c.toLowerCase()){
                            productsFilteredAd.add(product);
                        }
                    }

                    
                      if(type != null) {     
                        /*Si le type est roulant on cherche les statiques avec un parent sinon on cherche
                        les statiques n'ayant pas un parent  */       
                        if(type == 'Roulant')
                        {
                            for(ProductWrapper product : productsFilteredAd){
                                if(product.product.Product__c != null){
                                    byType.add(product);
                                }
                            }
                        }else {
                            for(ProductWrapper product : productsFilteredAd){
                                if(product.product.Product__c == null){
                                    byType.add(product);
                                    System.debug('heloo'+byType);
                                }
                            }
                        }
                        /*On itere sur chaque reservation de chaque produit et on compare les dates */
                        if(sDate != null && fDate != null)
                        for(ProductWrapper product : byType){
                            if(product.opportunityProducts == null ){
                                productsFilteredDate.add(product);

                            }else{
                            for(Integer i=0 ; i<product.opportunityProducts.size();i++){
                                OpportunityLineItem opp = product.opportunityProducts[i];
                                // if( i < product.opportunityProducts.size()){
                                //     OpportunityLineItem opp1 = product.opportunityProducts[i+1];}
                                        //(opp.DateDeFin__c > sDate && opp1.DateDeDebut__c < fDate) 
                                if(
                                     
                                (opp.DateDeDebut__c < sDate && opp.DateDeFin__c < fDate) ||
        
                                (opp.DateDeDebut__c > sDate && opp.DateDeFin__c > fDate) ||
                                (opp.DateDeDebut__c > sDate && opp.DateDeFin__c <= fDate) ||
                                (opp.DateDeDebut__c < sDate && opp.DateDeFin__c < fDate) 
                                    )
                                {
                                    productsFilteredDate.add(product);
                                }
                            }
                        }
                            }
                        }
                        
                    }
               
                
    }
if(type == 'Roulant'){
    for(ProductWrapper product : parents){
        for(ProductWrapper pros : productsFilteredDate){
            if(pros.product.Product__c == product.product.Id){
                    productsFiltered.add(product);
            }
        }
    }
    for(ProductWrapper product : productsFiltered){
        finalList.add(product);
    }
    return finalList ;
    }else { 
    for(ProductWrapper product : productsFilteredDate){
        finalList.add(product);
    }
    return finalList ;}

    

    }

    public class ProductWrapper {
        @AuraEnabled
        public Product2 product { get; set; }
        @AuraEnabled
        public Decimal price { get; set; }
        @AuraEnabled
       public List<OpportunityLineItem> opportunityProducts { get; set; }
    }
    
}
