import { connect } from 'react-redux';
import ButtonToNextScene from './ButtonToNextScene';
import isEligible, { isSingle } from '../questionnaire/isEligible';
import getMatchingSchedule, { schedule } from '../experiment/getMatchingSchedule';
import { experimentEnded, postAll } from '../actions';
import questions from '../experiment/questions';
import { LAST_TIME_OUT_QUESTION } from '../constants';

const [lastQuestion] = questions[questions.length - 1];

const getNextScene = (state, ownProps) => {
  switch (ownProps.header) {
    case 'QUESTION 19':
      if (!isEligible(state.answers)) {
        return 'NotEligible';
      } else if (isSingle(state)) {
        return 'InstructionTest';
      }
      break;
    case 'QUESTION 22':
      if (state.answers['QUESTION 20'].index < 2) {
        return 'NotEligible';
      }
      break;
    case lastQuestion: {
      const newSchedule = { ...state.notificationSchedule, [schedule]: { hasEnded: true } };
      const newRoute = getMatchingSchedule(newSchedule, undefined, true);
      if (newRoute === 'GetData') {
        return newRoute;
      }
      break;
    }
    default:
      break;
  }
  return ownProps.nextScene;
};

const mapStateToProps = (state, ownProps) => ({
  nextScene: getNextScene(state, ownProps),
  startTime: (state.notificationSchedule[schedule] || {}).startTime,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  onPress: () => {
    if (ownProps.onPress) ownProps.onPress();
    if (
      [LAST_TIME_OUT_QUESTION, lastQuestion].includes(ownProps.header) ||
      ownProps.header.startsWith('QUESTION')
    ) {
      if (schedule) {
        dispatch(experimentEnded(schedule));
      }
      dispatch(postAll());
    }
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(ButtonToNextScene);
