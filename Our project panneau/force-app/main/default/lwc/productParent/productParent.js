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
    oppProduct = [] ;
    listOpp ;
    @api recordId ;
    @api dateDebut ;
    @api dateFin ;


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
        @api formatedPrice ;
        updateSelectedTile(event) {
          
            this.selectedproductid = event.detail.productId;
            this.selectedProduct = this.products.find((product) => product.product.Id === event.detail.productId);
            this.formatedPrice = `${this.selectedProduct.price} MAD`;
           
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
            console.log(this.products)
            let filteredProducts = this.products;
            this.dateDebut = new Date(sDate) ;
            this.dateFin = new Date(fDate) ;
            
            if (address){
                console.log(filteredProducts)
                filteredProducts = this.products.filter(
                    (product) => product.product.Adresse__c.toLowerCase() === address
                  );
                    if (type) {
                        if (type == 'Roulant'){
                                            //keep only elements with available ads
                                            filteredProducts = filteredProducts.filter((product)=>{
                                                return product.product.Nb_des_fiches__c > product.product.current_ad_num__c ; 
        
                                            })
                                        
                                       }
                    filteredProducts = filteredProducts.filter(
                      (product) => product.product.Type__c.toLowerCase() === type.toLowerCase()
                    );

                    }
                    //console.log('avant filtrage ',JSON.stringify(this.listOpp))
                    if(sDate && fDate ){
                        console.log(sDate)
                        console.log(fDate)
                  

                    filteredProducts = filteredProducts.filter((product) => {
                        const noOverlappingOccurrences = product.opportunityProducts.every((opportunityProduct, i) => {
                            if (i < product.opportunityProducts.length - 1) {
                                const opportunityProduct1 = product.opportunityProducts[i + 1];
                    
                                return !(
                                    (sDate == opportunityProduct.DateDeDebut__c && fDate == opportunityProduct.DateDeFin__c) ||
                                    (sDate > opportunityProduct.DateDeDebut__c && fDate < opportunityProduct.DateDeFin__c) ||
                                    (sDate < opportunityProduct.DateDeDebut__c && fDate > opportunityProduct.DateDeFin__c) ||
                                    (sDate >= opportunityProduct.DateDeDebut__c && fDate <= opportunityProduct1.DateDeFin__c)
                                );
                            }
                    
                            return true; // Always return true for the last opportunityProduct
                        });
                    
                        return noOverlappingOccurrences;
                    });
                    
                    
                        
                    }
            
                
            this.products = filteredProducts;
            this.groupedProducts = this.groupProducts(this.products, PRODUCTS_PER_ROW);



      
            
        }}

    
}

