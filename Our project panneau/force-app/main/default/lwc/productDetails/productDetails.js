import { LightningElement, api , wire , track} from 'lwc';
import ComChannel from '@salesforce/messageChannel/ComChannel__c';
import RemoveChannel from '@salesforce/messageChannel/RemoveChannel__c';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import {publish, MessageContext , subscribe} from 'lightning/messageService'
import MY_IMAGE from '@salesforce/resourceUrl/imgae'
import getOppProdByProductId from  '@salesforce/apex/DM001_Panneau.getOppProdByProductId'


export default class ProductDetails extends LightningElement {
    
    @api products ;
    @api selectedProduct;
    @api dateDebut ;
    @api dateFin ;
    imageUrl = MY_IMAGE;
    @api listOfPanneaux = new Set();
    @wire(MessageContext)
    messageContext;
    oppProducts ;
    @api recordId ;
    listOpp ;
    @track isButtonDisabled;
    sDate ; 
    fDate ;
    @track listIds = []; 
    @track list1 = [];
    @api montant ;
    @api formatedPrice ;


    @wire(getOppProdByProductId , { productId: '$selectedProduct.product.Id' , dateDebut :'$dateDebut', dateFin:'$dateFin' })
    wiredProducts ({ error, data }) {
            if (data) {
                this.oppProducts = data ? data : [];
                this.oppProducts = data.map(opp => ({
                    ...opp,
                    formattedDateDeDebut: this.formatDate(opp.DateDeDebut__c),
                    formattedDateDeFin: this.formatDate(opp.DateDeFin__c)
                }));
                console.log('testing',JSON.stringify(this.oppProducts));
                
                this.enableDisableButton(this.listIds);

            } else if (error) {
                console.log(' #### error' );
                this.oppProducts = undefined;

            }
        }

        formatDate(dateString) {
            const date = new Date(dateString);
            const day = ('0' + date.getDate()).slice(-2);
            const month = ('0' + (date.getMonth() + 1)).slice(-2);
            const year = date.getFullYear();
            return `${day}/${month}/${year}`;
        }

        enableDisableButton(Ids){
            this.products.forEach((ele) => {
                if (!Ids.includes(ele.product.Id)) {
                    this.isButtonDisabled = false;
                }else{
                    this.isButtonDisabled = true;

                }
            });
        }  

    handleClick(){
        console.log('publishing the event without checking');
    

       if(typeof this.sDate == 'undefined' || typeof this.fDate == 'undefined' || typeof this.montant == 'undefined'){
                    this.ShowToast('Error','Must fill all fields','warning','dismissable ')

       }else
       {
        
            if(this.oppProducts.length == 0){
               
                let message = {message: this.selectedProduct , dDebut:this.sDate , dFin:this.fDate , montant : this.montant ,recordId:this.recordId};
                publish(this.messageContext, ComChannel, message);
                console.log('published');
     

            }else
            {
        
                for(let i=0;this.oppProducts.length;i++){

                    if(this.sDate >= this.oppProducts[i].DateDeDebut__c && this.sDate <= this.oppProducts[i].DateDeFin__c ||
                        this.fDate >= this.oppProducts[i].DateDeDebut__c && this.fDate <= this.oppProducts[i].DateDeFin__c ||
                        this.sDate <= this.oppProducts[i].DateDeDebut__c && this.fDate >= this.oppProducts[i].DateDeFin__c )
                    {
                            this.ShowToast('Error','Date already full','warning','dismissable ')
                    }else
                    {
                            let message = {message: this.selectedProduct , dDebut:this.sDate , dFin:this.fDate , montant : this.montant ,recordId:this.recordId};
                            publish(this.messageContext, ComChannel, message);
                    }
            
                                            }
                
        }
    }
    }

    

    handleDate(event){
        
      const fieldName = event.target.name ;
      
      if(fieldName == 'startDate'){
          this.sDate = event.target.value;
      }
      if(fieldName == 'endDate'){
        this.fDate = event.target.value;
      }
  }

    formatDate(dateString){
        const date = new Date(dateString);
        const day = ('0' + date.getDate()).slice(-2);
        const month = ('0' + (date.getMonth() + 1)).slice(-2);
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    }

    handlePrice(event){
        this.montant = event.target.value ;
    }
    
    connectedCallback(){
            console.log('i m called now');
         this.handleSubscribe();

    }

    handleSubscribe() {
        if (this.subscription) {
            return;
        }
        this.subscription = subscribe(this.messageContext, RemoveChannel, (message) => {
            console.log(message.message);
            this.publisherMessage = message.message;
            
            this.listOfPanneaux.filter((product)=>{
                this.publisherMessage.product.Id != product.product.Id ;
            })
            
            console.log('toto',this.listOfPanneaux)
            this.ShowToast('Success', message.message, 'success', 'dismissable');
        });
    }
 
    ShowToast(title, message, variant, mode){
        const evt = new ShowToastEvent({
            title: title,
            message:message,
            variant: variant,
            mode: mode
        });
        this.dispatchEvent(evt);
    }
}
