import { colors } from "@/theme/colors";
import { useState } from "react";
import { View, ViewProps, Text, StyleSheet, } from "react-native";
type IFormGroupProps = ViewProps & {
    label?: string,
    erroMsg?: string|null
}
export default function FormGroup({label, erroMsg = null, children}: IFormGroupProps) {

    return (
        <View style={styles.formGroup}>
            {label && <Text style={styles.label}>{label}</Text>}
            {children}
            {erroMsg && <Text style={styles.erroMsg}>{erroMsg}</Text>}
        </View>
    );
}

const styles = StyleSheet.create({
    formGroup: {
        gap: 5,
        marginVertical: 10
    },
    label: {
        color: colors.white[700],
        fontSize: 20,
    },
    erroMsg: {
        color: colors.red[600]
    }
});