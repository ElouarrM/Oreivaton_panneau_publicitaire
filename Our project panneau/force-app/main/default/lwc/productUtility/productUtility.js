import { LightningElement, api ,wire , track} from 'lwc';
import { subscribe, MessageContext } from 'lightning/messageService';
import ComChannel from '@salesforce/messageChannel/ComChannel__c';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class ProductUtility extends LightningElement {


    publisherMessage = '';
    subscription = null;
    listPanneaux = [];
    @track listEmpty = true ;
 
    @wire(MessageContext)
    messageContext;

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
            console.log('testttt',message.message);
            this.listPanneaux = message.panneaux ;
            //Pour afficher le MAD on formate le prix 
            this.listPanneaux = this.listPanneaux.map(panneau => ({
                ...panneau,
                formattedPrice: `${panneau.price} MAD `
            }));
            
            console.log('la liste des produits',this.listPanneaux)
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
        //filter the list
        var temp = this.listPanneaux.filter((panneau)=>{ 
            panneau.Id != event.target.dataset.id
            console.log('panneau de la list',panneau.product.Id)
            console.log('panneau event',event.target.dataset.id)

        });
        console.log(temp)
        this.listPanneaux.splice(this.listPanneaux.indexOf(event.target.dataset.id), 1);
        this.listPanneaux = temp.length ? temp : [];
        this.listEmpty = this.listPanneaux?.length == 0;
        console.log(this.listPanneaux.length);
        console.log(JSON.parse(JSON.stringify(this.listPanneaux)))
    }
 
}