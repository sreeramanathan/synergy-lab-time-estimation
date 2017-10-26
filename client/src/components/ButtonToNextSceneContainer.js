import { connect } from 'react-redux';
import ButtonToNextScene from './ButtonToNextScene';
import isEligible from '../questionnaire/isEligible';
import api from '../api';
import getMatchingSchedule, { schedule } from '../experiment/getMatchingSchedule';
import { experimentEnded } from '../actions';

const isLast = header => ['SESSION TIMED OUT', 'Question 5'].includes(header);

const mapStateToProps = (state, ownProps) => {
  const answer = schedule
    ? (state.experimentAnswers[schedule] || {})[ownProps.header]
    : state.answers[ownProps.header];

  let nextScene = ownProps.nextScene;
  if (ownProps.header === 'QUESTION 22' && !isEligible(state.answers)) {
    nextScene = 'NotEligible';
  } else if (isLast(ownProps.header)) {
    const newSchedule = { ...state.notificationSchedule, [schedule]: { hasEnded: true } };
    const newRoute = getMatchingSchedule(newSchedule, undefined, true);
    if (newRoute === 'RewardScreen' || ownProps.header === 'SESSION TIMED OUT') {
      nextScene = newRoute;
    }
  }
  return {
    nextScene,
    startTime: (state.notificationSchedule[schedule] || {}).startTime,
    disabled: ownProps.disabled !== undefined ? ownProps.disabled :
      answer === undefined ||
      (answer[-1] !== undefined && typeof answer[-1] === 'string' && (answer[-1] || '').trim() === '') || // for TextInputResponse
      Object.entries(answer || {}).every(([key, value]) => key === 'time' || value === undefined), // for CheckboxList
    onPress: (finishedExperiment) => {
      if (ownProps.onPress) ownProps.onPress();
      if (schedule) {
        if (isLast(ownProps.header)) {
          finishedExperiment(schedule);
        }
        api.postExperimentAnswer({
          answer,
          schedule,
          question: ownProps.header,
        });
      } else {
        api.postAnswer({
          answer,
          question: ownProps.header,
        });
      }
    },
  };
};

const mergeProps = (stateProps, dispatchProps, ownProps) => ({
  ...ownProps,
  ...stateProps,
  onPress: () => stateProps.onPress(dispatchProps.experimentEnded),
});

export default connect(
  mapStateToProps,
  { experimentEnded },
  mergeProps,
)(ButtonToNextScene);
