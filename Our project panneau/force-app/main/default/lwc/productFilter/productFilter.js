import { LightningElement , track,wire ,api } from 'lwc';
//import getProductAddresses from '@salesforce/apex/LC001_Panneau.getProductAddresses';
import opportunityProductDateRanges from '@salesforce/apex/LC002_Reservation_Panneau.opportunityProductDateRanges'
//import opportunityProduct from '@salesforce/apex/LC002_Reservation_Panneau.opportunityProduct'

import wiredProducts from '@salesforce/apex/LC001_Panneau.wiredProducts';

export default class ProductFilter extends LightningElement {
  
    @track searchResults; 
   // picklistOrdered = ['toto','tata','titi']
    @track selectedSearchResult;

    @api products;
   @api  uniqueTypes = [] ;
    @api uniqueAddresses = [];
    picklistOrdered;
   
/*
    @wire(getProductAddresses)
    wiredAddresses({ error, data }) {
      if (data) {
        this.picklistOrdered = data;
    } else if (error) {
        // Handle error
        console.error('Error fetching addresses:', error);
    }
  */

    @wire(wiredProducts)
    wiredProducts({error, data}) {
            if (data) {
                this.products = data ? data : [];
                console.log(' data',data );
                 // Use Set to store unique types , adresses 
                const  typesSet = new Set();
                const  addrSet = new Set();
             
          for(let i=0;i<this.products.length;i++){
            const productType = this.products[i].product.Type__c;
            console.log(productType)
            typesSet.add(productType);
            const productAddress = this.products[i].product.Adresse__c;
            console.log('adress',productAddress)

            addrSet.add(productAddress);


          }
      // Convert Set to an array
        this.uniqueTypes = Array.from(typesSet);
        console.log('array',JSON.stringify(this.uniqueTypes));
        this.uniqueAddresses = Array.from(addrSet)
        console.log('array',JSON.stringify(this.uniqueAddresses));

                
            } else if (error) {
                console.log(' error' );
                this.products = undefined;

            }
        }
  
  @api
  get selectedValue() {
    return this.selectedSearchResult ? this.selectedSearchResult : null;
  }

    //display elements when we focus on the field if there is no input 
    showItems(){
        
        if (!this.searchResults) {
            this.searchResults = this.uniqueAddresses;
          }
    }
    hideItems(){
      this.searchResults = null ;
    }

    /* does the list of options include the input value we got */
     search(event){
       const input = event.target.value.toLowerCase();
       console.log('input value',input)        
       const result = this.uniqueAddresses.filter((picklistOption) => picklistOption.toLowerCase().includes(input));
        this.searchResults = result;

       console.log('search result',JSON.stringify(this.searchResults))
      
    
    }

    selectSearchResult(event) {
        const selectedValue = event.currentTarget.dataset.value;
        console.log('selected value',selectedValue)
        this.selectedSearchResult = this.uniqueAddresses.find(
          (picklistOption) => picklistOption === selectedValue
        );
        
        console.log(JSON.stringify(this.selectedSearchResult));
        this.clearSearchResults();

      }

      clearSearchResults() {
        this.searchResults = null;
      }

    /*This section for type filter */
    typeValue = '';

    @api types ;

    @api
    get options() {
        return [{label:'statique',value:'statique'},
        {label:'roulant',value:'roulant'}];
    }

    handleChange(event) {
        this.value = event.detail.value;
    }

    /*Date filter */
    dateRanges;

    @track selectedSDate = '';
    @track selectedFDate = '';

    @wire(opportunityProductDateRanges)
    opportunityProductDateRanges({ error, data }) {
        if (data) {
            this.dateRanges = data;
        } else if (error) {
        }
      }
      
        handleDate(event){
            this.selectedSDate = event.target.value;
          console.log(this.selectedSDate)
          const fieldName = event.target.name ;
          
          if(fieldName == 'startDate'){
              this.selectedSDate = event.target.value;
          }
          if(fieldName == 'finishDate'){
            this.selectedFDate = event.target.value;
          }
      }
      
      //filters get applied when we click the button 
      handleSearch(){
        console.log('test')
       const  searchCriteria = {
          address: this.selectedValue,
          type: this.value,
           startDate: this.selectedSDate,
          finishDate: this.selectedFDate
        };
        const searchEvent = new CustomEvent('search',{
          detail : searchCriteria 
        })
       console.log('event',searchEvent)
        this.dispatchEvent(searchEvent);

      }
     
}

    

    
