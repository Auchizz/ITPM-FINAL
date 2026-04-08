const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');
const moduleController = require('../controllers/moduleController');

const router = express.Router();

router.use(authMiddleware);

router.get('/overview', moduleController.getOverview);

router.get('/sports', moduleController.listSports);
router.post('/sports', roleMiddleware(['admin']), moduleController.createSport);
router.put('/sports/:id', roleMiddleware(['admin']), moduleController.updateSport);
router.delete('/sports/:id', roleMiddleware(['admin']), moduleController.deleteSport);

router.get('/clubs', moduleController.listClubs);
router.post('/clubs', roleMiddleware(['admin']), moduleController.createClub);
router.put('/clubs/:id', roleMiddleware(['admin']), moduleController.updateClub);
router.delete('/clubs/:id', roleMiddleware(['admin']), moduleController.deleteClub);

router.get('/matches', moduleController.listMatches);
router.post('/matches', roleMiddleware(['admin']), moduleController.createMatch);
router.put('/matches/:id', roleMiddleware(['admin']), moduleController.updateMatch);
router.delete('/matches/:id', roleMiddleware(['admin']), moduleController.deleteMatch);

router.get('/players', moduleController.listPlayers);
router.post('/players', roleMiddleware(['admin']), moduleController.createPlayer);
router.put('/players/:id', roleMiddleware(['admin']), moduleController.updatePlayer);
router.delete('/players/:id', roleMiddleware(['admin']), moduleController.deletePlayer);

router.get('/facilities', moduleController.listFacilities);
router.post('/facilities', roleMiddleware(['admin']), moduleController.createFacility);
router.put('/facilities/:id', roleMiddleware(['admin']), moduleController.updateFacility);
router.delete('/facilities/:id', roleMiddleware(['admin']), moduleController.deleteFacility);

router.post('/inquiries', moduleController.createInquiry);
router.get('/inquiries', roleMiddleware(['admin']), moduleController.listInquiries);

module.exports = router;
