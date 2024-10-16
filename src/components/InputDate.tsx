import React, { useEffect, useState } from "react";
import { StyleSheet, TextInput, TextInputProps, TouchableOpacity } from "react-native";
import DatePicker from "react-native-date-picker";
import FormGroup from "./FormGroup";
import { colors } from "@/theme/colors";

type IInputDateProps = {
    label?: string,
    erroMsg?: string|null, 
    onChangeDate?: (date: Date) => void
    value?: Date|null
}

export default function InputDate({ label, erroMsg = null, value = null, onChangeDate}:IInputDateProps) {
    const [inFocus, setInFocus] = useState(false);
    const [hasError, setHasError] = useState(!!erroMsg);
    const [open, setOpen] = useState(false);
    const [date, setDate] = useState(value ?? new Date());
    const [dateAsText, setDateAsText] = useState('');

    useEffect(() => {
        setHasError(!!erroMsg)
    }, [erroMsg]);

    useEffect(() => {
        setDate(value??new Date())
    }, [value]);

    useEffect(() => {
        const day = date.getDate().toString().padStart(2, "0");
        const month = (date.getMonth() + 1).toString().padStart(2, "0");
        const year = date.getFullYear();
        setDateAsText(day + '/' + month + '/' + year);
        
        if(onChangeDate !== undefined)
            onChangeDate(date);

    }, [date]);

    return (
        <>
            <FormGroup label={label} erroMsg={erroMsg}>
                <TouchableOpacity onPress={() => setOpen(!open)}>
                    <TextInput 
                        style={[styles.input, (inFocus && styles.inputFocus), (hasError && styles.inputErro)]} 
                        value={dateAsText}
                        readOnly
                    />
                </TouchableOpacity>
            </FormGroup>
            <DatePicker 
                modal
                open={open}
                date={date}
                mode="date"
                locale="pt-BR"
                theme="dark"
                title="Selecione a data"
                confirmText="Confirmar"
                cancelText="Cancelar"
                onConfirm={(date) => {
                    setOpen(false);
                    setDate(date);
                }}
                onCancel={() => setOpen(false)}
            />
        </>
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
        paddingBottom: 8,
        width: 140
    },
    inputFocus: {
        borderColor: colors.purple[800],
        backgroundColor: colors.gray[600],
    },
    inputErro: {
        borderColor: colors.red[600]
    }
})