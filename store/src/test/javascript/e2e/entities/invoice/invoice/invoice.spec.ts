import { browser, element, by } from 'protractor';

import NavBarPage from './../../../page-objects/navbar-page';
import SignInPage from './../../../page-objects/signin-page';
import InvoiceComponentsPage from './invoice.page-object';
import InvoiceUpdatePage from './invoice-update.page-object';
import {
  waitUntilDisplayed,
  waitUntilAnyDisplayed,
  click,
  getRecordsCount,
  waitUntilHidden,
  waitUntilCount,
  isVisible,
} from '../../../util/utils';

const expect = chai.expect;

describe('Invoice e2e test', () => {
  let navBarPage: NavBarPage;
  let signInPage: SignInPage;
  let invoiceComponentsPage: InvoiceComponentsPage;
  let invoiceUpdatePage: InvoiceUpdatePage;

  before(async () => {
    await browser.get('/');
    navBarPage = new NavBarPage();
    signInPage = await navBarPage.getSignInPage();
    await signInPage.loginWithOAuth('admin', 'admin');
    await waitUntilDisplayed(navBarPage.entityMenu);
    await waitUntilDisplayed(navBarPage.adminMenu);
    await waitUntilDisplayed(navBarPage.accountMenu);
  });

  beforeEach(async () => {
    await browser.get('/');
    await waitUntilDisplayed(navBarPage.entityMenu);
    invoiceComponentsPage = new InvoiceComponentsPage();
    invoiceComponentsPage = await invoiceComponentsPage.goToPage(navBarPage);
  });

  it('should load Invoices', async () => {
    expect(await invoiceComponentsPage.title.getText()).to.match(/Invoices/);
    expect(await invoiceComponentsPage.createButton.isEnabled()).to.be.true;
  });

  it('should create and delete Invoices', async () => {
    const beforeRecordsCount = (await isVisible(invoiceComponentsPage.noRecords)) ? 0 : await getRecordsCount(invoiceComponentsPage.table);
    invoiceUpdatePage = await invoiceComponentsPage.goToCreateInvoice();
    await invoiceUpdatePage.enterData();

    expect(await invoiceComponentsPage.createButton.isEnabled()).to.be.true;
    await waitUntilDisplayed(invoiceComponentsPage.table);
    await waitUntilCount(invoiceComponentsPage.records, beforeRecordsCount + 1);
    expect(await invoiceComponentsPage.records.count()).to.eq(beforeRecordsCount + 1);

    await invoiceComponentsPage.deleteInvoice();
    if (beforeRecordsCount !== 0) {
      await waitUntilCount(invoiceComponentsPage.records, beforeRecordsCount);
      expect(await invoiceComponentsPage.records.count()).to.eq(beforeRecordsCount);
    } else {
      await waitUntilDisplayed(invoiceComponentsPage.noRecords);
    }
  });

  after(async () => {
    await navBarPage.autoSignOut();
  });
});
