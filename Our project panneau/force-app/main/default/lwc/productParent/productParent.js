import { LightningElement, wire,api } from 'lwc';

import wiredProducts from '@salesforce/apex/LC001_Panneau.wiredProducts';
const PRODUCTS_PER_ROW = 4; 




export default class ProductParent extends LightningElement {
    @api products;
    groupedProducts;
    @api selectedproductid;
    selectedProduct;




    @wire(wiredProducts)
    wiredProducts ({ error, data }) {
            if (data) {
                this.products = data ? data : [];
                console.log(' #### data',data );
                this.groupedProducts = this.groupProducts(this.products, PRODUCTS_PER_ROW);
            } else if (error) {
                console.log(' #### error' );
                this.products = undefined;
                this.groupedProducts = undefined;

            }
        }
        groupProducts(products, groupSize) {
            const groupedArray = [];
            const numCols = Math.ceil(products.length / groupSize);
        
            for (let i = 0; i < groupSize; i++) {
                const row = [];
                for (let j = 0; j < numCols; j++) {
                    const index = i + j * groupSize;
                    if (index < products.length) {
                        row.push(products[index]);
                    }
                }
                groupedArray.push(row);
            }
        
            return groupedArray;
        }
  
    

        updateSelectedTile(event) {
            this.selectedproductid = event.detail.productId;
            this.selectedProduct = this.products.find((product) => product.product.Id === event.detail.productId);
        }

        handleFilter(event){
            console.log('event fired')
            this.products = this.savePro ;
            const searchCriteria = event.detail;
            const {address, type ,sDate , fDate} = searchCriteria;
            
            console.log('selected address',address);
            let filteredProducts = this.products;
            let filteredOppPro = this.listProduct ;
            console.log('products before filtering',filteredProducts)
            console.log('type of paneau',type)
            
            if (address){
                console.log(filteredProducts)
                filteredProducts = this.products.filter(
                    (product) => product.product.Adresse__c.toLowerCase() === address
                  );
                  console.log('apres filtrage par adresse',JSON.stringify(filteredProducts))
                  if (type) {
                    filteredProducts = filteredProducts.filter(
                      (product) => product.product.Type__c.toLowerCase() === type.toLowerCase()
                    );}
                    console.log('apres filtrage par type',JSON.stringify(filteredProducts))
                       
                    if(sDate && fDate ){
                        console.log("are you even seeing me ")
                        //on itere sur la liste des oppproduct correspondent aux dates entrées
                        for(let i=0 ;i<this.listProduct.length;i++){
                            // console.log('date de debut',this.listProduct[i].DateDeDebut__c)
                            // console.log('date de fin',this.listProduct[i].DateDeFin__c)
    
                             console.log(sDate == this.listProduct[i].DateDeDebut__c)
                             console.log(sDate == this.listProduct[i].DateDeFin__c)

                            //console.log(this.listProduct[i])
    
                            if(sDate == this.listProduct[i].DateDeDebut__c && fDate == this.listProduct[i].DateDeFin__c){
                                   console.log("gooos test")
                                    console.log(this.listProduct[i].Product2Id)
                                    
                                    for(let i=0 ;i<filteredProducts.length;i++){
                                        console.log("id du produit",JSON.stringify(filteredProducts[i].product.Id))
                                    }
                                    filteredProducts = filteredProducts.filter((product)=>{
                                        return product.product.Id != this.listProduct[i].Product2Id
                                    })

                                    console.log("liste apres filtrage par date",JSON.stringify(filteredProducts))   
                                                             
                            }
                          
                            
                        }
                      
                    }
    
                } 
              
             
            
                
            
            this.products = filteredProducts;
            this.groupedProducts = this.groupProducts(this.products, PRODUCTS_PER_ROW);

            console.log('heloo',JSON.stringify(this.groupedProducts))
        }
}

