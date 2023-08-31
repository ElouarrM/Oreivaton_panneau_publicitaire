import { LightningElement, api ,wire , track} from 'lwc';
import { subscribe, MessageContext ,unsubscribe } from 'lightning/messageService';
import ComChannel from '@salesforce/messageChannel/ComChannel__c';
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

    listIds = [];
    parents = new Set();

    connectedCallback() {
        this.handleSubscribe();
        this.subscription = null;
    }

    disconnectedCallback() {
        unsubscribe(this.subscription);
        this.subscription = null;
     }
    handleSubscribe() {
        if (this.subscription) {
            return;
        }                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           
        this.subscription = subscribe(this.messageContext, ComChannel, (message) => {
            let  id = message.message.product.Id ;
           
            /*if list is empty add without check if not add only id not
            existing on the list  */
            console.log('liste des ids',JSON.stringify(this.listIds));
            if(!this.listIds.includes(id)){
                console.log('the id is different')
                 this.listIds.push(id);
                         //ce bloque s'execute apres check si reser exite !!!
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
                
               
                //Pour afficher le MAD on formate le prix 
                if(message.message.product.Product__c != null){
                    if(this.listPanneaux.length == 0 ){
                        this.listPanneaux.push(message.parent);

                    }else{
                    this.listPanneaux.forEach((product)=>{

                        if(message.message.product.Product__c == product.product.Id){
                            this.ShowToast('Ajout impossible d\'une annonce pour le même panneau', message.message, 'error', 'dismissable');

                        }
                    else{
                        this.listPanneaux.push(message.parent);
                        this.ShowToast('Panneau ajouté avec succès', message.message, 'success', 'dismissable');


                    }
                    })}
                    
                }else{
                    console.log('static without parent')

                    this.listPanneaux.push(message.message)
                    this.ShowToast('Panneau ajouté avec succès', message.message, 'success', 'dismissable');

                }
                
                this.listPanneaux = this.listPanneaux.map(panneau => ({
                    ...panneau,
                formattedPrice: `${panneau.price} MAD `
            }));
            
            }else{
                this.ShowToast('Panneau existe', message.message, 'info', 'dismissable');
            }
           
            this.publisherMessage = message.message;
                
            //this.ShowToast('Panneau ajouté avec succès', message.message, 'success', 'dismissable');
            
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
        var temp = this.listPanneaux.filter((panneau) => {
         
            
            return panneau.product.Id != event.target.dataset.id}
        );
        console.log(JSON.parse(JSON.stringify(temp)))

      
        var temp1 = this.listOppProducts.filter((opp) => {   
            return opp.Product2Id != event.target.dataset.id}
        );

        var temp2 = this.listIds.filter((id) => {   
            return id != event.target.dataset.id}
        );

        this.listPanneaux = temp.length ? temp : [] ;
        this.listOppProducts = temp1.length ? temp1 : [] ;
        this.listIds = temp2.length ? temp2 : [] ;

       

            
        // let message = {message:removedElement };
        // publish(this.messageContext, RemoveChannel, message);
    }


    handleClick(){
        console.log("helooooo")
        console.log('created opps',this.listOppProducts)
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
              setTimeout(() => {
                window.location.reload()
                }, "1500");
              
                

    }

 
}