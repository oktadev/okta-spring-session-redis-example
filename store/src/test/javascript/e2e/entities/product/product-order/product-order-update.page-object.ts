import { element, by, ElementFinder, protractor } from 'protractor';
import { waitUntilDisplayed, waitUntilHidden, isVisible } from '../../../util/utils';

const expect = chai.expect;

export default class ProductOrderUpdatePage {
  pageTitle: ElementFinder = element(by.id('storeApp.productProductOrder.home.createOrEditLabel'));
  saveButton: ElementFinder = element(by.id('save-entity'));
  cancelButton: ElementFinder = element(by.id('cancel-save'));
  placedDateInput: ElementFinder = element(by.css('input#product-order-placedDate'));
  statusSelect: ElementFinder = element(by.css('select#product-order-status'));
  codeInput: ElementFinder = element(by.css('input#product-order-code'));
  invoiceIdInput: ElementFinder = element(by.css('input#product-order-invoiceId'));
  customerInput: ElementFinder = element(by.css('input#product-order-customer'));

  getPageTitle() {
    return this.pageTitle;
  }

  async setPlacedDateInput(placedDate) {
    await this.placedDateInput.sendKeys(placedDate);
  }

  async getPlacedDateInput() {
    return this.placedDateInput.getAttribute('value');
  }

  async setStatusSelect(status) {
    await this.statusSelect.sendKeys(status);
  }

  async getStatusSelect() {
    return this.statusSelect.element(by.css('option:checked')).getText();
  }

  async statusSelectLastOption() {
    await this.statusSelect.all(by.tagName('option')).last().click();
  }
  async setCodeInput(code) {
    await this.codeInput.sendKeys(code);
  }

  async getCodeInput() {
    return this.codeInput.getAttribute('value');
  }

  async setInvoiceIdInput(invoiceId) {
    await this.invoiceIdInput.sendKeys(invoiceId);
  }

  async getInvoiceIdInput() {
    return this.invoiceIdInput.getAttribute('value');
  }

  async setCustomerInput(customer) {
    await this.customerInput.sendKeys(customer);
  }

  async getCustomerInput() {
    return this.customerInput.getAttribute('value');
  }

  async save() {
    await this.saveButton.click();
  }

  async cancel() {
    await this.cancelButton.click();
  }

  getSaveButton() {
    return this.saveButton;
  }

  async enterData() {
    await waitUntilDisplayed(this.saveButton);
    await this.setPlacedDateInput('01/01/2001' + protractor.Key.TAB + '02:30AM');
    expect(await this.getPlacedDateInput()).to.contain('2001-01-01T02:30');
    await waitUntilDisplayed(this.saveButton);
    await this.statusSelectLastOption();
    await waitUntilDisplayed(this.saveButton);
    await this.setCodeInput('code');
    expect(await this.getCodeInput()).to.match(/code/);
    await waitUntilDisplayed(this.saveButton);
    await this.setInvoiceIdInput('5');
    expect(await this.getInvoiceIdInput()).to.eq('5');
    await waitUntilDisplayed(this.saveButton);
    await this.setCustomerInput('customer');
    expect(await this.getCustomerInput()).to.match(/customer/);
    await this.save();
    await waitUntilHidden(this.saveButton);
    expect(await isVisible(this.saveButton)).to.be.false;
  }
}
