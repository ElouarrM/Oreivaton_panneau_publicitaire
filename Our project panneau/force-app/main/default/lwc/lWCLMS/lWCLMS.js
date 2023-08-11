import { LightningElement, wire } from 'lwc';
import TechdicerChannel from '@salesforce/messageChannel/TechdicerChannel__c';
import {publish, MessageContext} from 'lightning/messageService'
 
export default class LWCLMS extends LightningElement {
    @wire(MessageContext)
    messageContext;
    message;
 
    handleChange(event){
        this.message = event.detail.value;
    }
 
    handleClick() {
        let message = {message: this.message};
        publish(this.messageContext, TechdicerChannel, message);
    }
}