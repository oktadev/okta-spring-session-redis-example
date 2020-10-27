import { browser, element, by } from 'protractor';

import NavBarPage from './../../../page-objects/navbar-page';
import SignInPage from './../../../page-objects/signin-page';
import ProductCategoryComponentsPage from './product-category.page-object';
import ProductCategoryUpdatePage from './product-category-update.page-object';
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

describe('ProductCategory e2e test', () => {
  let navBarPage: NavBarPage;
  let signInPage: SignInPage;
  let productCategoryComponentsPage: ProductCategoryComponentsPage;
  let productCategoryUpdatePage: ProductCategoryUpdatePage;

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
    productCategoryComponentsPage = new ProductCategoryComponentsPage();
    productCategoryComponentsPage = await productCategoryComponentsPage.goToPage(navBarPage);
  });

  it('should load ProductCategories', async () => {
    expect(await productCategoryComponentsPage.title.getText()).to.match(/Product Categories/);
    expect(await productCategoryComponentsPage.createButton.isEnabled()).to.be.true;
  });

  it('should create and delete ProductCategories', async () => {
    const beforeRecordsCount = (await isVisible(productCategoryComponentsPage.noRecords))
      ? 0
      : await getRecordsCount(productCategoryComponentsPage.table);
    productCategoryUpdatePage = await productCategoryComponentsPage.goToCreateProductCategory();
    await productCategoryUpdatePage.enterData();

    expect(await productCategoryComponentsPage.createButton.isEnabled()).to.be.true;
    await waitUntilDisplayed(productCategoryComponentsPage.table);
    await waitUntilCount(productCategoryComponentsPage.records, beforeRecordsCount + 1);
    expect(await productCategoryComponentsPage.records.count()).to.eq(beforeRecordsCount + 1);

    await productCategoryComponentsPage.deleteProductCategory();
    if (beforeRecordsCount !== 0) {
      await waitUntilCount(productCategoryComponentsPage.records, beforeRecordsCount);
      expect(await productCategoryComponentsPage.records.count()).to.eq(beforeRecordsCount);
    } else {
      await waitUntilDisplayed(productCategoryComponentsPage.noRecords);
    }
  });

  after(async () => {
    await navBarPage.autoSignOut();
  });
});
