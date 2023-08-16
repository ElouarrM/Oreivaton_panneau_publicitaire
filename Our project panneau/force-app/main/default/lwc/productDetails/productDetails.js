import { LightningElement, api , wire , track} from 'lwc';
import ComChannel from '@salesforce/messageChannel/ComChannel__c';
import {publish, MessageContext} from 'lightning/messageService'
import MY_IMAGE from '@salesforce/resourceUrl/imgae'
import getOppProdByProductId from  '@salesforce/apex/DM001_Panneau.getOppProdByProductId'
export default class ProductDetails extends LightningElement {
    @api selectedProduct;
    imageUrl = MY_IMAGE;
    @api listOfPanneaux = []
    @wire(MessageContext)
    messageContext;
    oppProducts ;
    listOpp ;

    @wire(getOppProdByProductId , { productId: '$selectedProduct.product.Id' })
    wiredProducts ({ error, data }) {
            if (data) {
                this.oppProducts = data ? data : [];
                console.log('from product details',JSON.parse(JSON.stringify(this.oppProducts)) );
                console.log('this is me',JSON.stringify(this.selectedProduct))
                

            } else if (error) {
                console.log(' #### error' );
                this.oppProducts = undefined;

            }
        }


    handleClick(){
        console.log('this is me',JSON.stringify(this.selectedProduct))

            console.log("liste des produits ajoutés",JSON.parse(JSON.stringify(this.listOfPanneaux)))
            console.log(typeof this.listOfPanneaux)
            //let message = {message: this.selectedProduct , panneaux:this.listOfPanneaux};
            let message = {message: this.selectedProduct};

            publish(this.messageContext, ComChannel, message);
        
    }
}
