public class SM001_Panneau {
    @AuraEnabled(cacheable = true)
    public static List<ProductWrapper> wiredProducts() {
        List<Product2> productList = [SELECT Id, Name, Type__c, DisplayUrl FROM Product2];
        List<ProductWrapper> productWrappers = new List<ProductWrapper>();
        for (Product2 product : productList) {
            ProductWrapper wrapper = new ProductWrapper();
            wrapper.product = product;
            wrapper.price = getProductPrice(product.Id); // Appel de la méthode pour récupérer le prix
            productWrappers.add(wrapper);
        }
        return productWrappers;
    }

    // Méthode pour récupérer le prix du produit à partir de l'objet PricebookEntry
    private static Decimal getProductPrice(Id productId) {
        PricebookEntry entry = [SELECT UnitPrice FROM PricebookEntry WHERE Product2Id = :productId LIMIT 1];
        return entry != null ? entry.UnitPrice : null;
    }

    public class ProductWrapper {
        @AuraEnabled
        public Product2 product { get; set; }
        @AuraEnabled
        public Decimal price { get; set; }
    }
}
