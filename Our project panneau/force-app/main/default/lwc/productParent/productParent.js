import { LightningElement, wire } from 'lwc';

import wiredProducts from '@salesforce/apex/LC001_Panneau.wiredProducts';
const PRODUCTS_PER_ROW = 4; 




export default class ProductParent extends LightningElement {
    products;
    groupedProducts;


    @wire(wiredProducts)
    wiredProducts ({ error, data }) {
            if (data) {
                this.products = data ? data : [];
                console.log(' #### data',data );
                this.groupedProducts = this.groupProducts(this.products, PRODUCTS_PER_ROW);
            } else if (error) {
                console.log(' #### error' );
                this.products = undefined;
                this.groupedProducts = undefined;

            }
        }
    groupProducts(products, groupSize) {
            const groupedArray = [];
            for (let i = 0; i < products.length; i += groupSize) {
                groupedArray.push(products.slice(i, i + groupSize));
            }
            return groupedArray;
        }

}


