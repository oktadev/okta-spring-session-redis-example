import { entityItemSelector } from '../../support/commands';
import {
  entityTableSelector,
  entityDetailsButtonSelector,
  entityDetailsBackButtonSelector,
  entityCreateButtonSelector,
  entityCreateSaveButtonSelector,
  entityCreateCancelButtonSelector,
  entityEditButtonSelector,
  entityDeleteButtonSelector,
  entityConfirmDeleteButtonSelector,
} from '../../support/entity';

describe('Invoice e2e test', () => {
  const invoicePageUrl = '/invoice';
  const invoicePageUrlPattern = new RegExp('/invoice(\\?.*)?$');
  const username = Cypress.env('E2E_USERNAME') ?? 'user';
  const password = Cypress.env('E2E_PASSWORD') ?? 'user';
  const invoiceSample = {
    code: 'microchip',
    date: '2022-02-15T02:05:41.017Z',
    status: 'PAID',
    paymentMethod: 'CASH_ON_DELIVERY',
    paymentDate: '2022-02-15T04:21:08.769Z',
    paymentAmount: 43049,
  };

  let invoice: any;

  beforeEach(() => {
    cy.login(username, password);
  });

  beforeEach(() => {
    cy.intercept('GET', '/services/invoice/api/invoices+(?*|)').as('entitiesRequest');
    cy.intercept('POST', '/services/invoice/api/invoices').as('postEntityRequest');
    cy.intercept('DELETE', '/services/invoice/api/invoices/*').as('deleteEntityRequest');
  });

  afterEach(() => {
    if (invoice) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/services/invoice/api/invoices/${invoice.id}`,
      }).then(() => {
        invoice = undefined;
      });
    }
  });

  it('Invoices menu should load Invoices page', () => {
    cy.visit('/');
    cy.clickOnEntityMenuItem('invoice');
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response!.body.length === 0) {
        cy.get(entityTableSelector).should('not.exist');
      } else {
        cy.get(entityTableSelector).should('exist');
      }
    });
    cy.getEntityHeading('Invoice').should('exist');
    cy.url().should('match', invoicePageUrlPattern);
  });

  describe('Invoice page', () => {
    describe('create button click', () => {
      beforeEach(() => {
        cy.visit(invoicePageUrl);
        cy.wait('@entitiesRequest');
      });

      it('should load create Invoice page', () => {
        cy.get(entityCreateButtonSelector).click();
        cy.url().should('match', new RegExp('/invoice/new$'));
        cy.getEntityCreateUpdateHeading('Invoice');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', invoicePageUrlPattern);
      });
    });

    describe('with existing value', () => {
      beforeEach(() => {
        cy.authenticatedRequest({
          method: 'POST',
          url: '/services/invoice/api/invoices',
          body: invoiceSample,
        }).then(({ body }) => {
          invoice = body;

          cy.intercept(
            {
              method: 'GET',
              url: '/services/invoice/api/invoices+(?*|)',
              times: 1,
            },
            {
              statusCode: 200,
              headers: {
                link: '<http://localhost/services/invoice/api/invoices?page=0&size=20>; rel="last",<http://localhost/services/invoice/api/invoices?page=0&size=20>; rel="first"',
              },
              body: [invoice],
            }
          ).as('entitiesRequestInternal');
        });

        cy.visit(invoicePageUrl);

        cy.wait('@entitiesRequestInternal');
      });

      it('detail button click should load details Invoice page', () => {
        cy.get(entityDetailsButtonSelector).first().click();
        cy.getEntityDetailsHeading('invoice');
        cy.get(entityDetailsBackButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', invoicePageUrlPattern);
      });

      it('edit button click should load edit Invoice page', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('Invoice');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', invoicePageUrlPattern);
      });

      it('last delete button click should delete instance of Invoice', () => {
        cy.intercept('GET', '/services/invoice/api/invoices/*').as('dialogDeleteRequest');
        cy.get(entityDeleteButtonSelector).last().click();
        cy.wait('@dialogDeleteRequest');
        cy.getEntityDeleteDialogHeading('invoice').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click();
        cy.wait('@deleteEntityRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(204);
        });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', invoicePageUrlPattern);

        invoice = undefined;
      });
    });
  });

  describe('new Invoice page', () => {
    beforeEach(() => {
      cy.visit(`${invoicePageUrl}`);
      cy.get(entityCreateButtonSelector).click();
      cy.getEntityCreateUpdateHeading('Invoice');
    });

    it('should create an instance of Invoice', () => {
      cy.get(`[data-cy="code"]`).type('Universal Central').should('have.value', 'Universal Central');

      cy.get(`[data-cy="date"]`).type('2022-02-15T09:19').should('have.value', '2022-02-15T09:19');

      cy.get(`[data-cy="details"]`).type('Knoll').should('have.value', 'Knoll');

      cy.get(`[data-cy="status"]`).select('PAID');

      cy.get(`[data-cy="paymentMethod"]`).select('PAYPAL');

      cy.get(`[data-cy="paymentDate"]`).type('2022-02-15T02:47').should('have.value', '2022-02-15T02:47');

      cy.get(`[data-cy="paymentAmount"]`).type('85705').should('have.value', '85705');

      cy.get(entityCreateSaveButtonSelector).click();

      cy.wait('@postEntityRequest').then(({ response }) => {
        expect(response!.statusCode).to.equal(201);
        invoice = response!.body;
      });
      cy.wait('@entitiesRequest').then(({ response }) => {
        expect(response!.statusCode).to.equal(200);
      });
      cy.url().should('match', invoicePageUrlPattern);
    });
  });
});
