import { element, by, ElementFinder, ElementArrayFinder } from 'protractor';

import { waitUntilAnyDisplayed, waitUntilDisplayed, click, waitUntilHidden, isVisible } from '../../util/utils';

import NavBarPage from './../../page-objects/navbar-page';

import CustomerUpdatePage from './customer-update.page-object';

const expect = chai.expect;
export class CustomerDeleteDialog {
  deleteModal = element(by.className('modal'));
  private dialogTitle: ElementFinder = element(by.id('storeApp.customer.delete.question'));
  private confirmButton = element(by.id('jhi-confirm-delete-customer'));

  getDialogTitle() {
    return this.dialogTitle;
  }

  async clickOnConfirmButton() {
    await this.confirmButton.click();
  }
}

export default class CustomerComponentsPage {
  createButton: ElementFinder = element(by.id('jh-create-entity'));
  deleteButtons = element.all(by.css('div table .btn-danger'));
  title: ElementFinder = element(by.id('customer-heading'));
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
    await navBarPage.getEntityPage('customer');
    await waitUntilAnyDisplayed([this.noRecords, this.table]);
    return this;
  }

  async goToCreateCustomer() {
    await this.createButton.click();
    return new CustomerUpdatePage();
  }

  async deleteCustomer() {
    const deleteButton = this.getDeleteButton(this.records.last());
    await click(deleteButton);

    const customerDeleteDialog = new CustomerDeleteDialog();
    await waitUntilDisplayed(customerDeleteDialog.deleteModal);
    expect(await customerDeleteDialog.getDialogTitle().getAttribute('id')).to.match(/storeApp.customer.delete.question/);
    await customerDeleteDialog.clickOnConfirmButton();

    await waitUntilHidden(customerDeleteDialog.deleteModal);

    expect(await isVisible(customerDeleteDialog.deleteModal)).to.be.false;
  }
}
