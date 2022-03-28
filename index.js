/**
 * @format
 */
import React from 'react';
 import {AppRegistry, Text, TextInput, Platform} from 'react-native';
 import messaging from '@react-native-firebase/messaging';
 import App from './App';
 import {name as bodycareapp} from './app.json';
 
 Text.defaultProps = Text.defaultProps || {};
 Text.defaultProps.allowFontScaling = false;
 
 TextInput.defaultProps = TextInput.defaultProps || {};
 TextInput.defaultProps.allowFontScaling = false;

messaging().setBackgroundMessageHandler(async (remoteMessage) => {
    console.log('Message handled in the background!', remoteMessage);
});


  
function HeadlessCheck({isHeadless}) {
    if (isHeadless) {
      // App has been launched in the background by iOS, ignore
      return null;
    }
  
    return <App />;
  }

AppRegistry.registerComponent(bodycareapp, () => HeadlessCheck);
 

 