'use client'

import { motion } from 'framer-motion'

export function SkillsBar({ skills, primaryColor }: { skills: any[], primaryColor:String}) {
  return (
    <div className="space-y-3">
      {skills.map((skill: any, index: number) => (
        <div key={skill.id} className="flex items-center gap-4">
          <span className={`text-sm w-32 shrink-0 ${primaryColor ? primaryColor: "text-gray-700"}`}>{skill.name}</span>
          <div className="flex-1 bg-gray-100 rounded-full h-2 overflow-hidden">
            <motion.div
              className="bg-indigo-500 h-2 rounded-full"
              initial={{ width: 0 }}
              whileInView={{ width: `${skill.proficiency}%` }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: index * 0.05 }}
            />
          </div>
          <span className="text-xs text-gray-400 w-8 text-right">{skill.proficiency}%</span>
        </div>
      ))}
    </div>
  )
}