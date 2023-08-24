import { LightningElement,api } from 'lwc';

export default class ProductMap extends LightningElement {
    @api product;
    @api selectedproductid;

    selectProduct() {
        this.selectedproductid = this.product.product.Id;
        const productSelect = new CustomEvent('productselect', {
            detail: {
                productId: this.product.product.Id
            }
        });
        this.dispatchEvent(productSelect);
    }
    get mapMarkers() {
        return [{
            location: {
                Street: this.product.product.Adresse__c,
                City: 'Casablanca',
                Country: 'Morocco',
            },
            title: this.product.product.Name, // You can use the product name or any other relevant info
        }];
    }
}