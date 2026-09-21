import express from 'express';
import Bookmark from '../models/Bookmark.js';

const router = express.Router();

// GET /api/bookmarks
router.get('/', async (req, res) => {
  try {
    const bookmarks = await Bookmark.find().sort({ createdAt: -1 });
    // Map _id to id and createdAtTs to createdAt for frontend compatibility
    const mapped = bookmarks.map(b => {
      const json = b.toJSON();
      json.createdAt = json.createdAtTs;
      delete json.createdAtTs;
      return json;
    });
    res.json(mapped);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST /api/bookmarks
router.post('/', async (req, res) => {
  try {
    const bookmark = new Bookmark(req.body);
    const saved = await bookmark.save();
    const json = saved.toJSON();
    json.createdAt = json.createdAtTs;
    delete json.createdAtTs;
    res.status(201).json(json);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// PUT /api/bookmarks/:id
router.put('/:id', async (req, res) => {
  try {
    const updated = await Bookmark.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: 'Bookmark not found' });
    const json = updated.toJSON();
    json.createdAt = json.createdAtTs;
    delete json.createdAtTs;
    res.json(json);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE /api/bookmarks/:id
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Bookmark.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Bookmark not found' });
    res.json({ message: 'Bookmark deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// PUT /api/bookmarks/:id/favorite
router.put('/:id/favorite', async (req, res) => {
  try {
    const bookmark = await Bookmark.findById(req.params.id);
    if (!bookmark) return res.status(404).json({ message: 'Bookmark not found' });
    bookmark.isFavorite = !bookmark.isFavorite;
    await bookmark.save();
    const json = bookmark.toJSON();
    json.createdAt = json.createdAtTs;
    delete json.createdAtTs;
    res.json(json);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

export default router;
