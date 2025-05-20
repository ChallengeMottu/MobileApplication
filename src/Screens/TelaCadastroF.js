import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFonts, DarkerGrotesque_500Medium, DarkerGrotesque_700Bold } from '@expo-google-fonts/darker-grotesque';
import { useNavigation } from '@react-navigation/native'; 

export default function TelaCadastroF() {
  const navigation = useNavigation(); 

  let [fontsLoaded] = useFonts({
    DarkerGrotesque_500Medium,
    DarkerGrotesque_700Bold
  });

  const [nome, setNome] = useState('');
  const [id, setId] = useState('');
  const [dataNascimento, setDataNascimento] = useState('');
  const [cpf, setCpf] = useState('');
  const [patio, setPatio] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  useEffect(() => {
    carregarDados();
  }, []);

  const salvarDados = async () => {
    try {
      const dados = {
        nome,
        id,
        dataNascimento,
        cpf,
        patio,
        email,
        senha,
      };
      await AsyncStorage.setItem('dadosFuncionario', JSON.stringify(dados));
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
        setId(dados.id || '');
        setDataNascimento(dados.dataNascimento || '');
        setCpf(dados.cpf || '');
        setPatio(dados.patio || '');
        setEmail(dados.email || '');
        setSenha(dados.senha || '');
      }
    } catch (error) {
      console.log('Erro ao carregar dados:', error);
    }
  };

  if (!fontsLoaded) return null;

  const formatarData = (text) => {
    let cleaned = text.replace(/\D/g, '').slice(0, 8);
    let formatted = '';

    if (cleaned.length >= 2) {
      formatted = cleaned.slice(0, 2) + '/';
    } else {
      formatted = cleaned;
    }

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

    if (cleaned.length >= 3) {
      formatted = cleaned.slice(0, 3) + '.';
    } else {
      formatted = cleaned;
    }

    if (cleaned.length >= 6) {
      formatted += cleaned.slice(3, 6) + '.';
    } else if (cleaned.length > 3) {
      formatted += cleaned.slice(3);
    }

    if (cleaned.length >= 9) {
      formatted += cleaned.slice(6, 9) + '-';
      formatted += cleaned.slice(9, 11);
    } else if (cleaned.length > 6) {
      formatted += cleaned.slice(6);
    }

    setCpf(formatted);
  };

  const handleCadastro = async () => {
    if (!nome || !id || !dataNascimento || !cpf || !patio || !email || !senha) {
      Alert.alert('Campos obrigatórios', 'Por favor, preencha todos os campos antes de cadastrar.');
      return;
    }

    await salvarDados();

    Alert.alert(
      'Cadastro realizado',
      'Funcionário cadastrado com sucesso!',
      [
        {
          text: 'Voltar para Login',
          onPress: () => navigation.navigate('TelaLogin') 
        }
      ]
    );
  };


  return (
    <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
      <View style={styles.card}>
        <Text style={styles.subtitulo}>
          Ainda sem cadastro de funcionário?{"\n"}Preencha seus dados e acesse o sistema
        </Text>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Nome Completo</Text>
          <TextInput style={styles.input} value={nome} onChangeText={setNome} placeholder="Nome Completo" placeholderTextColor="#555" />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>ID de Colaborador</Text>
          <TextInput style={styles.input} value={id} onChangeText={setId} placeholder="ID" placeholderTextColor="#555" />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Data de Nascimento</Text>
          <TextInput
            style={styles.input}
            value={dataNascimento}
            onChangeText={formatarData}
            placeholder="DD/MM/AAAA"
            placeholderTextColor="#555"
            keyboardType="numeric"
            maxLength={10}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>CPF</Text>
          <TextInput
            style={styles.input}
            value={cpf}
            onChangeText={formatarCPF}
            placeholder="CPF"
            placeholderTextColor="#555"
            keyboardType="numeric"
            maxLength={14}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Pátio Mottu</Text>
          <TextInput style={styles.input} value={patio} onChangeText={setPatio} placeholder="Pátio" placeholderTextColor="#555" />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            placeholder="seu@email.com"
            placeholderTextColor="#555"
            keyboardType="email-address"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Crie sua senha</Text>
          <TextInput
            style={styles.input}
            value={senha}
            onChangeText={setSenha}
            placeholder="Senha"
            placeholderTextColor="#555"
            secureTextEntry
          />
        </View>

        <TouchableOpacity style={styles.botao} onPress={handleCadastro}>
          <Text style={styles.textoBotao}>CADASTRAR</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: '#000',
  },
  scrollContent: {
    padding: 20,
    alignItems: 'center',
  },
  card: {
    backgroundColor: '#332f2f',
    width: '85%',
    padding: 25,
    borderRadius: 12,
    shadowColor: '#11881D',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  subtitulo: {
    fontSize: 16,
    fontFamily: 'DarkerGrotesque_500Medium',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 30,
  },
  inputContainer: {
    marginBottom: 18,
  },
  label: {
    fontSize: 14,
    fontFamily: 'DarkerGrotesque_700Bold',
    color: '#11881D',
    marginBottom: 6,
  },
  input: {
    backgroundColor: '#433e3e',
    borderRadius: 8,
    padding: 12,
    color: '#fff',
    fontSize: 16,
    fontFamily: 'DarkerGrotesque_500Medium',
  },
  botao: {
    backgroundColor: '#11881D',
    borderRadius: 8,
    padding: 14,
    alignItems: 'center',
    marginTop: 10,
  },
  textoBotao: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'DarkerGrotesque_700Bold',
  },
});