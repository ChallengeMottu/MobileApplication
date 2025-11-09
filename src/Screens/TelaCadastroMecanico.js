import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import { useState } from 'react';
import { useFonts, DarkerGrotesque_500Medium, DarkerGrotesque_700Bold } from '@expo-google-fonts/darker-grotesque';
import { Ionicons } from "@expo/vector-icons";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../configurations/firebaseConfig";
import { useTheme } from '../context/ContextTheme';
import { useTranslation } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function TelaCadastroMecanico({ navigation }) {
  const { colors } = useTheme();
  const { t } = useTranslation();
  
  let [fontsLoaded] = useFonts({
    DarkerGrotesque_500Medium,
    DarkerGrotesque_700Bold
  });

  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [nome, setNome] = useState('');
  const [telefone, setTelefone] = useState('');
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [carregando, setCarregando] = useState(false);

  if (!fontsLoaded) return null;

  const handleCadastroMecanico = async () => {
    // Validações
    if (!email || !senha || !confirmarSenha || !nome) {
      Alert.alert(t('campos_obrigatorios'), t('preencha_email_nome_senha'));
      return;
    }

    if (senha !== confirmarSenha) {
      Alert.alert(t('erro'), t('senhas_nao_coincidem'));
      return;
    }

    if (senha.length < 6) {
      Alert.alert(t('senha_fraca'), t('senha_minimo_caracteres'));
      return;
    }

    // Validar email de mecânico
    if (!email.toLowerCase().includes('mecanico')) {
      Alert.alert(
        t('atencao'),
        t('email_deve_conter_mecanico')
      );
    }

    setCarregando(true);

    try {
      // Criar usuário no Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, email, senha);
      const user = userCredential.user;

      // Dados do mecânico
      const dadosMecanico = {
        uid: user.uid,
        email: user.email,
        nome: nome.trim(),
        telefone: telefone.trim() || '',
        cargo: 'Mecânico',
        tipo: 'mecanico',
        dataCadastro: new Date().toISOString(),
      };

      // Salvar dados localmente
      const mecanicosSalvos = await AsyncStorage.getItem('mecanicosCadastrados');
      let listaMecanicos = mecanicosSalvos ? JSON.parse(mecanicosSalvos) : [];
      listaMecanicos.push(dadosMecanico);
      await AsyncStorage.setItem('mecanicosCadastrados', JSON.stringify(listaMecanicos));

      console.log('========== MECÂNICO CRIADO ==========');
      console.log('UID:', user.uid);
      console.log('Email:', user.email);
      console.log('Nome:', nome);
      console.log('=====================================');

      Alert.alert(
        t('mecanico_cadastrado'),
        t('mecanico_cadastrado_sucesso', { nome: nome, email: email }),
        [
          {
            text: t('cadastrar_outro'),
            style: 'default',
            onPress: () => limparFormulario()
          },
          {
            text: t('voltar'),
            onPress: () => navigation.goBack()
          }
        ]
      );

    } catch (error) {
      console.error('Erro ao cadastrar mecânico:', error);
      
      let errorMessage = t('erro_criar_mecanico');
      
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = t('email_em_uso');
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = t('email_invalido');
      } else if (error.code === 'auth/weak-password') {
        errorMessage = t('senha_muito_fraca');
      } else if (error.code === 'auth/network-request-failed') {
        errorMessage = t('erro_conexao');
      }
      
      Alert.alert(t('erro_cadastro'), errorMessage);
    } finally {
      setCarregando(false);
    }
  };

  const limparFormulario = () => {
    setEmail('');
    setSenha('');
    setConfirmarSenha('');
    setNome('');
    setTelefone('');
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color={colors.text} />
          </TouchableOpacity>
          
          <View style={[styles.iconContainer, { backgroundColor: colors.success || '#01743A' }]}>
            <Ionicons name="construct" size={48} color="#fff" />
          </View>
          
          <Text style={[styles.titulo, { color: colors.text }]}>
            {t('cadastrar_mecanico')}
          </Text>
          <Text style={[styles.subtitulo, { color: colors.textSecondary }]}>
            {t('adicione_novo_mecanico')}
          </Text>
        </View>

        {/* Card de Informações */}
        <View style={[styles.infoCard, { backgroundColor: colors.primary + '15', borderColor: colors.primary + '30' }]}>
          <Ionicons name="information-circle" size={24} color={colors.primary} />
          <View style={styles.infoTextContainer}>
            <Text style={[styles.infoTitle, { color: colors.text }]}>
              {t('informacao')}
            </Text>
            <Text style={[styles.infoText, { color: colors.textSecondary }]}>
              {t('mecanico_acesso_status')}
            </Text>
          </View>
        </View>

        {/* Formulário */}
        <View style={[styles.card, { backgroundColor: colors.cardBackground }]}>
          {/* Campo Nome */}
          <View style={styles.inputContainer}>
            <Text style={[styles.label, { color: colors.primary }]}>
              {t('nome_completo')} *
            </Text>
            <View style={styles.inputWrapper}>
              <TextInput
                style={[styles.input, { 
                  backgroundColor: colors.inputBackground,
                  color: colors.text,
                  borderColor: colors.border
                }]}
                placeholder={t('placeholder_nome')}
                placeholderTextColor={colors.textSecondary}
                value={nome}
                onChangeText={setNome}
                editable={!carregando}
              />
              <Ionicons 
                name="person" 
                size={20} 
                color={colors.textSecondary}
                style={styles.inputIcon}
              />
            </View>
          </View>

          {/* Campo Email */}
          <View style={styles.inputContainer}>
            <Text style={[styles.label, { color: colors.primary }]}>
              {t('email')} *
            </Text>
            <View style={styles.inputWrapper}>
              <TextInput
                style={[styles.input, { 
                  backgroundColor: colors.inputBackground,
                  color: colors.text,
                  borderColor: colors.border
                }]}
                placeholder={t('placeholder_email_mecanico')}
                placeholderTextColor={colors.textSecondary}
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
                editable={!carregando}
              />
              <Ionicons 
                name="mail" 
                size={20} 
                color={colors.textSecondary}
                style={styles.inputIcon}
              />
            </View>
            <Text style={[styles.helperText, { color: colors.textSecondary }]}>
              {t('deve_conter_mecanico_email')}
            </Text>
          </View>

          {/* Campo Telefone */}
          <View style={styles.inputContainer}>
            <Text style={[styles.label, { color: colors.primary }]}>
              {t('telefone')} ({t('opcional')})
            </Text>
            <View style={styles.inputWrapper}>
              <TextInput
                style={[styles.input, { 
                  backgroundColor: colors.inputBackground,
                  color: colors.text,
                  borderColor: colors.border
                }]}
                placeholder={t('placeholder_telefone')}
                placeholderTextColor={colors.textSecondary}
                value={telefone}
                onChangeText={setTelefone}
                keyboardType="phone-pad"
                editable={!carregando}
              />
              <Ionicons 
                name="call" 
                size={20} 
                color={colors.textSecondary}
                style={styles.inputIcon}
              />
            </View>
          </View>

          {/* Campo Senha */}
          <View style={styles.inputContainer}>
            <Text style={[styles.label, { color: colors.primary }]}>
              {t('senha')} *
            </Text>
            <View style={styles.inputWrapper}>
              <TextInput
                style={[styles.input, { 
                  backgroundColor: colors.inputBackground,
                  color: colors.text,
                  borderColor: colors.border
                }]}
                placeholder={t('placeholder_senha_minimo')}
                placeholderTextColor={colors.textSecondary}
                secureTextEntry={!mostrarSenha}
                value={senha}
                onChangeText={setSenha}
                editable={!carregando}
              />
              <TouchableOpacity
                style={styles.inputIcon}
                onPress={() => setMostrarSenha(!mostrarSenha)}
                disabled={carregando}
              >
                <Ionicons 
                  name={mostrarSenha ? "eye-off" : "eye"} 
                  size={20} 
                  color={colors.textSecondary}
                />
              </TouchableOpacity>
            </View>
            <Text style={[styles.helperText, { color: colors.textSecondary }]}>
              {t('minimo_caracteres')}
            </Text>
          </View>

          {/* Campo Confirmar Senha */}
          <View style={styles.inputContainer}>
            <Text style={[styles.label, { color: colors.primary }]}>
              {t('confirmar_senha')} *
            </Text>
            <View style={styles.inputWrapper}>
              <TextInput
                style={[styles.input, { 
                  backgroundColor: colors.inputBackground,
                  color: colors.text,
                  borderColor: colors.border
                }]}
                placeholder={t('placeholder_confirmar_senha')}
                placeholderTextColor={colors.textSecondary}
                secureTextEntry={!mostrarSenha}
                value={confirmarSenha}
                onChangeText={setConfirmarSenha}
                editable={!carregando}
              />
              <Ionicons 
                name="checkmark-circle" 
                size={20} 
                color={senha === confirmarSenha && senha ? colors.success || '#01743A' : colors.textSecondary}
                style={styles.inputIcon}
              />
            </View>
          </View>

          {/* Botão Cadastrar */}
          <TouchableOpacity 
            style={[
              styles.botao, 
              { backgroundColor: carregando ? colors.inputBackground : colors.success || '#01743A' }
            ]} 
            onPress={handleCadastroMecanico}
            disabled={carregando}
          >
            {carregando ? (
              <Text style={[styles.textoBotao, { color: '#fff' }]}>
                {t('cadastrando')}
              </Text>
            ) : (
              <>
                <Ionicons name="person-add" size={20} color="#fff" style={{ marginRight: 8 }} />
                <Text style={[styles.textoBotao, { color: '#fff' }]}>
                  {t('cadastrar_mecanico')}
                </Text>
              </>
            )}
          </TouchableOpacity>

          {/* Botão Limpar */}
          <TouchableOpacity 
            style={[styles.botaoLimpar, { 
              backgroundColor: colors.inputBackground,
              borderColor: colors.border
            }]} 
            onPress={limparFormulario}
            disabled={carregando}
          >
            <Text style={[styles.textoBotaoLimpar, { color: colors.text }]}>
              {t('limpar_campos')}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Lista de Mecânicos Cadastrados */}
        <View style={[styles.infoCard, { backgroundColor: colors.warning + '15', borderColor: colors.warning + '30', marginTop: 20 }]}>
          <Ionicons name="people" size={20} color={colors.warning} />
          <View style={styles.infoTextContainer}>
            <Text style={[styles.infoTitle, { color: colors.text }]}>
              {t('sugestoes_email')}
            </Text>
            <Text style={[styles.helperText, { color: colors.textSecondary }]}>
              • mecanico1@pulse.com
            </Text>
            <Text style={[styles.helperText, { color: colors.textSecondary }]}>
              • mecanico2@pulse.com
            </Text>
            <Text style={[styles.helperText, { color: colors.textSecondary }]}>
              • oficina@pulse.com
            </Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  backButton: {
    position: 'absolute',
    left: 0,
    top: 0,
    padding: 10,
    zIndex: 10,
  },
  iconContainer: {
    width: 90,
    height: 90,
    borderRadius: 45,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  titulo: {
    fontSize: 26,
    fontFamily: 'DarkerGrotesque_700Bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitulo: {
    fontSize: 14,
    fontFamily: 'DarkerGrotesque_500Medium',
    textAlign: 'center',
  },
  infoCard: {
    flexDirection: 'row',
    padding: 15,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 20,
  },
  infoTextContainer: {
    flex: 1,
    marginLeft: 12,
  },
  infoTitle: {
    fontSize: 16,
    fontFamily: 'DarkerGrotesque_700Bold',
    marginBottom: 5,
  },
  infoText: {
    fontSize: 14,
    fontFamily: 'DarkerGrotesque_500Medium',
    lineHeight: 20,
  },
  card: {
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontFamily: 'DarkerGrotesque_700Bold',
    marginBottom: 8,
  },
  inputWrapper: {
    position: 'relative',
  },
  input: {
    borderRadius: 8,
    padding: 14,
    paddingRight: 45,
    fontSize: 16,
    fontFamily: 'DarkerGrotesque_500Medium',
    borderWidth: 1,
  },
  inputIcon: {
    position: 'absolute',
    right: 15,
    top: 14,
  },
  helperText: {
    fontSize: 12,
    fontFamily: 'DarkerGrotesque_500Medium',
    marginTop: 5,
  },
  botao: {
    borderRadius: 10,
    padding: 16,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  textoBotao: {
    fontSize: 16,
    fontFamily: 'DarkerGrotesque_700Bold',
    letterSpacing: 1,
  },
  botaoLimpar: {
    borderRadius: 10,
    padding: 14,
    alignItems: 'center',
    marginTop: 10,
    borderWidth: 1,
  },
  textoBotaoLimpar: {
    fontSize: 14,
    fontFamily: 'DarkerGrotesque_500Medium',
  },
});