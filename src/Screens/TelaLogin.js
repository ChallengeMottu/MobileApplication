import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useState } from 'react';
import { useFonts, DarkerGrotesque_500Medium, DarkerGrotesque_700Bold } from '@expo-google-fonts/darker-grotesque';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from "@expo/vector-icons";
import { signInWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../configurations/firebaseConfig";
import { CommonActions } from '@react-navigation/native';

export default function TelaLogin({ navigation }) {
  let [fontsLoaded] = useFonts({
    DarkerGrotesque_500Medium,
    DarkerGrotesque_700Bold
  });

  const [usuario, setUsuario] = useState('');
  const [senha, setSenha] = useState('');
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [carregando, setCarregando] = useState(false);

  if (!fontsLoaded) return null;

  const handleLogin = async () => {
    if (!usuario || !senha) {
      Alert.alert('Campos obrigatórios', 'Por favor, preencha o e-mail e a senha.');
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

      // Salvar dados completos no AsyncStorage
      await AsyncStorage.setItem('usuarioLogado', JSON.stringify(usuarioCompleto));

      Alert.alert('Login realizado', 'Você entrou no sistema com sucesso!', [
        {
          text: 'OK',
          onPress: () => {
            navigation.dispatch(
              CommonActions.reset({
                index: 0,
                routes: [{ name: 'TelaInfos' }],
              })
            );
          },
        },
      ]);
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      
      let errorMessage = 'E-mail ou senha inválidos.';
      
      if (error.code === 'auth/invalid-credential') {
        errorMessage = 'E-mail ou senha incorretos.';
      } else if (error.code === 'auth/user-not-found') {
        errorMessage = 'Usuário não encontrado.';
      } else if (error.code === 'auth/wrong-password') {
        errorMessage = 'Senha incorreta.';
      } else if (error.code === 'auth/network-request-failed') {
        errorMessage = 'Erro de conexão. Verifique sua internet.';
      }
      
      Alert.alert('Erro', errorMessage);
    } finally {
      setCarregando(false);
    }
  };

  const handleEsqueciSenha = async () => {
    if (!usuario) {
      Alert.alert(
        'Recuperação de Senha', 
        'Por favor, digite seu e-mail no campo acima para redefinir sua senha.'
      );
      return;
    }

    try {
      setCarregando(true);
      await sendPasswordResetEmail(auth, usuario);
      
      Alert.alert(
        'E-mail enviado!', 
        `Enviamos um link de recuperação para: ${usuario}\n\nVerifique sua caixa de entrada e spam.`,
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
        errorMessage = 'E-mail não encontrado. Verifique o endereço digitado.';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'E-mail inválido. Verifique o formato do endereço.';
      } else if (error.code === 'auth/network-request-failed') {
        errorMessage = 'Erro de conexão. Verifique sua internet.';
      }
      
      Alert.alert('Erro', errorMessage);
    } finally {
      setCarregando(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.titulo}>Bem-vindo de volta!</Text>

        {/* Texto informativo acima dos inputs */}
        <View style={styles.textoInfoContainer}>
          <Text style={styles.textoInfo}>
            Digite seu e-mail e senha para acessar o sistema
          </Text>
        </View>

        {/* Campo de E-mail */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="E-mail"
            placeholderTextColor="#888"
            value={usuario}
            onChangeText={setUsuario}
            autoCapitalize="none"
            keyboardType="email-address"
            editable={!carregando}
          />
          <Ionicons name="mail-outline" style={styles.iconRight} />
        </View>

        {/* Campo de Senha */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Senha"
            placeholderTextColor="#888"
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
              color="#888" 
            />
          </TouchableOpacity>
        </View>

        {/* Botão de Login */}
        <TouchableOpacity 
          style={[styles.botao, carregando && styles.botaoDesabilitado]} 
          onPress={handleLogin}
          disabled={carregando}
        >
          <Text style={styles.textoBotao}>
            {carregando ? 'ENTRANDO...' : 'ENTRAR'}
          </Text>
        </TouchableOpacity>

        {/* Link para cadastro */}
        <TouchableOpacity
          style={styles.linkContainer}
          onPress={() => navigation.navigate('TelaCadastroF')}
          disabled={carregando}
        >
          <Text style={styles.linkTexto}>Ainda não tem conta? Cadastre-se</Text>
        </TouchableOpacity>

        {/* Link para recuperação de senha */}
        <TouchableOpacity 
          style={styles.linkContainer}
          onPress={handleEsqueciSenha}
          disabled={carregando}
        >
          <Text style={styles.linkTexto}>Esqueceu a senha?</Text>
        </TouchableOpacity>

        {/* Texto informativo para recuperação */}
        <View style={styles.textoRecuperacaoContainer}>
          <Text style={styles.textoRecuperacao}>
            Para redefinir sua senha, digite seu e-mail acima e clique em "Esqueceu a senha?"
          </Text>
        </View>
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
  titulo: {
    fontSize: 27,
    fontFamily: 'DarkerGrotesque_700Bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 20,
  },
  textoInfoContainer: {
    marginBottom: 25,
    paddingHorizontal: 10,
  },
  textoInfo: {
    color: '#ccc',
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
    color: '#888',
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
    color: '#888',
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
    marginTop: 20,
    marginBottom: 15,
    width: '100%',
  },
  botaoDesabilitado: {
    backgroundColor: '#555',
    opacity: 0.7,
  },
  textoBotao: {
    color: '#fff',
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
    color: '#fff',
    fontSize: 16,
    fontFamily: 'DarkerGrotesque_500Medium',
    textAlign: 'center',
  },
});