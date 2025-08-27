import express, { Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
// import { authController } from './controllers/authController';
// import { todoController } from './controllers/todoController';
// import { authenticate } from './middleware/auth';

const app = express();

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Routes
// app.post('/api/auth/register', authController.register);
// app.post('/api/auth/login', authController.login);
// app.get('/api/auth/profile', authenticate, authController.getProfile);

// app.post('/api/todos', authenticate, todoController.createTodo);
// app.get('/api/todos', authenticate, todoController.getTodos);
// app.get('/api/todos/:id', authenticate, todoController.getTodo);
// app.put('/api/todos/:id', authenticate, todoController.updateTodo);
// app.delete('/api/todos/:id', authenticate, todoController.deleteTodo);
// app.patch('/api/todos/:id/toggle', authenticate, todoController.toggleTodo);


app.get('/', (req: Request, res: Response) => {
    res.send("Welcome to your AWS learnings")
})


// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error handler
app.use((error: any, req: any, res: any, next: any) => {
  console.error('Unhandled error:', error);
  res.status(500).json({ error: 'Internal server error' });
});

export default app;