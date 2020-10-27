import { browser, element, by } from 'protractor';

import NavBarPage from './../../../page-objects/navbar-page';
import SignInPage from './../../../page-objects/signin-page';
import OrderItemComponentsPage from './order-item.page-object';
import OrderItemUpdatePage from './order-item-update.page-object';
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

describe('OrderItem e2e test', () => {
  let navBarPage: NavBarPage;
  let signInPage: SignInPage;
  let orderItemComponentsPage: OrderItemComponentsPage;
  let orderItemUpdatePage: OrderItemUpdatePage;

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
    orderItemComponentsPage = new OrderItemComponentsPage();
    orderItemComponentsPage = await orderItemComponentsPage.goToPage(navBarPage);
  });

  it('should load OrderItems', async () => {
    expect(await orderItemComponentsPage.title.getText()).to.match(/Order Items/);
    expect(await orderItemComponentsPage.createButton.isEnabled()).to.be.true;
  });

  /* it('should create and delete OrderItems', async () => {
        const beforeRecordsCount = await isVisible(orderItemComponentsPage.noRecords) ? 0 : await getRecordsCount(orderItemComponentsPage.table);
        orderItemUpdatePage = await orderItemComponentsPage.goToCreateOrderItem();
        await orderItemUpdatePage.enterData();

        expect(await orderItemComponentsPage.createButton.isEnabled()).to.be.true;
        await waitUntilDisplayed(orderItemComponentsPage.table);
        await waitUntilCount(orderItemComponentsPage.records, beforeRecordsCount + 1);
        expect(await orderItemComponentsPage.records.count()).to.eq(beforeRecordsCount + 1);
        
        await orderItemComponentsPage.deleteOrderItem();
        if(beforeRecordsCount !== 0) { 
          await waitUntilCount(orderItemComponentsPage.records, beforeRecordsCount);
          expect(await orderItemComponentsPage.records.count()).to.eq(beforeRecordsCount);
        } else {
          await waitUntilDisplayed(orderItemComponentsPage.noRecords);
        }
    }); */

  after(async () => {
    await navBarPage.autoSignOut();
  });
});
