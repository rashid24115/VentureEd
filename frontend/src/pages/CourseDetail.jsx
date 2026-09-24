import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  BookOpen,
  CheckCircle2,
  Circle,
  Clock,
  ArrowLeft,
  ArrowRight,
  Sparkles,
  HelpCircle,
  Award,
  ChevronRight,
  Share2,
  Check,
  Flame,
  Zap
} from 'lucide-react';
import { fetchCourseById, enrollInCourse, updateLessonProgress } from '../services/api';
import { AuthContext } from '../context/AuthContext';

export default function CourseDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, refreshUser, openAuthModal } = useContext(AuthContext);

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeLessonId, setActiveLessonId] = useState(null);
  const [completedLessons, setCompletedLessons] = useState([]);
  const [progressPercent, setProgressPercent] = useState(0);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [showXpToast, setShowXpToast] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetchCourseById(id)
      .then((res) => {
        const c = res.data;
        setCourse(c);
        setIsEnrolled(c.is_enrolled);
        setProgressPercent(c.progress_percent || 0);
        setCompletedLessons(c.completed_lessons || []);

        // Pick first lesson as active
        if (c.syllabus && c.syllabus.length > 0 && c.syllabus[0].lessons?.length > 0) {
          setActiveLessonId(c.syllabus[0].lessons[0].lesson_id);
        }
      })
      .catch((err) => console.error('Error fetching course:', err))
      .finally(() => setLoading(false));
  }, [id]);

  // Find active lesson object
  let activeLesson = null;
  let allLessonsList = [];
  if (course?.syllabus) {
    for (const mod of course.syllabus) {
      for (const les of mod.lessons || []) {
        allLessonsList.push(les);
        if (les.lesson_id === activeLessonId) {
          activeLesson = les;
        }
      }
    }
  }

  const activeLessonIndex = allLessonsList.findIndex((l) => l.lesson_id === activeLessonId);
  const prevLesson = activeLessonIndex > 0 ? allLessonsList[activeLessonIndex - 1] : null;
  const nextLesson = activeLessonIndex < allLessonsList.length - 1 ? allLessonsList[activeLessonIndex + 1] : null;

  const handleEnroll = async () => {
    if (!user) {
      openAuthModal();
      return;
    }
    try {
      await enrollInCourse(id);
      setIsEnrolled(true);
      refreshUser();
    } catch (err) {
      console.error('Enrollment error:', err);
    }
  };

  const toggleLessonComplete = async (lessonId) => {
    if (!user) {
      openAuthModal();
      return;
    }
    const isCurrentlyComplete = completedLessons.includes(lessonId);
    setUpdating(true);
    try {
      const res = await updateLessonProgress(id, {
        lesson_id: lessonId,
        completed: !isCurrentlyComplete,
      });
      setCompletedLessons(res.data.completed_lessons);
      setProgressPercent(res.data.progress_percent);
      if (!isCurrentlyComplete) {
        setShowXpToast(true);
        setTimeout(() => setShowXpToast(false), 3000);
      }
      refreshUser();
    } catch (err) {
      console.error('Failed to update progress:', err);
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8 max-w-7xl mx-auto animate-pulse space-y-6">
        <div className="h-8 bg-slate-200 rounded w-1/4" />
        <div className="h-16 bg-slate-200 rounded" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="h-96 bg-slate-200 rounded" />
          <div className="md:col-span-2 h-96 bg-slate-200 rounded" />
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="p-12 text-center">
        <p className="text-slate-500">Course not found.</p>
        <Link to="/courses" className="text-indigo-600 font-semibold text-sm hover:underline mt-2 inline-block">
          ← Back to courses
        </Link>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 animate-fade-in relative">
      {/* Toast for XP Earned */}
      {showXpToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-xl flex items-center gap-3 border border-slate-700 animate-bounce">
          <div className="p-2 bg-amber-400 text-slate-950 rounded-xl font-bold">
            <Zap size={18} />
          </div>
          <div>
            <p className="text-xs font-bold">+25 Founder XP Earned!</p>
            <p className="text-[11px] text-slate-300">Lesson marked as completed</p>
          </div>
        </div>
      )}

      {/* Breadcrumb & Navigation */}
      <div className="flex items-center justify-between">
        <Link
          to="/courses"
          className="flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-slate-800 transition"
        >
          <ArrowLeft size={14} /> Back to Courses Catalogue
        </Link>

        <div className="flex items-center gap-3">
          <Link
            to={`/quiz/${course.id}`}
            className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white text-xs font-bold rounded-xl shadow-xs transition"
          >
            <HelpCircle size={15} />
            <span>Take Course Quiz</span>
          </Link>
        </div>
      </div>

      {/* Course Header Banner */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-lg border border-indigo-100">
                {course.category}
              </span>
              <span className="text-xs font-semibold text-slate-500">· {course.difficulty}</span>
              <span className="text-xs font-semibold text-slate-500">· {course.duration}</span>
            </div>
            <h1 className="text-xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-tight">
              {course.title}
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{course.description}</p>
          </div>

          <div className="shrink-0 bg-slate-50 border border-slate-200/80 p-5 rounded-2xl min-w-[220px] text-center space-y-3">
            <div className="flex justify-between items-center text-xs font-bold">
              <span className="text-slate-600">Your Progress</span>
              <span className="text-indigo-600 font-extrabold text-sm">{progressPercent}%</span>
            </div>
            <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-indigo-500 to-violet-600 rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            {!isEnrolled ? (
              <button
                onClick={handleEnroll}
                className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-xs transition cursor-pointer"
              >
                Enroll in Course
              </button>
            ) : (
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                <Check size={12} /> Active Enrollment
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Main Learning Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Interactive Syllabus Navigation */}
        <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
              <BookOpen size={15} className="text-indigo-600" /> Course Curriculum
            </h3>
            <span className="text-[11px] font-semibold text-slate-400">
              {completedLessons.length} / {allLessonsList.length} done
            </span>
          </div>

          <div className="divide-y divide-slate-100 max-h-[620px] overflow-y-auto">
            {course.syllabus?.map((module, mIdx) => (
              <div key={module.module_id || mIdx} className="p-3">
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-2 mb-2">
                  {module.title}
                </p>
                <div className="space-y-1">
                  {module.lessons?.map((lesson) => {
                    const isSelected = lesson.lesson_id === activeLessonId;
                    const isDone = completedLessons.includes(lesson.lesson_id);
                    return (
                      <button
                        key={lesson.lesson_id}
                        onClick={() => setActiveLessonId(lesson.lesson_id)}
                        className={`w-full text-left p-2.5 rounded-xl text-xs font-medium flex items-center justify-between transition cursor-pointer ${
                          isSelected
                            ? 'bg-indigo-600 text-white shadow-xs'
                            : 'text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 pr-2">
                          {isDone ? (
                            <CheckCircle2
                              size={16}
                              className={isSelected ? 'text-white shrink-0' : 'text-emerald-500 shrink-0'}
                            />
                          ) : (
                            <Circle
                              size={16}
                              className={isSelected ? 'text-indigo-200 shrink-0' : 'text-slate-300 shrink-0'}
                            />
                          )}
                          <span className="line-clamp-1">{lesson.title}</span>
                        </div>
                        <span
                          className={`text-[10px] shrink-0 ${
                            isSelected ? 'text-indigo-200' : 'text-slate-400'
                          }`}
                        >
                          {lesson.duration}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Quiz CTA Box at bottom of syllabus */}
          <div className="p-4 bg-gradient-to-br from-amber-50 to-orange-50 border-t border-amber-100">
            <div className="flex items-center gap-2 mb-1.5">
              <Award size={16} className="text-amber-600" />
              <span className="text-xs font-bold text-amber-900">Knowledge Check</span>
            </div>
            <p className="text-[11px] text-amber-800 mb-3">
              Ready to test your mastery? Complete the scenario quiz to earn XP and strengthen your founder score.
            </p>
            <Link
              to={`/quiz/${course.id}`}
              className="flex items-center justify-center gap-2 w-full py-2 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold rounded-xl shadow-2xs transition"
            >
              <span>Take Course Quiz</span>
              <ChevronRight size={14} />
            </Link>
          </div>
        </div>

        {/* Right Column: Active Lesson Reader */}
        <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200 shadow-xs p-6 sm:p-8 space-y-6">
          {activeLesson ? (
            <>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                <div>
                  <span className="text-xs font-semibold text-indigo-600">
                    Lesson {activeLessonIndex + 1} of {allLessonsList.length}
                  </span>
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mt-0.5">{activeLesson.title}</h2>
                </div>

                {/* Mark complete toggle */}
                <button
                  onClick={() => toggleLessonComplete(activeLesson.lesson_id)}
                  disabled={updating}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                    completedLessons.includes(activeLesson.lesson_id)
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                      : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs'
                  }`}
                >
                  <CheckCircle2 size={15} />
                  <span>
                    {completedLessons.includes(activeLesson.lesson_id)
                      ? 'Completed'
                      : 'Mark as Complete (+25 XP)'}
                  </span>
                </button>
              </div>

              {/* Lesson Body Content */}
              <div className="prose prose-slate max-w-none text-slate-700 text-sm sm:text-base leading-relaxed space-y-4">
                {activeLesson.content ? (
                  activeLesson.content.split('\n\n').map((paragraph, pIdx) => {
                    if (paragraph.startsWith('### ')) {
                      return (
                        <h3 key={pIdx} className="text-lg font-bold text-slate-900 pt-2">
                          {paragraph.replace('### ', '')}
                        </h3>
                      );
                    }
                    if (paragraph.startsWith('#### ')) {
                      return (
                        <h4 key={pIdx} className="text-base font-bold text-slate-800 pt-1">
                          {paragraph.replace('#### ', '')}
                        </h4>
                      );
                    }
                    if (paragraph.startsWith('> ')) {
                      return (
                        <blockquote
                          key={pIdx}
                          className="border-l-4 border-indigo-500 bg-indigo-50/50 p-4 rounded-r-xl text-indigo-950 font-medium my-3 text-sm italic"
                        >
                          {paragraph.replace('> ', '')}
                        </blockquote>
                      );
                    }
                    if (paragraph.includes('\n- ')) {
                      const lines = paragraph.split('\n');
                      return (
                        <ul key={pIdx} className="list-disc list-inside space-y-1 my-2 text-slate-700">
                          {lines.map((l, lIdx) => (
                            <li key={lIdx}>{l.replace('- ', '').replace(/^\d+\.\s*/, '')}</li>
                          ))}
                        </ul>
                      );
                    }
                    return <p key={pIdx}>{paragraph}</p>;
                  })
                ) : (
                  <p className="text-slate-500">Lesson content loading...</p>
                )}
              </div>

              {/* Bottom Navigation for Lessons */}
              <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
                {prevLesson ? (
                  <button
                    onClick={() => setActiveLessonId(prevLesson.lesson_id)}
                    className="flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-3.5 py-2 rounded-xl transition cursor-pointer"
                  >
                    <ArrowLeft size={14} /> Previous Lesson
                  </button>
                ) : (
                  <div />
                )}

                {nextLesson ? (
                  <button
                    onClick={() => setActiveLessonId(nextLesson.lesson_id)}
                    className="flex items-center gap-1.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-xl shadow-xs transition cursor-pointer"
                  >
                    <span>Next Lesson</span> <ArrowRight size={14} />
                  </button>
                ) : (
                  <Link
                    to={`/quiz/${course.id}`}
                    className="flex items-center gap-1.5 text-xs font-bold text-white bg-amber-500 hover:bg-amber-600 px-4 py-2 rounded-xl shadow-xs transition"
                  >
                    <span>Take Course Quiz</span> <Award size={14} />
                  </Link>
                )}
              </div>
            </>
          ) : (
            <div className="p-12 text-center text-slate-500">Select a lesson from the syllabus to begin reading.</div>
          )}
        </div>
      </div>
    </div>
  );
}
