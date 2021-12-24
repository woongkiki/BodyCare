import React from 'react';
import { StyleSheet, Dimensions} from 'react-native';
import Font from './Font';

const {width} = Dimensions.get('window');

export default StyleSheet.create({
    p:{
        fontSize:15,
        fontFamily: Font.RobotoRegular,
        color: '#333',
        margin:0,
        padding:0,
    },
    img: {
        width:width
    }
})