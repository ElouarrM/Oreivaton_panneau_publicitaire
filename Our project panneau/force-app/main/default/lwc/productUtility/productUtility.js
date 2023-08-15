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
            //this.listPanneaux = message.panneaux ;
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
        //filter the list
        console.log('liste avant filtrage',JSON.parse(JSON.stringify(this.listPanneaux)))
        var temp = this.listPanneaux.filter((panneau) => {
            console.log('from list',panneau.product.Id)
            console.log('from event',event.target.dataset.id)
            
            return panneau.product.Id != event.target.dataset.id}
        );
        console.log('liste apres filtrage',JSON.parse(JSON.stringify(temp)))
        this.listPanneaux = temp.length ? temp : [] ;
        console.log(JSON.parse(JSON.stringify(this.listPanneaux)))
        // const test = this.listPanneaux.splice(this.listPanneaux.indexOf(event.target.dataset.id), 1);
        // //la liste d'affiche normalement
        // console.log('liste apres splice',JSON.stringify(this.listPanneaux))
        // this.listPanneaux = test.length ? test : [];
        // this.listEmpty = this.listPanneaux?.length == 0;
        // console.log(this.listPanneaux.length);
        // console.log(JSON.parse(JSON.stringify(this.listPanneaux)))
    }
 
}