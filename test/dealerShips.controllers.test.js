const chai = require('chai');
const sinon = require('sinon');
const { ObjectId } = require('mongodb');
const expect = chai.expect;

const dealerShipsController = require('../controllers/dealerShips'); // adjust path
const connect = require('../db/connect');

describe(' DealerShips Controller - GET Endpoints', () => {
  let req, res, sandbox, dbStub, collectionStub;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
    req = { params: {} };
    res = {
      status: sandbox.stub().returnsThis(),
      json: sandbox.stub(),
    };
    collectionStub = { find: sandbox.stub().returns({ toArray: sandbox.stub() }), findOne: sandbox.stub() };
    dbStub = { db: sandbox.stub().returns({ collection: () => collectionStub }) };
    sandbox.stub(connect, 'getDb').returns(dbStub);
  });

  afterEach(() => sandbox.restore());

  it('getAllDealerShips should return 200 and list of dealerShips', async () => {
    const dealerShip = [{ name: 'MegaAuto Zone' }];
    collectionStub.find().toArray.resolves(dealerShip);
    await carsController.getAllDealerShipss(req, res);
    expect(res.status.calledWith(200)).to.be.true;
    expect(res.json.calledWith(dealerShip)).to.be.true;
  });

  it('getDealerShipById should return 400 for invalid ObjectId', async () => {
    req.params.id = 'invalid';
    await dealerShipsController.getDealerShipById(req, res);
    expect(res.status.calledWith(400)).to.be.true;
  });

  it('getDearlerShipById should return 404 if not found', async () => {
    req.params.id = new ObjectId().toString();
    collectionStub.findOne.resolves(null);
    await dealerShipsController.getDealerShipsById(req, res);
    expect(res.status.calledWith(404)).to.be.true;
  });

  it('getDealerShipById should return 200 and dealerShip', async () => {
    req.params.id = new ObjectId().toString();
    const dealerShip = { _id: new ObjectId(), name: 'MegaAuto Zone' };
    collectionStub.findOne.resolves(dealerShip);
    await dealerShipsController.getDealerShipsById(req, res);
    expect(res.status.calledWith(200)).to.be.true;
    expect(res.json.calledWith(car)).to.be.true;
  });
});
