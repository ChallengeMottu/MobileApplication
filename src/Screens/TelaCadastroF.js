import { DarkerGrotesque_500Medium, DarkerGrotesque_700Bold, useFonts } from '@expo-google-fonts/darker-grotesque';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Ionicons } from "@expo/vector-icons";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../configurations/firebaseConfig";
import { useTheme } from '../context/ContextTheme';

export default function TelaCadastroF() {
  const { colors, theme } = useTheme();
  const navigation = useNavigation();

  let [fontsLoaded] = useFonts({
    DarkerGrotesque_500Medium,
    DarkerGrotesque_700Bold
  });

  const [nome, setNome] = useState('');
  const [dataNascimento, setDataNascimento] = useState('');
  const [cpf, setCpf] = useState('');
  const [patio, setPatio] = useState('');
  const [telefone, setTelefone] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    carregarDados();
  }, []);

  const salvarDados = async (userId) => {
    try {
      const dados = { 
        nome, 
        dataNascimento, 
        cpf, 
        patio,
        filial: patio,
        telefone,
        email, 
        uid: userId,
        cargo: 'Funcionário'
      };
      
      await AsyncStorage.setItem('dadosFuncionario', JSON.stringify(dados));
      await AsyncStorage.setItem('usuarioLogado', JSON.stringify(dados));
      
    } catch (error) {
      console.log('Erro ao salvar dados:', error);
    }
  };

  const carregarDados = async () => {
    try {
      const dadosSalvos = await AsyncStorage.getItem('dadosFuncionario');
      if (dadosSalvos) {
        const dados = JSON.parse(dadosSalvos);
        setNome(dados.nome || '');
        setDataNascimento(dados.dataNascimento || '');
        setCpf(dados.cpf || '');
        setPatio(dados.patio || '');
        setTelefone(dados.telefone || '');
        setEmail(dados.email || '');
      }
    } catch (error) {
      console.log('Erro ao carregar dados:', error);
    }
  };

  if (!fontsLoaded) return null;

  const formatarData = (text) => {
    let cleaned = text.replace(/\D/g, '').slice(0, 8);
    let formatted = '';
    if (cleaned.length >= 2) formatted = cleaned.slice(0, 2) + '/';
    else formatted = cleaned;
    if (cleaned.length >= 4) {
      formatted += cleaned.slice(2, 4) + '/';
      formatted += cleaned.slice(4, 8);
    } else if (cleaned.length > 2) {
      formatted += cleaned.slice(2);
    }
    setDataNascimento(formatted);
  };

  const formatarCPF = (text) => {
    let cleaned = text.replace(/\D/g, '').slice(0, 11);
    let formatted = '';
    if (cleaned.length >= 3) formatted = cleaned.slice(0, 3) + '.';
    else formatted = cleaned;
    if (cleaned.length >= 6) formatted += cleaned.slice(3, 6) + '.';
    else if (cleaned.length > 3) formatted += cleaned.slice(3);
    if (cleaned.length >= 9) {
      formatted += cleaned.slice(6, 9) + '-';
      formatted += cleaned.slice(9, 11);
    } else if (cleaned.length > 6) {
      formatted += cleaned.slice(6);
    }
    setCpf(formatted);
  };

  const formatarTelefone = (text) => {
    // Se o texto está vazio ou sendo apagado, permite a deleção
    if (text.length < telefone.length) {
      setTelefone(text);
      return;
    }

    let cleaned = text.replace(/\D/g, '').slice(0, 11);
    
    // Permite apagar completamente
    if (cleaned.length === 0) {
      setTelefone('');
      return;
    }

    let formatted = '';
    
    if (cleaned.length >= 1) formatted = '(';
    if (cleaned.length >= 2) formatted += cleaned.slice(0, 2) + ') ';
    else if (cleaned.length > 0) formatted += cleaned;
    
    if (cleaned.length >= 7) {
      formatted += cleaned.slice(2, 7) + '-';
      formatted += cleaned.slice(7, 11);
    } else if (cleaned.length > 2) {
      formatted += cleaned.slice(2);
    }
    
    setTelefone(formatted);
  };

  const handleCadastro = async () => {
    if (!nome || !dataNascimento || !cpf || !patio || !telefone || !email || !senha) {
      Alert.alert('Campos obrigatórios', 'Por favor, preencha todos os campos antes de cadastrar.');
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, senha);
      const user = userCredential.user;

      await salvarDados(user.uid);

      Alert.alert(
        'Cadastro realizado',
        'Funcionário cadastrado com sucesso!',
        [{ text: 'Voltar para Login', onPress: () => navigation.navigate('TelaLogin') }]
      );
    } catch (error) {
      console.log("Erro no cadastro:", error.message);

      let errorMessage = "Não foi possível criar a conta.";

      if (error.code === 'auth/email-already-in-use') {
        errorMessage = "Este e-mail já está em uso.";
      } else if (error.code === 'auth/weak-password') {
        errorMessage = "Senha muito fraca. Use pelo menos 6 caracteres.";
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = "E-mail inválido.";
      }

      Alert.alert("Erro", errorMessage);
    }
  };

  return (
    <ScrollView 
      style={[styles.scrollView, { backgroundColor: colors.background }]} 
      contentContainerStyle={styles.scrollContent}
    >
      
      <TouchableOpacity 
        style={styles.goBack} 
        onPress={() => navigation.navigate('TelaLogin')}
      >
        <Ionicons name="arrow-back" size={20} color={colors.text} />
      </TouchableOpacity>

      <Text style={[styles.subtitulo, { color: colors.text }]}>
        Ainda sem cadastro de funcionário?{"\n"}Preencha seus dados e acesse o sistema
      </Text>

      <View style={[styles.inputContainer, { backgroundColor: colors.inputBackground }]}>
        <TextInput
          style={[styles.input, { color: colors.text }]}
          value={nome}
          onChangeText={setNome}
          placeholder="Nome Completo"
          placeholderTextColor={colors.textSecondary}
        />
      </View>

      <View style={[styles.inputContainer, { backgroundColor: colors.inputBackground }]}>
        <TextInput
          style={[styles.input, { color: colors.text }]}
          value={dataNascimento}
          onChangeText={formatarData}
          placeholder="Data de Nascimento"
          placeholderTextColor={colors.textSecondary}
          keyboardType="numeric"
          maxLength={10}
        />
      </View>

      <View style={[styles.inputContainer, { backgroundColor: colors.inputBackground }]}>
        <TextInput
          style={[styles.input, { color: colors.text }]}
          value={cpf}
          onChangeText={formatarCPF}
          placeholder="CPF"
          placeholderTextColor={colors.textSecondary}
          keyboardType="numeric"
          maxLength={14}
        />
      </View>

      <View style={[styles.inputContainer, { backgroundColor: colors.inputBackground }]}>
        <TextInput
          style={[styles.input, { color: colors.text }]}
          value={telefone}
          onChangeText={formatarTelefone}
          placeholder="Telefone (XX) XXXXX-XXXX"
          placeholderTextColor={colors.textSecondary}
          keyboardType="phone-pad"
          maxLength={15}
        />
      </View>

      <View style={[styles.inputContainer, { backgroundColor: colors.inputBackground }]}>
        <TextInput
          style={[styles.input, { color: colors.text }]}
          value={patio}
          onChangeText={setPatio}
          placeholder="Filial Mottu"
          placeholderTextColor={colors.textSecondary}
        />
      </View>

      <View style={[styles.inputContainer, { backgroundColor: colors.inputBackground }]}>
        <TextInput
          style={[styles.input, { color: colors.text }]}
          value={email}
          onChangeText={setEmail}
          placeholder="Email"
          placeholderTextColor={colors.textSecondary}
          keyboardType="email-address"
        />
      </View>

      <View style={[styles.inputContainer, { backgroundColor: colors.inputBackground }]}>
        <TextInput
          style={[styles.input, { color: colors.text }]}
          value={senha}
          onChangeText={setSenha}
          placeholder="Crie sua senha"
          placeholderTextColor={colors.textSecondary}
          secureTextEntry={!showPassword}
        />
        <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.icon}>
          <Ionicons 
            name={showPassword ? "eye-off" : "eye"} 
            size={20} 
            color={colors.text} 
          />
        </TouchableOpacity>
      </View>

      <TouchableOpacity 
        style={[styles.botao, { backgroundColor: colors.primary }]} 
        onPress={handleCadastro}
      >
        <Text style={[styles.textoBotao, { color: colors.primaryText }]}>CADASTRAR</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
    alignItems: 'center', 
    justifyContent: 'center',
  },
  goBack: {
    position: "absolute",
    top: 40, 
    left: 20,
    zIndex: 10,
  },
  subtitulo: {
    fontSize: 21,
    fontFamily: 'DarkerGrotesque_500Medium',
    textAlign: 'center',
    marginBottom: 30,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 10,
    paddingHorizontal: 12,
    marginTop: 18,
    width: "70%", 
  },
  input: {
    flex: 1,
    fontSize: 18,
    fontFamily: "DarkerGrotesque_500Medium",
    paddingVertical: 13,
  },
  icon: {
    marginLeft: 8,
  },
  botao: {
    borderRadius: 10,
    padding: 14,
    alignItems: 'center',
    marginTop: 50,
    width: "70%", 
  },
  textoBotao: {
    fontSize: 16,
    fontFamily: 'DarkerGrotesque_700Bold',
  },
});