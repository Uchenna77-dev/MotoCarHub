const validator = require('../validator/validate');

// Validation for Cars
const saveCars = (req, res, next) => {
  const validationRule = {
    make: 'required|string',
    model: 'required|string',
    year: 'required|numeric',
    color: 'required|string',
    price: 'required|numeric',
    engineType: 'required|string',
    countryOfManufacture:'required|string'
  };

  validator(req.body, validationRule, {}, (err, status) => {
    if (!status) {
      res.status(412).send({
        success: false,
        message: 'Validation failed',
        data: err
      });
    } else {
      next();
    }
  });
}
  
// Validation for Motobikes
  const saveMotoBikes = (req, res, next) => {
  const validationRule = {
    make: 'required|string',
    model: 'required|string',
    year: 'required|numeric',
    engineType: 'required|string',
    countryOfManufacture:'required|string'
  };

  validator(req.body, validationRule, {}, (err, status) => {
    if (!status) {
      res.status(412).send({
        success: false,
        message: 'Validation failed',
        data: err
      });
    } else {
      next();
    }
  });
};

// Validation for dealerShips
const saveDealerShips = (req, res, next) => {
  const validationRule = {
    name: 'required|string',
    location: 'required|string',
    contact: 'required|string',
    manager: 'required|string',
    inventoryCapacity: 'required|numeric'
  };

  validator(req.body, validationRule, {}, (err, status) => {
    if (!status) {
      res.status(412).send({
        success: false,
        message: 'Validation failed',
        data: err
      });
    } else {
      next();
    }
  });
};

// Validation for users
const saveUsers = (req, res, next) => {
  const validationRule = {
    username: 'required|string',
    password: 'required|string|min:6',
    email: 'required|email',
    role: 'required|string',
    phone: 'required|string'
  };

  validator(req.body, validationRule, {}, (err, status) => {
    if (!status) {
      res.status(412).send({
        success: false,
        message: 'Validation failed',
        data: err
      });
    } else {
      next();
    }
  });
};

module.exports = {
  saveCars,
  saveMotoBikes,
  saveUsers,
  saveDealerShips
};