import { LightningElement, api } from 'lwc';

const TILE_WRAPPER_SELECTED_CLASS = 'tile-wrapper selected';
const TILE_WRAPPER_UNSELECTED_CLASS = 'tile-wrapper';

export default class ProductChild extends LightningElement {
    @api product;
    /*
    @api selectedproductId;
    get tileClass() {
        if (this.product.Id == this.selectedproductId) {
            return TILE_WRAPPER_SELECTED_CLASS;
        }
        return TILE_WRAPPER_UNSELECTED_CLASS;
    }
    selectProduct() {
        this.selectedproductId = this.product.Id;
        const productSelect = new CustomEvent('productSelect', {
            detail: {
                boatId: this.selectedproductId
            }
        });
        this.dispatchEvent(productSelect);
    }
    */
}

