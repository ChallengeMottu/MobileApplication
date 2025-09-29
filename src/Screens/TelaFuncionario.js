import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ImageBackground, Dimensions, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import { useTheme } from '../context/ContextTheme';

const { width } = Dimensions.get('window');

export default function TelaFuncionario({ navigation }) {
    const { colors, theme } = useTheme();
    const [usuario, setUsuario] = useState(null);
    const [carregando, setCarregando] = useState(true);

    useEffect(() => {
        const carregarDados = async () => {
            try {
                const usuarioLogado = await AsyncStorage.getItem('usuarioLogado');
                console.log('Dados do AsyncStorage:', usuarioLogado); // DEBUG
                
                if (usuarioLogado) {
                    const dadosUsuario = JSON.parse(usuarioLogado);
                    console.log('Dados parseados:', dadosUsuario); // DEBUG
                    setUsuario(dadosUsuario);
                } else {
                    console.log('Nenhum usuário encontrado no AsyncStorage');
                }
            } catch (error) {
                console.error('Erro ao carregar dados:', error);
                Alert.alert('Erro', 'Não foi possível carregar os dados do usuário');
            } finally {
                setCarregando(false);
            }
        };

        carregarDados();
    }, []);

    const handleNavigate = (tela) => {
        navigation.navigate(tela);
    };

    // Função para extrair o nome do usuário de forma segura
    const getNomeUsuario = () => {
        if (!usuario) return 'Usuário';
        
        // Tenta diferentes possibilidades de onde o nome pode estar armazenado
        if (usuario.nome) return usuario.nome.split(' ')[0];
        if (usuario.displayName) return usuario.displayName.split(' ')[0];
        if (usuario.email) return usuario.email.split('@')[0];
        
        return 'Usuário';
    };

    if (carregando) {
        return (
            <View style={[styles.loadingContainer, { backgroundColor: colors.background }]}>
                <Text style={[styles.loadingText, { color: colors.text }]}>Carregando...</Text>
            </View>
        );
    }

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            {/* Fundo verde no topo */}
            <ImageBackground 
                source={require('../../assets/fundo.png')} 
                style={styles.topSection} 
                resizeMode="cover"
            >
                <View style={styles.headerContent}>
                    <Text style={styles.nomeUsuario}>
                        Olá, {getNomeUsuario()}!
                    </Text>
                    <Text style={styles.questionText}>O que deseja realizar hoje?</Text>
                </View>
            </ImageBackground>

            {/* Caixa central */}
            <View style={[styles.centralBox, { 
                backgroundColor: theme === 'dark' ? '#1a1a1a' : '#bfbfbf' 
            }]}>
                <View style={styles.row}>
                    <TouchableOpacity 
                        style={[styles.button, { backgroundColor: colors.primary }]} 
                        onPress={() => handleNavigate('TelaCadastroM')}
                    >
                        <Ionicons name="bicycle" size={32} color={colors.primaryText} />
                        <Text style={[styles.buttonText, { color: colors.primaryText }]}>Cadastrar moto</Text>
                    </TouchableOpacity>

                    <TouchableOpacity 
                        style={[styles.button, { backgroundColor: colors.primary }]} 
                        onPress={() => handleNavigate('Tela')}
                    >
                        <Ionicons name="location" size={32} color={colors.primaryText} />
                        <Text style={[styles.buttonText, { color: colors.primaryText }]}>Identificar{"\n"}localização</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.row}>
                    <TouchableOpacity 
                        style={[styles.button, { backgroundColor: colors.primary }]} 
                        onPress={() => handleNavigate('TelaEntradaMotoPatio')}
                    >
                        <Ionicons name="enter" size={32} color={colors.primaryText} />
                        <Text style={[styles.buttonText, { color: colors.primaryText }]}>Entrada e{"\n"}alocação da moto</Text>
                    </TouchableOpacity>

                    <TouchableOpacity 
                        style={[styles.button, { backgroundColor: colors.primary }]} 
                        onPress={() => handleNavigate('TelaScanner')}
                    >
                        <Ionicons name="exit" size={32} color={colors.primaryText} />
                        <Text style={[styles.buttonText, { color: colors.primaryText }]}>Saída da moto</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        fontSize: 18,
    },
    topSection: {
        width: '100%',
        height: 250,
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    headerContent: {
        alignItems: 'center',
        marginBottom: 100,
    },
    nomeUsuario: {
        color: '#fff',
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        letterSpacing: 0.5,
        marginBottom: 10,
        textShadowColor: 'rgba(0, 0, 0, 0.8)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 3,
    },
    questionText: {
        color: '#fff',
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
        letterSpacing: 0.5,
        textShadowColor: 'rgba(0, 0, 0, 0.8)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 3,
    },
    centralBox: {
        width: width * 0.85,
        height: 500,
        borderRadius: 16,
        padding: 20,
        marginTop: -50,
        elevation: 8,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    button: {
        width: '48%',
        aspectRatio: 1,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 15,
        elevation: 5,
    },
    buttonText: {
        fontSize: 14, 
        fontWeight: '600',
        textAlign: 'center',
        marginTop: 10,
        lineHeight: 16,
    },
});