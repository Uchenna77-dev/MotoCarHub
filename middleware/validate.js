const validator = require('../validator/validate');

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

module.exports = {
  saveCars,
  saveMotoBikes
};