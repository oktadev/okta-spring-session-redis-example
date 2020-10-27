import { browser, element, by } from 'protractor';

import NavBarPage from './../../../page-objects/navbar-page';
import SignInPage from './../../../page-objects/signin-page';
import ProductOrderComponentsPage from './product-order.page-object';
import ProductOrderUpdatePage from './product-order-update.page-object';
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

describe('ProductOrder e2e test', () => {
  let navBarPage: NavBarPage;
  let signInPage: SignInPage;
  let productOrderComponentsPage: ProductOrderComponentsPage;
  let productOrderUpdatePage: ProductOrderUpdatePage;

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
    productOrderComponentsPage = new ProductOrderComponentsPage();
    productOrderComponentsPage = await productOrderComponentsPage.goToPage(navBarPage);
  });

  it('should load ProductOrders', async () => {
    expect(await productOrderComponentsPage.title.getText()).to.match(/Product Orders/);
    expect(await productOrderComponentsPage.createButton.isEnabled()).to.be.true;
  });

  it('should create and delete ProductOrders', async () => {
    const beforeRecordsCount = (await isVisible(productOrderComponentsPage.noRecords))
      ? 0
      : await getRecordsCount(productOrderComponentsPage.table);
    productOrderUpdatePage = await productOrderComponentsPage.goToCreateProductOrder();
    await productOrderUpdatePage.enterData();

    expect(await productOrderComponentsPage.createButton.isEnabled()).to.be.true;
    await waitUntilDisplayed(productOrderComponentsPage.table);
    await waitUntilCount(productOrderComponentsPage.records, beforeRecordsCount + 1);
    expect(await productOrderComponentsPage.records.count()).to.eq(beforeRecordsCount + 1);

    await productOrderComponentsPage.deleteProductOrder();
    if (beforeRecordsCount !== 0) {
      await waitUntilCount(productOrderComponentsPage.records, beforeRecordsCount);
      expect(await productOrderComponentsPage.records.count()).to.eq(beforeRecordsCount);
    } else {
      await waitUntilDisplayed(productOrderComponentsPage.noRecords);
    }
  });

  after(async () => {
    await navBarPage.autoSignOut();
  });
});
