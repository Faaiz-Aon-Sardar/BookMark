import express from 'express';
import Collection from '../models/Collection.js';
import Bookmark from '../models/Bookmark.js';

const router = express.Router();

// GET /api/collections
router.get('/', async (req, res) => {
  try {
    const collections = await Collection.find().sort({ createdAt: -1 });
    const mapped = collections.map(c => {
      const json = c.toJSON();
      json.createdAt = json.createdAtTs;
      delete json.createdAtTs;
      return json;
    });
    res.json(mapped);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST /api/collections
router.post('/', async (req, res) => {
  try {
    const collection = new Collection(req.body);
    const saved = await collection.save();
    const json = saved.toJSON();
    json.createdAt = json.createdAtTs;
    delete json.createdAtTs;
    res.status(201).json(json);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// PUT /api/collections/:id
router.put('/:id', async (req, res) => {
  try {
    const updated = await Collection.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: 'Collection not found' });
    const json = updated.toJSON();
    json.createdAt = json.createdAtTs;
    delete json.createdAtTs;
    res.json(json);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE /api/collections/:id
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Collection.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Collection not found' });
    
    // Also remove this collection ID from all bookmarks that have it
    await Bookmark.updateMany(
      { collections: req.params.id },
      { $pull: { collections: req.params.id } }
    );
    
    res.json({ message: 'Collection deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
