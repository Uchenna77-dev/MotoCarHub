const chai = require('chai');
const sinon = require('sinon');
const { ObjectId } = require('mongodb');
const expect = chai.expect;

const carsController = require('../controllers/contact'); // adjust path
const connect = require('../db/connect');

describe('Cars Controller - GET Endpoints', () => {
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

  it('getAllCars should return 200 and list of cars', async () => {
    const sample = [{ make: 'Ford' }];
    collectionStub.find().toArray.resolves(sample);
    await carsController.getAllCars(req, res);
    expect(res.status.calledWith(200)).to.be.true;
    expect(res.json.calledWith(sample)).to.be.true;
  });

  it('getCarById should return 400 for invalid ObjectId', async () => {
    req.params.id = 'invalid';
    await carsController.getCarById(req, res);
    expect(res.status.calledWith(400)).to.be.true;
  });

  it('getCarById should return 404 if not found', async () => {
    req.params.id = new ObjectId().toString();
    collectionStub.findOne.resolves(null);
    await carsController.getCarById(req, res);
    expect(res.status.calledWith(404)).to.be.true;
  });

  it('getCarById should return 200 and car', async () => {
    req.params.id = new ObjectId().toString();
    const car = { _id: new ObjectId(), make: 'Honda' };
    collectionStub.findOne.resolves(car);
    await carsController.getCarById(req, res);
    expect(res.status.calledWith(200)).to.be.true;
    expect(res.json.calledWith(car)).to.be.true;
  });
});
