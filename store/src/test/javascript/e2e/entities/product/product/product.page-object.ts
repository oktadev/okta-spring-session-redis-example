import { element, by, ElementFinder, ElementArrayFinder } from 'protractor';

import { waitUntilAnyDisplayed, waitUntilDisplayed, click, waitUntilHidden, isVisible } from '../../../util/utils';

import NavBarPage from './../../../page-objects/navbar-page';

import ProductUpdatePage from './product-update.page-object';

const expect = chai.expect;
export class ProductDeleteDialog {
  deleteModal = element(by.className('modal'));
  private dialogTitle: ElementFinder = element(by.id('storeApp.productProduct.delete.question'));
  private confirmButton = element(by.id('jhi-confirm-delete-product'));

  getDialogTitle() {
    return this.dialogTitle;
  }

  async clickOnConfirmButton() {
    await this.confirmButton.click();
  }
}

export default class ProductComponentsPage {
  createButton: ElementFinder = element(by.id('jh-create-entity'));
  deleteButtons = element.all(by.css('div table .btn-danger'));
  title: ElementFinder = element(by.id('product-heading'));
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
    await navBarPage.getEntityPage('product');
    await waitUntilAnyDisplayed([this.noRecords, this.table]);
    return this;
  }

  async goToCreateProduct() {
    await this.createButton.click();
    return new ProductUpdatePage();
  }

  async deleteProduct() {
    const deleteButton = this.getDeleteButton(this.records.last());
    await click(deleteButton);

    const productDeleteDialog = new ProductDeleteDialog();
    await waitUntilDisplayed(productDeleteDialog.deleteModal);
    expect(await productDeleteDialog.getDialogTitle().getAttribute('id')).to.match(/storeApp.productProduct.delete.question/);
    await productDeleteDialog.clickOnConfirmButton();

    await waitUntilHidden(productDeleteDialog.deleteModal);

    expect(await isVisible(productDeleteDialog.deleteModal)).to.be.false;
  }
}
