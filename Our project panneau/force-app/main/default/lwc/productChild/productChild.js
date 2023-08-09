import { LightningElement, api, wire } from 'lwc';
import { publish, MessageContext, subscribe, unsubscribe, APPLICATION_SCOPE } from 'lightning/messageService';
import PanneauxMC from '@salesforce/messageChannel/PanneauDetailsMessageChannel__c';

const TILE_WRAPPER_SELECTED_CLASS = 'tile-wrapper selected';
const TILE_WRAPPER_UNSELECTED_CLASS = 'tile-wrapper';

export default class ProductChild extends LightningElement {
    @api product;
    @wire(MessageContext) messageContext;

    @api selectedproductid;

    
    get tileClass() {
        if (this.selectedproductid==this.product.product.Id ) {
           // console.log(this.product.product.Id )
            return TILE_WRAPPER_SELECTED_CLASS;
        } 
        return TILE_WRAPPER_UNSELECTED_CLASS;
    }
    
    selectProduct() {
        this.selectedproductid = this.product.product.Id;
        const productSelect = new CustomEvent('productselect', {
            detail: {
                productId: this.product.product.Id
            }
        });
        this.dispatchEvent(productSelect);
        //addded by saad
        const payload = { recordId: this.product.product.Id};
        try {
           publish(this.messageContext, PanneauxMC, payload);
        }
        catch (error) {
           console.log(JSON.stringify(error));
        }
    }
    
}

