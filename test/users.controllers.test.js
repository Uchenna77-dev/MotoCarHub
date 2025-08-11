const chai = require('chai');
const sinon = require('sinon');
const { ObjectId } = require('mongodb');
const expect = chai.expect;

const usersController = require('../controllers/users'); 
const connect = require('../db/connect');

describe('Users Controller - GET Endpoints', () => {
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

  it('getAllUsers should return 200 and list of users', async () => {
    const users = [{ role: 'Admin' }];
    collectionStub.find().toArray.resolves(users);

    await usersController.getAllUsers(req, res);

    expect(res.status.calledOnceWithExactly(200)).to.be.true;
    expect(res.json.calledOnceWithExactly(users)).to.be.true;
  });

  it('getUserById should return 400 for invalid ObjectId', async () => {
    req.params.id = 'invalid';

    await usersController.getUserById(req, res);

    expect(res.status.calledOnceWithExactly(400)).to.be.true;
    expect(res.json.calledOnce).to.be.true;
  });

  it('getUserById should return 404 if not found', async () => {
    req.params.id = new ObjectId().toString();
    collectionStub.findOne.resolves(null);

    await usersController.getUserById(req, res);

    expect(res.status.calledOnceWithExactly(404)).to.be.true;
    expect(res.json.calledOnce).to.be.true;
  });

  it('getUserById should return 200 and user', async () => {
    req.params.id = new ObjectId().toString();
    const user = { _id: new ObjectId(), role: 'Admin' };
    collectionStub.findOne.resolves(user);

    await usersController.getUserById(req, res);

    expect(res.status.calledOnceWithExactly(200)).to.be.true;
    expect(res.json.calledOnceWithExactly(user)).to.be.true;
  });
});
