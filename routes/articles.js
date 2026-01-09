const express = require('express');
const Article = require('../models/Article');
const router = express.Router();

// GET /api/articles - Get all published articles
router.get('/', async (req, res) => {
  try {
    const { category, search, limit = 50, page = 1 } = req.query;

    const query = { isPublished: true };

    // Filter by category
    if (category) {
      query.category = category;
    }

    // Search functionality
    if (search) {
      query.$text = { $search: search };
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const articles = await Article.find(query)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(skip)
      .select('-__v');

    const total = await Article.countDocuments(query);

    res.json({
      success: true,
      data: articles,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    console.error('Error fetching articles:', error);
    res.status(500).json({ error: 'Failed to fetch articles' });
  }
});

// GET /api/articles/:id - Get single article by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const article = await Article.findById(id).select('-__v');

    if (!article) {
      return res.status(404).json({ error: 'Article not found' });
    }

    // Increment view count
    article.views += 1;
    await article.save();

    res.json({
      success: true,
      data: article,
    });
  } catch (error) {
    console.error('Error fetching article:', error);
    res.status(500).json({ error: 'Failed to fetch article' });
  }
});

// GET /api/articles/categories/list - Get all categories
router.get('/categories/list', async (req, res) => {
  try {
    const categories = await Article.distinct('category', { isPublished: true });
    res.json({
      success: true,
      data: categories,
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

module.exports = router;
