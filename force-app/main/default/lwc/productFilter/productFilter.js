import { LightningElement , track,wire } from 'lwc';
import getProductAddresses from '@salesforce/apex/LC001_Panneau.getProductAddresses';
export default class ProductFilter extends LightningElement {
  
    @track searchResults; 
   // picklistOrdered = ['toto','tata','titi']
    @track selectedSearchResult;


    picklistOrdered;

    @wire(getProductAddresses)
    wiredAddresses({ error, data }) {
        if (data) {
            this.picklistOrdered = data;
        } else if (error) {
            // Handle error
            console.error('Error fetching addresses:', error);
        }
    }
  
//@track selectedValue ;
  get selectedValue() {
    return this.selectedSearchResult ? this.selectedSearchResult : null;
  }

    //display elements when we focus on the field if there is no input 
    showItems(){
        
        if (!this.searchResults) {
            this.searchResults = this.picklistOrdered;
          }
    }
    hideItems(){
      this.searchResults = null ;
    }

    /* does the list of options include the input value we got */
     search(event){
       const input = event.target.value.toLowerCase();
       console.log('input value',input)        
       const result = this.picklistOrdered.filter((picklistOption) => picklistOption.toLowerCase().includes(input));
        this.searchResults = result;

       console.log('search result',JSON.stringify(this.searchResults))
      
    
    }

    selectSearchResult(event) {
        const selectedValue = event.currentTarget.dataset.value;
        console.log('selected value',selectedValue)
        this.selectedSearchResult = this.picklistOrdered.find(
          (picklistOption) => picklistOption === selectedValue
        );
        
        console.log(JSON.stringify(this.selectedSearchResult));
        this.clearSearchResults();

      }

      clearSearchResults() {
        this.searchResults = null;
      }
    

    
}