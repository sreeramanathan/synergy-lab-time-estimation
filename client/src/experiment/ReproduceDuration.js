import React from 'react';
import { StyleSheet, Text, View, ScrollView, Alert } from 'react-native';
import { Actions } from 'react-native-router-flux';
import Button from '../components/Button';
import { getNextScene } from '../experiment/getMatchingSchedule';
import { getRemainingSequence } from './ReadyScreen';

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  header: {
    color: 'white',
    marginTop: 50,
    marginLeft: 20,
    marginRight: 20,
    fontSize: 25,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  instructionContainer: {
    flexDirection: 'row',
  },
  instructions: {
    backgroundColor: 'lightgrey',
    marginTop: 20,
    paddingRight: 15,
    paddingLeft: 15,
    borderRadius: 10,
    borderWidth: 10,
    borderColor: 'lightgrey',
    flex: 0.8,
  },
  instructionTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    padding: 6,
    textAlign: 'center',
  },
  button: {
    padding: 10,
    marginTop: 40,
    borderRadius: 5,
    width: 120,
  },
  buttonText: {
    textAlign: 'center',
    fontWeight: 'bold',
  },
});

class ReproduceDuration extends React.Component {
  state = {
    startTimer: undefined,
  }
  componentDidMount() {
    this.timeBetweenMountAndStart = Date.now();
  }
  render() {
    const props = this.props;
    return (
      <ScrollView>
        <View style={styles.container}>
          <Text style={styles.header}>HOW LONG WAS THE SCREEN RED FOR?</Text>
          <View style={styles.instructionContainer}>
            <View style={{ flex: 0.1 }} />
            <View style={styles.instructions}>
              <Text style={styles.instructionTitle}>Reproduce the duration</Text>
              <View style={{ flexDirection: 'row', marginBottom: 5 }}>
                <Text>1. </Text>
                <Text>Press 'START' when you're ready</Text>
              </View>
              <View style={{ flexDirection: 'row' }}>
                <Text>2. </Text>
                <Text style={{ marginBottom: 5 }}>Press 'STOP' when you think you've reproduced the duration the screen was red for.</Text>
              </View>
              <Text style={styles.text}>Remember:</Text>
              <View style={{ flexDirection: 'row', marginBottom: 2 }}>
                <Text>- </Text>
                <Text><Text style={{ textDecorationLine: 'underline' }}>Don't count</Text> how much time has passed</Text>
              </View>
              <View style={{ flexDirection: 'row' }}>
                <Text>- </Text>
                <Text>We're interested in what it
                  <Text style={{ fontStyle: 'italic' }}> feels like</Text> to you
                </Text>
              </View>
            </View>
            <View style={{ flex: 0.1 }} />
          </View>
          <Button
            text="START TIMER"
            style={[styles.button, { backgroundColor: '#00e500' }]}
            disabled={!!this.state.startTimer}
            onPress={() => {
              const currentTime = Date.now();
              this.setState({ startTimer: currentTime });
              this.timeBetweenMountAndStart = currentTime - this.timeBetweenMountAndStart;
            }}
          />
          <Button
            text="STOP TIMER"
            style={[styles.button, { backgroundColor: 'red' }]}
            disabled={!this.state.startTimer}
            onPress={() => {
              const duration = Date.now() - this.state.startTimer;
              props.updateDuration({
                recordedDuration: duration,
                timeBetweenMountAndStart: this.timeBetweenMountAndStart,
              });
              if (props.startTime) { // for actual experiment
                const seq = getRemainingSequence(props.answers);
                if (seq.length === 0) {
                  console.log('All random sequence generated');
                  Actions.replace(getNextScene('Question 2', props.startTime));
                  return;
                }
              }

              if (duration < 1000 && props.answers[props.answers.length - 1].redDuration > 2000) {
                if (!props.startTime) { // for trial
                  Actions.replace('FailedTrial');
                  return;
                }
                if (!props.hasWarned) {
                  props.experimentWarned();
                  Alert.alert('Please do not multi-task', "It's important for us to collect good data");
                }
                // only repeat once
                if ((props.answers[props.answers.length - 2] || {}).round !== props.roundNum) {
                  Actions.replace(getNextScene(`ReadyTransition${props.roundNum}`, props.startTime));
                  return;
                }
              }
              Actions.replace(getNextScene(props.nextScene, props.startTime));
            }}
          />
        </View>
      </ScrollView>
    );
  }
}

export default ReproduceDuration;
