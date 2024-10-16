import { colors } from "@/theme/colors";
import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";

type IModalConfirmDeleteProps = {
    visible: boolean,
    onClose: () => void,
    onConfirm: () => void,
    onCancel: () => void,
}

export default function ModalConfirmDelete({visible, onClose, onCancel, onConfirm}:IModalConfirmDeleteProps) {
    return (
        <Modal
            animationType="slide"
            transparent
            visible={visible}
            onRequestClose={onClose}
        >
            <View style={styles.centeredView}>
                <View style={styles.modalView}>
                    <Text style={styles.modalText}>Deseja excluir este Registro?</Text>
                    <View style={styles.containerButtons}>
                        <TouchableOpacity
                            style={[styles.button, styles.buttonConfirm]}
                            onPress={onConfirm}>
                            <Text style={styles.textStyle}>SIM</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.button, styles.buttonCancel]}
                            onPress={onCancel}>
                            <Text style={styles.textStyle}>NÃO</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
}


const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 22,
    },
    modalView: {
        margin: 20,
        backgroundColor: colors.black[300],
        borderRadius: 20,
        padding: 25,
        alignItems: 'center',
    },
    containerButtons: {
        flexDirection: 'row',
        gap: 10
    },
    button: {
        borderRadius: 20,
        paddingHorizontal: 20,
        paddingVertical: 10,
        elevation: 2
    },
    buttonConfirm: {
        backgroundColor: colors.green[600],
    },
    buttonCancel: {
        backgroundColor: colors.red[600],
    },
    textStyle: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    modalText: {
        marginBottom: 15,
        textAlign: 'center',
        color: colors.white[700],
        fontWeight: 'bold'
    },
});