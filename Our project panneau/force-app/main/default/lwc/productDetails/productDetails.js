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
    @track list = []; 
    @track list1 = [];
    @api montant ;
    @wire(getOppProdByProductId , { productId: '$selectedProduct.product.Id' })
    wiredProducts ({ error, data }) {
            if (data) {
                this.oppProducts = data ? data : [];
                this.oppProducts = data.map(opp => ({
                    ...opp,
                    formattedDateDeDebut: this.formatDate(opp.DateDeDebut__c),
                    formattedDateDeFin: this.formatDate(opp.DateDeFin__c)
                }));

                this.enableDisableButton(this.list);

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

    handleClick(event){
         const Id = event.target.dataset.id;
       
       console.log(Id)
       let exists = false ;

       if(this.list.length == 0){
        this.list.push(Id);
        console.log(this.montant);

        let message = {message: this.selectedProduct , dDebut:this.sDate , dFin:this.fDate , montant : this.montant ,recordId:this.recordId};
                publish(this.messageContext, ComChannel, message);
       }else{

        this.list.forEach((id)=>{

            if(id === this.selectedProduct.product.Id){
                exists = true ;
              

            }

        })
                if(!exists){
                    console.log(this.montant);
                    let message = {message: this.selectedProduct , dDebut:this.sDate , dFin:this.fDate ,montant : this.montant , recordId:this.recordId};
                    publish(this.messageContext, ComChannel, message);
                    this.list.push(Id);
                }}

        
       

        this.isButtonDisabled = true ;

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

         this.handleSubscribe();

    }

    handleSubscribe() {
        if (this.subscription) {
            return;
        }
        this.subscription = subscribe(this.messageContext, RemoveChannel, (message) => {
            console.log(message.message);
            this.publisherMessage = message.message;
            console.log('titiii',JSON.parse(JSONstringify(message.message)))
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
