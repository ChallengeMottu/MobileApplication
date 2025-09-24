import { DarkerGrotesque_500Medium, DarkerGrotesque_700Bold, useFonts } from '@expo-google-fonts/darker-grotesque';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View, TextInput, ActivityIndicator } from 'react-native';

export default function TelaPerfil({ navigation }) {
    const [fontsLoaded] = useFonts({
        DarkerGrotesque_500Medium,
        DarkerGrotesque_700Bold
    });

    const [usuario, setUsuario] = useState(null);
    const [carregando, setCarregando] = useState(true);

    useEffect(() => {
        const carregarDados = async () => {
            try {
                const usuarioLogado = await AsyncStorage.getItem('usuarioLogado');
                if (!usuarioLogado) {
                    navigation.reset({ index: 0, routes: [{ name: 'TelaLogin' }] });
                    return;
                }
                setUsuario(JSON.parse(usuarioLogado));
            } catch (error) {
                console.error('Erro ao carregar dados:', error);
                Alert.alert('Erro', 'Sessão expirada. Faça login novamente.');
            } finally {
                setCarregando(false);
            }
        };

        carregarDados();
    }, [navigation]);

    const handleLogout = async () => {
        Alert.alert('CONFIRMAR', 'Deseja realmente sair da conta?', [
            { text: 'Cancelar', style: 'cancel' },
            {
                text: 'Sair',
                style: 'destructive',
                onPress: async () => {
                    await AsyncStorage.removeItem('usuarioLogado');
                    navigation.reset({ index: 0, routes: [{ name: 'TelaLogin' }] });
                }
            }
        ]);
    };

    if (!fontsLoaded || carregando) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#11881D" />
            </View>
        );
    }

    if (!usuario) {
        return (
            <View style={styles.loadingContainer}>
                <Text style={styles.errorText}>Usuário não identificado</Text>
            </View>
        );
    }

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
            <TouchableOpacity style={styles.goBack} onPress={() => navigation.navigate('TelaInicial')}>
                <Ionicons name="arrow-back" size={20} color="#fff" />
            </TouchableOpacity>
            {/* Título */}
            <Text style={styles.title}>Editar Perfil</Text>

            {/* Ícone redondo */}
            <View style={styles.iconWrapper}>
                <View style={styles.iconCircle}>
                    <Ionicons name="person-add" size={42} color="#fff" />
                </View>
            </View>

            {/* Campos */}
            <View style={styles.form}>
                <Text style={styles.label}>Nome</Text>
                <TextInput style={styles.input} value={usuario.nome || ''} editable={false} />

                <Text style={styles.label}>E-mail</Text>
                <TextInput style={styles.input} value={usuario.email || ''} editable={false} />

                <Text style={styles.label}>Telefone</Text>
                <TextInput style={styles.input} value={usuario.telefone || ''} editable={false} />

                <Text style={styles.label}>CPF</Text>
                <TextInput style={styles.input} value={usuario.cpf || ''} editable={false} />

                <Text style={styles.label}>Filial Mottu</Text>
                <TextInput style={styles.input} value={usuario.filial || ''} editable={false} />

                <Text style={styles.label}>Cargo</Text>
                <TextInput style={styles.input} value={usuario.cargo || ''} editable={false} />
            </View>

            {/* Botão sair */}
            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout} activeOpacity={0.8}>
                <Text style={styles.logoutText}>Sair da conta</Text>
                <Ionicons name="log-out-outline" size={20} color="#fff" style={{ marginLeft: 8 }} />
            </TouchableOpacity>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    scrollContent: {
        padding: 20,
        alignItems: 'center',
    },
    goBack: {
        position: "absolute",
        top: 28,
        left: 20,
        zIndex: 10,
    },
    title: {
        fontSize: 22,
        color: '#fff',
        fontFamily: 'DarkerGrotesque_700Bold',
        marginBottom: 20,
    },
    iconWrapper: {
        marginBottom: 20,
        alignItems: 'center',
    },
    iconCircle: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#01743A',
        justifyContent: 'center',
        alignItems: 'center',
    },
    form: {
        width: '100%',
        marginTop: 10,
        alignItems: 'center',
    },
    label: {
        color: '#fff',
        fontFamily: 'DarkerGrotesque_500Medium',
        marginBottom: 5,
    },
    input: {
        backgroundColor: '#1E1E1E',
        color: '#fff',
        width: '80%',
        borderRadius: 10,
        paddingHorizontal: 15,
        paddingVertical: 10,
        marginBottom: 15,
        fontFamily: 'DarkerGrotesque_500Medium',
    },
    logoutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#01743A',
        paddingVertical: 12,
        paddingHorizontal: 25,
        borderRadius: 8,
        marginTop: 20,
    },
    logoutText: {
        color: '#fff',
        fontSize: 16,
        fontFamily: 'DarkerGrotesque_700Bold',
        marginBottom: 7,
    },
    loadingContainer: {
        flex: 1,
        backgroundColor: '#000',
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorText: {
        color: '#ff4444',
        fontFamily: 'DarkerGrotesque_700Bold',
    },
});
