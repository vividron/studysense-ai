import { getActivityOverview } from '../api/activity.api'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast';
import Loader from '../components/Loader'
import { CircleCheckBig, CircleQuestionMark, Clock, Dot, FileText, Target } from 'lucide-react';
import StatCard from '../components/StatCard';
import { Link } from 'react-router-dom';

const ActivityPage = () => {
  const [activityData, setActivityData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchActivity = async () => {
    try {
      const data = await getActivityOverview();
      setActivityData(data.data);
    } catch (error) {
      toast.error(error.message || "Failed to fetch Activity");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchActivity();
  }, []);

  if (loading) return <Loader />

  const stats = [
    {
      label: 'Total Documents',
      value: activityData?.overview.totalDocuments ?? 0,
      icon: FileText,
      iconColor: "text-blue-400"
    },
    {
      label: 'Total Quizzes',
      value: activityData?.overview.totalQuizzes ?? 0,
      icon: CircleQuestionMark,
      iconColor: "text-(--primary)"
    },
    {
      label: 'Completed Quiz',
      value: activityData?.overview.completedQuiz ?? 0,
      icon: CircleCheckBig,
      iconColor: "text-green-400"
    },
    {
      label: 'Average Score',
      value: activityData?.overview.averageScore ?? 0,
      icon: Target,
      iconColor: "text-orange-400"
    }
  ];

  const documents = activityData?.recentActivity?.documents ?? []
  const quizzes = activityData?.recentActivity?.quizzes ?? []
  const hasRecentActivity = documents.length > 0 || quizzes.length > 0

  const recentActivities = [
    ...documents.map((document) => ({
      title: document.title,
      lastAccessed: document.lastAccessed,
      link: `/documents/${document._id}`,
      type: 'document'
    })),

    ...quizzes.map((quiz) => ({
      title: quiz.title,
      lastAccessed: quiz.completedAt ?? quiz.createdAt,
      link: `/quizzes/${quiz._id}`,
      type: quiz.completedAt ? 'quiz-completed' : 'quiz-created'
    }))
  ].sort((a, b) => new Date(b.lastAccessed).getTime() - new Date(a.lastAccessed).getTime());

  return (
    <div className="min-h-full space-y-8 select-none">
      <div className='space-y-1'>
        <h1 className="text-2xl font-bold text-white">
          My Activity
        </h1>
        <p className="text-sm text-white/60">
          Track your learning progress
        </p>
        <div className='tablet:hidden mt-2 h-px gradient bg-linear-to-r from-white/10 via-white/20 to-white/10' />
      </div>

      {/*Activity stats */}
      <div className="grid grid-cols-2 xs:grid-cols-2 desktop:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <StatCard
            key={index}
            label={stat.label}
            value={stat.value}
            icon={stat.icon}
            iconColor={stat.iconColor}
          />
        ))}
      </div>

      {/*Recent activity*/}
      <div className="bg-(--bg-surface) rounded-xl p-5 border border-white/10">
        <div className="flex items-center gap-2 mb-4">
          <div className="p-2 rounded-full bg-white/5">
            <Clock className="w-4 h-4 text-white/70" />
          </div>
          <h1 className="text-white text-lg font-semibold">
            Recent Activity
          </h1>
        </div>

        {hasRecentActivity ? (
          <div className="space-y-3">
            {recentActivities.map((recentItem, index) => (
              <div
                key={index}
                className="group flex items-center justify-between rounded-lg border border-white/10 bg-white/5 px-2 py-3 
                transition hover:bg-white/10"
              >
                <div className="flex flex-col min-w-0 gap-1">
                  <div className="flex items-center mr-5">
                    <Dot size={35} className={`shrink-0 ${recentItem.type === "document" ? "text-blue-400" : recentItem.type === "quiz-created"
                      ? "text-yellow-400" : "text-green-400"}`} />

                    <p className="font-semibold text-white min-w-0 truncate">
                      {recentItem.type === "document" ? `Accessed Document: ${recentItem.title}` : recentItem.type === "quiz-created"
                        ? `Created Quiz: ${recentItem.title}` : `Completed Quiz: ${recentItem.title}`}
                    </p>
                  </div>

                  <p className="text-sm text-white/60 ml-9">
                    {new Date(recentItem.lastAccessed).toLocaleString(undefined, {
                      dateStyle: "medium", timeStyle: "short"
                    })}
                  </p>
                </div>

                {/* View document link*/}
                <Link to={recentItem.link} className="text-sm font-medium text-white transition group-hover:scale-110 mr-5 hover:text-blue-400 hover:underline">
                  View
                </Link>
              </div>
            ))}
          </div>) : <p className='flex py-10 justify-center text-white/50'>
          No activities yet. Start by uploading a document!
        </p>}
      </div>
    </div>
  );
}

export default ActivityPage