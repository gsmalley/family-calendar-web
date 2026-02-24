import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Flame, Star, Medal, Crown, Zap } from 'lucide-react';
import { familyMembers } from '../services/api';
import { FamilyMember } from '../types';

// Mock gamification data
const mockLeaderboard = [
  { id: '1', name: 'Emma', points: 2450, streak: 14, tasks: 45, badges: 8, avatar: '👩‍🎤' },
  { id: '2', name: 'Jack', points: 1890, streak: 7, tasks: 32, badges: 5, avatar: '👨‍🎨' },
  { id: '3', name: 'Sophie', points: 1650, streak: 10, tasks: 28, badges: 6, avatar: '👧' },
  { id: '4', name: 'Mom', points: 1200, streak: 21, tasks: 55, badges: 12, avatar: '👩' },
  { id: '5', name: 'Dad', points: 950, streak: 5, tasks: 20, badges: 3, avatar: '👨' },
];

const badges = [
  { id: '1', name: 'First Task', icon: '✅', description: 'Complete your first task', earned: true, earnedBy: 'Emma' },
  { id: '2', name: 'Week Warrior', icon: '🔥', description: '7 day streak', earned: true, earnedBy: 'Emma' },
  { id: '3', name: 'Homework Hero', icon: '📚', description: 'Complete 10 homework assignments', earned: true, earnedBy: 'Jack' },
  { id: '4', name: 'Meal Planner', icon: '🍽️', description: 'Plan a week of meals', earned: false, earnedBy: null },
  { id: '5', name: 'Practice Master', icon: '🎵', description: 'Practice 30 days in a row', earned: false, earnedBy: null },
  { id: '6', name: 'Early Bird', icon: '🌅', description: 'Complete tasks before 8am', earned: true, earnedBy: 'Sophie' },
  { id: '7', name: 'Family Leader', icon: '👑', description: 'Top the leaderboard', earned: true, earnedBy: 'Emma' },
  { id: '8', name: 'Streak Legend', icon: '⚡', description: '30 day streak', earned: false, earnedBy: null },
];

const ranks = [
  { name: 'Bronze', minPoints: 0, color: 'from-amber-700 to-amber-600', icon: '🥉' },
  { name: 'Silver', minPoints: 500, color: 'from-gray-400 to-gray-300', icon: '🥈' },
  { name: 'Gold', minPoints: 1500, color: 'from-yellow-500 to-yellow-400', icon: '🥇' },
  { name: 'Platinum', minPoints: 3000, color: 'from-cyan-400 to-blue-500', icon: '💎' },
  { name: 'Diamond', minPoints: 5000, color: 'from-purple-500 to-pink-500', icon: '💠' },
];

