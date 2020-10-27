import { element, by, ElementFinder, ElementArrayFinder } from 'protractor';

import { waitUntilAnyDisplayed, waitUntilDisplayed, click, waitUntilHidden, isVisible } from '../../../util/utils';

import NavBarPage from './../../../page-objects/navbar-page';

import ProductCategoryUpdatePage from './product-category-update.page-object';

const expect = chai.expect;
export class ProductCategoryDeleteDialog {
  deleteModal = element(by.className('modal'));
  private dialogTitle: ElementFinder = element(by.id('storeApp.productProductCategory.delete.question'));
  private confirmButton = element(by.id('jhi-confirm-delete-productCategory'));

  getDialogTitle() {
    return this.dialogTitle;
  }

  async clickOnConfirmButton() {
    await this.confirmButton.click();
  }
}

export default class ProductCategoryComponentsPage {
  createButton: ElementFinder = element(by.id('jh-create-entity'));
  deleteButtons = element.all(by.css('div table .btn-danger'));
  title: ElementFinder = element(by.id('product-category-heading'));
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
    await navBarPage.getEntityPage('product-category');
    await waitUntilAnyDisplayed([this.noRecords, this.table]);
    return this;
  }

  async goToCreateProductCategory() {
    await this.createButton.click();
    return new ProductCategoryUpdatePage();
  }

  async deleteProductCategory() {
    const deleteButton = this.getDeleteButton(this.records.last());
    await click(deleteButton);

    const productCategoryDeleteDialog = new ProductCategoryDeleteDialog();
    await waitUntilDisplayed(productCategoryDeleteDialog.deleteModal);
    expect(await productCategoryDeleteDialog.getDialogTitle().getAttribute('id')).to.match(
      /storeApp.productProductCategory.delete.question/
    );
    await productCategoryDeleteDialog.clickOnConfirmButton();

    await waitUntilHidden(productCategoryDeleteDialog.deleteModal);

    expect(await isVisible(productCategoryDeleteDialog.deleteModal)).to.be.false;
  }
}
