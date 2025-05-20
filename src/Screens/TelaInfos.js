import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { useFonts, DarkerGrotesque_500Medium, DarkerGrotesque_700Bold } from '@expo-google-fonts/darker-grotesque';
import { Ionicons } from '@expo/vector-icons';
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function TelaInfos({ navigation }) {
    const [fontsLoaded] = useFonts({
        DarkerGrotesque_500Medium,
        DarkerGrotesque_700Bold
    });

    const [usuario, setUsuario] = useState(null);
    const [carregando, setCarregando] = useState(true);

    useEffect(() => {
        const carregarDadosUsuario = async () => {
            try {
                
                let dadosSalvos = await AsyncStorage.getItem('usuarioLogado');

                if (!dadosSalvos) {
                    dadosSalvos = await AsyncStorage.getItem('dadosFuncionario');
                }

                if (dadosSalvos) {
                    const dadosUsuario = JSON.parse(dadosSalvos);
                    setUsuario(dadosUsuario);
                } else {
                    throw new Error('Nenhum usuário logado encontrado');
                }
            } catch (error) {
                console.error('Erro ao carregar dados:', error);
                Alert.alert('Erro', 'Sessão expirada. Faça login novamente.', [{
                    text: 'OK',
                    onPress: () => navigation.reset({
                        index: 0,
                        routes: [{ name: 'TelaLogin' }],
                    })
                }]);
            } finally {
                setCarregando(false);
            }
        };

        carregarDadosUsuario();
    }, []);

    const handleLogout = async () => {
        try {
            Alert.alert('Sair', 'Deseja realmente sair da conta?', [
                {
                    text: 'Cancelar',
                    style: 'cancel'
                },
                {
                    text: 'Sair',
                    onPress: async () => {
                        await AsyncStorage.removeItem('dadosFuncionario');
                        navigation.reset({
                            index: 0,
                            routes: [{ name: 'TelaLogin' }],
                        });
                    }
                }
            ]);
        } catch (error) {
            console.error('Erro ao fazer logout:', error);
            Alert.alert('Erro', 'Não foi possível fazer logout');
        }
    };

    if (!fontsLoaded || carregando) {
        return (
            <View style={styles.container}>
                <Text style={styles.textoCarregando}>Carregando dados...</Text>
            </View>
        );
    }

    if (!usuario) {
        return (
            <View style={styles.container}>
                <Text style={styles.textoCarregando}>Nenhum usuário encontrado</Text>
            </View>
        );
    }

    return (
        <ScrollView
            style={styles.container}
            contentContainerStyle={styles.scrollContent}
        >
            {/* Cabeçalho com saudação */}
            <View style={styles.header}>
                <Text style={styles.saudacao}>Olá, {usuario.nome.split(' ')[0]}!</Text>
                <Text style={styles.subtitulo}>O que deseja realizar hoje?</Text>
            </View>

            {/* Botões de ação */}
            <View style={styles.botoesContainer}>
                <TouchableOpacity
                    style={styles.botaoGrande}
                    onPress={() => navigation.navigate('CadastrarMoto')}
                >
                    <Ionicons name="bicycle" size={32} color="#fff" />
                    <Text style={styles.textoBotao}>Cadastrar nova moto</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.botaoGrande}
                    onPress={() => navigation.navigate('RastrearMotos')}
                >
                    <Ionicons name="search" size={32} color="#fff" />
                    <Text style={styles.textoBotao}>Rastrear motos</Text>
                </TouchableOpacity>
            </View>

            {/* Seção de dados pessoais */}
            <View style={styles.secaoDados}>
                <Text style={styles.tituloSecao}>Dados Pessoais</Text>

                {/* Campo Nome Completo */}
                <View style={styles.itemDado}>
                    <Text style={styles.label}>Nome Completo</Text>
                    <Text style={styles.valor}>{usuario.nome || 'Não informado'}</Text>
                </View>

                {/* Campo Email */}
                <View style={styles.itemDado}>
                    <Text style={styles.label}>Email</Text>
                    <Text style={styles.valor}>{usuario.email || 'Não informado'}</Text>
                </View>

                {/* Campo CPF */}
                <View style={styles.itemDado}>
                    <Text style={styles.label}>CPF</Text>
                    <Text style={styles.valor}>{usuario.cpf || 'Não informado'}</Text>
                </View>

                {/* Campo Data de Nascimento */}
                <View style={styles.itemDado}>
                    <Text style={styles.label}>Data de Nascimento</Text>
                    <Text style={styles.valor}>{usuario.dataNascimento || 'Não informada'}</Text>
                </View>

                {/* Campo Pátio */}
                <View style={styles.itemDado}>
                    <Text style={styles.label}>Pátio</Text>
                    <Text style={styles.valor}>{usuario.patio || 'Não informado'}</Text>
                </View>

                {/* Campo ID Colaborador */}
                <View style={styles.itemDado}>
                    <Text style={styles.label}>ID Colaborador</Text>
                    <Text style={styles.valor}>{usuario.id || 'Não informado'}</Text>
                </View>

                {/* Adicione mais campos conforme necessário */}
            </View>

            {/* Botão de Logout */}
            <TouchableOpacity
                style={styles.botaoSair}
                onPress={handleLogout}
            >
                <Text style={styles.textoBotaoSair}>Sair da Conta</Text>
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
        paddingBottom: 40,
    },
    textoCarregando: {
        color: '#fff',
        textAlign: 'center',
        marginTop: 20,
        fontSize: 16,
    },
    header: {
        marginBottom: 30,
    },
    saudacao: {
        fontSize: 28,
        fontFamily: 'DarkerGrotesque_700Bold',
        color: '#fff',
        marginBottom: 8,
    },
    subtitulo: {
        fontSize: 18,
        fontFamily: 'DarkerGrotesque_500Medium',
        color: '#fff',
        opacity: 0.9,
    },
    botoesContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 30,
        gap: 15,
    },
    botaoGrande: {
        flex: 1,
        backgroundColor: '#11881D',
        padding: 20,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 120,
    },
    textoBotao: {
        color: '#fff',
        fontFamily: 'DarkerGrotesque_700Bold',
        marginTop: 10,
        fontSize: 16,
        textAlign: 'center',
    },
    secaoDados: {
        backgroundColor: '#332f2f',
        borderRadius: 12,
        padding: 20,
        marginBottom: 25,
    },
    tituloSecao: {
        color: '#11881D',
        fontFamily: 'DarkerGrotesque_700Bold',
        fontSize: 20,
        marginBottom: 20,
    },
    itemDado: {
        marginBottom: 18,
    },
    label: {
        color: '#11881D',
        fontFamily: 'DarkerGrotesque_700Bold',
        fontSize: 14,
        marginBottom: 4,
    },
    valor: {
        color: '#fff',
        fontFamily: 'DarkerGrotesque_500Medium',
        fontSize: 16,
    },
    botaoSair: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: '#ff4444',
        borderRadius: 8,
        padding: 16,
        alignItems: 'center',
    },
    textoBotaoSair: {
        color: '#ff4444',
        fontFamily: 'DarkerGrotesque_700Bold',
        fontSize: 16,
    },
});