export default function Leaderboard() {
  const [timeFilter, setTimeFilter] = useState<'week' | 'month' | 'all'>('week');
  const [family, setFamily] = useState<FamilyMember[]>([]);

  const getRank = (points: number) => ranks.find(r => points >= r.minPoints) || ranks[0];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-white flex items-center justify-center gap-2">
          <Trophy className="w-6 h-6 text-yellow-400" />
          Leaderboard
        </h2>
        <p className="text-gray-400">Compete with your family!</p>
      </div>

      {/* Time Filter */}
      <div className="flex justify-center gap-2">
        {(['week', 'month', 'all'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setTimeFilter(f)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              timeFilter === f
                ? 'bg-primary-500 text-white'
                : 'bg-dark-card text-gray-400 border border-dark-border'
            }`}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {/* Top 3 Podium */}
      <div className="flex justify-center items-end gap-4">
        {/* 2nd Place */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-center"
        >
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-gray-400 to-gray-300 flex items-center justify-center text-2xl mx-auto mb-2 shadow-lg">
            {mockLeaderboard[1].avatar}
          </div>
          <div className="bg-dark-card rounded-xl border border-gray-400/30 p-3 w-24">
            <p className="text-lg font-bold text-gray-300">{mockLeaderboard[1].points}</p>
            <p className="text-xs text-gray-500">pts</p>
          </div>
          <p className="text-gray-300 font-medium mt-2">{mockLeaderboard[1].name}</p>
          <div className="flex items-center justify-center gap-1 text-orange-400">
            <Flame className="w-4 h-4" />
            <span className="text-sm">{mockLeaderboard[1].streak}</span>
          </div>
        </motion.div>

        {/* 1st Place */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <Crown className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-yellow-500 to-yellow-400 flex items-center justify-center text-3xl mx-auto mb-2 shadow-lg shadow-yellow-500/30 animate-pulse-slow">
            {mockLeaderboard[0].avatar}
          </div>
          <div className="bg-dark-card rounded-xl border border-yellow-500/30 p-3 w-28">
            <p className="text-xl font-bold text-yellow-400">{mockLeaderboard[0].points}</p>
            <p className="text-xs text-gray-500">pts</p>
          </div>
          <p className="text-white font-semibold mt-2">{mockLeaderboard[0].name}</p>
          <div className="flex items-center justify-center gap-1 text-orange-400">
            <Flame className="w-4 h-4" />
            <span className="text-sm">{mockLeaderboard[0].streak}</span>
          </div>
        </motion.div>

        {/* 3rd Place */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-center"
        >
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-amber-700 to-amber-600 flex items-center justify-center text-xl mx-auto mb-2 shadow-lg">
            {mockLeaderboard[2].avatar}
          </div>
          <div className="bg-dark-card rounded-xl border border-amber-600/30 p-3 w-22">
            <p className="text-lg font-bold text-amber-600">{mockLeaderboard[2].points}</p>
            <p className="text-xs text-gray-500">pts</p>
          </div>
          <p className="text-gray-400 font-medium mt-2">{mockLeaderboard[2].name}</p>
          <div className="flex items-center justify-center gap-1 text-orange-400">
            <Flame className="w-4 h-4" />
            <span className="text-sm">{mockLeaderboard[2].streak}</span>
          </div>
        </motion.div>
      </div>

      {/* Full Leaderboard */}
      <div className="bg-dark-card rounded-2xl border border-dark-border p-4">
        <h3 className="text-lg font-semibold text-white mb-4">All Members</h3>
        <div className="space-y-3">
          {mockLeaderboard.map((member, index) => {
            const rank = getRank(member.points);
            return (
              <motion.div
                key={member.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`flex items-center gap-3 p-3 rounded-xl ${
                  index < 3 ? 'bg-dark-bg' : 'bg-transparent'
                }`}
              >
                <span className="w-6 text-center font-bold text-gray-500">#{index + 1}</span>
                <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${rank.color} flex items-center justify-center text-lg`}>
                  {member.avatar}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-white">{member.name}</p>
                  <div className="flex items-center gap-3 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <Star className="w-3 h-3 text-yellow-400" /> {member.points}
                    </span>
                    <span className="flex items-center gap-1">
                      <Flame className="w-3 h-3 text-orange-400" /> {member.streak}
                    </span>
                    <span className="flex items-center gap-1">
                      <Medal className="w-3 h-3 text-purple-400" /> {member.badges}
                    </span>
                  </div>
                </div>
                <div className="text-2xl">{rank.icon}</div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Badges */}
      <div className="bg-dark-card rounded-2xl border border-dark-border p-4">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Zap className="w-5 h-5 text-yellow-400" />
          Badges
        </h3>
        <div className="grid grid-cols-4 gap-3">
          {badges.map((badge) => (
            <motion.div
              key={badge.id}
              whileTap={{ scale: 0.95 }}
              className={`flex flex-col items-center gap-1 p-3 rounded-xl ${
                badge.earned 
                  ? 'bg-yellow-500/10 border border-yellow-500/30' 
                  : 'bg-dark-border/30 border border-dark-border opacity-50'
              }`}
            >
              <span className="text-2xl">{badge.icon}</span>
              <span className="text-xs text-center text-gray-400">{badge.name}</span>
              {badge.earned && (
                <span className="text-[10px] text-green-400">✓ {badge.earnedBy}</span>
              )}
            </motion.div>
          ))}
        </div>
      </div>

      {/* Your Progress */}
      <div className="bg-gradient-to-r from-primary-500/20 to-purple-500/20 rounded-2xl border border-primary-500/30 p-4">
        <h3 className="text-lg font-semibold text-white mb-4">Your Progress</h3>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-400">Points to next rank</span>
              <span className="text-primary-400">550 / 1500</span>
            </div>
            <div className="h-3 bg-dark-bg rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: '37%' }}
                transition={{ duration: 1 }}
                className="h-full bg-gradient-to-r from-primary-500 to-purple-500 rounded-full" 
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">Gold rank - 950 points away!</p>
          </div>
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-400">Current streak</span>
              <span className="text-orange-400">7 days 🔥</span>
            </div>
            <div className="h-3 bg-dark-bg rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: '70%' }}
                transition={{ duration: 1 }}
                className="h-full bg-gradient-to-r from-orange-500 to-red-500 rounded-full" 
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">3 more days to Week Warrior badge!</p>
          </div>
        </div>
      </div>
    </div>
  );
}
