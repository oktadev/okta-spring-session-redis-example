import { combineReducers } from 'redux';
import { loadingBarReducer as loadingBar } from 'react-redux-loading-bar';

import locale, { LocaleState } from './locale';
import authentication, { AuthenticationState } from './authentication';
import applicationProfile, { ApplicationProfileState } from './application-profile';

import administration, { AdministrationState } from 'app/modules/administration/administration.reducer';
import userManagement, { UserManagementState } from './user-management';
// prettier-ignore
import customer, {
  CustomerState
} from 'app/entities/customer/customer.reducer';
// prettier-ignore
import product, {
  ProductState
} from 'app/entities/product/product/product.reducer';
// prettier-ignore
import productCategory, {
  ProductCategoryState
} from 'app/entities/product/product-category/product-category.reducer';
// prettier-ignore
import productOrder, {
  ProductOrderState
} from 'app/entities/product/product-order/product-order.reducer';
// prettier-ignore
import orderItem, {
  OrderItemState
} from 'app/entities/product/order-item/order-item.reducer';
// prettier-ignore
import invoice, {
  InvoiceState
} from 'app/entities/invoice/invoice/invoice.reducer';
// prettier-ignore
import shipment, {
  ShipmentState
} from 'app/entities/invoice/shipment/shipment.reducer';
// prettier-ignore
import notification, {
  NotificationState
} from 'app/entities/notification/notification/notification.reducer';
/* jhipster-needle-add-reducer-import - JHipster will add reducer here */

export interface IRootState {
  readonly authentication: AuthenticationState;
  readonly locale: LocaleState;
  readonly applicationProfile: ApplicationProfileState;
  readonly administration: AdministrationState;
  readonly userManagement: UserManagementState;
  readonly customer: CustomerState;
  readonly product: ProductState;
  readonly productCategory: ProductCategoryState;
  readonly productOrder: ProductOrderState;
  readonly orderItem: OrderItemState;
  readonly invoice: InvoiceState;
  readonly shipment: ShipmentState;
  readonly notification: NotificationState;
  /* jhipster-needle-add-reducer-type - JHipster will add reducer type here */
  readonly loadingBar: any;
}

const rootReducer = combineReducers<IRootState>({
  authentication,
  locale,
  applicationProfile,
  administration,
  userManagement,
  customer,
  product,
  productCategory,
  productOrder,
  orderItem,
  invoice,
  shipment,
  notification,
  /* jhipster-needle-add-reducer-combine - JHipster will add reducer here */
  loadingBar,
});

export default rootReducer;
