const chai = require('chai');
const sinon = require('sinon');
const { ObjectId } = require('mongodb');
const expect = chai.expect;

const carsController = require('../controllers/cars');
const connect = require('../db/connect');

describe('Cars Controller - GET Endpoints', () => {
  let req, res, sandbox, collectionStub, dbStub;

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    req = { params: {} };
    res = {
      status: sandbox.stub().returnsThis(),  // allows chaining like res.status(200).json(...)
      json: sandbox.stub(),
    };

    // Stub MongoDB collection methods
    collectionStub = {
      find: sandbox.stub().returns({ toArray: sandbox.stub() }),
      findOne: sandbox.stub(),
    };

    // Stub DB to return the collection stub
    dbStub = {
      db: sandbox.stub().returns({
        collection: sandbox.stub().returns(collectionStub),
      }),
    };

    // Stub connect.getDb() to return dbStub
    sandbox.stub(connect, 'getDb').returns(dbStub);
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('getAllCars should return 200 and list of cars', async () => {
    const cars = [{ make: 'Ford' }];
    collectionStub.find().toArray.resolves(cars);

    await carsController.getAllCars(req, res);

    expect(res.status.calledOnceWithExactly(200)).to.be.true;
    expect(res.json.calledOnceWithExactly(cars)).to.be.true;
  });

  it('getCarById should return 400 for invalid ObjectId', async () => {
    req.params.id = 'invalid';

    await carsController.getCarById(req, res);

    expect(res.status.calledOnceWithExactly(400)).to.be.true;
    expect(res.json.calledOnce).to.be.true; // usually error message json
  });

  it('getCarById should return 404 if not found', async () => {
    req.params.id = new ObjectId().toString();
    collectionStub.findOne.resolves(null);

    await carsController.getCarById(req, res);

    expect(res.status.calledOnceWithExactly(404)).to.be.true;
    expect(res.json.calledOnce).to.be.true; // usually error message json
  });

  it('getCarById should return 200 and car', async () => {
    req.params.id = new ObjectId().toString();
    const car = { _id: new ObjectId(), make: 'Honda' };
    collectionStub.findOne.resolves(car);

    await carsController.getCarById(req, res);

    expect(res.status.calledOnceWithExactly(200)).to.be.true;
    expect(res.json.calledOnceWithExactly(car)).to.be.true;
  });
});
