import { DarkerGrotesque_500Medium, DarkerGrotesque_700Bold, useFonts } from '@expo-google-fonts/darker-grotesque';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View, ActivityIndicator, Dimensions } from 'react-native';

// ...imports permanecem iguais

export default function TelaInfos({ navigation }) {

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
                Alert.alert('Erro', 'Sessão expirada. Faça login novamente.', [{
                    text: 'OK',
                    onPress: () => navigation.reset({ index: 0, routes: [{ name: 'TelaLogin' }] })
                }]);
            } finally {
                setCarregando(false);
            }
        };

        const unsubscribe = navigation.addListener('focus', carregarDados);
        carregarDados();
        return unsubscribe;
    }, [navigation]);

    const handleLogout = async () => {
        try {
            Alert.alert('CONFIRMAR DESCONEXÃO', 'Deseja realmente encerrar a sessão?', [
                { text: 'CANCELAR', style: 'cancel' },
                {
                    text: 'DESCONECTAR',
                    style: 'destructive',
                    onPress: async () => {
                        await AsyncStorage.removeItem('usuarioLogado');
                        navigation.reset({ index: 0, routes: [{ name: 'TelaInicial' }] });
                    }
                }
            ]);
        } catch (error) {
            console.error('Erro ao fazer logout:', error);
            Alert.alert('ERRO CRÍTICO', 'Falha na desconexão do sistema');
        }
    };

    if (!fontsLoaded || carregando) {
        return (
            <View style={styles.loadingContainer}>
                <View style={styles.loadingContent}>
                    <View style={styles.loadingCircle}>
                        <ActivityIndicator size="large" color="#11881D" />
                    </View>
                    <Text style={styles.loadingText}>INICIALIZANDO SISTEMA</Text>
                    <View style={styles.loadingBar}>
                        <View style={styles.loadingProgress} />
                    </View>
                </View>
            </View>
        );
    }

    if (!usuario) {
        return (
            <View style={styles.loadingContainer}>
                <Text style={styles.errorText}>USUÁRIO NÃO IDENTIFICADO</Text>
            </View>
        );
    }

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
            
            <View style={styles.statusSystem}>
                <View style={styles.statusBar}>
                    <View style={styles.statusIndicator}>
                        <View style={styles.statusDot} />
                        <Text style={styles.statusText}>SISTEMA OPERACIONAL</Text>
                    </View>
                </View>
                
                <View style={styles.welcomeMatrix}>
                    <Text style={styles.welcomePrefix}>ACESSO AUTORIZADO //</Text>
                    <Text style={styles.welcomeUser}>{usuario.nome ? usuario.nome.split(' ')[0].toUpperCase() : 'USUÁRIO'}</Text>
                </View>
            </View>

            <View style={styles.commandInterface}>
                <View style={styles.interfaceHeader}>
                    <Text style={styles.interfaceTitle}>CENTRAL DE COMANDOS</Text>
                    <View style={styles.interfaceLine} />
                </View>

                <View style={styles.primaryCommands}>
                    <TouchableOpacity style={styles.primaryCommand} onPress={() => navigation.navigate('TelaCadastroM')} activeOpacity={0.7}>
                        <View style={styles.commandLeft}>
                            <View style={styles.commandIcon}><Ionicons name="bicycle" size={24} color="#11881D" /></View>
                            <View style={styles.commandInfo}>
                                <Text style={styles.commandTitle}>REGISTRO</Text>
                                <Text style={styles.commandDesc}>Cadastrar Nova Moto</Text>
                            </View>
                        </View>
                        <View style={styles.commandArrow}><Ionicons name="chevron-forward" size={20} color="#11881D" /></View>
                        <View style={styles.commandGlow} />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.primaryCommand} onPress={() => navigation.navigate('TelaScanner')} activeOpacity={0.7}>
                        <View style={styles.commandLeft}>
                            <View style={styles.commandIcon}><Ionicons name="search" size={24} color="#11881D" /></View>
                            <View style={styles.commandInfo}>
                                <Text style={styles.commandTitle}>LOCALIZAR</Text>
                                <Text style={styles.commandDesc}>Rastrear Veículos</Text>
                            </View>
                        </View>
                        <View style={styles.commandArrow}><Ionicons name="chevron-forward" size={20} color="#11881D" /></View>
                        <View style={styles.commandGlow} />
                    </TouchableOpacity>
                </View>

                <View style={styles.secondaryCommands}>
                    <TouchableOpacity style={styles.secondaryCommand} onPress={() => navigation.navigate('TelaAssociacao')} activeOpacity={0.7}>
                        <View style={styles.secondaryIcon}><Ionicons name="link" size={20} color="#11881D" /></View>
                        <Text style={styles.secondaryTitle}>VINCULAR BEACON</Text>
                        <View style={styles.secondaryGlow} />
                    </TouchableOpacity>

                    <TouchableOpacity style={[styles.secondaryCommand, styles.dangerCommand]} onPress={() => navigation.navigate('TelaDesassociacao')} activeOpacity={0.7}>
                        <View style={styles.secondaryIcon}><Ionicons name="unlink" size={20} color="#ff4444" /></View>
                        <Text style={[styles.secondaryTitle, styles.dangerText]}>DESVINCULAR BEACON</Text>
                        <View style={styles.dangerGlow} />
                    </TouchableOpacity>
                </View>
            </View>

            <View style={styles.database}>
                <View style={styles.databaseHeader}>
                    <Ionicons name="server" size={24} color="#11881D" />
                    <Text style={styles.databaseTitle}>BANCO DE DADOS PESSOAIS</Text>
                    <View style={styles.databaseStatus}>
                        <View style={styles.databaseDot} />
                        <Text style={styles.databaseStatusText}>ONLINE</Text>
                    </View>
                </View>

                <View style={styles.dataMatrix}>
                    <View style={styles.dataColumn}>
                        <View style={styles.dataField}>
                            <Text style={styles.dataKey}>NOME_COMPLETO</Text>
                            <View style={styles.dataContainer}>
                                <Text style={styles.dataValue}>{usuario.nome || '[NULL]'}</Text>
                            </View>
                        </View>

                        <View style={styles.dataField}>
                            <Text style={styles.dataKey}>EMAIL_SISTEMA</Text>
                            <View style={styles.dataContainer}>
                                <Text style={styles.dataValue}>{usuario.email || '[NULL]'}</Text>
                            </View>
                        </View>

                        <View style={styles.dataField}>
                            <Text style={styles.dataKey}>DOCUMENTO_CPF</Text>
                            <View style={styles.dataContainer}>
                                <Text style={styles.dataValue}>{usuario.cpf || '[NULL]'}</Text>
                            </View>
                        </View>
                    </View>

                    <View style={styles.dataColumn}>
                        <View style={styles.dataField}>
                            <Text style={styles.dataKey}>DATA_NASCIMENTO</Text>
                            <View style={styles.dataContainer}>
                                <Text style={styles.dataValue}>{usuario.dataNascimento || '[NULL]'}</Text>
                            </View>
                        </View>

                        <View style={styles.dataField}>
                            <Text style={styles.dataKey}>UNIDADE_PATIO</Text>
                            <View style={styles.dataContainer}>
                                <Text style={styles.dataValue}>{usuario.patio || '[NULL]'}</Text>
                            </View>
                        </View>
                    </View>
                </View>
            </View>

            <View style={styles.Logout}>
                <TouchableOpacity style={styles.logoutButton} onPress={handleLogout} activeOpacity={0.8}>
                    <View style={styles.logoutContent}>
                        <Ionicons name="power" size={24} color="#ff4444" />
                        <Text style={styles.logoutText}>ENCERRAR SESSÃO</Text>
                    </View>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000000',
    },
    scrollContent: {
        padding: 16,
        paddingBottom: 40,
    },
    loadingContainer: {
        flex: 1,
        backgroundColor: '#000000',
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingContent: {
        alignItems: 'center',
        padding: 40,
    },
    loadingCircle: {
        width: 80,
        height: 80,
        borderRadius: 40,
        borderWidth: 2,
        borderColor: '#11881D',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 30,
    },
    loadingText: {
        color: '#11881D',
        fontSize: 14,
        fontFamily: 'DarkerGrotesque_700Bold',
        letterSpacing: 2,
        marginBottom: 20,
    },
    loadingBar: {
        width: 200,
        height: 4,
        backgroundColor: '#1a1a1a',
        borderRadius: 2,
        overflow: 'hidden',
    },
    loadingProgress: {
        width: '60%',
        height: '100%',
        backgroundColor: '#11881D',
    },
    errorText: {
        color: '#ff4444',
        fontSize: 16,
        fontFamily: 'DarkerGrotesque_700Bold',
        letterSpacing: 1,
    },
    statusSystem: {
        backgroundColor: '#0d0d0d',
        borderRadius: 12,
        padding: 20,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#1a1a1a',
    },
    statusBar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
    },
    statusIndicator: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    statusDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: '#11881D',
        marginRight: 8,
        shadowColor: '#11881D',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.8,
        shadowRadius: 3,
    },
    statusText: {
        color: '#11881D',
        fontSize: 12,
        fontFamily: 'DarkerGrotesque_700Bold',
        letterSpacing: 1.5,
        marginBottom:3
    },
    userCode: {
        color: '#666',
        fontSize: 10,
        fontFamily: 'DarkerGrotesque_500Medium',
        letterSpacing: 1,
    },
    welcomeMatrix: {
        borderTopWidth: 1,
        borderTopColor: '#1a1a1a',
        paddingTop: 15,
    },
    welcomePrefix: {
        color: '#666',
        fontSize: 12,
        fontFamily: 'DarkerGrotesque_500Medium',
        letterSpacing: 1,
        marginBottom: 5,
    },
    welcomeUser: {
        color: '#ffffff',
        fontSize: 28,
        fontFamily: 'DarkerGrotesque_700Bold',
        letterSpacing: 2,
    },
    commandInterface: {
        backgroundColor: '#0a0a0a',
        borderRadius: 16,
        padding: 20,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#222222',
    },
    interfaceHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 25,
    },
    interfaceTitle: {
        color: '#ffffff',
        fontSize: 17,
        fontFamily: 'DarkerGrotesque_700Bold',
        letterSpacing: 1,
        flex: 1,
    },
    interfaceLine: {
        width: 40,
        height: 2,
        backgroundColor: '#11881D',
    },
    primaryCommands: {
        marginBottom: 20,
    },
    primaryCommand: {
        backgroundColor: '#111111',
        borderRadius: 12,
        padding: 18,
        marginBottom: 12,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderWidth: 1,
        borderColor: '#222222',
        position: 'relative',
        overflow: 'hidden',
    },
    commandLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    commandIcon: {
        width: 44,
        height: 44,
        borderRadius: 8,
        backgroundColor: '#1a1a1a',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
        borderWidth: 1,
        borderColor: '#11881D',
    },
    commandInfo: {
        flex: 1,
    },
    commandTitle: {
        color: '#11881D',
        fontSize: 14,
        fontFamily: 'DarkerGrotesque_700Bold',
        letterSpacing: 1,
        marginBottom: 2,
    },
    commandDesc: {
        color: '#cccccc',
        fontSize: 14,
        fontFamily: 'DarkerGrotesque_500Medium',
        letterSpacing: 0.5,
    },
    commandArrow: {
        opacity: 0.7,
    },
    commandGlow: {
        position: 'absolute',
        left: 0,
        bottom: 0,
        right: 0,
        height: 2,
        backgroundColor: '#11881D',
        opacity: 0.3,
    },
    secondaryCommands: {
        flexDirection: 'row',
        gap: 12,
    },
    secondaryCommand: {
        flex: 1,
        backgroundColor: '#0f0f0f',
        borderRadius: 10,
        padding: 16,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#11881D',
        position: 'relative',
        overflow: 'hidden',
    },
    dangerCommand: {
        borderColor: '#ff4444',
    },
    secondaryIcon: {
        width: 36,
        height: 36,
        borderRadius: 6,
        backgroundColor: '#1a1a1a',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
    },
    secondaryTitle: {
        color: '#11881D',
        fontSize: 12,
        fontFamily: 'DarkerGrotesque_700Bold',
        letterSpacing: 0.5,
        textAlign: 'center',
    },
    dangerText: {
        color: '#ff4444',
    },
    secondaryGlow: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 2,
        backgroundColor: '#11881D',
        opacity: 0.4,
    },
    dangerGlow: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 2,
        backgroundColor: '#ff4444',
        opacity: 0.4,
    },
    database: {
        backgroundColor: '#0a0a0a',
        borderRadius: 16,
        padding: 20,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#222222',
    },
    databaseHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 25,
        paddingBottom: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#1a1a1a',
    },
    databaseTitle: {
        color: '#ffffff',
        fontSize: 16,
        fontFamily: 'DarkerGrotesque_700Bold',
        letterSpacing: 1,
        marginLeft: 12,
        flex: 1,
    },
    databaseStatus: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    databaseDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: '#11881D',
        marginRight: 6,
        shadowColor: '#11881D',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 1,
        shadowRadius: 2,
    },
    databaseStatusText: {
        color: '#11881D',
        fontSize: 10,
        fontFamily: 'DarkerGrotesque_700Bold',
        letterSpacing: 1,
    },
    dataMatrix: {
        flexDirection: 'row',
        gap: 15,
    },
    dataColumn: {
        flex: 1,
    },
    dataField: {
        marginBottom: 15,
    },
    dataKey: {
        color: '#11881D',
        fontSize: 13,
        fontFamily: 'DarkerGrotesque_700Bold',
        letterSpacing: 1.5,
        marginBottom: 6,
    },
    dataContainer: {
        backgroundColor: '#0d0d0d',
        borderRadius: 6,
        padding: 10,
        borderWidth: 1,
        borderColor: '#1a1a1a',
    },
    dataValue: {
        color: '#ffffff',
        fontSize: 16,
        fontFamily: 'DarkerGrotesque_500Medium',
        letterSpacing: 0.3,
    },
    Logout: {
        borderRadius: 12,
        padding: 18,
        position: 'relative',
        overflow: 'hidden',
    },
    logoutButton: {
        backgroundColor: '#111111',
        borderRadius: 10,
        padding: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#ff4444',
        position: 'relative',
        overflow: 'hidden',
    },
    logoutContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    logoutText: {
        color: '#ff4444',
        fontSize: 14,
        fontFamily: 'DarkerGrotesque_700Bold',
        letterSpacing: 1,
        marginLeft: 12,
    },
});