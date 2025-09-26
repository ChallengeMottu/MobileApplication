import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useState } from 'react';
import { useFonts, DarkerGrotesque_500Medium, DarkerGrotesque_700Bold } from '@expo-google-fonts/darker-grotesque';
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from '@react-navigation/native';
import { EmailAuthProvider, reauthenticateWithCredential, updatePassword } from 'firebase/auth';
import { auth } from '../configurations/firebaseConfig';


export default function TelaNovaSenha() {
    let [fontsLoaded] = useFonts({
        DarkerGrotesque_500Medium,
        DarkerGrotesque_700Bold
    });

    const navigation = useNavigation();

    const [novaSenha, setNovaSenha] = useState('');
    const [confirmarSenha, setConfirmarSenha] = useState('');
    const [senhaAtual, setSenhaAtual] = useState('');
    const [mostrarSenha1, setMostrarSenha1] = useState(false);
    const [mostrarSenha2, setMostrarSenha2] = useState(false);
    const [mostrarSenhaAtual, setMostrarSenhaAtual] = useState(false);

    if (!fontsLoaded) return null;

    const handleAlterarSenha = async () => {
        if (!senhaAtual || !novaSenha || !confirmarSenha) {
            Alert.alert('Atenção', 'Preencha todos os campos!');
            return;
        }

        if (novaSenha !== confirmarSenha) {
            Alert.alert("Erro", "As senhas não coincidem!");
            return;
        }

        if (novaSenha.length < 6) {
            Alert.alert("Erro", "A nova senha deve ter pelo menos 6 caracteres.");
            return;
        }

        try {
            const user = auth.currentUser;
            if (!user || !user.email) {
                Alert.alert("Erro", "Nenhum usuário logado.");
                return;
            }

            // Reautenticar com senha atual
            const credencial = EmailAuthProvider.credential(user.email, senhaAtual);
            await reauthenticateWithCredential(user, credencial);

            // Atualizar senha
            await updatePassword(user, novaSenha);
            Alert.alert("Sucesso", "Senha alterada com sucesso!");
            navigation.navigate('TelaLogin');
        } catch (error) {
            console.log(error);
            Alert.alert("Erro", "Não foi possível alterar a senha.");
        }
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.goBack} onPress={() => navigation.navigate('TelaLogin')}>
                <Ionicons name="arrow-back" size={20} color="#fff" />
            </TouchableOpacity>
            <View style={styles.card}>
                <Text style={styles.titulo}>Alterar senha</Text>

                {/* Senha atual */}
                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        placeholder="Senha atual"
                        placeholderTextColor="#888"
                        secureTextEntry={!mostrarSenhaAtual}
                        value={senhaAtual}
                        onChangeText={setSenhaAtual}
                    />
                    <TouchableOpacity
                        style={styles.iconRight}
                        onPress={() => setMostrarSenhaAtual(!mostrarSenhaAtual)}
                    >
                        <Ionicons
                            name={mostrarSenhaAtual ? "eye-off-outline" : "eye-outline"}
                            size={22}
                            color="#888"
                        />
                    </TouchableOpacity>
                </View>

                {/* Nova senha */}
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

                {/* Confirmar senha */}
                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        placeholder="Confirmar nova senha"
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

                <TouchableOpacity style={styles.botao} onPress={handleAlterarSenha}>
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
