const Formula = require('../models/Formula');

class FormulaController {
  async createFormula(req, res) {
    try {
      const { name, description, expression, parameters, is_template } = req.body;
      
      const formula = new Formula({
        name,
        description,
        expression,
        parameters,
        is_template
      });
      
      await formula.save();
      
      res.status(201).json(formula);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getFormula(req, res) {
    try {
      const { id } = req.params;
      const formula = await Formula.findById(id);
      
      if (!formula) {
        return res.status(404).json({ error: 'Formula not found' });
      }
      
      res.json(formula);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getAllFormulas(req, res) {
    try {
      const formulas = await Formula.find();
      res.json(formulas);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getFormulaTemplates(req, res) {
    try {
      const templates = await Formula.find({ is_template: true });
      res.json(templates);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async updateFormula(req, res) {
    try {
      const { id } = req.params;
      const updates = req.body;
      
      const formula = await Formula.findByIdAndUpdate(
        id,
        updates,
        { new: true }
      );
      
      if (!formula) {
        return res.status(404).json({ error: 'Formula not found' });
      }
      
      res.json(formula);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async deleteFormula(req, res) {
    try {
      const { id } = req.params;
      
      const formula = await Formula.findByIdAndDelete(id);
      
      if (!formula) {
        return res.status(404).json({ error: 'Formula not found' });
      }
      
      res.json({ message: 'Formula deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = new FormulaController();