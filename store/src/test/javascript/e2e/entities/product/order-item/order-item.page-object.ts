import { element, by, ElementFinder, ElementArrayFinder } from 'protractor';

import { waitUntilAnyDisplayed, waitUntilDisplayed, click, waitUntilHidden, isVisible } from '../../../util/utils';

import NavBarPage from './../../../page-objects/navbar-page';

import OrderItemUpdatePage from './order-item-update.page-object';

const expect = chai.expect;
export class OrderItemDeleteDialog {
  deleteModal = element(by.className('modal'));
  private dialogTitle: ElementFinder = element(by.id('storeApp.productOrderItem.delete.question'));
  private confirmButton = element(by.id('jhi-confirm-delete-orderItem'));

  getDialogTitle() {
    return this.dialogTitle;
  }

  async clickOnConfirmButton() {
    await this.confirmButton.click();
  }
}

export default class OrderItemComponentsPage {
  createButton: ElementFinder = element(by.id('jh-create-entity'));
  deleteButtons = element.all(by.css('div table .btn-danger'));
  title: ElementFinder = element(by.id('order-item-heading'));
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
    await navBarPage.getEntityPage('order-item');
    await waitUntilAnyDisplayed([this.noRecords, this.table]);
    return this;
  }

  async goToCreateOrderItem() {
    await this.createButton.click();
    return new OrderItemUpdatePage();
  }

  async deleteOrderItem() {
    const deleteButton = this.getDeleteButton(this.records.last());
    await click(deleteButton);

    const orderItemDeleteDialog = new OrderItemDeleteDialog();
    await waitUntilDisplayed(orderItemDeleteDialog.deleteModal);
    expect(await orderItemDeleteDialog.getDialogTitle().getAttribute('id')).to.match(/storeApp.productOrderItem.delete.question/);
    await orderItemDeleteDialog.clickOnConfirmButton();

    await waitUntilHidden(orderItemDeleteDialog.deleteModal);

    expect(await isVisible(orderItemDeleteDialog.deleteModal)).to.be.false;
  }
}
