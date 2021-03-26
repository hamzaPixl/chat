import express, { Router } from 'express';

const router = express.Router();

router.get('/', (request, response) => {
  response.send([]);
});

export const UsersController: Router = router;
