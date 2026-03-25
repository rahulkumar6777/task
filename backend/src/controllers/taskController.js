import Task from '../models/Task.js';
import { clearCache } from '../middleware/cacheMiddleware.js';
import AppError from '../utils/AppError.js';

export const getAllTasks = async (req, res, next) => {
  try {
    let query;
    if (req.user.role === 'admin') {
      query = Task.find().populate('user', 'username email');
    } else {
      query = Task.find({ user: req.user.id });
    }
    
    const tasks = await query.sort('-createdAt');
    
    res.status(200).json({
      success: true,
      count: tasks.length,
      data: tasks
    });
  } catch (error) {
    next(error);
  }
};

export const getTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);
    
    if (!task) {
      return next(new AppError('Task not found', 404));
    }
    
    if (req.user.role !== 'admin' && task.user.toString() !== req.user.id) {
      return next(new AppError('Not authorized to access this task', 403));
    }
    
    res.status(200).json({
      success: true,
      data: task
    });
  } catch (error) {
    next(error);
  }
};

export const createTask = async (req, res, next) => {
  try {
    req.body.user = req.user.id;
    const task = await Task.create(req.body);
    
    await clearCache(`cache:${req.user.id}:*`);
    
    res.status(201).json({
      success: true,
      data: task
    });
  } catch (error) {
    next(error);
  }
};

export const updateTask = async (req, res, next) => {
  try {
    let task = await Task.findById(req.params.id);
    
    if (!task) {
      return next(new AppError('Task not found', 404));
    }
    
    if (req.user.role !== 'admin' && task.user.toString() !== req.user.id) {
      return next(new AppError('Not authorized to update this task', 403));
    }
    
    task = await Task.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    
    await clearCache(`cache:${req.user.id}:*`);
    if (req.user.role === 'admin') {
      await clearCache(`cache:*:*`);
    }
    
    res.status(200).json({
      success: true,
      data: task
    });
  } catch (error) {
    next(error);
  }
};

export const deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);
    
    if (!task) {
      return next(new AppError('Task not found', 404));
    }
    
    if (req.user.role !== 'admin' && task.user.toString() !== req.user.id) {
      return next(new AppError('Not authorized to delete this task', 403));
    }
    
    await task.deleteOne();
    
    await clearCache(`cache:${req.user.id}:*`);
    if (req.user.role === 'admin') {
      await clearCache(`cache:*:*`);
    }
    
    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    next(error);
  }
};