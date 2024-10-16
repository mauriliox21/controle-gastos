import React, { useEffect, useState } from "react";
import { StyleSheet, TextInput, TextInputProps } from "react-native";
import FormGroup from "./FormGroup";
import { colors } from "@/theme/colors";

type IInputProps = TextInputProps & {
    label: string,
    erroMsg?: string|null, 
}

export default function Input({ label, erroMsg = null, value, onChangeText,secureTextEntry, keyboardType }:IInputProps) {
    const [inFocus, setInFocus] = useState(false);
    const [hasError, setHasError] = useState(!!erroMsg);

    useEffect(() => {
        setHasError(!!erroMsg)
    }, [erroMsg]);

    return (
        <FormGroup label={label} erroMsg={erroMsg}>
            <TextInput 
                style={[styles.input, (inFocus && styles.inputFocus), (hasError && styles.inputErro)]} 
                onFocus={() => setInFocus(true)} 
                onBlur={() => setInFocus(false)}
                value={value}
                onChangeText={onChangeText}
                secureTextEntry={secureTextEntry}
                keyboardType={keyboardType}
            />
        </FormGroup>
    );
}

const styles = StyleSheet.create({
    input: {
        backgroundColor: colors.gray[500],
        color: colors.white[800],
        height: 50,
        borderRadius: 5,
        borderColor: '#333',
        borderWidth: 1,
        fontSize: 22, 
        paddingHorizontal: 10,
        paddingTop: 6,
        paddingBottom: 8
    },
    inputFocus: {
        borderColor: colors.purple[800],
        backgroundColor: colors.gray[600],
    },
    inputErro: {
        borderColor: colors.red[600]
    }
})