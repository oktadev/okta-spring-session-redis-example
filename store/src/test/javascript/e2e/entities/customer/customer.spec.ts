import { browser, element, by } from 'protractor';

import NavBarPage from './../../page-objects/navbar-page';
import SignInPage from './../../page-objects/signin-page';
import CustomerComponentsPage from './customer.page-object';
import CustomerUpdatePage from './customer-update.page-object';
import {
  waitUntilDisplayed,
  waitUntilAnyDisplayed,
  click,
  getRecordsCount,
  waitUntilHidden,
  waitUntilCount,
  isVisible,
} from '../../util/utils';

const expect = chai.expect;

describe('Customer e2e test', () => {
  let navBarPage: NavBarPage;
  let signInPage: SignInPage;
  let customerComponentsPage: CustomerComponentsPage;
  let customerUpdatePage: CustomerUpdatePage;

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
    customerComponentsPage = new CustomerComponentsPage();
    customerComponentsPage = await customerComponentsPage.goToPage(navBarPage);
  });

  it('should load Customers', async () => {
    expect(await customerComponentsPage.title.getText()).to.match(/Customers/);
    expect(await customerComponentsPage.createButton.isEnabled()).to.be.true;
  });

  /* it('should create and delete Customers', async () => {
        const beforeRecordsCount = await isVisible(customerComponentsPage.noRecords) ? 0 : await getRecordsCount(customerComponentsPage.table);
        customerUpdatePage = await customerComponentsPage.goToCreateCustomer();
        await customerUpdatePage.enterData();

        expect(await customerComponentsPage.createButton.isEnabled()).to.be.true;
        await waitUntilDisplayed(customerComponentsPage.table);
        await waitUntilCount(customerComponentsPage.records, beforeRecordsCount + 1);
        expect(await customerComponentsPage.records.count()).to.eq(beforeRecordsCount + 1);
        
        await customerComponentsPage.deleteCustomer();
        if(beforeRecordsCount !== 0) { 
          await waitUntilCount(customerComponentsPage.records, beforeRecordsCount);
          expect(await customerComponentsPage.records.count()).to.eq(beforeRecordsCount);
        } else {
          await waitUntilDisplayed(customerComponentsPage.noRecords);
        }
    }); */

  after(async () => {
    await navBarPage.autoSignOut();
  });
});
