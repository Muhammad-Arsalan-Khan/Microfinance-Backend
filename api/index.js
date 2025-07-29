import app from '../app.js';
import serverless from 'serverless-http';

export const handler = serverless(app)

// export default function handler(req, res) {
//   res.status(200).json({ working: true });
// }

