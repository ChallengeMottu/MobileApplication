import { DarkerGrotesque_500Medium, DarkerGrotesque_700Bold, useFonts } from '@expo-google-fonts/darker-grotesque';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View, TextInput, ActivityIndicator } from 'react-native';
import { useTheme } from '../context/ContextTheme';
import { useTranslation } from 'react-i18next';

export default function TelaInfos({ navigation }) {
    const { colors, theme } = useTheme();
    const { t } = useTranslation();
    
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
                Alert.alert(t('erro'), t('sessao_expirada'));
            } finally {
                setCarregando(false);
            }
        };

        carregarDados();
    }, [navigation]);

    const handleLogout = async () => {
        Alert.alert(t('confirmar'), t('deseja_sair_conta'), [
            { text: t('cancelar'), style: 'cancel' },
            {
                text: t('sair'),
                style: 'destructive',
                onPress: async () => {
                    await AsyncStorage.removeItem('usuarioLogado');
                    navigation.reset({ index: 0, routes: [{ name: 'TelaLogin' }] });
                }
            }
        ]);
    };

    const handleNovaSenha = () => {
        navigation.navigate('TelaNovaSenha');
    };

    if (!fontsLoaded || carregando) {
        return (
            <View style={[styles.loadingContainer, { backgroundColor: colors.background }]}>
                <ActivityIndicator size="large" color={colors.primary} />
            </View>
        );
    }

    if (!usuario) {
        return (
            <View style={[styles.loadingContainer, { backgroundColor: colors.background }]}>
                <Text style={[styles.errorText, { color: '#ff4444' }]}>{t('usuario_nao_identificado')}</Text>
            </View>
        );
    }

    return (
        <ScrollView 
            style={[styles.container, { backgroundColor: colors.background }]} 
            contentContainerStyle={styles.scrollContent} 
            showsVerticalScrollIndicator={false}
        >
            <TouchableOpacity 
                style={styles.goBack} 
                onPress={() => navigation.navigate('TelaFuncionario')}
            >
                <Ionicons name="arrow-back" size={20} color={colors.text} />
            </TouchableOpacity>

            {/* Título */}
            <Text style={[styles.title, { color: colors.text }]}>{t('editar_perfil')}</Text>

            {/* Ícone redondo */}
            <View style={styles.iconWrapper}>
                <View style={[styles.iconCircle, { backgroundColor: colors.primary }]}>
                    <Ionicons name="person-add" size={42} color="#fff" />
                </View>
            </View>

            {/* Campos */}
            <View style={styles.form}>
                <Text style={[styles.label, { color: colors.text }]}>{t('nome')}</Text>
                <TextInput 
                    style={[styles.input, { 
                        backgroundColor: colors.inputBackground, 
                        color: colors.text
                    }]} 
                    value={usuario.nome || ''} 
                    editable={false} 
                    placeholderTextColor={colors.textSecondary}
                />

                <Text style={[styles.label, { color: colors.text }]}>{t('email')}</Text>
                <TextInput 
                    style={[styles.input, { 
                        backgroundColor: colors.inputBackground, 
                        color: colors.text
                    }]} 
                    value={usuario.email || ''} 
                    editable={false} 
                    placeholderTextColor={colors.textSecondary}
                />

                <Text style={[styles.label, { color: colors.text }]}>{t('telefone')}</Text>
                <TextInput 
                    style={[styles.input, { 
                        backgroundColor: colors.inputBackground, 
                        color: colors.text
                    }]} 
                    value={usuario.telefone || ''} 
                    editable={false} 
                    placeholderTextColor={colors.textSecondary}
                />

                <Text style={[styles.label, { color: colors.text }]}>{t('cpf')}</Text>
                <TextInput 
                    style={[styles.input, { 
                        backgroundColor: colors.inputBackground, 
                        color: colors.text
                    }]} 
                    value={usuario.cpf || ''} 
                    editable={false} 
                    placeholderTextColor={colors.textSecondary}
                />

                <Text style={[styles.label, { color: colors.text }]}>{t('filial_mottu')}</Text>
                <TextInput 
                    style={[styles.input, { 
                        backgroundColor: colors.inputBackground, 
                        color: colors.text
                    }]} 
                    value={usuario.filial || ''} 
                    editable={false} 
                    placeholderTextColor={colors.textSecondary}
                />

                <Text style={[styles.label, { color: colors.text }]}>{t('cargo')}</Text>
                <TextInput 
                    style={[styles.input, { 
                        backgroundColor: colors.inputBackground, 
                        color: colors.text
                    }]} 
                    value={usuario.cargo || ''} 
                    editable={false} 
                    placeholderTextColor={colors.textSecondary}
                />
            </View>

            {/* Botão Alterar Senha */}
            <TouchableOpacity 
                style={[styles.changePasswordButton, { backgroundColor: colors.primary }]} 
                onPress={handleNovaSenha} 
                activeOpacity={0.8}
            >
                <Text style={styles.changePasswordText}>{t('alterar_senha')}</Text>
                <Ionicons name="key-outline" size={20} color="#fff" style={{ marginLeft: 8 }} />
            </TouchableOpacity>

            {/* Botão sair */}
            <TouchableOpacity 
                style={[styles.logoutButton, { backgroundColor: colors.primary }]} 
                onPress={handleLogout} 
                activeOpacity={0.8}
            >
                <Text style={styles.logoutText}>{t('sair_conta')}</Text>
                <Ionicons name="log-out-outline" size={20} color="#fff" style={{ marginLeft: 8 }} />
            </TouchableOpacity>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
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
        width: 36,
        height: 36,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 22,
        fontFamily: 'DarkerGrotesque_700Bold',
        marginBottom: 20,
        marginTop: 40,
    },
    iconWrapper: {
        marginBottom: 20,
        alignItems: 'center',
    },
    iconCircle: {
        width: 80,
        height: 80,
        borderRadius: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    form: {
        width: '100%',
        marginTop: 10,
        alignItems: 'center',
    },
    label: {
        fontFamily: 'DarkerGrotesque_500Medium',
        marginBottom: 5,
        alignSelf: 'flex-start',
        marginLeft: '10%',
    },
    input: {
        width: '80%',
        borderRadius: 10,
        paddingHorizontal: 15,
        paddingVertical: 12,
        marginBottom: 15,
        fontFamily: 'DarkerGrotesque_500Medium',
    },
    changePasswordButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 25,
        borderRadius: 8,
        marginTop: 20,
    },
    changePasswordText: {
        color: '#fff',
        fontSize: 16,
        fontFamily: 'DarkerGrotesque_700Bold',
    },
    logoutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 25,
        borderRadius: 8,
        marginTop: 15,
        marginBottom: 20,
    },
    logoutText: {
        color: '#fff',
        fontSize: 16,
        fontFamily: 'DarkerGrotesque_700Bold',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorText: {
        fontFamily: 'DarkerGrotesque_700Bold',
    },
});