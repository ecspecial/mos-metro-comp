import React, { useEffect, useRef } from 'react';
import { DataSet, Timeline } from 'vis-timeline/standalone';
import 'vis-timeline/styles/vis-timeline-graph2d.min.css';

type Application = {
  id: number;
  description: string;
  category: string;
  startTime: string;
  endTime: string;
};

const TimelineChart: React.FC<{ applications: Application[] }> = ({ applications }) => {
  const timelineRef = useRef<HTMLDivElement | null>(null);
  const timeline = useRef<Timeline | null>(null);

  useEffect(() => {
    if (timelineRef.current) {
      const items = new DataSet(
        applications.map((application) => ({
          id: application.id,
          content: application.category,
          start: application.startTime,
          end: application.endTime,
        }))
      );

      const options = {
        editable: true,
        margin: {
          item: 10,
          axis: 5,
        },
        orientation: 'top',
        showCurrentTime: true,
        locale: 'ru',
        zoomMin: 1000 * 60 * 60 * 1, // One hour in milliseconds
        zoomMax: 1000 * 60 * 60 * 24, // One day in milliseconds
      };

      if (timeline.current) {
        timeline.current.setItems(items);
      } else {
        timeline.current = new Timeline(timelineRef.current, items, options);
      }
    }
  }, [applications]);

  return <div ref={timelineRef} style={{ marginBottom: '20px' }} />;
};

export default TimelineChart;