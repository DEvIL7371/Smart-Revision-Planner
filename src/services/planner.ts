import { Subject, Task } from '../types';
import { addDays, format, isBefore, differenceInDays, startOfDay } from 'date-fns';

export const generatePlan = (subjects: Subject[], startDate: Date): Task[] => {
  const tasks: Task[] = [];
  const start = startOfDay(startDate);

  // Sort subjects by exam date (closest first)
  const sortedSubjects = [...subjects].sort((a, b) => 
    new Date(a.examDate).getTime() - new Date(b.examDate).getTime()
  );

  sortedSubjects.forEach((subject) => {
    const examDate = startOfDay(new Date(subject.examDate));
    const daysUntilExam = differenceInDays(examDate, start);

    if (daysUntilExam > 0) {
      // Create revision tasks for each day leading up to the exam
      // Priority-based allocation: higher priority gets more focus
      const focusDays = subject.priority === 'high' ? 5 : subject.priority === 'medium' ? 3 : 2;
      
      for (let i = 1; i <= Math.min(daysUntilExam, focusDays); i++) {
        const taskDate = addDays(examDate, -i);
        if (isBefore(start, taskDate) || format(start, 'yyyy-MM-dd') === format(taskDate, 'yyyy-MM-dd')) {
          tasks.push({
            id: Math.random().toString(36).substr(2, 9),
            subjectId: subject.id,
            title: `Revision: ${subject.name} - ${i === 1 ? 'Final Review' : `Topic ${i}`}`,
            date: taskDate.toISOString(),
            completed: false,
            type: 'revision',
          });
        }
      }

      // Add a practice task if there's enough time
      if (daysUntilExam > 3) {
        tasks.push({
          id: Math.random().toString(36).substr(2, 9),
          subjectId: subject.id,
          title: `Practice Test: ${subject.name}`,
          date: addDays(examDate, -2).toISOString(),
          completed: false,
          type: 'practice',
        });
      }
    }
  });

  return tasks.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
};
