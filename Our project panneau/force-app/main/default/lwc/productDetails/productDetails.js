import { LightningElement, api , wire } from 'lwc';
import ComChannel from '@salesforce/messageChannel/ComChannel__c';
import {publish, MessageContext} from 'lightning/messageService'
import MY_IMAGE from '@salesforce/resourceUrl/imgae'
export default class ProductDetails extends LightningElement {
    @api selectedProduct;
    imageUrl = MY_IMAGE;
    @api listOfPanneaux = []
    @wire(MessageContext)
    messageContext;

    handleClick(){
            //console.log('Le produit selectionné est :',JSON.stringify(this.selectedProduct))
            //this.listOfPanneaux = [...this.listOfPanneaux , this.selectedProduct]
            //this.listOfPanneaux.push(this.selectedProduct)
            console.log("liste des produits ajoutés",JSON.parse(JSON.stringify(this.listOfPanneaux)))
            console.log(typeof this.listOfPanneaux)
            //let message = {message: this.selectedProduct , panneaux:this.listOfPanneaux};
            let message = {message: this.selectedProduct};

            publish(this.messageContext, ComChannel, message);
        
    }
}
