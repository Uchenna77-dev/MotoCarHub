const chai = require('chai');
const sinon = require('sinon');
const { ObjectId } = require('mongodb');
const expect = chai.expect;

const motoBikesController = require('../controllers/motoBikes');
const connect = require('../db/connect');

describe('MotoBikes Controller - GET Endpoints', () => {
  let req, res, sandbox, collectionStub, dbStub;

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    req = { params: {} };
    res = {
      status: sandbox.stub().returnsThis(),
      json: sandbox.stub(),
    };

    collectionStub = {
      find: sandbox.stub().returns({ toArray: sandbox.stub() }),
      findOne: sandbox.stub(),
    };

    dbStub = {
      db: sandbox.stub().returns({
        collection: sandbox.stub().returns(collectionStub),
      }),
    };

    sandbox.stub(connect, 'getDb').returns(dbStub);
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('getAllMotoBikes should return 200 and list of motoBikes', async () => {
    const motoBikes = [{ make: 'BMW' }];
    collectionStub.find().toArray.resolves(motoBikes);

    await motoBikesController.getAllMotoBikes(req, res);

    expect(res.status.calledOnceWithExactly(200)).to.be.true;
    expect(res.json.calledOnceWithExactly(motoBikes)).to.be.true;
  });

  it('getMotoBikeById should return 400 for invalid ObjectId', async () => {
    req.params.id = 'invalid';

    await motoBikesController.getMotoBikeById(req, res);

    expect(res.status.calledOnceWithExactly(400)).to.be.true;
    expect(res.json.calledOnce).to.be.true;
  });

  it('getMotoBikeById should return 404 if not found', async () => {
    req.params.id = new ObjectId().toString();
    collectionStub.findOne.resolves(null);

    await motoBikesController.getMotoBikeById(req, res);

    expect(res.status.calledOnceWithExactly(404)).to.be.true;
    expect(res.json.calledOnce).to.be.true;
  });

  it('getMotoBikeById should return 200 and motoBike', async () => {
    req.params.id = new ObjectId().toString();
    const motoBike = { _id: new ObjectId(), make: 'BMW' };
    collectionStub.findOne.resolves(motoBike);

    await motoBikesController.getMotoBikeById(req, res);

    expect(res.status.calledOnceWithExactly(200)).to.be.true;
    expect(res.json.calledOnceWithExactly(motoBike)).to.be.true;
  });
});
