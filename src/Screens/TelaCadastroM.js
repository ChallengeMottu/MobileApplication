import { DarkerGrotesque_500Medium, DarkerGrotesque_700Bold, useFonts } from '@expo-google-fonts/darker-grotesque';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ContextTheme';
import { useTranslation } from 'react-i18next';

export default function TelaCadastroM() {
  const navigation = useNavigation();
  const { colors } = useTheme();
  const { t } = useTranslation();

  let [fontsLoaded] = useFonts({
    DarkerGrotesque_500Medium,
    DarkerGrotesque_700Bold,
  });

  const [placa, setPlaca] = useState('');
  const [modelo, setModelo] = useState('');
  const [numeroChassi, setNumeroChassi] = useState('');
  const [codigoBeacon, setCodigoBeacon] = useState('');
  const [condicaoMecanica, setCondicaoMecanica] = useState('');
  const [aparatoFisico, setAparatoFisico] = useState('');
  const [status, setStatus] = useState('');
  const [anoFabricacao, setAnoFabricacao] = useState('');
  const [carregando, setCarregando] = useState(false);

  // Função para salvar dados no AsyncStorage
  const salvarDados = async () => {
    try {
      const dadosMoto = {
        placa: placa.toUpperCase(),
        modelo,
        numeroChassi: numeroChassi.toUpperCase(),
        codigoBeacon: codigoBeacon || 'N/A',
        condicaoMecanica,
        aparatoFisico,
        status,
        anoFabricacao: parseInt(anoFabricacao) || 0,
        dataCadastro: new Date().toISOString(),
        id: Date.now().toString(), // ID único baseado no timestamp
      };

      // Buscar motos existentes
      const motosSalvas = await AsyncStorage.getItem('motosCadastradas');
      let listaMotos = motosSalvas ? JSON.parse(motosSalvas) : [];

      // Verificar se a placa já existe
      const placaExistente = listaMotos.find(moto => moto.placa === dadosMoto.placa);
      if (placaExistente) {
        Alert.alert('Placa já cadastrada', 'Já existe uma moto cadastrada com esta placa.');
        return false;
      }

      // Adicionar nova moto à lista
      listaMotos.push(dadosMoto);

      // Salvar lista atualizada
      await AsyncStorage.setItem('motosCadastradas', JSON.stringify(listaMotos));
      
      // Também salvar individualmente para fácil acesso
      await AsyncStorage.setItem('dadosMoto', JSON.stringify(dadosMoto));
      
      console.log('Moto cadastrada com sucesso:', dadosMoto);
      return true;
    } catch (error) {
      console.log('Erro ao salvar dados:', error);
      return false;
    }
  };

  // Função para carregar dados do AsyncStorage
  const carregarDados = async () => {
    try {
      const dadosSalvos = await AsyncStorage.getItem('dadosMoto');
      if (dadosSalvos) {
        const dados = JSON.parse(dadosSalvos);
        setPlaca(dados.placa || '');
        setModelo(dados.modelo || '');
        setNumeroChassi(dados.numeroChassi || '');
        setCodigoBeacon(dados.codigoBeacon || '');
        setCondicaoMecanica(dados.condicaoMecanica || '');
        setAparatoFisico(dados.aparatoFisico || '');
        setStatus(dados.status || '');
        setAnoFabricacao(dados.anoFabricacao?.toString() || '');
      }
    } catch (error) {
      console.log('Erro ao carregar dados: ', error);
    }
  };

  // Hook de efeito para carregar dados ao iniciar
  useEffect(() => {
    carregarDados();
  }, []);

  // Função para fazer o cadastro
  const handleCadastro = async () => {
    if (!placa || !modelo || !numeroChassi || !condicaoMecanica || !aparatoFisico || !status || !anoFabricacao) {
      Alert.alert(t('campos_obrigatorios'), t('preencha_todos_campos'));
      return;
    }

    setCarregando(true);

    try {
      const sucesso = await salvarDados();
      
      if (sucesso) {
        Alert.alert(
          t('cadastro_realizado'), 
          t('moto_cadastrada_sucesso'),
          [
            {
              text: 'OK',
              onPress: () => {
                // Limpar formulário após cadastro bem-sucedido
                setPlaca('');
                setModelo('');
                setNumeroChassi('');
                setCodigoBeacon('');
                setCondicaoMecanica('');
                setAparatoFisico('');
                setStatus('');
                setAnoFabricacao('');
                navigation.navigate('TelaFuncionario');
              }
            }
          ]
        );
      }
    } catch (error) {
      console.log('Erro ao cadastrar moto:', error);
      Alert.alert(t('erro_cadastro'), t('nao_conseguir_cadastrar_moto'));
    } finally {
      setCarregando(false);
    }
  };

  // Função para limpar formulário
  const limparFormulario = () => {
    setPlaca('');
    setModelo('');
    setNumeroChassi('');
    setCodigoBeacon('');
    setCondicaoMecanica('');
    setAparatoFisico('');
    setStatus('');
    setAnoFabricacao('');
  };

  if (!fontsLoaded) return null;

  return (
    <ScrollView style={[styles.scrollView, { backgroundColor: colors.background }]} contentContainerStyle={styles.scrollContent}>
      <TouchableOpacity style={styles.goBack} onPress={() => navigation.navigate('TelaFuncionario')}>
        <Ionicons name="arrow-back" size={20} color={colors.text} />
      </TouchableOpacity>

      <View style={[styles.card, { backgroundColor: colors.cardBackground }]}>
        <Text style={[styles.titulo, { color: colors.text }]}>{t('cadastro_nova_moto')}</Text>

        <View style={[styles.separador, { backgroundColor: colors.border }]} />

        <View style={styles.inputContainer}>
          <Text style={[styles.label, { color: colors.primary }]}>{t('placa')}</Text>
          <TextInput
            style={[styles.input, { backgroundColor: colors.inputBackground, color: colors.text, borderColor: colors.border }]}
            value={placa}
            onChangeText={setPlaca}
            placeholder={t('placa_moto')}
            placeholderTextColor={colors.textSecondary}
            autoCapitalize="characters"
            maxLength={7}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={[styles.label, { color: colors.primary }]}>{t('modelo')}</Text>
          <View style={[styles.pickerContainer, { backgroundColor: colors.inputBackground, borderColor: colors.border }]}>
            <Picker
              selectedValue={modelo}
              onValueChange={(itemValue) => setModelo(itemValue)}
              style={[styles.picker, { color: colors.text }]}
              dropdownIconColor={colors.text}
            >
              <Picker.Item label={t('modelo')} value="" />
              <Picker.Item label="Sport 110i" value="Sport 110i" />
              <Picker.Item label="Mottu E" value="Mottu E" />
              <Picker.Item label="Mottu Pop 110i" value="Mottu Pop 110i" />
            </Picker>
          </View>
        </View>

        <View style={styles.inputContainer}>
          <Text style={[styles.label, { color: colors.primary }]}>{t('numero_chassi')}</Text>
          <TextInput
            style={[styles.input, { backgroundColor: colors.inputBackground, color: colors.text, borderColor: colors.border }]}
            value={numeroChassi}
            onChangeText={setNumeroChassi}
            placeholder={t('numero_chassi_moto')}
            placeholderTextColor={colors.textSecondary}
            autoCapitalize="characters"
            maxLength={17}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={[styles.label, { color: colors.primary }]}>{t('status_moto')}</Text>
          <View style={[styles.pickerContainer, { backgroundColor: colors.inputBackground, borderColor: colors.border }]}>
            <Picker
              selectedValue={status}
              onValueChange={(itemValue) => setStatus(itemValue)}
              style={[styles.picker, { color: colors.text }]}
              dropdownIconColor={colors.text}
            >
              <Picker.Item label={t('selecione')} value="" />
              <Picker.Item label={t('sem_placa')} value="Moto sem placa" />
              <Picker.Item label={t('com_placa')} value="Moto normal com placa" />
              <Picker.Item label={t('situacao_furto')} value="Moto parada por situação de furto" />
              <Picker.Item label={t('situacao_acidente')} value="Moto parada por situação de acidente" />
            </Picker>
          </View>
        </View>

        <View style={styles.inputContainer}>
          <Text style={[styles.label, { color: colors.primary }]}>Ano de Fabricação</Text>
          <TextInput
            style={[styles.input, { backgroundColor: colors.inputBackground, color: colors.text, borderColor: colors.border }]}
            value={anoFabricacao}
            onChangeText={setAnoFabricacao}
            placeholder="Ano de Fabricação"
            placeholderTextColor={colors.textSecondary}
            keyboardType="numeric"
            maxLength={4}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={[styles.label, { color: colors.primary }]}>Código Beacon (Opcional)</Text>
          <TextInput
            style={[styles.input, { backgroundColor: colors.inputBackground, color: colors.text, borderColor: colors.border }]}
            value={codigoBeacon}
            onChangeText={setCodigoBeacon}
            placeholder="Código do Beacon"
            placeholderTextColor={colors.textSecondary}
          />
        </View>

        <View style={[styles.separador, { backgroundColor: colors.border }]} />

        <View style={styles.secaoContainer}>
          <Text style={[styles.subtituloSecao, { color: colors.text }]}>{t('condicoes_fisicas')}</Text>
        </View>

        <View style={styles.inputContainer}>
          <Text style={[styles.labelPergunta, { color: colors.textSecondary }]}>{t('condicao_mecanica')}</Text>
          <View style={[styles.pickerContainer, { backgroundColor: colors.inputBackground, borderColor: colors.border }]}>
            <Picker
              selectedValue={condicaoMecanica}
              onValueChange={(itemValue) => setCondicaoMecanica(itemValue)}
              style={[styles.picker, { color: colors.text }]}
              dropdownIconColor={colors.text}
            >
              <Picker.Item label={t('selecione')} value="" />
              <Picker.Item label={t('bom_estado')} value="Moto em bom estado mecânico" />
              <Picker.Item label={t('gravemente_danificada')} value="Moto com graves danificações" />
              <Picker.Item label={t('inoperante')} value="Moto sem utilidade" />
              <Picker.Item label={t('necessita_revisao')} value="Moto precisa ser diagnosticada" />
              <Picker.Item label={t('pequenos_reparos')} value="Moto com pequenos reparos de funcionamento" />
            </Picker>
          </View>
        </View>

        <View style={styles.inputContainer}>
          <Text style={[styles.labelPergunta, { color: colors.textSecondary }]}>{t('aparato_fisico')}</Text>
          <View style={[styles.pickerContainer, { backgroundColor: colors.inputBackground, borderColor: colors.border }]}>
            <Picker
              selectedValue={aparatoFisico}
              onValueChange={(itemValue) => setAparatoFisico(itemValue)}
              style={[styles.picker, { color: colors.text }]}
              dropdownIconColor={colors.text}
            >
              <Picker.Item label={t('selecione')} value="" />
              <Picker.Item label={t('completa')} value="Completa" />
              <Picker.Item label={t('falta_retrovisor')} value="Falta retrovisor" />
              <Picker.Item label={t('falta_banco')} value="Falta banco" />
              <Picker.Item label={t('falta_farol')} value="Falta farol" />
            </Picker>
          </View>
        </View>

        <TouchableOpacity 
          style={[
            styles.botao, 
            { backgroundColor: carregando ? colors.inputBackground : colors.primary }
          ]} 
          onPress={handleCadastro}
          disabled={carregando}
        >
          <Text style={[styles.textoBotao, { color: colors.primaryText }]}>
            {carregando ? 'CADASTRANDO...' : t('cadastrar_moto')}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.botaoLimpar, { backgroundColor: colors.inputBackground }]} 
          onPress={limparFormulario}
        >
          <Text style={[styles.textoBotaoLimpar, { color: colors.text }]}>
            LIMPAR FORMULÁRIO
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    alignItems: 'center',
    paddingVertical: 40,
  },
  goBack: {
    position: 'absolute',
    top: 40,
    left: 20,
    zIndex: 10,
  },
  card: {
    width: '100%',
    maxWidth: 400,
    padding: 25,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  titulo: {
    fontSize: 28,
    fontFamily: 'DarkerGrotesque_700Bold',
    textAlign: 'center',
    marginBottom: 10,
    letterSpacing: 0.5,
  },
  separador: {
    height: 1,
    marginVertical: 15,
    width: '100%',
  },
  inputContainer: {
    marginBottom: 20,
    width: '100%',
  },
  label: {
    fontSize: 18,
    fontFamily: 'DarkerGrotesque_700Bold',
    marginBottom: 8,
    textAlign: 'left',
  },
  labelPergunta: {
    fontSize: 16,
    fontFamily: 'DarkerGrotesque_500Medium',
    marginBottom: 10,
    textAlign: 'center',
    lineHeight: 20,
  },
  input: {
    borderRadius: 8,
    padding: 14,
    fontSize: 16,
    fontFamily: 'DarkerGrotesque_500Medium',
    borderWidth: 1,
  },
  pickerContainer: {
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 1,
    height: 50,
  },
  picker: {
    fontFamily: 'DarkerGrotesque_500Medium',
    fontSize: 16,
    height: 50,
  },
  secaoContainer: {
    marginBottom: 25,
    marginTop: 10,
    alignItems: 'center',
  },
  subtituloSecao: {
    fontFamily: 'DarkerGrotesque_700Bold',
    fontSize: 22,
    textAlign: 'center',
  },
  botao: {
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 20,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  textoBotao: {
    fontSize: 18,
    fontFamily: 'DarkerGrotesque_700Bold',
    letterSpacing: 1,
  },
  botaoLimpar: {
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  textoBotaoLimpar: {
    fontSize: 14,
    fontFamily: 'DarkerGrotesque_500Medium',
  },
});