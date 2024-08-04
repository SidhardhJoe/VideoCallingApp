import React from 'react';
import { View, Button, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';


const HomePage = () => {
    const { navigate } = useNavigation();
  return (
    <View style={styles.container}>
      <Button title="Start Video Call" onPress={() => navigate('VideoCall')} />
    </View>
  )
}

export default HomePage

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      },
})