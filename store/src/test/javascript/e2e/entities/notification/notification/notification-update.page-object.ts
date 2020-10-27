import { element, by, ElementFinder, protractor } from 'protractor';
import { waitUntilDisplayed, waitUntilHidden, isVisible } from '../../../util/utils';

const expect = chai.expect;

export default class NotificationUpdatePage {
  pageTitle: ElementFinder = element(by.id('storeApp.notificationNotification.home.createOrEditLabel'));
  saveButton: ElementFinder = element(by.id('save-entity'));
  cancelButton: ElementFinder = element(by.id('cancel-save'));
  dateInput: ElementFinder = element(by.css('input#notification-date'));
  detailsInput: ElementFinder = element(by.css('input#notification-details'));
  sentDateInput: ElementFinder = element(by.css('input#notification-sentDate'));
  formatSelect: ElementFinder = element(by.css('select#notification-format'));
  userIdInput: ElementFinder = element(by.css('input#notification-userId'));
  productIdInput: ElementFinder = element(by.css('input#notification-productId'));

  getPageTitle() {
    return this.pageTitle;
  }

  async setDateInput(date) {
    await this.dateInput.sendKeys(date);
  }

  async getDateInput() {
    return this.dateInput.getAttribute('value');
  }

  async setDetailsInput(details) {
    await this.detailsInput.sendKeys(details);
  }

  async getDetailsInput() {
    return this.detailsInput.getAttribute('value');
  }

  async setSentDateInput(sentDate) {
    await this.sentDateInput.sendKeys(sentDate);
  }

  async getSentDateInput() {
    return this.sentDateInput.getAttribute('value');
  }

  async setFormatSelect(format) {
    await this.formatSelect.sendKeys(format);
  }

  async getFormatSelect() {
    return this.formatSelect.element(by.css('option:checked')).getText();
  }

  async formatSelectLastOption() {
    await this.formatSelect.all(by.tagName('option')).last().click();
  }
  async setUserIdInput(userId) {
    await this.userIdInput.sendKeys(userId);
  }

  async getUserIdInput() {
    return this.userIdInput.getAttribute('value');
  }

  async setProductIdInput(productId) {
    await this.productIdInput.sendKeys(productId);
  }

  async getProductIdInput() {
    return this.productIdInput.getAttribute('value');
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
    await this.setDateInput('01/01/2001' + protractor.Key.TAB + '02:30AM');
    expect(await this.getDateInput()).to.contain('2001-01-01T02:30');
    await waitUntilDisplayed(this.saveButton);
    await this.setDetailsInput('details');
    expect(await this.getDetailsInput()).to.match(/details/);
    await waitUntilDisplayed(this.saveButton);
    await this.setSentDateInput('01/01/2001' + protractor.Key.TAB + '02:30AM');
    expect(await this.getSentDateInput()).to.contain('2001-01-01T02:30');
    await waitUntilDisplayed(this.saveButton);
    await this.formatSelectLastOption();
    await waitUntilDisplayed(this.saveButton);
    await this.setUserIdInput('5');
    expect(await this.getUserIdInput()).to.eq('5');
    await waitUntilDisplayed(this.saveButton);
    await this.setProductIdInput('5');
    expect(await this.getProductIdInput()).to.eq('5');
    await this.save();
    await waitUntilHidden(this.saveButton);
    expect(await isVisible(this.saveButton)).to.be.false;
  }
}
