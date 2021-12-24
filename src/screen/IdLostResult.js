import React from 'react';
import { TouchableOpacity, StyleSheet, Platform, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { Box, VStack, HStack, Image, Input  } from 'native-base';
import HeaderDef from '../components/HeaderDef';
import { DefText } from '../common/BOOTSTRAP';
import { phoneFormat } from '../common/dataFunction';
import Font from '../common/Font';


const IdLostResult = (props) => {

    const {navigation, route} = props;

    //console.log('아이디 찾기 결과 : ', route);

    return (
        <Box flex={1} backgroundColor='#fff'>
            <HeaderDef headertitle='아이디 찾기' navigation={navigation} />
        </Box>
    );
};

export default IdLostResult;