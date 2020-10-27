import { browser, element, by } from 'protractor';

import NavBarPage from './../../../page-objects/navbar-page';
import SignInPage from './../../../page-objects/signin-page';
import NotificationComponentsPage from './notification.page-object';
import NotificationUpdatePage from './notification-update.page-object';
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

describe('Notification e2e test', () => {
  let navBarPage: NavBarPage;
  let signInPage: SignInPage;
  let notificationComponentsPage: NotificationComponentsPage;
  let notificationUpdatePage: NotificationUpdatePage;

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
    notificationComponentsPage = new NotificationComponentsPage();
    notificationComponentsPage = await notificationComponentsPage.goToPage(navBarPage);
  });

  it('should load Notifications', async () => {
    expect(await notificationComponentsPage.title.getText()).to.match(/Notifications/);
    expect(await notificationComponentsPage.createButton.isEnabled()).to.be.true;
  });

  it('should create and delete Notifications', async () => {
    const beforeRecordsCount = (await isVisible(notificationComponentsPage.noRecords))
      ? 0
      : await getRecordsCount(notificationComponentsPage.table);
    notificationUpdatePage = await notificationComponentsPage.goToCreateNotification();
    await notificationUpdatePage.enterData();

    expect(await notificationComponentsPage.createButton.isEnabled()).to.be.true;
    await waitUntilDisplayed(notificationComponentsPage.table);
    await waitUntilCount(notificationComponentsPage.records, beforeRecordsCount + 1);
    expect(await notificationComponentsPage.records.count()).to.eq(beforeRecordsCount + 1);

    await notificationComponentsPage.deleteNotification();
    if (beforeRecordsCount !== 0) {
      await waitUntilCount(notificationComponentsPage.records, beforeRecordsCount);
      expect(await notificationComponentsPage.records.count()).to.eq(beforeRecordsCount);
    } else {
      await waitUntilDisplayed(notificationComponentsPage.noRecords);
    }
  });

  after(async () => {
    await navBarPage.autoSignOut();
  });
});
