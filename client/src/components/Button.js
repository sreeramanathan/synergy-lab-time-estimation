import React from 'react';
import { StyleSheet, Text, TouchableHighlight } from 'react-native';

const styles = StyleSheet.create({
  button: {
    padding: 10,
    margin: 10,
    borderRadius: 5,
    width: 120,
    backgroundColor: 'white',
  },
  buttonText: {
    textAlign: 'center',
    fontWeight: 'bold',
  },
});

const Button = ({ text, onPress, disabled, style }) => (
  <TouchableHighlight
    style={[styles.button, style, { opacity: disabled ? 0.5 : 1 }]}
    onPress={onPress}
    disabled={disabled}
  >
    <Text style={styles.buttonText}>{text}</Text>
  </TouchableHighlight>
);

export default Button;
