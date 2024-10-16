import React, { useEffect, useRef, useState } from "react";
import { Dimensions, FlatList, StyleSheet, Text } from "react-native";

type Month = {
    id: number;
    name: string;
    value: string;
}

type MonthSelectProps = {
    onChange: (month_year: string) => void;
}

export const monthsOfMonthSelect: string[] = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Des"];
const itemWidth = (Dimensions.get('window').width / 5) * 2;
const defaultOffset = (2 * itemWidth) - (Dimensions.get('window').width - itemWidth) / 2;

export default function MonthSelect({onChange}: MonthSelectProps) {
    const flatListRef = useRef<FlatList>(null);
    const [visibleMonths, setVisibleMonths] = useState<Month[]>([]);
    const [actualMonth, setActualMonth] = useState<number>(0);
    const [actualYear, setActualYear] = useState<number>(new Date().getFullYear());

    const handleScroll = (newOffset: number) => {
        let targetMonth: number;

        if(newOffset > defaultOffset)
            targetMonth = actualMonth + 1;
        else
            targetMonth = actualMonth - 1;

        defineActualDate(targetMonth);
        onChange(getListMonth(targetMonth)[2].value);
        confgureInterface();
    }

    const getListMonth = (month: number): Month[] => {
        
        const startIndex = month - 2;
        
        const listMonths: Month[] = [];
        
        for(let i = 0; i < 5; i++){
            let year = actualYear;
            let index = startIndex + i;

            if(index < 0){
                index = 12 + (startIndex + i);
                year -= 1;
            }
            else if(index > 11){
                index -= 12;
                year += 1;
            }
            
            listMonths.push({id: i, name: (monthsOfMonthSelect[index] + "/" + year), value: (index + "_" + year)});
        }
        setVisibleMonths(listMonths);
        return listMonths;
    }

    const defineActualDate = (month: number) => {
        if(month < 0){
            setActualMonth(11);
            setActualYear(actualYear - 1);
        }
        else if(month > 11){
            setActualMonth(0);
            setActualYear(actualYear + 1);
        }
        else
            setActualMonth(month);
    }

    const confgureInterface = () => {
        flatListRef.current?.scrollToOffset({ animated: false, offset: defaultOffset });
    }

    useEffect(() => {
        setActualYear(new Date().getFullYear());
        defineActualDate(new Date().getMonth());
        getListMonth(new Date().getMonth());
        confgureInterface();
    }, []);


    return (
        <FlatList
            ref={flatListRef}
            horizontal
            data={visibleMonths} 
            onScrollEndDrag={(scroll) => { const x = scroll.nativeEvent.contentOffset.x; setTimeout(() => handleScroll(x), 500)}}
            renderItem={({ item, index }) => (<Text style={[styles.text, {width: itemWidth, color: (index === 2 ? '#a435f0':'#ddd')}]} >{(item as Month).name}</Text>)}
        />
    );
}

const styles = StyleSheet.create({
    text: {
        textAlign: 'center',
        fontSize: 26,
        marginVertical: 2
    }
});