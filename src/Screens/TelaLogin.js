import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useState } from 'react';
import { useFonts, DarkerGrotesque_500Medium, DarkerGrotesque_700Bold } from '@expo-google-fonts/darker-grotesque';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CommonActions } from '@react-navigation/native';
import { Ionicons } from "@expo/vector-icons";

export default function TelaLogin({ navigation }) {
  let [fontsLoaded] = useFonts({
    DarkerGrotesque_500Medium,
    DarkerGrotesque_700Bold
  });

  const [usuario, setUsuario] = useState('');
  const [senha, setSenha] = useState('');
  const [mostrarSenha, setMostrarSenha] = useState(false);

  if (!fontsLoaded) {
    return null;
  }

  const handleLogin = async () => {
    if (!usuario || !senha) {
      Alert.alert('Campos obrigatórios', 'Por favor, preencha o e-mail e a senha.');
      return;
    }
  
    try {
      const dadosSalvos = await AsyncStorage.getItem('dadosFuncionario');
  
      if (!dadosSalvos) {
        Alert.alert('Erro', 'Nenhum usuário cadastrado. Crie uma conta primeiro.');
        return;
      }
  
      let dadosFuncionario;
      try {
        dadosFuncionario = JSON.parse(dadosSalvos);
        
        if (!dadosFuncionario || !dadosFuncionario.email || !dadosFuncionario.senha) {
          throw new Error('Dados inválidos');
        }
      } catch (e) {
        console.error('Erro ao analisar dados:', e);
        Alert.alert('Erro', 'Dados de usuário corrompidos. Por favor, crie uma nova conta.');
        await AsyncStorage.removeItem('dadosFuncionario');
        return;
      }
  
      if (dadosFuncionario.email === usuario && dadosFuncionario.senha === senha) {
        await AsyncStorage.setItem('usuarioLogado', JSON.stringify(dadosFuncionario));
        
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
            }
          }
        ]);
      } else {
        Alert.alert('Erro', 'E-mail ou senha incorretos.');
      }
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      Alert.alert('Erro', 'Não foi possível fazer login. Tente novamente.');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.titulo}>Bem-vindo de volta!</Text>

        {/* Campo de E-mail */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="E-mail"
            placeholderTextColor="#888"
            value={usuario}
            onChangeText={setUsuario}
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
          />
          <TouchableOpacity
            style={styles.iconRight}
            onPress={() => setMostrarSenha(!mostrarSenha)}
          >
            <Ionicons 
              name={mostrarSenha ? "eye-off-outline" : "eye-outline"} 
              size={22} 
              color="#888" 
            />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.botao} onPress={handleLogin}>
          <Text style={styles.textoBotao}>ENTRAR</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.linkContainer}>
          <Text style={styles.linkTexto}>Esqueceu a senha?</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.linkContainer}
          onPress={() => navigation.navigate('TelaCadastroF')}
        >
          <Text style={styles.linkTexto}>Ainda não tem conta? Cadastre-se</Text>
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
  titulo: {
    fontSize: 27,
    fontFamily: 'DarkerGrotesque_700Bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 40,
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
    marginBottom: 30,
    width: '100%',
  },
  textoBotao: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'DarkerGrotesque_700Bold',
    letterSpacing: 1,
  },
  linkContainer: {
    alignItems: 'center',
    marginBottom: 9,
  },
  linkTexto: {
    color: '#fff',
    fontSize: 18,
    fontFamily: 'DarkerGrotesque_500Medium',
    textAlign: 'center',
  },
});
