import express from 'express';
const router = express.Router();

// ✅ Import models using ES modules
import HealthGuide from '../models/HealthGuide.js';
import Immunization from '../models/Immunization.js';

// === HEALTH TIP ROUTES ===
router.get('/health-tips', async (req, res) => {
  try {
    const tips = await HealthGuide.find();
    res.json(tips);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/health-tips', async (req, res) => {
  try {
    const tip = new HealthGuide(req.body);
    await tip.save();
    res.status(201).json(tip);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// === VACCINATION SCHEDULE ROUTES ===
router.get('/vaccination-schedules', async (req, res) => {
  try {
    const schedules = await Immunization.find();
    res.json(schedules);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/vaccination-schedules', async (req, res) => {
  try {
    const schedule = new Immunization(req.body);
    await schedule.save();
    res.status(201).json(schedule);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// === MEDICAL RESOURCE ROUTES ===
router.get('/medical-resources', async (req, res) => {
  try {
    const resources = await MedicalResource.find();
    res.json(resources);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/medical-resources', async (req, res) => {
  try {
    const resource = new MedicalResource(req.body);
    await resource.save();
    res.status(201).json(resource);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ✅ Export router
export default router;
