import { useState } from 'react';
import { ActivityIndicator, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";

export default function TelaScanner() {
    const [rastreandoStatus, setRastreandoStatus] = useState(false);

    const toggleRastreando = () => {
        setRastreandoStatus(prevStatus => !prevStatus);
    }

    return (
        <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
            <View style={styles.card}>
                <View style={styles.containerImagem}>
                    <Image style={styles.iconeMoto} source={require('../../assets/motoIcon.png')} />
                </View>

                <Text style={styles.titulo}>Entrada de Motos no Pátio</Text>
                <Text style={styles.subtitulo}>Identifique o código de uso da moto mais próxima ao dispositivo</Text>


                {!rastreandoStatus ? (
                    <TouchableOpacity onPress={toggleRastreando} style={styles.botao}>
                        <Text style={styles.textoBotao}>RASTREAR</Text>
                    </TouchableOpacity>
                ) : (
                    <TouchableOpacity onPress={toggleRastreando} style={styles.botao}>
                        <Text style={styles.textoBotao}>PARAR RASTREAMENTO</Text>
                    </TouchableOpacity>
                )}


                {rastreandoStatus && (
                    <View style={styles.rastreandoContainer}>
                        <Text style={{ color: '#ffff', textAlign: 'center' }}>Rastreando Motos...</Text>
                        <ActivityIndicator size="large" color="#fff" style={styles.spinner} />
                    </View>
                )}
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    scrollView: {
        backgroundColor: '#000',
    },
    scrollContent: {
        marginTop: 80,
    },
    containerImagem: {
        flex: 1,
        alignItems: 'center'
    },
    iconeMoto: {
        width: 80,
        height: 60,
    },
    card: {
        backgroundColor: '#332f2f',
        width: '85%',
        padding: 25,
        borderRadius: 12,
        shadowColor: '#11881D',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 5,
        margin: 40,
        height: '90%'
    },
    botao: {
        backgroundColor: '#11881D',
        borderRadius: 8,
        padding: 10,
        marginTop: 10,
    },
    textoBotao: {
        color: '#fff',
        fontSize: 16,
        fontFamily: 'DarkerGrotesque_700Bold',
        textAlign: 'center',
        paddingBottom: 5
    },
    titulo: {
        fontSize: 24,
        fontFamily: 'DarkerGrotesque_700Bold',
        color: '#fff',
        textAlign: 'center',
        marginBottom: 30,
    },
    subtitulo: {
        fontFamily: 'DarkerGrotesque_700Medium',
        fontSize: 14,
        color: '#fff',
        textAlign: 'center',
        marginBottom: 30
    },
    rastreandoContainer: {
        marginTop: 20,
        padding: 10,
        backgroundColor: '#2d2d2d',
        borderRadius: 8,
        alignItems: 'center',
    },
    spinner: {
        marginTop: 20,
    }
});
