import React, { useState } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { RtcEngine, AgoraView } from 'react-native-agora';
import { request, PERMISSIONS } from 'react-native-permissions';

const APP_ID = '7ad3b3f9bb6e46ccad447af67d19260a';

const VideoCallScreen = () => {
  const [engine, setEngine] = useState(null);
  const [joined, setJoined] = useState(false);
  const [muteAudio, setMuteAudio] = useState(false);
  const [muteVideo, setMuteVideo] = useState(false);

  const initAgora = async () => {
    await request(PERMISSIONS.ANDROID.CAMERA);
    await request(PERMISSIONS.ANDROID.RECORD_AUDIO);

    const agoraEngine = await RtcEngine.create(APP_ID);
    await agoraEngine.enableVideo();
    await agoraEngine.enableAudio();

    agoraEngine.addListener('JoinChannelSuccess', () => {
      setJoined(true);
    });

    agoraEngine.addListener('UserOffline', () => {
      setJoined(false);
    });

    setEngine(agoraEngine);
  };

  const startCall = async () => {
    await engine?.joinChannel(null, 'test-channel', null, 0);
  };

  const endCall = async () => {
    await engine?.leaveChannel();
    setJoined(false);
  };

  const toggleMuteAudio = async () => {
    await engine?.muteLocalAudioStream(!muteAudio);
    setMuteAudio(!muteAudio);
  };

  const toggleMuteVideo = async () => {
    await engine?.muteLocalVideoStream(!muteVideo);
    setMuteVideo(!muteVideo);
  };

  React.useEffect(() => {
    initAgora();
    return () => {
      engine?.destroy();
    };
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Agora Video Call</Text>
      {joined ? (
        <>
          <AgoraView style={styles.fullView} showLocalVideo={true} />
          <View style={styles.buttonContainer}>
            <Button title={`${muteAudio ? 'Unmute' : 'Mute'} Audio`} onPress={toggleMuteAudio} />
            <Button title={`${muteVideo ? 'Turn On' : 'Turn Off'} Video`} onPress={toggleMuteVideo} />
            <Button title="End Call" onPress={endCall} />
          </View>
        </>
      ) : (
        <Button title="Start Video Call" onPress={startCall} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    fontSize: 20,
    marginBottom: 20,
  },
  fullView: {
    width: '100%',
    height: '80%',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 20,
  },
});

export default VideoCallScreen;
