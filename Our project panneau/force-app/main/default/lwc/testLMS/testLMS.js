import { LightningElement, wire } from 'lwc';
import { subscribe, APPLICATION_SCOPE, unsubscribe, MessageContext } from 'lightning/messageService';
import PanneauxMC from '@salesforce/messageChannel/PanneauDetailsMessageChannel__c';

export default class TestLMS extends LightningElement {
    subscription = null;
    @wire(MessageContext) messageContext;

    //todo : Lifecycle hooks 
    connectedCallback(){
        this.subscribeToPanneautMC();
    }
    disconnectedCallback(){
        unsubscribe(this.subscription);
        this.subscription = null;
    }

    subscribeToPanneautMC() {
        if (!this.subscription) {
           this.subscription = subscribe(
               this.messageContext,
               PanneauxMC,
               (message) => this.handleMessage(message),
               { scope: APPLICATION_SCOPE }
           );
        }
    }

    handleMessage() {
        console.log('this is your message : ' + JSON.stringify(message));
    }
}