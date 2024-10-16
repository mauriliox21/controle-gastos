import { colors } from "@/theme/colors";
import { useEffect, useState } from "react";
import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";

type IModalAlertProps = {
    message: string
}

export function hadleMensage(message: string, changeMessage: (m: string) => void, timing: number){
    changeMessage(message);
    setTimeout(() => changeMessage(""), timing);
}

export default function ModalAlert({message}:IModalAlertProps) {
    return (
        <Modal
            animationType="slide"
            transparent
            visible={!!message}
        >
            <View style={styles.centeredView}>
                <View style={styles.modalView}>
                    <Text style={styles.modalText}>{message}</Text>
                </View>
            </View>
        </Modal>
    );
}


const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: 'flex-start',
        paddingHorizontal: 25,
        paddingTop: 10
    },
    modalView: {
        backgroundColor: colors.orange[500],
        borderRadius: 20,
        padding: 25,
        alignItems: 'center',
        justifyContent: 'center'
    },
    textStyle: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    modalText: {
        textAlign: 'center',
        color: colors.white[900],
        fontWeight: 'bold',
        alignSelf: 'center',
        fontSize: 16
    },
});