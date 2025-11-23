# Test API Endpoints

Test the API endpoints to verify functionality:

```bash
# Test root endpoint
curl http://localhost:8000/

# Get all news articles
curl http://localhost:8000/news

# Get articles from a specific source (e.g., guardian, bbc, nytimes)
curl http://localhost:8000/news/guardian
```
