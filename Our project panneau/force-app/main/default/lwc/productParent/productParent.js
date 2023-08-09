import { LightningElement, wire,api } from 'lwc';
import opportunityProductDateRanges from '@salesforce/apex/LC002_Reservation_Panneau.opportunityProductDateRanges'
import wiredProducts from '@salesforce/apex/LC001_Panneau.wiredProducts';
import opportunityProduct from '@salesforce/apex/LC002_Reservation_Panneau.opportunityProduct'

const PRODUCTS_PER_ROW = 4; 




export default class ProductParent extends LightningElement {
    @api products;
    groupedProducts;
    @api selectedproductid;
    selectedProduct;
    savePro ; 





    @wire(wiredProducts)
    wiredProducts ({ error, data }) {
            if (data) {
                this.products = data ? data : [];
                console.log(' #### data',data );
                this.savePro = this.products;
                this.groupedProducts = this.groupProducts(this.products, PRODUCTS_PER_ROW);
                console.log(JSON.stringify(this.groupedProducts))
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
                  console.log('product',data)
              } else if (error) {
              }
            }

        handleFilter(event){
            this.products = this.savePro ;
            const searchCriteria = event.detail;
            const { address, type ,sDate , fDate} = searchCriteria;
            console.log('helooo',address);
            let filteredProducts = this.products;
            console.log('testoooo',filteredProducts)
            if (address) {
              filteredProducts = filteredProducts.filter(
                (product) => product.product.Adresse__c === address
              );
              console.log(JSON.stringify(filteredProducts))
              if (type) {
                filteredProducts = filteredProducts.filter(
                  (product) => product.product.Type__c.toLowerCase() === type
                );
                    console.log(filteredProducts.length)
                    
                    // for(i=0;i<filteredProducts.length;i++){
                    //     {
                    //         this.listProduct.forEach((detail)=>{
                    //             console.log('Id du produit',detail.productId)
                    //         })

                    //     }
                    // }

                    console.log(filteredProducts);

              }
            }
            this.products = filteredProducts;
            this.groupedProducts = this.groupProducts(this.products, PRODUCTS_PER_ROW);

            console.log('heloo',JSON.stringify(this.groupedProducts))
        }
}

