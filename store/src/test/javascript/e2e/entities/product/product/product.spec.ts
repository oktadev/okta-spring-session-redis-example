import { browser, element, by } from 'protractor';

import NavBarPage from './../../../page-objects/navbar-page';
import SignInPage from './../../../page-objects/signin-page';
import ProductComponentsPage from './product.page-object';
import ProductUpdatePage from './product-update.page-object';
import {
  waitUntilDisplayed,
  waitUntilAnyDisplayed,
  click,
  getRecordsCount,
  waitUntilHidden,
  waitUntilCount,
  isVisible,
} from '../../../util/utils';
import path from 'path';

const expect = chai.expect;

describe('Product e2e test', () => {
  let navBarPage: NavBarPage;
  let signInPage: SignInPage;
  let productComponentsPage: ProductComponentsPage;
  let productUpdatePage: ProductUpdatePage;

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
    productComponentsPage = new ProductComponentsPage();
    productComponentsPage = await productComponentsPage.goToPage(navBarPage);
  });

  it('should load Products', async () => {
    expect(await productComponentsPage.title.getText()).to.match(/Products/);
    expect(await productComponentsPage.createButton.isEnabled()).to.be.true;
  });

  it('should create and delete Products', async () => {
    const beforeRecordsCount = (await isVisible(productComponentsPage.noRecords)) ? 0 : await getRecordsCount(productComponentsPage.table);
    productUpdatePage = await productComponentsPage.goToCreateProduct();
    await productUpdatePage.enterData();

    expect(await productComponentsPage.createButton.isEnabled()).to.be.true;
    await waitUntilDisplayed(productComponentsPage.table);
    await waitUntilCount(productComponentsPage.records, beforeRecordsCount + 1);
    expect(await productComponentsPage.records.count()).to.eq(beforeRecordsCount + 1);

    await productComponentsPage.deleteProduct();
    if (beforeRecordsCount !== 0) {
      await waitUntilCount(productComponentsPage.records, beforeRecordsCount);
      expect(await productComponentsPage.records.count()).to.eq(beforeRecordsCount);
    } else {
      await waitUntilDisplayed(productComponentsPage.noRecords);
    }
  });

  after(async () => {
    await navBarPage.autoSignOut();
  });
});
