import React from "react";
import { StyleSheet, Text, TouchableOpacity, TouchableOpacityProps } from "react-native";

import { colors } from "@/theme/colors";

type IButtonProps = TouchableOpacityProps & {
    description: string
}
export default function Button({description, onPress, style}: IButtonProps) {
    return (
        <TouchableOpacity 
            style={[styles.button, style]} 
            onPress={onPress}
        >
            <Text style={styles.buttonText}>{description}</Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    button: {
        backgroundColor: colors.purple[500],
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10,
        borderRadius: 5,
        width: '70%',
        alignSelf: 'center'
    },
    buttonText: {
        color: colors.white[700],
        fontSize: 20,
        fontWeight: 'bold'
    }
});