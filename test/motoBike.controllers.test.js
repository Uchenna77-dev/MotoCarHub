const chai = require('chai');
const sinon = require('sinon');
const { ObjectId } = require('mongodb');
const expect = chai.expect;

const motoBikesController = require('../controllers/motoBikes'); // adjust path
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

  it('getAllMotoBikes should return 200 and list of motoBikes', async () => {
    const motoBike = [{ make: 'BMW' }];
    collectionStub.find().toArray.resolves(motoBike);
    await motoBikesController.getAllMotoBikes(req, res);
    expect(res.status.calledWith(200)).to.be.true;
    expect(res.json.calledWith(sample)).to.be.true;
  });

  it('getMotoBikeById should return 400 for invalid ObjectId', async () => {
    req.params.id = 'invalid';
    await motoBikesController.getMotoBikeById(req, res);
    expect(res.status.calledWith(400)).to.be.true;
  });

  it('getMotoBikeById should return 404 if not found', async () => {
    req.params.id = new ObjectId().toString();
    collectionStub.findOne.resolves(null);
    await motoBikesController.getMotoBikeById(req, res);
    expect(res.status.calledWith(404)).to.be.true;
  });

  it('getMotoBikeById should return 200 and car', async () => {
    req.params.id = new ObjectId().toString();
    const motoBike = { _id: new ObjectId(), make: 'BMW' };
    collectionStub.findOne.resolves(motoBike);
    await motoBikesController.getMotoBikeById(req, res);
    expect(res.status.calledWith(200)).to.be.true;
    expect(res.json.calledWith(car)).to.be.true;
  });
});
