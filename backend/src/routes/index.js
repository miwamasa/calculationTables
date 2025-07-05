const express = require('express');
const tableController = require('../controllers/tableController');
const cellController = require('../controllers/cellController');
const formulaController = require('../controllers/formulaController');

const router = express.Router();

// Table routes
router.post('/tables', tableController.createTable);
router.get('/tables', tableController.getAllTables);
router.get('/tables/:id', tableController.getTable);
router.put('/tables/:id', tableController.updateTable);
router.delete('/tables/:id', tableController.deleteTable);
router.get('/tables/:id/cells', tableController.getTableCells);

// Cell routes
router.post('/cells', cellController.createCell);
router.get('/cells/:id', cellController.getCell);
router.put('/cells/:id', cellController.updateCell);
router.delete('/cells/:id', cellController.deleteCell);
router.get('/cells/table/:tableId', cellController.getCellsByTable);
router.put('/tables/:tableId/cells/:rowId/:columnId', cellController.updateOrCreateCell);
router.post('/tables/:tableId/sample-data', cellController.createSampleData);
router.post('/tables/:tableId/rows', cellController.addRow);
router.delete('/tables/:tableId/rows/:rowId', cellController.deleteRow);
router.post('/tables/:tableId/cells/:rowId/:columnId/apply-formula', cellController.applyFormulaToCell);

// Formula routes
router.post('/formulas', formulaController.createFormula);
router.get('/formulas', formulaController.getAllFormulas);
router.get('/formulas/templates', formulaController.getFormulaTemplates);
router.get('/formulas/:id', formulaController.getFormula);
router.put('/formulas/:id', formulaController.updateFormula);
router.delete('/formulas/:id', formulaController.deleteFormula);

module.exports = router;