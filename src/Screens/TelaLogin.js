import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useState } from 'react';
import { useFonts, DarkerGrotesque_500Medium, DarkerGrotesque_700Bold } from '@expo-google-fonts/darker-grotesque';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from "@expo/vector-icons";
import { signInWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../configurations/firebaseConfig";
import { CommonActions } from '@react-navigation/native';
import { useTheme } from '../context/ContextTheme';
import { useTranslation } from 'react-i18next';

export default function TelaLogin({ navigation }) {
  const { colors, theme } = useTheme();
  const { t, i18n } = useTranslation();
  
  let [fontsLoaded] = useFonts({
    DarkerGrotesque_500Medium,
    DarkerGrotesque_700Bold
  });

  const [usuario, setUsuario] = useState('');
  const [senha, setSenha] = useState('');
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [carregando, setCarregando] = useState(false);

  if (!fontsLoaded) return null;

  // Função para determinar o tipo de usuário
  const determinarTipoUsuario = (email, cargo) => {
    const emailLower = email.toLowerCase();
    
    // Verificar por email específico (administradores)
    const emailsAdmin = [
      'admin@pulse.com',
      'administrador@pulse.com',
      'gerente@pulse.com'
    ];
    
    // 1. PRIMEIRO: Verificar emails específicos de admin
    if (emailsAdmin.includes(emailLower)) {
      return 'adm';
    }
    
    // 2. SEGUNDO: Verificar se contém "mecanico" ou "oficina" no email (MAIS IMPORTANTE)
    if (emailLower.includes('mecanico') || emailLower.includes('oficina')) {
      return 'mecanico';
    }
    
    // 3. TERCEIRO: Verificar pelo cargo cadastrado
    if (cargo) {
      const cargoLower = cargo.toLowerCase();
      
      if (cargoLower.includes('admin') || 
          cargoLower.includes('gerente') || 
          cargoLower.includes('diretor')) {
        return 'adm';
      }
      
      if (cargoLower.includes('mecanico') || 
          cargoLower.includes('mecânico') || 
          cargoLower.includes('técnico') ||
          cargoLower.includes('tecnico')) {
        return 'mecanico';
      }
    }

    // 4. Por padrão, é funcionário
    return 'funcionario';
  };

  // Função para obter a tela inicial baseada no tipo de usuário
  const getTelaInicial = (tipoUsuario) => {
    switch (tipoUsuario) {
      case 'adm':
        return 'TelaDashboard';
      case 'mecanico':
        return 'TelaStatusMotos';
      case 'funcionario':
      default:
        return 'TelaInfos';
    }
  };

  // Função para obter mensagem de boas-vindas baseada no tipo
  const getMensagemBoasVindas = (tipoUsuario, nome) => {
    const nomeUsuario = nome || 'Usuário';
    
    switch (tipoUsuario) {
      case 'adm':
        return `Bem-vindo, Administrador ${nomeUsuario}! 🛡️`;
      case 'mecanico':
        return `Bem-vindo, Mecânico ${nomeUsuario}! 🔧`;
      case 'funcionario':
      default:
        return `Bem-vindo, ${nomeUsuario}! 👋`;
    }
  };

  const handleLogin = async () => {
    if (!usuario || !senha) {
      Alert.alert(t('campos_obrigatorios'), t('preencha_email_senha'));
      return;
    }

    setCarregando(true);

    try {
      const userCredential = await signInWithEmailAndPassword(auth, usuario, senha);
      const user = userCredential.user;

      // Buscar dados completos do AsyncStorage
      const dadosSalvos = await AsyncStorage.getItem('dadosFuncionario');
      let usuarioCompleto = { 
        email: user.email, 
        uid: user.uid,
        nome: '',
        telefone: '',
        cpf: '',
        filial: '',
        cargo: '',
        dataNascimento: '',
        patio: ''
      };

      if (dadosSalvos) {
        const dadosParse = JSON.parse(dadosSalvos);
        // Verifica se é o mesmo usuário pelo email
        if (dadosParse.email === user.email) {
          usuarioCompleto = { ...usuarioCompleto, ...dadosParse };
        }
      }

      // 🔐 DETERMINAR TIPO DE USUÁRIO
      const tipoUsuario = determinarTipoUsuario(user.email, usuarioCompleto.cargo);
      
      console.log('========== DETECÇÃO DE TIPO ==========');
      console.log('Email completo:', user.email);
      console.log('Email em lowercase:', user.email.toLowerCase());
      console.log('Contém "mecanico"?:', user.email.toLowerCase().includes('mecanico'));
      console.log('Contém "oficina"?:', user.email.toLowerCase().includes('oficina'));
      console.log('Cargo:', usuarioCompleto.cargo);
      console.log('Tipo detectado:', tipoUsuario);
      console.log('======================================');

      // Salvar dados completos no AsyncStorage
      await AsyncStorage.setItem('usuarioLogado', JSON.stringify(usuarioCompleto));
      
      // 🔑 SALVAR TIPO DE USUÁRIO
      await AsyncStorage.setItem('tipoUsuario', tipoUsuario);

      // Obter tela inicial e mensagem
      const telaInicial = getTelaInicial(tipoUsuario);
      const mensagemBoasVindas = getMensagemBoasVindas(tipoUsuario, usuarioCompleto.nome);

      Alert.alert(
        t('login_sucesso'), 
        mensagemBoasVindas,
        [
          {
            text: 'OK',
            onPress: () => {
              navigation.dispatch(
                CommonActions.reset({
                  index: 0,
                  routes: [{ name: telaInicial }],
                })
              );
            },
          },
        ]
      );
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      
      let errorMessage = t('email_senha_invalidos');
      
      if (error.code === 'auth/invalid-credential') {
        errorMessage = t('email_incorreto');
      } else if (error.code === 'auth/user-not-found') {
        errorMessage = t('usuario_nao_encontrado');
      } else if (error.code === 'auth/wrong-password') {
        errorMessage = t('senha_incorreta');
      } else if (error.code === 'auth/network-request-failed') {
        errorMessage = t('erro_conexao');
      }
      
      Alert.alert(t('erro_login'), errorMessage);
    } finally {
      setCarregando(false);
    }
  };

  const handleEsqueciSenha = async () => {
    if (!usuario) {
      Alert.alert(
        t('recuperacao_senha'), 
        t('digite_email_recuperacao')
      );
      return;
    }

    try {
      setCarregando(true);
      await sendPasswordResetEmail(auth, usuario);
      
      Alert.alert(
        t('email_enviado'), 
        t('email_recuperacao_enviado', { email: usuario }),
        [
          {
            text: 'OK',
            style: 'default'
          }
        ]
      );
    } catch (error) {
      console.error('Erro ao enviar e-mail de recuperação:', error);
      
      let errorMessage = 'Erro ao enviar e-mail de recuperação.';
      
      if (error.code === 'auth/user-not-found') {
        errorMessage = t('email_nao_encontrado');
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = t('email_invalido');
      } else if (error.code === 'auth/network-request-failed') {
        errorMessage = t('erro_conexao');
      }
      
      Alert.alert(t('erro_login'), errorMessage);
    } finally {
      setCarregando(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.card, { backgroundColor: colors.cardBackground }]}>
        <Text style={[styles.titulo, { color: colors.text }]}>{t('bem_vindo')}</Text>

        
        {/* Texto informativo acima dos inputs */}
        <View style={styles.textoInfoContainer}>
          <Text style={[styles.textoInfo, { color: colors.textSecondary }]}>
            {t('digite_email_senha')}
          </Text>
        </View>

        {/* Campo de E-mail */}
        <View style={styles.inputContainer}>
          <TextInput
            style={[styles.input, { 
              backgroundColor: colors.inputBackground,
              color: colors.text 
            }]}
            placeholder={t('email')}
            placeholderTextColor={colors.textSecondary}
            value={usuario}
            onChangeText={setUsuario}
            autoCapitalize="none"
            keyboardType="email-address"
            editable={!carregando}
          />
          <Ionicons 
            name="mail-outline" 
            style={[styles.iconRight, { color: colors.textSecondary }]} 
          />
        </View>

        {/* Campo de Senha */}
        <View style={styles.inputContainer}>
          <TextInput
            style={[styles.input, { 
              backgroundColor: colors.inputBackground,
              color: colors.text 
            }]}
            placeholder={t('senha')}
            placeholderTextColor={colors.textSecondary}
            secureTextEntry={!mostrarSenha}
            value={senha}
            onChangeText={setSenha}
            editable={!carregando}
          />
          <TouchableOpacity
            style={styles.iconRight}
            onPress={() => setMostrarSenha(!mostrarSenha)}
            disabled={carregando}
          >
            <Ionicons 
              name={mostrarSenha ? "eye-off-outline" : "eye-outline"} 
              size={22} 
              color={colors.textSecondary}
            />
          </TouchableOpacity>
        </View>

        {/* Botão de Login */}
        <TouchableOpacity 
          style={[
            styles.botao, 
            { backgroundColor: carregando ? colors.inputBackground : colors.primary },
            carregando && styles.botaoDesabilitado
          ]} 
          onPress={handleLogin}
          disabled={carregando}
        >
          <Text style={[styles.textoBotao, { color: colors.primaryText }]}>
            {carregando ? t('entrando') : t('entrar')}
          </Text>
        </TouchableOpacity>

        {/* Link para cadastro */}
        <TouchableOpacity
          style={styles.linkContainer}
          onPress={() => navigation.navigate('TelaCadastroF')}
          disabled={carregando}
        >
          <Text style={[styles.linkTexto, { color: colors.text }]}>
            {t('nao_tem_conta')}
          </Text>
        </TouchableOpacity>

        {/* Link para recuperação de senha */}
        <TouchableOpacity 
          style={styles.linkContainer}
          onPress={handleEsqueciSenha}
          disabled={carregando}
        >
          <Text style={[styles.linkTexto, { color: colors.text }]}>
            {t('esqueceu_senha')}
          </Text>
        </TouchableOpacity>

        {/* Texto informativo para recuperação */}
        <View style={styles.textoRecuperacaoContainer}>
          <Text style={[styles.textoRecuperacao, { color: colors.textSecondary }]}>
            {t('texto_recuperacao')}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  card: {
    width: '90%',
    maxWidth: 350,
    padding: 30,
    borderRadius: 16,
    alignItems: 'center',
  },
  titulo: {
    fontSize: 27,
    fontFamily: 'DarkerGrotesque_700Bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 15,
    width: '100%',
  },
  infoBoxText: {
    marginLeft: 10,
    flex: 1,
  },
  infoBoxTitle: {
    fontSize: 14,
    fontFamily: 'DarkerGrotesque_700Bold',
    marginBottom: 5,
  },
  infoBoxItem: {
    fontSize: 12,
    fontFamily: 'DarkerGrotesque_500Medium',
    marginBottom: 2,
  },
  textoInfoContainer: {
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  textoInfo: {
    fontSize: 16,
    fontFamily: 'DarkerGrotesque_500Medium',
    textAlign: 'center',
    lineHeight: 22,
  },
  textoRecuperacaoContainer: {
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  textoRecuperacao: {
    fontSize: 14,
    fontFamily: 'DarkerGrotesque_500Medium',
    textAlign: 'center',
    lineHeight: 18,
    fontStyle: 'italic',
  },
  inputContainer: {
    position: 'relative',
    width: '100%',
    marginBottom: 10,
    justifyContent: 'center',
  },
  iconRight: {
    position: 'absolute',
    right: 15,
    top: 15,
    zIndex: 1,
    fontSize: 20,
  },
  input: {
    borderRadius: 12,
    paddingVertical: 15,
    paddingLeft: 15,
    paddingRight: 45,
    fontSize: 18,
    fontFamily: 'DarkerGrotesque_500Medium',
    width: '100%',
  },
  botao: {
    borderRadius: 12,
    paddingVertical: 15,
    paddingHorizontal: 40,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 15,
    width: '100%',
  },
  botaoDesabilitado: {
    opacity: 0.7,
  },
  textoBotao: {
    fontSize: 16,
    fontFamily: 'DarkerGrotesque_700Bold',
    letterSpacing: 1,
  },
  linkContainer: {
    alignItems: 'center',
    marginBottom: 12,
    padding: 5,
  },
  linkTexto: {
    fontSize: 16,
    fontFamily: 'DarkerGrotesque_500Medium',
    textAlign: 'center',
  },
});