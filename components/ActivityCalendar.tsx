"use client"

import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip"

interface ActivityCalendarProps {
  className?: string
  title?: string
  showTitle?: boolean
  showLegend?: boolean
  showStats?: boolean
  showInfographic?: boolean
}

export default function ActivityCalendar({ 
  className = "",
  title = "Your Daily Journal Log",
  showTitle = true,
  showLegend = true,
  showStats = true,
}: ActivityCalendarProps) {

  const activityData = useQuery(api.stories.getActivityData)
  const storyStats = useQuery(api.stories.getStoryStats)

  return (
    <TooltipProvider delayDuration={300}>
      <div className={`space-y-3 ${className}`}>
        {showTitle && (
          <h2 className="text-lg font-medium text-foreground font-serif">{title}</h2>
        )}
        
        <div className="p-4 border border-border rounded-lg bg-card w-fit mx-auto">
          <div className="mb-2">
            <p className="text-sm text-muted-foreground">Stories created in the past year</p>
          </div>
          
          {/* Calendar with month headers and weekday labels */}
          <div className="flex flex-col gap-1 overflow-x-auto min-w-fit">
            {activityData && (
              <>
                {/* Month labels row */}
                <div className="grid grid-cols-[20px_repeat(53,13px)] gap-0.5 items-center">
                  <div></div> {/* Empty space for top-left corner */}
                  {(() => {
                    const months = []
                    let currentMonth = ''
                    
                    for (let i = 0; i < activityData.length; i += 7) {
                      const date = new Date(activityData[i].date)
                      const monthName = date.toLocaleDateString('en-US', { month: 'short' })
                      
                      if (monthName !== currentMonth) {
                        months.push(monthName)
                        currentMonth = monthName
                      } else {
                        months.push('')
                      }
                    }
                    
                    return months.map((month, index) => (
                      <div key={index} className="text-[10px] text-muted-foreground text-left leading-none font-medium py-0.5">
                        {month}
                      </div>
                    ))
                  })()}
                </div>
                
                {/* Combined calendar with weekday labels */}
                <div className="flex gap-1.5 items-start justify-start">
                  {/* Weekday labels column */}
                  <div className="flex flex-col gap-0.5 w-[30px]">
                    <div className="text-[9px] text-muted-foreground text-right leading-3 font-medium h-3 flex items-center justify-end pr-1">Mon</div>
                    <div className="text-[9px] text-muted-foreground text-right leading-3 font-medium h-3 flex items-center justify-end pr-1">Tue</div>
                    <div className="text-[9px] text-muted-foreground text-right leading-3 font-medium h-3 flex items-center justify-end pr-1">Wed</div>
                    <div className="text-[9px] text-muted-foreground text-right leading-3 font-medium h-3 flex items-center justify-end pr-1">Thu</div>
                    <div className="text-[9px] text-muted-foreground text-right leading-3 font-medium h-3 flex items-center justify-end pr-1">Fri</div>
                    <div className="text-[9px] text-muted-foreground text-right leading-3 font-medium h-3 flex items-center justify-end pr-1">Sat</div>
                    <div className="text-[9px] text-muted-foreground text-right leading-3 font-medium h-3 flex items-center justify-end pr-1">Sun</div>
                  </div>
                  
                  {/* Main calendar grid */}
                  <div className="grid grid-cols-[repeat(53,12px)] grid-rows-[repeat(7,12px)] gap-0.5 grid-flow-col justify-start p-0.5">
                    {activityData.map((day, index) => {
                      const isToday = day.date === new Date().toISOString().split('T')[0]
                      const date = new Date(day.date)
                      const dayName = date.toLocaleDateString('en-US', { weekday: 'long' })
                      const monthDay = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                      const tooltipText = `${dayName}, ${monthDay}: ${day.stories} ${day.stories === 1 ? 'story' : 'stories'} created${isToday ? ' (TODAY)' : ''}`
                      
                      // Determine background color based on level
                      const getLevelColor = (level: number) => {
                        switch (level) {
                          case 0: return 'bg-gray-200 dark:bg-gray-600'
                          case 1: return 'bg-pink-100 dark:bg-pink-900/30'
                          case 2: return 'bg-pink-300 dark:bg-pink-700/50'
                          case 3: return 'bg-pink-400 dark:bg-pink-600/70'
                          case 4: return 'bg-pink-500 dark:bg-pink-500'
                          default: return 'bg-gray-200 dark:bg-gray-600'
                        }
                      }
                      
                      return (
                        <Tooltip key={index} disableHoverableContent={true}>
                          <TooltipTrigger asChild>
                            <div
                              className={`w-3 h-3 rounded-sm cursor-pointer relative hover:outline-1 hover:outline-pink-500/60 hover:outline-offset-1 ${getLevelColor(day.level)} ${
                                isToday ? 'outline-2 outline-pink-500 outline-offset-1' : ''
                              }`}
                              style={{
                                gridColumn: Math.floor(index / 7) + 1,
                                gridRow: (index % 7) + 1
                              }}
                            />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>{tooltipText}</p>
                          </TooltipContent>
                        </Tooltip>
                      )
                    })}
                  </div>
                </div>
              </>
            )}
            
            {!activityData && (
              /* Loading state */
              <div className="grid grid-cols-[repeat(53,12px)] grid-rows-[repeat(7,12px)] gap-0.5 grid-flow-col justify-start p-0.5">
                {[...Array(365)].map((_, index) => (
                  <Tooltip key={index}>
                    <TooltipTrigger asChild>
                      <div
                        className="w-3 h-3 rounded-sm bg-gray-200 dark:bg-gray-600 cursor-pointer"
                        style={{
                          gridColumn: Math.floor(index / 7) + 1,
                          gridRow: (index % 7) + 1
                        }}
                      />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Loading...</p>
                    </TooltipContent>
                  </Tooltip>
                ))}
              </div>
            )}
          </div>
          
          {(showStats || showLegend) && (
            <div className="mt-2 flex items-center justify-between">
              {showStats && (
                <div className="text-xs text-muted-foreground">
                  <span className="font-medium">
                    {storyStats ? storyStats.totalStories : 0}
                  </span> stories created in the past year
                </div>
              )}
              {showLegend && (
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span>Less</span>
                  <div className="flex gap-1">
                    <div className="w-3 h-3 rounded-sm bg-gray-200 dark:bg-gray-600"></div>
                    <div className="w-3 h-3 rounded-sm bg-pink-100 dark:bg-pink-900/30"></div>
                    <div className="w-3 h-3 rounded-sm bg-pink-300 dark:bg-pink-700/50"></div>
                    <div className="w-3 h-3 rounded-sm bg-pink-400 dark:bg-pink-600/70"></div>
                    <div className="w-3 h-3 rounded-sm bg-pink-500 dark:bg-pink-500"></div>
                  </div>
                  <span>More</span>
                </div>
              )}
            </div>
          )}
        </div>
        
      </div>
    </TooltipProvider>
  )
}
