const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const dotenv = require('dotenv');
const cron = require('node-cron');
const winston = require('winston');

// Import our modules
const MatrixImporter = require('./src/modules/MatrixImporter');
const CompetitorScraper = require('./src/modules/CompetitorScraper');
const PricingStrategy = require('./src/modules/PricingStrategy');
const ERPIntegration = require('./src/modules/ERPIntegration');
const WorkflowController = require('./src/modules/WorkflowController');

// Load environment variables
dotenv.config();

// Configure logging
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' }),
    new winston.transports.Console({
      format: winston.format.simple()
    })
  ]
});

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.static('public'));

// Initialize modules
const matrixImporter = new MatrixImporter(logger);
const competitorScraper = new CompetitorScraper(logger);
const pricingStrategy = new PricingStrategy(logger);
const erpIntegration = new ERPIntegration(logger);
const workflowController = new WorkflowController(
  matrixImporter,
  competitorScraper,
  pricingStrategy,
  erpIntegration,
  logger
);

// API Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

app.get('/api/products', async (req, res) => {
  try {
    const products = await matrixImporter.getProducts();
    res.json(products);
  } catch (error) {
    logger.error('Error fetching products:', error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

app.get('/api/competitor-data', async (req, res) => {
  try {
    const competitorData = await competitorScraper.getLatestData();
    res.json(competitorData);
  } catch (error) {
    logger.error('Error fetching competitor data:', error);
    res.status(500).json({ error: 'Failed to fetch competitor data' });
  }
});

app.post('/api/run-workflow', async (req, res) => {
  try {
    const result = await workflowController.runCompleteWorkflow();
    res.json(result);
  } catch (error) {
    logger.error('Error running workflow:', error);
    res.status(500).json({ error: 'Workflow execution failed' });
  }
});

app.get('/api/pricing-strategy', async (req, res) => {
  try {
    const strategy = await pricingStrategy.getCurrentStrategy();
    res.json(strategy);
  } catch (error) {
    logger.error('Error fetching pricing strategy:', error);
    res.status(500).json({ error: 'Failed to fetch pricing strategy' });
  }
});

app.post('/api/update-prices', async (req, res) => {
  try {
    const { prices } = req.body;
    const result = await erpIntegration.updatePrices(prices);
    res.json(result);
  } catch (error) {
    logger.error('Error updating prices:', error);
    res.status(500).json({ error: 'Failed to update prices' });
  }
});

// Schedule automated workflow (runs every 6 hours)
cron.schedule('0 */6 * * *', async () => {
  logger.info('Starting scheduled workflow execution');
  try {
    await workflowController.runCompleteWorkflow();
    logger.info('Scheduled workflow completed successfully');
  } catch (error) {
    logger.error('Scheduled workflow failed:', error);
  }
});

// Error handling middleware
app.use((error, req, res, next) => {
  logger.error('Unhandled error:', error);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
  logger.info(`Dynamic Pricing Workflow Server running on port ${PORT}`);
  logger.info(`Dashboard available at http://localhost:${PORT}`);
}); 