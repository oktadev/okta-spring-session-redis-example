import { browser, element, by } from 'protractor';

import NavBarPage from './../../../page-objects/navbar-page';
import SignInPage from './../../../page-objects/signin-page';
import ShipmentComponentsPage from './shipment.page-object';
import ShipmentUpdatePage from './shipment-update.page-object';
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

describe('Shipment e2e test', () => {
  let navBarPage: NavBarPage;
  let signInPage: SignInPage;
  let shipmentComponentsPage: ShipmentComponentsPage;
  let shipmentUpdatePage: ShipmentUpdatePage;

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
    shipmentComponentsPage = new ShipmentComponentsPage();
    shipmentComponentsPage = await shipmentComponentsPage.goToPage(navBarPage);
  });

  it('should load Shipments', async () => {
    expect(await shipmentComponentsPage.title.getText()).to.match(/Shipments/);
    expect(await shipmentComponentsPage.createButton.isEnabled()).to.be.true;
  });

  /* it('should create and delete Shipments', async () => {
        const beforeRecordsCount = await isVisible(shipmentComponentsPage.noRecords) ? 0 : await getRecordsCount(shipmentComponentsPage.table);
        shipmentUpdatePage = await shipmentComponentsPage.goToCreateShipment();
        await shipmentUpdatePage.enterData();

        expect(await shipmentComponentsPage.createButton.isEnabled()).to.be.true;
        await waitUntilDisplayed(shipmentComponentsPage.table);
        await waitUntilCount(shipmentComponentsPage.records, beforeRecordsCount + 1);
        expect(await shipmentComponentsPage.records.count()).to.eq(beforeRecordsCount + 1);
        
        await shipmentComponentsPage.deleteShipment();
        if(beforeRecordsCount !== 0) { 
          await waitUntilCount(shipmentComponentsPage.records, beforeRecordsCount);
          expect(await shipmentComponentsPage.records.count()).to.eq(beforeRecordsCount);
        } else {
          await waitUntilDisplayed(shipmentComponentsPage.noRecords);
        }
    }); */

  after(async () => {
    await navBarPage.autoSignOut();
  });
});
