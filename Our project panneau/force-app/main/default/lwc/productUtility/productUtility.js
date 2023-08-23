import { LightningElement, api ,wire , track} from 'lwc';
import { subscribe, MessageContext } from 'lightning/messageService';
import ComChannel from '@salesforce/messageChannel/ComChannel__c';
import RemoveChannel from '@salesforce/messageChannel/RemoveChannel__c';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import createOpportunityProduct from '@salesforce/apex/DM002_Reservation_Panneau.createOpportunityProduct'
export default class ProductUtility extends LightningElement {


    publisherMessage = '';
    subscription = null;
    listPanneaux = [];
    @track listEmpty = true ;
   
    @wire(MessageContext)
    messageContext;
    //@api recordId ;
    productId ;

    listOppProducts = [] ;

    oppProduct = {
        DateDeDebut__c :'',
        DateDeFin__c:'',
        Quantity:'',
        OpportunityId:'',
        Product2Id :'',
        UnitPrice:''
    }

    connectedCallback() {
        console.log('callback is being called')
        this.handleSubscribe();
    }
    handleSubscribe() {
        console.log('testing function')
        if (this.subscription) {
            return;
        }
        this.subscription = subscribe(this.messageContext, ComChannel, (message) => {
            
            //Reservation de panneaux attributes
            this.oppProduct.DateDeDebut__c = new Date(message.dDebut);
            this.oppProduct.DateDeFin__c =  new Date(message.dFin) ;

            var dd = new Date(message.dDebut)
            var df = new Date(message.dFin)

            var Difference_In_Time = df.getTime() - dd.getTime()
            this.oppProduct.Quantity = Difference_In_Time / (1000 * 3600 * 24);
            this.oppProduct.OpportunityId = message.recordId ;
            this.oppProduct.Product2Id = message.message.product.Id 
            this.oppProduct.UnitPrice = message.montant ;
            this.listOppProducts.push(this.oppProduct)
            console.log('another test',JSON.parse(JSON.stringify(this.listOppProducts)))
            console.log('created oppProduct',JSON.parse(JSON.stringify(this.oppProduct)));
            //Pour afficher le MAD on formate le prix 
            this.listPanneaux.push(message.message)
            this.listPanneaux = this.listPanneaux.map(panneau => ({
                ...panneau,
                formattedPrice: `${panneau.price} MAD `
            }));
            
            console.log('la liste des produits',JSON.parse(JSON.stringify(this.listPanneaux)))
            this.publisherMessage = message.message;
            this.ShowToast('Panneau ajouté avec succès', message.message, 'success', 'dismissable');
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
       
        
       

    handleRemove(event){
        console.log('heloo11')
        var temp = this.listPanneaux.filter((panneau) => {
         
            
            return panneau.product.Id != event.target.dataset.id}
        );
        console.log(JSON.parse(JSON.stringify(temp)))

        var removedElement = this.listPanneaux.filter((panneau) => {
            return panneau.product.Id == event.target.dataset.id}
        );

        console.log('removed',JSON.parse(JSON.stringify(removedElement)))
        this.listPanneaux = temp.length ? temp : [] ;

        let message = {message:removedElement };
            
        publish(this.messageContext, RemoveChannel, message);
    }

   

    handleClick(){
        console.log("helooooo")
        createOpportunityProduct({ oppProducts: this.listOppProducts })
            .then(()=>{
                const evt = new ShowToastEvent({
                    title: 'Success',
                    message: 'Operation sucessful',
                    variant: 'success',
                });
                this.dispatchEvent(evt);

            })
            .catch(error => { // Define the error variable here
                console.error(error);
                const evt = new ShowToastEvent({
                    title: 'Error',
                    message: 'Unexpected error has occurred',
                    variant: 'error',
                });
                this.dispatchEvent(evt);
            })
           
            .finally(() => {
                console.log('heloo')
              }) 
              console.log('okk :',JSON.stringify(this.listOppProducts));
            
    }
 
}