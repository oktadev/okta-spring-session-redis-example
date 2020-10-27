import { element, by, ElementFinder, ElementArrayFinder } from 'protractor';

import { waitUntilAnyDisplayed, waitUntilDisplayed, click, waitUntilHidden, isVisible } from '../../../util/utils';

import NavBarPage from './../../../page-objects/navbar-page';

import InvoiceUpdatePage from './invoice-update.page-object';

const expect = chai.expect;
export class InvoiceDeleteDialog {
  deleteModal = element(by.className('modal'));
  private dialogTitle: ElementFinder = element(by.id('storeApp.invoiceInvoice.delete.question'));
  private confirmButton = element(by.id('jhi-confirm-delete-invoice'));

  getDialogTitle() {
    return this.dialogTitle;
  }

  async clickOnConfirmButton() {
    await this.confirmButton.click();
  }
}

export default class InvoiceComponentsPage {
  createButton: ElementFinder = element(by.id('jh-create-entity'));
  deleteButtons = element.all(by.css('div table .btn-danger'));
  title: ElementFinder = element(by.id('invoice-heading'));
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
    await navBarPage.getEntityPage('invoice');
    await waitUntilAnyDisplayed([this.noRecords, this.table]);
    return this;
  }

  async goToCreateInvoice() {
    await this.createButton.click();
    return new InvoiceUpdatePage();
  }

  async deleteInvoice() {
    const deleteButton = this.getDeleteButton(this.records.last());
    await click(deleteButton);

    const invoiceDeleteDialog = new InvoiceDeleteDialog();
    await waitUntilDisplayed(invoiceDeleteDialog.deleteModal);
    expect(await invoiceDeleteDialog.getDialogTitle().getAttribute('id')).to.match(/storeApp.invoiceInvoice.delete.question/);
    await invoiceDeleteDialog.clickOnConfirmButton();

    await waitUntilHidden(invoiceDeleteDialog.deleteModal);

    expect(await isVisible(invoiceDeleteDialog.deleteModal)).to.be.false;
  }
}
