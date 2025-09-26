import { useState } from 'react';
import { ActivityIndicator, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

export default function TelaScanner() {
    const navigation = useNavigation();
    const [rastreandoStatus, setRastreandoStatus] = useState(false);

    const toggleRastreando = () => {
        setRastreandoStatus(prevStatus => !prevStatus);
    }

    return (
        <View style={styles.container}>
            {/* Botão GoBack */}
            <TouchableOpacity
                style={styles.goBack}
                onPress={() => navigation.navigate('TelaFuncionario')}   
            >
                <Ionicons name="arrow-back" size={20} color="#fff" />
            </TouchableOpacity>

            {/* Conteúdo principal */}
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
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
        justifyContent: 'center',
        alignItems: 'center',
    },
    goBack: {
        position: 'absolute',
        top: 40,
        left: 20,
        padding: 8,
    },
    containerImagem: {
        alignItems: 'center',
        marginBottom: 10,
    },
    iconeMoto: {
        width: 80,
        height: 60,
    },
    card: {
        backgroundColor: '#212121',
        width: '85%',
        padding: 25,
        borderRadius: 12,
        shadowColor: '#01743A',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 5,
        alignItems: 'center',
    },
    botao: {
        backgroundColor: '#01743A',
        borderRadius: 8,
        padding: 10,
        marginTop: 10,
        width: '100%',
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
        marginBottom: 20,
    },
    subtitulo: {
        fontFamily: 'DarkerGrotesque_700Medium',
        fontSize: 14,
        color: '#fff',
        textAlign: 'center',
        marginBottom: 20
    },
    rastreandoContainer: {
        marginTop: 20,
        padding: 10,
        backgroundColor: '#2d2d2d',
        borderRadius: 8,
        alignItems: 'center',
        width: '100%',
    },
    spinner: {
        marginTop: 20,
    }
});
