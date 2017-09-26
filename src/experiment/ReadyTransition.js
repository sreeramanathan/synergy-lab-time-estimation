import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Actions } from 'react-native-router-flux';

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
  },
  turned: {
    backgroundColor: 'red',
  },
  plus: {
    color: 'white',
    fontSize: 50,
    marginTop: 212,
  },
});

class ReadyTransition extends React.Component {
  state = {
    turned: false,
  }
  componentDidMount() {
    setTimeout(() => {
      this.setState({ turned: true });
    }, (Math.floor(Math.random() * 3) + 1) * 1000,
    setTimeout(() => {
      Actions.replace('ReproduceDuration');
    }, 1000 * { 0: 2, 1: 6, 2: 10 }[Math.floor(Math.random() * 3)]));
  }
  render() {
    return (
      <View style={[styles.container, this.state.turned && styles.turned]}>
        <Text style={styles.plus} >+</Text>
      </View>
    );
  }
}

export default ReadyTransition;
