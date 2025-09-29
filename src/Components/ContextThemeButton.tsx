import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import { useTheme } from "../context/ContextTheme";

export default function ContextThemeButton(){
    const {toggleTheme, colors} = useTheme()

    return(
        <TouchableOpacity 
            style={[styles.button, {backgroundColor: colors.button}]}
            onPress={toggleTheme}
        >
            <Text style={[styles.text, {color: colors.buttonText}]}>🌓</Text>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    button:{
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        minWidth: 40,
    },
    text:{
        fontSize: 18,
        fontWeight: 'bold'
    }
})