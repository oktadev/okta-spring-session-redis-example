import { element, by, ElementFinder, ElementArrayFinder } from 'protractor';

import { waitUntilAnyDisplayed, waitUntilDisplayed, click, waitUntilHidden, isVisible } from '../../../util/utils';

import NavBarPage from './../../../page-objects/navbar-page';

import ProductOrderUpdatePage from './product-order-update.page-object';

const expect = chai.expect;
export class ProductOrderDeleteDialog {
  deleteModal = element(by.className('modal'));
  private dialogTitle: ElementFinder = element(by.id('storeApp.productProductOrder.delete.question'));
  private confirmButton = element(by.id('jhi-confirm-delete-productOrder'));

  getDialogTitle() {
    return this.dialogTitle;
  }

  async clickOnConfirmButton() {
    await this.confirmButton.click();
  }
}

export default class ProductOrderComponentsPage {
  createButton: ElementFinder = element(by.id('jh-create-entity'));
  deleteButtons = element.all(by.css('div table .btn-danger'));
  title: ElementFinder = element(by.id('product-order-heading'));
  noRecords: ElementFinder = element(by.css('#app-view-container .table-responsive div.alert.alert-warning'));
  table: ElementFinder = element(by.css('#app-view-container div.table-responsive > table'));

  records: ElementArrayFinder = this.table.all(by.css('tbody tr'));

  getDetailsButton(record: ElementFinder) {
    return record.element(by.css('a.btn.btn-info.btn-sm'));
  }

  getEditButton(record: ElementFinder) {
    return record.element(by.css('a.btn.btn-primary.btn-sm'));
  }

  getDeleteButton(record: ElementFinder) {
    return record.element(by.css('a.btn.btn-danger.btn-sm'));
  }

  async goToPage(navBarPage: NavBarPage) {
    await navBarPage.getEntityPage('product-order');
    await waitUntilAnyDisplayed([this.noRecords, this.table]);
    return this;
  }

  async goToCreateProductOrder() {
    await this.createButton.click();
    return new ProductOrderUpdatePage();
  }

  async deleteProductOrder() {
    const deleteButton = this.getDeleteButton(this.records.last());
    await click(deleteButton);

    const productOrderDeleteDialog = new ProductOrderDeleteDialog();
    await waitUntilDisplayed(productOrderDeleteDialog.deleteModal);
    expect(await productOrderDeleteDialog.getDialogTitle().getAttribute('id')).to.match(/storeApp.productProductOrder.delete.question/);
    await productOrderDeleteDialog.clickOnConfirmButton();

    await waitUntilHidden(productOrderDeleteDialog.deleteModal);

    expect(await isVisible(productOrderDeleteDialog.deleteModal)).to.be.false;
  }
}
