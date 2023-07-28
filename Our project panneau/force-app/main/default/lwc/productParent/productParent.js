import { LightningElement, wire } from 'lwc';
import { getListUi } from 'lightning/uiListApi';
import PRODUCT_OBJECT from '@salesforce/schema/Product2';
import wiredProducts from '@salesforce/apex/SM001_Panneau.wiredProducts';


const FIELDS = ['Name', 'Type__c']; 

export default class ProductParent extends LightningElement {
    products;


    @wire(wiredProducts)
    wiredProducts ({ error, data }) {
            if (data) {
                console.log(' #### data  ;', data );
                this.products = data ? data : [];
                console.log(' #### data.records ;', this.products );
            } else if (error) {
                console.log(' #### error' );
                this.products = undefined;
            }
        }
}


