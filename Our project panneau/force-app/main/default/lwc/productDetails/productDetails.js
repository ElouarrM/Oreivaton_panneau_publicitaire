import { LightningElement, api } from 'lwc';
import MY_IMAGE from '@salesforce/resourceUrl/imgae'
export default class ProductDeatils extends LightningElement {
    @api selectedProduct;
    imageUrl = MY_IMAGE;
}