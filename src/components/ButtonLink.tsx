import React from "react";
import { StyleSheet, Text, TouchableOpacity, TouchableOpacityProps } from "react-native";

import { colors } from "@/theme/colors";

type IButtonProps = TouchableOpacityProps & {
    description: string
}
export default function ButtonLink({description, onPress, style}: IButtonProps) {
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
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        paddingVertical: 10
    },
    buttonText: {
        color: colors.white[700],
        fontSize: 16,
        textDecorationLine: "underline"
    }
});