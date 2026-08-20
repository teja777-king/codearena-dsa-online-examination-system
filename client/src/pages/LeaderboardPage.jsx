import React, { useState, useEffect } from 'react';
import {
  Trophy,
  Medal,
  Flame,
  Award,
  Crown,
  Search,
  Filter,
  CheckCircle2,
} from 'lucide-react';
import api from '../services/api';
import { Badge } from '../components/common/Badge';
import { LoadingSpinner } from '../components/common/Badge';

const LeaderboardPage = () => {
  const [timeframe, setTimeframe] = useState('global'); // 'global', 'weekly', 'monthly'
  const [course, setCourse] = useState('All');
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      setLoading(true);
      try {
        const res = await api.get('/analytics/leaderboard', {
          params: { timeframe, course },
        });
        if (res.data.success) {
          setStudents(res.data.leaderboard || []);
        }
      } catch (err) {
        console.error('Error fetching leaderboard:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, [timeframe, course]);

  const topThree = students.slice(0, 3);
  const remainingStudents = students.slice(3);

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="glass-card p-6 sm:p-8 rounded-2xl border-slate-800 bg-gradient-to-r from-dark-900 via-dark-850 to-amber-950/30 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold mb-3 shadow-glow-amber">
            <Trophy className="w-3.5 h-3.5" />
            <span>Hall of Fame</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">DSA Arena Leaderboard</h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-xl">
            Celebrating the top algorithmic minds across universities, courses, and examination assessments.
          </p>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {['global', 'monthly', 'weekly'].map((tab) => (
            <button
              key={tab}
              onClick={() => setTimeframe(tab)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold capitalize transition ${
                timeframe === tab
                  ? 'bg-amber-500 text-dark-950 shadow-glow-amber'
                  : 'bg-dark-950 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {tab === 'global' ? 'All-Time' : tab}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <LoadingSpinner size="lg" className="min-h-[50vh]" />
      ) : (
        <>
          {/* Top 3 Podium Cards */}
          {topThree.length >= 3 && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4">
              {/* Rank 2 (Silver) */}
              <div className="glass-card p-6 rounded-2xl border-slate-700 text-center order-2 sm:order-1 flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 rounded-full bg-slate-300/10 border border-slate-300/30 flex items-center justify-center text-slate-300 mx-auto mb-3 font-black text-lg">
                    2
                  </div>
                  <h3 className="font-extrabold text-white text-base">{topThree[1].name}</h3>
                  <p className="text-[11px] text-slate-400 mt-0.5">{topThree[1].college}</p>
                </div>
                <div className="mt-4 pt-4 border-t border-slate-800">
                  <div className="text-xl font-black text-white">{topThree[1].score} pts</div>
                  <div className="text-[11px] text-emerald-400 font-semibold">{topThree[1].accuracy}% Accuracy</div>
                </div>
              </div>

              {/* Rank 1 (Gold) */}
              <div className="glass-card p-6 rounded-2xl border-amber-500/50 text-center order-1 sm:order-2 bg-amber-500/10 shadow-glow-amber -mt-2 sm:-mt-4 flex flex-col justify-between">
                <div>
                  <div className="w-14 h-14 rounded-full bg-amber-500 flex items-center justify-center text-dark-950 mx-auto mb-3 font-black text-xl shadow-lg">
                    <Crown className="w-7 h-7 fill-dark-950" />
                  </div>
                  <h3 className="font-extrabold text-white text-lg">{topThree[0].name}</h3>
                  <p className="text-xs text-amber-300 font-medium mt-0.5">{topThree[0].college}</p>
                </div>
                <div className="mt-4 pt-4 border-t border-amber-500/30">
                  <div className="text-2xl font-black text-amber-300">{topThree[0].score} pts</div>
                  <div className="text-xs text-emerald-400 font-bold">{topThree[0].accuracy}% Accuracy</div>
                </div>
              </div>

              {/* Rank 3 (Bronze) */}
              <div className="glass-card p-6 rounded-2xl border-orange-700/50 text-center order-3 sm:order-3 flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 rounded-full bg-amber-700/10 border border-amber-700/40 flex items-center justify-center text-amber-600 mx-auto mb-3 font-black text-lg">
                    3
                  </div>
                  <h3 className="font-extrabold text-white text-base">{topThree[2].name}</h3>
                  <p className="text-[11px] text-slate-400 mt-0.5">{topThree[2].college}</p>
                </div>
                <div className="mt-4 pt-4 border-t border-slate-800">
                  <div className="text-xl font-black text-white">{topThree[2].score} pts</div>
                  <div className="text-[11px] text-emerald-400 font-semibold">{topThree[2].accuracy}% Accuracy</div>
                </div>
              </div>
            </div>
          )}

          {/* Full Leaderboard Table */}
          <div className="glass-card rounded-2xl overflow-hidden border-slate-800">
            <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between">
              <h3 className="text-sm font-bold text-white">Full Arena Standings</h3>
              <span className="text-xs text-slate-400">{students.length} Ranked Students</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-dark-950/80 text-slate-400 uppercase tracking-wider text-[10px] border-b border-slate-800">
                  <tr>
                    <th className="py-3.5 px-4 font-bold">Rank</th>
                    <th className="py-3.5 px-4 font-bold">Student</th>
                    <th className="py-3.5 px-4 font-bold hidden sm:table-cell">Institution</th>
                    <th className="py-3.5 px-4 font-bold">Total Score</th>
                    <th className="py-3.5 px-4 font-bold">Accuracy</th>
                    <th className="py-3.5 px-4 font-bold hidden md:table-cell">Exams Taken</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-300 font-medium">
                  {students.map((student, idx) => (
                    <tr
                      key={student.id || idx}
                      className="hover:bg-slate-800/40 transition"
                    >
                      <td className="py-3.5 px-4 font-bold">
                        {idx === 0 ? '🥇 1' : idx === 1 ? '🥈 2' : idx === 2 ? '🥉 3' : `#${idx + 1}`}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-white">{student.name}</div>
                        <div className="text-[10px] text-slate-500 sm:hidden">{student.college}</div>
                      </td>
                      <td className="py-3.5 px-4 text-slate-400 hidden sm:table-cell">
                        {student.college}
                      </td>
                      <td className="py-3.5 px-4 font-black text-brand-400 font-mono">
                        {student.score} pts
                      </td>
                      <td className="py-3.5 px-4 text-emerald-400 font-bold">
                        {student.accuracy}%
                      </td>
                      <td className="py-3.5 px-4 text-slate-400 hidden md:table-cell">
                        {student.examsAttempted}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default LeaderboardPage;
