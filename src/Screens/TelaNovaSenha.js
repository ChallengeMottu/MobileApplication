import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useState } from 'react';
import { useFonts, DarkerGrotesque_500Medium, DarkerGrotesque_700Bold } from '@expo-google-fonts/darker-grotesque';
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from '@react-navigation/native';

export default function TelaNovaSenha() {
    let [fontsLoaded] = useFonts({
        DarkerGrotesque_500Medium,
        DarkerGrotesque_700Bold
    });

    const navigation = useNavigation();

    const [novaSenha, setNovaSenha] = useState('');
    const [confirmarSenha, setConfirmarSenha] = useState('');
    const [mostrarSenha1, setMostrarSenha1] = useState(false);
    const [mostrarSenha2, setMostrarSenha2] = useState(false);

    if (!fontsLoaded) return null;

    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.goBack} onPress={() => navigation.navigate('TelaLogin')}>
                <Ionicons name="arrow-back" size={20} color="#fff" />
            </TouchableOpacity>
            <View style={styles.card}>
                <Text style={styles.titulo}>Escolha a sua nova e senha e confirme</Text>
                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        placeholder="Nova senha"
                        placeholderTextColor="#888"
                        secureTextEntry={!mostrarSenha1}
                        value={novaSenha}
                        onChangeText={setNovaSenha}
                    />
                    <TouchableOpacity
                        style={styles.iconRight}
                        onPress={() => setMostrarSenha1(!mostrarSenha1)}
                    >
                        <Ionicons
                            name={mostrarSenha1 ? "eye-off-outline" : "eye-outline"}
                            size={22}
                            color="#888"
                        />
                    </TouchableOpacity>
                </View>

                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        placeholder="Confirmar"
                        placeholderTextColor="#888"
                        secureTextEntry={!mostrarSenha2}
                        value={confirmarSenha}
                        onChangeText={setConfirmarSenha}
                    />
                    <TouchableOpacity
                        style={styles.iconRight}
                        onPress={() => setMostrarSenha2(!mostrarSenha2)}
                    >
                        <Ionicons
                            name={mostrarSenha2 ? "eye-off-outline" : "eye-outline"}
                            size={22}
                            color="#888"
                        />
                    </TouchableOpacity>
                </View>

                <TouchableOpacity style={styles.botao}>
                    <Text style={styles.textoBotao}>Salvar senha</Text>
                </TouchableOpacity>
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
        padding: 10,
    },
    card: {
        backgroundColor: '#000',
        width: '90%',
        maxWidth: 350,
        padding: 30,
        borderRadius: 16,
        alignItems: 'center',
    },
    inputContainer: {
        position: 'relative',
        width: '100%',
        marginBottom: 20,
        justifyContent: 'center',
    },
    goBack: {
        position: "absolute",
        top: 40,
        left: 20,
        zIndex: 10,
    },
    iconRight: {
        position: 'absolute',
        right: 15,
        top: 15,
        zIndex: 1,
        fontSize: 20,
        color: '#888',
    },
    titulo: {
        fontSize: 27,
        fontFamily: 'DarkerGrotesque_700Bold',
        color: '#fff',
        textAlign: 'center',
        marginBottom: 40,
    },
    input: {
        backgroundColor: '#212121',
        borderRadius: 12,
        paddingVertical: 15,
        paddingLeft: 15,
        paddingRight: 45,
        color: '#fff',
        fontSize: 18,
        fontFamily: 'DarkerGrotesque_500Medium',
        width: '100%',
    },
    botao: {
        backgroundColor: '#01743A',
        borderRadius: 12,
        paddingVertical: 15,
        paddingHorizontal: 40,
        alignItems: 'center',
        marginTop: 10,
        width: '100%',
    },
    textoBotao: {
        color: '#fff',
        fontSize: 16,
        fontFamily: 'DarkerGrotesque_700Bold',
        letterSpacing: 1,
    },
});
