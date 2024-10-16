import { useEffect, useState } from "react";
import { Dimensions, FlatList, Modal, StyleSheet, Text, TextInput, TouchableOpacity, View, ViewStyle } from "react-native";
import { MotiTransitionProp, MotiView, StyleValueWithReplacedTransforms, useAnimationState } from "moti";
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import FormGroup from "@/components/FormGroup";
import { colors } from "@/theme/colors";


type SelectProps = {
    data: any[],
    keyOfName: string,
    keyOfValue: string,
    onChange: (value: string) => void,
    value: string
    addEmptyValue?: boolean
    labelEmptyValue?: string
}

export default function Select({data, keyOfName, keyOfValue, onChange, value, addEmptyValue = false, labelEmptyValue = ''}: SelectProps) {

    const [selected, setSelected] = useState('');
    const [opened, setOpened] = useState(false);

    const emptyValue: any = {};
    emptyValue[keyOfName] = labelEmptyValue;
    emptyValue[keyOfValue] = "";

    const animationState = useAnimationState({
        from: {
            height: '0%'
        },
        to: {
            height: '0%'
        },
        expanded:{
            height: '100%'
        }
    });
      
    const toggleAnimationState = () => {
        setOpened(!opened)
        if (animationState.current === 'expanded') {
            animationState.transitionTo('from');
        }
        else{
            animationState.transitionTo('expanded');
        }
    }

    const changeValue = (selectedValue: string) => {

        onChange(selectedValue);
        if(selectedValue)
            setSelected(data.filter(item => item[keyOfValue] === selectedValue)[0][keyOfName]);
        else
            setSelected(labelEmptyValue);
        
        toggleAnimationState();
    }

    useEffect(() => {
        if(!value)
            setSelected('');
    }, [value]);

    return (
        <>
            <FormGroup label={"Categoria"} erroMsg={""}>
                <View style={styles.selectView} >
                    <TextInput 
                        value={selected}
                        style={[styles.selectText]} 
                        readOnly
                    />
                    <TouchableOpacity style={styles.selectPressable} onPress={() => toggleAnimationState()}>
                        {/* <Text style={styles.chevron}>V</Text> */}
                        <FontAwesome6 style={styles.chevron} name="chevron-down" size={20} color={colors.white[700]} />
                    </TouchableOpacity>
                </View>
            </FormGroup>
            <Modal
                animationType="slide"
                transparent
                visible={opened}
                onRequestClose={() => setOpened(false)}
            >
                <TouchableOpacity style={{height: '100%', width: '100%'}} onPress={() => toggleAnimationState()}>
                    <FlatList
                        data={[(addEmptyValue && emptyValue),...data]} 
                        renderItem={({item}) => (
                            <TouchableOpacity style={styles.containerItem} onPress={() => changeValue(item[keyOfValue])}>
                                <Text style={styles.textItem}>{item[keyOfName]}</Text>
                            </TouchableOpacity>
                        )} 
                        style={styles.modal}
                        keyExtractor={(item) => item[keyOfValue]}
                    />
                </TouchableOpacity>
            </Modal>
        </>
    )
}

const styles = StyleSheet.create({
    selectView: {
        justifyContent: 'center',
        height: 56
    },
    selectPressable: {
        zIndex: 1000,
        justifyContent: 'center',
        position: 'absolute',
        height: '100%',
        width: '100%'
    },
    selectText: {
        backgroundColor: colors.gray[500],
        color: colors.white[800],
        borderRadius: 5,
        borderColor: '#333',
        borderWidth: 1,
        fontSize: 22, 
        paddingHorizontal: 10,
        paddingTop: 6,
        paddingBottom: 8,
        height: '100%'
    },
    inputFocus: {
        borderColor: colors.purple[800],
        backgroundColor: colors.gray[600],
    },
    inputErro: {
        borderColor: colors.red[600]
    },
    chevron: {
        alignSelf: 'flex-end',
        fontSize: 20,
        color: colors.white[700],
        position: 'relative',
        right: 10
    },
    containerData:{
        backgroundColor: colors.black[400],
        maxHeight: Dimensions.get('window').height / 3,
        width: Dimensions.get('window').width ,
        position: "absolute",
        left: 0,
        bottom: 0,
        zIndex: 1000
    },
    containerItem:{
        paddingVertical: 10,
        paddingHorizontal: 10,
        width: '100%',
        backgroundColor: colors.black[400],
        borderTopColor: colors.gray[500],
        borderTopWidth: 2
    },
    textItem:{
        color: colors.white[700],
        fontSize: 20
    },
    modal: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        width: '100%',
        maxHeight: Dimensions.get('window').height / 3,
        backgroundColor: colors.black[400]
    }
})