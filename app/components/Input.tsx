import React, { CSSProperties, useState } from "react";
import { StyleProp, Text, TextInput, TextStyle, View } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';

export interface InputProps {
    initialValue?: string;
    placeholder: string;
    title: string;
    type: 'text' | 'select';
    options?: string[];
}

export type DropDownData = {
    label: string,
    value: string,
}

export const Input = (props: InputProps): JSX.Element => {
    const [open, setOpen] = useState(false);
    const [ value, changeValue ] = useState<string | undefined>(props.initialValue);
    
    const inputStyle: StyleProp<TextStyle> = { height:50, borderWidth: 1 };

    const input = (): JSX.Element => {
        console.log(value);
        switch (props.type) {
            case 'text':
                return (
                    <TextInput
                        style={inputStyle}
                        onChangeText={(text: string) => changeValue(text)}
                        placeholder={props.placeholder}
                        value={value}
                    />
                )
            case 'select':
                return (
                    <DropDownPicker
                        open={open}
                        setOpen={setOpen}
                        value={value?? null}
                        setValue={changeValue}
                        items={props.options!.map((option) => {return {label: option, value: option}}) as DropDownData[]}
                    />
                )
            default:
                return (<></>)
        }
    }

    return (
        <View style={{
            margin: 10,
            padding: 20,
        }}>
            <Text style={{
                paddingBottom: 10,
                fontWeight: "700",
                color: "black"
            }}>{props.title}</Text>
            {
                input()
            }
        </View>
    )
}
