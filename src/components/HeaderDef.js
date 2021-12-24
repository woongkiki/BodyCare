import React from 'react';
import { Box, HStack, Text, Image } from 'native-base';
import { TouchableOpacity } from 'react-native';
import { DefText } from '../common/BOOTSTRAP';
import Font from '../common/Font';

const HeaderDef = (props) => {

    const {navigation, headertitle, onPress} = props;

    return (
        <Box backgroundColor='#fff' px={5} py={4} borderBottomWidth={1} borderBottomColor='#F2F2F2' >
            <HStack alignItems='center' >
                
                <TouchableOpacity onPress={ onPress ? onPress : ()=>{navigation.goBack()} } style={[{marginRight:25}]}>
                    <Image source={require('../images/backButton.png')} alt='뒤로가기' />
                </TouchableOpacity>
                <DefText text={headertitle} style={{fontSize:18, fontFamily:Font.RobotoBold, color:'#000' }} />
               
            </HStack>
        </Box>
    );
};

export default HeaderDef;