import React from 'react';

import DIFFICULTIES from './DIFFICULTIES';

const formatDuration = (duration) => {
  const seconds = Math.floor(duration % 60);
  return `${Math.floor(duration / 60)}:${seconds < 10 ? `0${seconds}` : seconds}`;
};

const Fight = ({ difficulty, name, kill, start_time, end_time, wipes, ...others }) => {
  const duration = Math.round((end_time - start_time) / 1000);

  delete others.boss;
  delete others.bossPercentage;
  delete others.partial;
  delete others.fightPercentage;
  delete others.lastPhaseForPercentageDisplay;

  return (
    <div {...others}>
      {DIFFICULTIES[difficulty]} {name} - <span className={kill ? 'kill' : 'wipe'}>{kill ? 'Kill' : `Wipe ${wipes}`} ({formatDuration(duration)})</span>
    </div>
  );
};
Fight.propTypes = {
  id: React.PropTypes.number.isRequired,
  difficulty: React.PropTypes.number.isRequired,
  boss: React.PropTypes.number.isRequired,
  start_time: React.PropTypes.number.isRequired,
  end_time: React.PropTypes.number.isRequired,
  name: React.PropTypes.string.isRequired,
  kill: React.PropTypes.bool.isRequired,
};

export default Fight;
