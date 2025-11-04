import { DarkerGrotesque_500Medium, DarkerGrotesque_700Bold, useFonts } from '@expo-google-fonts/darker-grotesque';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ContextTheme';
import { useTranslation } from 'react-i18next';
import { cadastrarMoto } from '../services/motorcycleService';
import * as Notifications from 'expo-notifications';

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
  const [parkingId, setParkingId] = useState('1');
  const [carregando, setCarregando] = useState(false);

  // Validar placa no formato brasileiro
  const validarPlaca = (placa) => {
    const regex = /^([A-Z]{3}[0-9]{4}|[A-Z]{3}[0-9][A-Z][0-9]{2})$/;
    return regex.test(placa.toUpperCase());
  };

  // Validar chassi (17 caracteres)
  const validarChassi = (chassi) => {
    return chassi && chassi.length === 17;
  };

  // Enviar notificação de cadastro
  const enviarNotificacaoCadastro = async (placa, salvaNaAPI) => {
    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: salvaNaAPI ? '✅ Moto Cadastrada!' : '💾 Moto Salva Localmente',
          body: salvaNaAPI 
            ? `A moto ${placa} foi cadastrada com sucesso no sistema!`
            : `A moto ${placa} foi salva no dispositivo e será sincronizada quando possível.`,
          data: { tipo: 'cadastro_moto', placa },
        },
        trigger: null,
      });
    } catch (error) {
      console.log('Erro ao enviar notificação:', error);
    }
  };

  // Salvar TODOS os dados localmente (backup completo)
  const salvarLocalmente = async (dadosCompletos) => {
    try {
      const motosSalvas = await AsyncStorage.getItem('motosCadastradas');
      let listaMotos = motosSalvas ? JSON.parse(motosSalvas) : [];

      // Verificar se a placa já existe localmente
      const placaExistente = listaMotos.find(moto => moto.placa === dadosCompletos.placa);
      if (placaExistente) {
        throw new Error('Placa já cadastrada localmente');
      }

      // Adicionar à lista
      listaMotos.push(dadosCompletos);

      // Salvar lista completa
      await AsyncStorage.setItem('motosCadastradas', JSON.stringify(listaMotos));
      
      // Salvar individualmente também
      await AsyncStorage.setItem('dadosMoto', JSON.stringify(dadosCompletos));
      
      console.log('✅ Moto salva localmente:', dadosCompletos);
      return true;
    } catch (error) {
      console.log('❌ Erro ao salvar localmente:', error);
      throw error;
    }
  };

  // Função principal de cadastro
  const handleCadastro = async () => {
    // Validações básicas
    if (!placa || !modelo || !numeroChassi || !condicaoMecanica || !aparatoFisico || !status || !anoFabricacao) {
      Alert.alert(t('campos_obrigatorios'), t('preencha_todos_campos'));
      return;
    }

    // Validar formato da placa
    if (!validarPlaca(placa)) {
      Alert.alert('Placa Inválida', 'A placa deve estar no formato ABC1234 ou ABC1D23');
      return;
    }

    // Validar chassi
    if (!validarChassi(numeroChassi)) {
      Alert.alert('Chassi Inválido', 'O número de chassi deve ter exatamente 17 caracteres');
      return;
    }

    setCarregando(true);

    try {
      // 📦 DADOS COMPLETOS - para salvar localmente
      const dadosCompletosLocais = {
        placa: placa.toUpperCase(),
        modelo,
        numeroChassi: numeroChassi.toUpperCase(),
        codigoBeacon: codigoBeacon || 'N/A',
        condicaoMecanica,
        aparatoFisico,
        status,
        anoFabricacao: parseInt(anoFabricacao) || 0,
        parkingId: parseInt(parkingId) || 1,
        dataCadastro: new Date().toISOString(),
        id: Date.now().toString(), // ID local temporário
        sincronizadoComAPI: false, // Flag de sincronização
        apiId: null, // ID retornado pela API (se houver)
      };

      // 🌐 DADOS PARA API - apenas o que a API aceita
      const dadosParaAPI = {
        placa: placa.toUpperCase(),
        modelo,
        numeroChassi: numeroChassi.toUpperCase(),
        condicaoMecanica,
        status,
        parkingId: parseInt(parkingId) || 1,
      };

      console.log('📤 Tentando cadastrar na API...');
      
      // Tentar cadastrar na API
      const resultado = await cadastrarMoto(dadosParaAPI);

      if (resultado.success) {
        console.log('✅ Cadastro na API bem-sucedido!');
        
        // Atualizar dados locais com ID da API
        dadosCompletosLocais.sincronizadoComAPI = true;
        dadosCompletosLocais.apiId = resultado.data.id || null;
        
        // Salvar localmente com todos os dados
        await salvarLocalmente(dadosCompletosLocais);
        
        // Enviar notificação de sucesso
        await enviarNotificacaoCadastro(placa.toUpperCase(), true);

        Alert.alert(
          '✅ Cadastro Completo!', 
          `A moto ${placa.toUpperCase()} foi cadastrada com sucesso!\n\n` +
          `📡 Sincronizada com API\n` +
          `💾 Todos os dados salvos localmente\n\n` +
          `Dados extras (beacon, ano, aparato físico) estão disponíveis apenas no app.`,
          [
            {
              text: 'OK',
              onPress: () => {
                limparFormulario();
                navigation.navigate('TelaFuncionario');
              }
            }
          ]
        );
      } else {
        console.log('⚠️ Falha na API, salvando apenas localmente...');
        
        // Se falhar na API, salvar apenas localmente
        dadosCompletosLocais.sincronizadoComAPI = false;
        dadosCompletosLocais.apiId = null;
        dadosCompletosLocais.erroAPI = resultado.error;
        
        await salvarLocalmente(dadosCompletosLocais);
        
        // Enviar notificação de salvamento local
        await enviarNotificacaoCadastro(placa.toUpperCase(), false);

        Alert.alert(
          '💾 Salvo Localmente',
          `A moto ${placa.toUpperCase()} foi salva no dispositivo!\n\n` +
          `⚠️ Não foi possível conectar com o servidor.\n` +
          `Erro: ${resultado.error}\n\n` +
          `✅ Todos os dados estão seguros no app.\n` +
          `🔄 A sincronização será feita quando o servidor estiver disponível.`,
          [
            {
              text: 'OK',
              onPress: () => {
                limparFormulario();
                navigation.navigate('TelaFuncionario');
              }
            }
          ]
        );
      }
    } catch (error) {
      console.log('❌ Erro ao cadastrar moto:', error);
      Alert.alert(
        'Erro no Cadastro', 
        error.message || 'Não foi possível cadastrar a moto. Tente novamente.'
      );
    } finally {
      setCarregando(false);
    }
  };

  // Função para carregar dados do AsyncStorage (se necessário)
  const carregarDados = async () => {
    try {
      const dadosSalvos = await AsyncStorage.getItem('dadosMoto');
      if (dadosSalvos) {
        const dados = JSON.parse(dadosSalvos);
        // Não carrega automaticamente, apenas mantém disponível
        console.log('Dados anteriores disponíveis:', dados);
      }
    } catch (error) {
      console.log('Erro ao carregar dados: ', error);
    }
  };

  useEffect(() => {
    carregarDados();
  }, []);

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
    setParkingId('1');
  };

  if (!fontsLoaded) return null;

  return (
    <ScrollView style={[styles.scrollView, { backgroundColor: colors.background }]} contentContainerStyle={styles.scrollContent}>
      <TouchableOpacity style={styles.goBack} onPress={() => navigation.navigate('TelaFuncionario')}>
        <Ionicons name="arrow-back" size={20} color={colors.text} />
      </TouchableOpacity>

      <View style={[styles.card, { backgroundColor: colors.cardBackground }]}>
        <Text style={[styles.titulo, { color: colors.text }]}>{t('cadastro_nova_moto')}</Text>

        <View style={[styles.infoBox, { backgroundColor: colors.primary + '15', borderColor: colors.primary + '30' }]}>
          <Ionicons name="information-circle" size={20} color={colors.primary} />
          <Text style={[styles.infoText, { color: colors.text }]}>
            Os dados serão salvos localmente e sincronizados com a API
          </Text>
        </View>

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
          <Text style={[styles.helperText, { color: colors.textSecondary }]}>
            Formato: ABC1234 ou ABC1D23
          </Text>
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
          <Text style={[styles.helperText, { color: colors.textSecondary }]}>
            {numeroChassi.length}/17 caracteres
          </Text>
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
              <Picker.Item label="Disponível" value="Moto normal com placa" />
              <Picker.Item label="Em Uso" value="Moto sem placa" />
              <Picker.Item label="Em Manutenção - Furto" value="Moto parada por situação de furto" />
              <Picker.Item label="Em Manutenção - Acidente" value="Moto parada por situação de acidente" />
              <Picker.Item label="Em Manutenção - Geral" value="Moto em manutenção" />
            </Picker>
          </View>
        </View>

        <View style={styles.inputContainer}>
          <Text style={[styles.label, { color: colors.primary }]}>ID do Pátio</Text>
          <TextInput
            style={[styles.input, { backgroundColor: colors.inputBackground, color: colors.text, borderColor: colors.border }]}
            value={parkingId}
            onChangeText={setParkingId}
            placeholder="ID do Pátio"
            placeholderTextColor={colors.textSecondary}
            keyboardType="numeric"
          />
        </View>

        <View style={[styles.separador, { backgroundColor: colors.border }]} />

        <Text style={[styles.sectionLabel, { color: colors.primary }]}>
          📋 Dados Adicionais (Apenas Local)
        </Text>

        <View style={styles.inputContainer}>
          <Text style={[styles.label, { color: colors.text }]}>Ano de Fabricação</Text>
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
          <Text style={[styles.label, { color: colors.text }]}>Código Beacon (Opcional)</Text>
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
          {carregando ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color={colors.primaryText} />
              <Text style={[styles.textoBotao, { color: colors.primaryText, marginLeft: 10 }]}>
                CADASTRANDO...
              </Text>
            </View>
          ) : (
            <Text style={[styles.textoBotao, { color: colors.primaryText }]}>
              {t('cadastrar_moto')}
            </Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.botaoLimpar, { backgroundColor: colors.inputBackground, borderColor: colors.border }]} 
          onPress={limparFormulario}
          disabled={carregando}
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
    marginBottom: 15,
    letterSpacing: 0.5,
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 10,
  },
  infoText: {
    fontSize: 12,
    marginLeft: 8,
    flex: 1,
    fontFamily: 'DarkerGrotesque_500Medium',
  },
  separador: {
    height: 1,
    marginVertical: 15,
    width: '100%',
  },
  sectionLabel: {
    fontSize: 16,
    fontFamily: 'DarkerGrotesque_700Bold',
    marginBottom: 15,
    marginTop: 5,
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
  helperText: {
    fontSize: 12,
    marginTop: 4,
    fontFamily: 'DarkerGrotesque_500Medium',
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
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
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
  },
  textoBotaoLimpar: {
    fontSize: 14,
    fontFamily: 'DarkerGrotesque_500Medium',
  },
});