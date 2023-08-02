import { LightningElement, api } from 'lwc';

const TILE_WRAPPER_SELECTED_CLASS = 'tile-wrapper selected';
const TILE_WRAPPER_UNSELECTED_CLASS = 'tile-wrapper';

export default class ProductChild extends LightningElement {
    @api product;

    @api selectedproductid;

    
    get tileClass() {
        if (this.selectedproductid==this.product.product.Id ) {
            console.log(this.product.product.Id )
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
    }
    
    
    
}

