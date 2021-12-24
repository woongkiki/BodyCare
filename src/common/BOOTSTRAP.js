import React from 'react';
import { TouchableOpacity, TextInput, Platform } from 'react-native';
import { Box, Text, Image } from 'native-base';
import Font from '../common/Font';

export const DefText = ({text, style}) => {
    return(
        <Text textBreakStrategy='highQuality' fontSize={14} color='#000' style={[{fontFamily:Font.RobotoRegular}, style]}>{text}</Text>
    )
}