import React, { useEffect, useState } from 'react';
import Style from './Progress.module.css'; // Add your CSS for styling the progress bar

const Progress = ({ strokeWidth, className }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prevProgress) => (prevProgress >= 100 ? 0 : prevProgress + 1));
    }, 30); // Adjust the interval speed as needed

    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <div className={Style.popoverlay}>
    <div className={Style.progressbarcontainer}>
      <svg className={Style.progressbar} viewBox="0 0 100 100">
        <circle
          className={Style.progressbarfill}
          strokeWidth={strokeWidth}
          style={{ strokeDasharray: 200, strokeDashoffset: 200 - progress * 2}}
          r="40"
          cx="50"
          cy="50"
        />
      </svg>
    </div>

    </div>
  );
};

export default Progress;
