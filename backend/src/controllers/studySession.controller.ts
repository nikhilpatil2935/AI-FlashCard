import { Request, Response } from 'express';
import StudySession, { ReviewResult } from '../models/studySession.model';
import Flashcard from '../models/flashcard.model';

// Create a new study session
export const createStudySession = async (req: Request, res: Response) => {
  try {
    const { flashcardIds } = req.body;
    
    // Validate input
    if (!flashcardIds || !Array.isArray(flashcardIds) || flashcardIds.length === 0) {
      return res.status(400).json({ error: 'Flashcard IDs array is required' });
    }
    
    // Verify all flashcards belong to the user
    const flashcards = await Flashcard.find({
      _id: { $in: flashcardIds },
      user: req.userId
    });
    
    if (flashcards.length !== flashcardIds.length) {
      return res.status(400).json({ error: 'One or more flashcards not found or do not belong to the user' });
    }
    
    // Create a new study session
    const studySession = new StudySession({
      user: req.userId,
      flashcards: flashcardIds,
      startTime: new Date()
    });
    
    await studySession.save();
    
    res.status(201).json(studySession);
  } catch (error) {
    console.error('Create study session error:', error);
    res.status(500).json({ error: 'Server error while creating study session' });
  }
};

// Get all user's study sessions
export const getStudySessions = async (req: Request, res: Response) => {
  try {
    const { limit = 10, page = 1 } = req.query;
    
    // Calculate pagination
    const skip = (Number(page) - 1) * Number(limit);
    
    // Get study sessions
    const studySessions = await StudySession.find({ user: req.userId })
      .sort({ startTime: -1 })
      .skip(skip)
      .limit(Number(limit))
      .populate('flashcards', 'question answer');
    
    // Get total count for pagination
    const total = await StudySession.countDocuments({ user: req.userId });
    
    res.json({
      studySessions,
      pagination: {
        total,
        page: Number(page),
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) {
    console.error('Get study sessions error:', error);
    res.status(500).json({ error: 'Server error while fetching study sessions' });
  }
};

// Get a single study session by ID
export const getStudySessionById = async (req: Request, res: Response) => {
  try {
    const studySession = await StudySession.findOne({
      _id: req.params.id,
      user: req.userId
    }).populate('flashcards', 'question answer tags difficulty');
    
    if (!studySession) {
      return res.status(404).json({ error: 'Study session not found' });
    }
    
    res.json(studySession);
  } catch (error) {
    console.error('Get study session error:', error);
    res.status(500).json({ error: 'Server error while fetching study session' });
  }
};

// Update study session (complete session or add results)
export const updateStudySession = async (req: Request, res: Response) => {
  try {
    const { results, complete } = req.body;
    
    // Find the study session
    const studySession = await StudySession.findOne({
      _id: req.params.id,
      user: req.userId
    });
    
    if (!studySession) {
      return res.status(404).json({ error: 'Study session not found' });
    }
    
    // Update with results if provided
    if (results && Array.isArray(results)) {
      // Validate that all flashcards in results belong to this session
      const validFlashcardIds = studySession.flashcards.map(id => id.toString());
      const allResultsValid = results.every((result: any) => 
        validFlashcardIds.includes(result.flashcard.toString())
      );
      
      if (!allResultsValid) {
        return res.status(400).json({ error: 'Results contain flashcards not in this study session' });
      }
      
      // Add results
      studySession.results = [
        ...studySession.results,
        ...results
      ];
      
      // Update counters
      let correctCount = 0;
      let incorrectCount = 0;
      
      results.forEach((result: any) => {
        if (result.result === ReviewResult.CORRECT) {
          correctCount++;
        } else if (result.result === ReviewResult.INCORRECT) {
          incorrectCount++;
        }
      });
      
      studySession.correctCount += correctCount;
      studySession.incorrectCount += incorrectCount;
      
      // Also update the individual flashcards
      await Promise.all(results.map(async (result: any) => {
        const updateData: any = {
          lastReviewed: new Date(),
          $inc: { reviewCount: 1 }
        };
        
        if (result.result === ReviewResult.CORRECT) {
          updateData.$inc.correctCount = 1;
        } else if (result.result === ReviewResult.INCORRECT) {
          updateData.$inc.incorrectCount = 1;
        }
        
        await Flashcard.updateOne(
          { _id: result.flashcard, user: req.userId },
          updateData
        );
      }));
    }
    
    // Complete the session if requested
    if (complete) {
      const endTime = new Date();
      studySession.endTime = endTime;
      studySession.totalTime = endTime.getTime() - studySession.startTime.getTime();
    }
    
    await studySession.save();
    res.json(studySession);
  } catch (error) {
    console.error('Update study session error:', error);
    res.status(500).json({ error: 'Server error while updating study session' });
  }
};

// Get study statistics for the user
export const getStudyStats = async (req: Request, res: Response) => {
  try {
    // Get time range from query params - default to last 30 days
    const { days = 30 } = req.query;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - Number(days));
    
    // Get all completed sessions in the date range
    const sessions = await StudySession.find({
      user: req.userId,
      endTime: { $exists: true, $ne: null },
      startTime: { $gte: startDate }
    });
    
    // Calculate statistics
    const totalSessions = sessions.length;
    const totalCards = sessions.reduce((sum, session) => sum + session.flashcards.length, 0);
    const totalTime = sessions.reduce((sum, session) => sum + (session.totalTime || 0), 0);
    const correctAnswers = sessions.reduce((sum, session) => sum + session.correctCount, 0);
    const incorrectAnswers = sessions.reduce((sum, session) => sum + session.incorrectCount, 0);
    
    // Calculate accuracy
    const accuracy = totalCards > 0 ? 
      (correctAnswers / (correctAnswers + incorrectAnswers)) * 100 : 0;
    
    // Get daily study data for chart
    const dailyData = [];
    const today = new Date();
    
    for (let i = Number(days) - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(today.getDate() - i);
      date.setHours(0, 0, 0, 0);
      
      const nextDate = new Date(date);
      nextDate.setDate(date.getDate() + 1);
      
      // Find sessions for this day
      const daySessions = sessions.filter(session => 
        session.startTime >= date && session.startTime < nextDate
      );
      
      // Calculate stats for the day
      const dayCorrect = daySessions.reduce((sum, session) => sum + session.correctCount, 0);
      const dayIncorrect = daySessions.reduce((sum, session) => sum + session.incorrectCount, 0);
      const dayTime = daySessions.reduce((sum, session) => sum + (session.totalTime || 0), 0);
      
      dailyData.push({
        date: date.toISOString().split('T')[0],
        sessionsCount: daySessions.length,
        cardsReviewed: dayCorrect + dayIncorrect,
        timeSpentMs: dayTime,
        accuracy: (dayCorrect + dayIncorrect) > 0 ? 
          (dayCorrect / (dayCorrect + dayIncorrect)) * 100 : 0
      });
    }
    
    // Return the compiled statistics
    res.json({
      overview: {
        totalSessions,
        totalCards,
        totalTimeMs: totalTime,
        accuracy,
        correctAnswers,
        incorrectAnswers,
        averageTimePerCardMs: totalCards > 0 ? totalTime / totalCards : 0
      },
      dailyData
    });
  } catch (error) {
    console.error('Get study stats error:', error);
    res.status(500).json({ error: 'Server error while fetching study statistics' });
  }
};
