import { LightningElement, wire,api } from 'lwc';
import opportunityProductDateRanges from '@salesforce/apex/LC002_Reservation_Panneau.opportunityProductDateRanges'
import opportunityProduct from '@salesforce/apex/LC002_Reservation_Panneau.opportunityProduct'
import wiredProducts from '@salesforce/apex/LC001_Panneau.wiredProducts';
const PRODUCTS_PER_ROW = 4; 




export default class ProductParent extends LightningElement {
    @api products;
    groupedProducts;
    @api selectedproductid;
    selectedProduct;


savePro;

    @wire(wiredProducts)
    wiredProducts ({ error, data }) {
            if (data) {
                this.products = data ? data : [];
                console.log(' #### data',data );
                this.savePro = this.products ;

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

        @wire(opportunityProductDateRanges)
        opportunityProductDateRanges({ error, data }) {
            if (data) {
                console.log(data)
                this.dateRanges = data;
            } else if (error) {
            }
 
        }
        //list of products that have oppProduct
        listProduct ;
          @wire(opportunityProduct)
          opportunityProduct({ error, data }) {
              if (data) {
                  console.log(data)
                  this.listProduct = data;
                  console.log('oppPro',data)
              } else if (error) {
              }
            }

        handleFilter(event){
            console.log('event fired')
            console.log( this.savePro)
            this.products = this.savePro ;
            const searchCriteria = event.detail;
            const {address, type ,sDate , fDate} = searchCriteria;
            console.log('address',address)
            console.log('type',type)
            console.log(this.products)
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
                    );
                    console.log('apres filtrage par type',JSON.stringify(filteredProducts))
                  }
                    if(sDate && fDate ){
                        console.log("are you even seeing me ")
                        //on itere sur la liste des oppproduct correspondent aux dates entrées
                        for(let i=0 ;i<this.listProduct.length;i++){
                           
    
                            //  console.log(sDate == this.listProduct[i].DateDeDebut__c)
                            //  console.log(sDate == this.listProduct[i].DateDeFin__c)

                            //console.log(this.listProduct[i])
    
                            if(sDate == this.listProduct[i].DateDeDebut__c && fDate == this.listProduct[i].DateDeFin__c){
                                   console.log("gooos test",sDate == this.listProduct[i].DateDeDebut__c && fDate == this.listProduct[i].DateDeFin__c)
                                    console.log(this.listProduct[i].Product2Id)
                               if (type == 'Roulant'){
                                console.log(type == 'Roulant')
                                    //keep only elements with
                                    filteredProducts = filteredProducts.filter((product)=>{
                                        return product.product.Nb_des_fiches__c > product.product.current_ad_num__c ; 

                                    })
                                
                               }
                               for(let i=0;i<filteredProducts.length;i++){
                                console.log("Id du produit",filteredProducts[i].product.Id)
                                console.log('id frm opp product',this.listProduct[i].Product2Id)
                               }
                                //we keep the signs with dates different than the entered one
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

