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

describe('Shipment e2e test', () => {
  const shipmentPageUrl = '/shipment';
  const shipmentPageUrlPattern = new RegExp('/shipment(\\?.*)?$');
  const username = Cypress.env('E2E_USERNAME') ?? 'user';
  const password = Cypress.env('E2E_PASSWORD') ?? 'user';
  const shipmentSample = { date: '2022-02-15T09:43:58.621Z' };

  let shipment: any;
  let invoice: any;

  beforeEach(() => {
    cy.login(username, password);
  });

  beforeEach(() => {
    // create an instance at the required relationship entity:
    cy.authenticatedRequest({
      method: 'POST',
      url: '/services/invoice/api/invoices',
      body: {
        code: 'generation',
        date: '2022-02-15T15:08:56.046Z',
        details: 'Associate',
        status: 'PAID',
        paymentMethod: 'PAYPAL',
        paymentDate: '2022-02-15T08:35:11.870Z',
        paymentAmount: 13982,
      },
    }).then(({ body }) => {
      invoice = body;
    });
  });

  beforeEach(() => {
    cy.intercept('GET', '/services/invoice/api/shipments+(?*|)').as('entitiesRequest');
    cy.intercept('POST', '/services/invoice/api/shipments').as('postEntityRequest');
    cy.intercept('DELETE', '/services/invoice/api/shipments/*').as('deleteEntityRequest');
  });

  beforeEach(() => {
    // Simulate relationships api for better performance and reproducibility.
    cy.intercept('GET', '/services/invoice/api/invoices', {
      statusCode: 200,
      body: [invoice],
    });
  });

  afterEach(() => {
    if (shipment) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/services/invoice/api/shipments/${shipment.id}`,
      }).then(() => {
        shipment = undefined;
      });
    }
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

  it('Shipments menu should load Shipments page', () => {
    cy.visit('/');
    cy.clickOnEntityMenuItem('shipment');
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response!.body.length === 0) {
        cy.get(entityTableSelector).should('not.exist');
      } else {
        cy.get(entityTableSelector).should('exist');
      }
    });
    cy.getEntityHeading('Shipment').should('exist');
    cy.url().should('match', shipmentPageUrlPattern);
  });

  describe('Shipment page', () => {
    describe('create button click', () => {
      beforeEach(() => {
        cy.visit(shipmentPageUrl);
        cy.wait('@entitiesRequest');
      });

      it('should load create Shipment page', () => {
        cy.get(entityCreateButtonSelector).click();
        cy.url().should('match', new RegExp('/shipment/new$'));
        cy.getEntityCreateUpdateHeading('Shipment');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', shipmentPageUrlPattern);
      });
    });

    describe('with existing value', () => {
      beforeEach(() => {
        cy.authenticatedRequest({
          method: 'POST',
          url: '/services/invoice/api/shipments',
          body: {
            ...shipmentSample,
            invoice: invoice,
          },
        }).then(({ body }) => {
          shipment = body;

          cy.intercept(
            {
              method: 'GET',
              url: '/services/invoice/api/shipments+(?*|)',
              times: 1,
            },
            {
              statusCode: 200,
              headers: {
                link: '<http://localhost/services/invoice/api/shipments?page=0&size=20>; rel="last",<http://localhost/services/invoice/api/shipments?page=0&size=20>; rel="first"',
              },
              body: [shipment],
            }
          ).as('entitiesRequestInternal');
        });

        cy.visit(shipmentPageUrl);

        cy.wait('@entitiesRequestInternal');
      });

      it('detail button click should load details Shipment page', () => {
        cy.get(entityDetailsButtonSelector).first().click();
        cy.getEntityDetailsHeading('shipment');
        cy.get(entityDetailsBackButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', shipmentPageUrlPattern);
      });

      it('edit button click should load edit Shipment page', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('Shipment');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', shipmentPageUrlPattern);
      });

      it('last delete button click should delete instance of Shipment', () => {
        cy.intercept('GET', '/services/invoice/api/shipments/*').as('dialogDeleteRequest');
        cy.get(entityDeleteButtonSelector).last().click();
        cy.wait('@dialogDeleteRequest');
        cy.getEntityDeleteDialogHeading('shipment').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click();
        cy.wait('@deleteEntityRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(204);
        });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', shipmentPageUrlPattern);

        shipment = undefined;
      });
    });
  });

  describe('new Shipment page', () => {
    beforeEach(() => {
      cy.visit(`${shipmentPageUrl}`);
      cy.get(entityCreateButtonSelector).click();
      cy.getEntityCreateUpdateHeading('Shipment');
    });

    it('should create an instance of Shipment', () => {
      cy.get(`[data-cy="trackingCode"]`).type('Borders Intelligent pixel').should('have.value', 'Borders Intelligent pixel');

      cy.get(`[data-cy="date"]`).type('2022-02-15T14:13').should('have.value', '2022-02-15T14:13');

      cy.get(`[data-cy="details"]`).type('Keys index').should('have.value', 'Keys index');

      cy.get(`[data-cy="invoice"]`).select(1);

      cy.get(entityCreateSaveButtonSelector).click();

      cy.wait('@postEntityRequest').then(({ response }) => {
        expect(response!.statusCode).to.equal(201);
        shipment = response!.body;
      });
      cy.wait('@entitiesRequest').then(({ response }) => {
        expect(response!.statusCode).to.equal(200);
      });
      cy.url().should('match', shipmentPageUrlPattern);
    });
  });
});
