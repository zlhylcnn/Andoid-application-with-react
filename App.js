import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useRef, useState } from 'react';
import {
  Alert,
  FlatList,
  Modal,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import emojiler from './assets/malzemeler.json';
import tarifler from './assets/recipess.json';

export default function App() {
  const [veri, setVeri] = useState([]);
  const [seciliMalzemeler, setSeciliMalzemeler] = useState([]);
  const [seciliKategori, setSeciliKategori] = useState("Hepsi");
  const [aktifMalzemeGrubu, setAktifMalzemeGrubu] = useState("Sebzeler");
  const [modalVisible, setModalVisible] = useState(false);
  const [favoriler, setFavoriler] = useState([]);
  const [favoriGoster, setFavoriGoster] = useState(false);
  const [yeniTarif, setYeniTarif] = useState({
    isim: '',
    kategori: 'Ana Yemek',
    malzemeler: '',
    yapilis: '',
    diyet: false,
    glutensiz: false
  });

  const flatListRef = useRef(null);
  const kategoriler = ["Hepsi", "Çorba", "Tatlı", "Ana Yemek", "Kek", "Salata", "Kahvaltı", "Diyet", "Glutensiz"];

  const malzemeGruplari = {
    "Sebzeler": ["Tatlı Patates", "Pancar","Haşlanmış Pancar", "Mantar","Kültür Mantarı","Trüf Mantarı","Porçini Mantarı", "Balkabağı","Soğan","Yeşil Soğan", "Havuç", "Patates", "Domates","Çeri Domates","Salkım Domates","Pembe Domates", "Salatalık", "Patlıcan","Közlenmiş Patlıcan", "Kabak", "Biber","Kapya Biber", "Bezelye", "Pazı", "Ispanak", "Lahana", "Brüksel Lahanası","Dolmalık Biber","Kereviz","Kereviz Sapı", "Turp", "Brokoli", "Bakla","Taze Bakla", "Maydanoz", "Marul","Kıvırcık Marul", "Enginar", "Pırasa","Karnabahar", "Yer Elması", "Şevketibostan", "Roka", "Taze Fasulye", "Bamya","Kırmızı Lahana","Sivri Yeşil Biber","Kırmızı Biber","Yeşil Biber", "Kuşkonmaz","Dereotu","Semizotu", "Taze Nane", "Fesleğen","Sarımsak","Deniz Hıyarı","Deniz Börülcesi","Ebegümeci","Pezik(Pancar Sapı)"],
    "Meyveler": [ "Siyah Zeytin", "Elma", "Muz", "Armut", "Çilek", "Erik", "Kiraz", "Vişne","Mandalina", "Portakal", "Turunç", "Bergamot", "Kumkat", "Ayva", "Kivi", "Üzüm","İncir", "Alıç", "Hurma", "Karadut", "Beyaz Dut", "Frambuaz", "Kavun", "Karpuz", "Kayısı", "Şeftali", "Yaban Mersini", "Kuşburnu", "Malta Eriği", "Muşmula","Yenidünya", "Altın Çilek", "Ananas", "Mango", "Avakado", "Hindistan Cevizi","Papaya", "Pomelo", "Yıldız Meyvesi", "Pitaya", "Liçi", "Ejder Meyvesi","Kestane",  "Nar","Ahududu"],
    "Soslar":["Domates Salçası","Domates Sosu","Yoğurtlu Sos","Tatlı Biber Salçası","Acı Biber Salçası","Ketçap", "Mayonez", "Hardal","Soya Sosu", "Limon Sosu","Barbekü","Ranch Sos","Acı Sos","Nar Ekşisi","Hamburger Sosu","Cheddar Sos","Köri Sos","Pesto Sos","Sirke","Chipotle Sos","Balzamik Sosu","Beşamel Sos","Karamel Sos","Çikolata Sosu"],
    "Baklagiller":  ["Kuru Börülce", "Kuru Bakla","Kuru Fasulye","Haşlanmış Fasulye","Nohut","Haşlanmış Nohut","Barbunya","Kırmızı Mercimek","Yeşil Mercimek", "Bulgur","İnce Bulgur","Pirinç","Esmer Pirinç", "Buğday","Dövme Buğday","Mısır Yarması", "Karabuğday", "Makarna","Spagetti Makarna","Taglietelle Makarna","Penne Makarna","Fettucine Makarna", "Kuskus","Erişte", "Spagetti","Arpa Şehriye", "Tel Şehriye","İrmik"],
    "Hayvansal Gıdalar": [ "Süt","Yoğurt","Süzme Yoğurt","Yumurta","Beyaz Peynir","Lor Peyniri","Labne","Kaşar Peyniri","Mozeralla","Cheddar","Parmesan","Rokfor Peyniri","Hellim Peyniri","Mascarpone Peyniri","Künefe Peyniri","Ezine Peyniri","Krema","Tereyağı","Tavuk","Tavuk Döner Eti","Tavuk Göğsü","Tavuk But","Tavuk Kalçalı But","Tavuk Baget","Tavuk Kanatları","Tavuk Pirzola","Tavuk Bonfile","Tavuk Ciğeri","Dana Eti","Dana Kuşbaşı","Dana Kıyma","Dana Pirzola","Dana Antrikot","Dana Bonfile","Dana Kaburga","Dana İncik","Dana Ciğeri","Kıyma","Et Döner","Kuzu Kıyma","Kuzu Kuşbaşı","Kuzu Pirzola","Kuzu Antrikot","Kuzu Kaburga","Kuzu Bonfile","Kuzu İncik","Kuzu Gerdan","Kuzu Ciğeri" ,"Kuzu Eti","Hamsi","İstavrit","Uskumru","Levrek","Çupra","Somon","Somon Fileto","Sardalya","Ton Balığı","Mezgit","Mezgit Fileto","Yengeç","Istakoz","Karides","Jumbo Karides","Hindi Eti","Hindi Kıyma","Sosis","Midye","Ördek Göğsü","Ördek Eti","Sucuk","Pastırma","Jambon"],
    "Baharatlar ve Tatlandırıcılar": [ "Tuz","Deniz Tuzu","Kaya Tuzu","Himalaya Tuzu","Limon Tuzu","Şeker","Esmer Şeker","Gül Suyu","Reçel","Ahududu Reçeli","Bal","Soda","Pekmez","Tahin","Tahin Helvası","Kakao","Bitter Çikolata","Sütlü Çikolata","Belçika Çikolatası","Damla Çikolata","Agave Şurubu","Şerbet","Stevia","Dut Kurusu","Kuru İncir", "Karabiber", "Pulbiber", "Kimyon", "Nane", "Kekik", "Köri","Kırmızı Toz Biber", "İsot", "Sumak", "Zerdeçal", "Zencefil", "Sarımsak Tozu","Soğan Tozu", "Çörek Otu", "Susam", "Hindistan Cevizi Tozu","Hindistan Cevizi Sütü", "Kahve","Defne Yaprağı","Asma Yaprağı","Tarhun Otu", "Biberiye", "Karanfil", "Mahlep", "Tarçın","Yeni Bahar", "Salep", "Kakao","Vanilya","Vanilin", "Kabartma Tozu","Kuru Maya","Yaş Maya","Pudra Şekeri","Krem Şanti","Jelatin","Karbonat", "Kuş Üzümü","Kuru Üzüm","Kurutulmuş Domates","Dolmalık Fıstık","Kişniş", "Safran", "Muskat", "Reyhan", "Meyankökü", "Adaçayı", "Ihlamur", "Kajun","Beyaz Şarap","Kornişon Turşu","Nar Suyu","Limon Suyu","Portakal Suyu","Tavuk Suyu","Buğday Nişastası"],
    "Glütensiz Ürünler": ["Soya","Maş Fasulyesi","Kinoa","Yulaf","Arborio Pirinci","Arorat","Amarant","Keten Tohumu","Chia Tohumu","Haşhaş","Mavi Haşhaş","Haşhaş Tohumu","Fındık","Fıstık","Badem","Badem Tozu","Ceviz","Leblebi","Antep Fıstığı","Çam Fıstığı","Karnabahar Unu","Yulaf Kepeği","Yulaf Ezmesi","Yulaf Unu","Hindistan Cevizi Unu","Glütensiz Şehriye","Glütensiz Lavaş","Glütensiz Un Karışımı","Glütensiz Ekmek","Glütensiz Makarna","Glütensiz Sandviç Ekmeği"],
    "Yağlar ve Unlu Mamüller": ["Ayçiçek Yağı","Zeytinyağı","Hindistan Cevizi Yağı","Mısır Yağı","Susam Yağı","Kuyruk Yağı","İç Yağı","Trüf Yağı","Un","Tam Tahıllı Ekmek","Tam Buğday Unu","Tam Buğday Ekmeği","Mısır Unu", "Galeta Unu", "Siyez Unu","Pirinç Unu","Nohut Unu","Leblebi Unu","Tel Kadayıf","Ekmek Kadayıfı","Kedidili Bisküvi","Etimek","Pandispanya Keki","Bisküvi","Bebe Bisküvisi","Petibör Bisküvi","Güllaç Yaprağı","Pirinç Noodle","Ramen Noodle","Pide","Yufka","Baklavalık Yufka","Tortilla","Kruton","Baget Ekmeği","Ekşi Mayalı Ekmek","Tam Buğday Lavaş","Tam Buğday Lazanya","Focaccio Ekmeği","Sandviç Ekmeği","Milför Hamuru","Mısır Nişastası","Buğday Nişastası"]
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        const [savedFavorites, savedRecipes] = await Promise.all([
          AsyncStorage.getItem('favoriler'),
          AsyncStorage.getItem('tarifler')
        ]);
        
        if (savedFavorites !== null) {
          setFavoriler(JSON.parse(savedFavorites));
        }
        if (savedRecipes !== null) {
          setVeri(JSON.parse(savedRecipes));
        } else {
          setVeri(tarifler);
          await AsyncStorage.setItem('tarifler', JSON.stringify(tarifler));
        }
      } catch (error) {
        console.error('Veri yüklenirken hata:', error);
      }
    };
    
    loadData();
  }, []);

  const toggleMalzeme = (malzeme) => {
    if (seciliMalzemeler.includes(malzeme)) {
      setSeciliMalzemeler(seciliMalzemeler.filter((m) => m !== malzeme));
    } else {
      setSeciliMalzemeler([...seciliMalzemeler, malzeme]);
    }
  };

  const toggleFavori = async (tarif) => {
    try {
      const favoriIndex = favoriler.findIndex(f => f.isim === tarif.isim);
      let yeniFavoriler;
      
      if (favoriIndex >= 0) {
        yeniFavoriler = [...favoriler];
        yeniFavoriler.splice(favoriIndex, 1);
      } else {
        yeniFavoriler = [...favoriler, tarif];
      }
      
      setFavoriler(yeniFavoriler);
      await AsyncStorage.setItem('favoriler', JSON.stringify(yeniFavoriler));
    } catch (error) {
      console.error('Favori kaydedilirken hata:', error);
      Alert.alert('Hata', 'Favori işlemi kaydedilemedi');
    }
  };

  const tarifOner = () => {
  if (seciliMalzemeler.length === 0) {
    Alert.alert('Uyarı', 'Lütfen en az bir malzeme seçin!');
    return;
  }

  try {
    if (filtreliTarifler.length > 0) {
      flatListRef.current?.scrollToIndex({ index: 0, animated: true });
    } else {
      Alert.alert(
        'Bilgi', 
        'Seçtiğiniz malzemelerle tam uyumlu tarif bulunamadı. Daha az malzeme seçerek deneyin.'
      );
    }
  } catch (error) {
    console.error("Tarif öneri hatası:", error);
  }
 };

  const filtreliTarifler = veri.filter((tarif) => {
    const kategoriUygunMu = seciliKategori === "Hepsi" || tarif.kategori === seciliKategori;
    const malzemelerUygunMu = seciliMalzemeler.every((m) =>
      tarif.malzemeler.toLowerCase().includes(m.toLowerCase())
    );
    return kategoriUygunMu && malzemelerUygunMu;
  });

  const yeniTarifEkle = async () => {
    if (!yeniTarif.isim || !yeniTarif.malzemeler || !yeniTarif.yapilis) {
      Alert.alert('Hata', 'Lütfen tüm alanları doldurun!');
      return;
    }

    const yeniTarifObj = {
      isim: yeniTarif.isim,
      kategori: yeniTarif.kategori,
      malzemeler: yeniTarif.malzemeler,
      yapilis: yeniTarif.yapilis,
      diyet: yeniTarif.diyet,
      glutensiz: yeniTarif.glutensiz
    };

    const yeniVeri = [...veri, yeniTarifObj];
    setVeri(yeniVeri);
    
    try {
      await AsyncStorage.setItem('tarifler', JSON.stringify(yeniVeri));
    } catch (error) {
      console.error('Tarif kaydedilirken hata:', error);
      Alert.alert('Hata', 'Tarif kaydedilemedi');
    }
    
    setModalVisible(false);
    setYeniTarif({
      isim: '',
      kategori: 'Ana Yemek',
      malzemeler: '',
      yapilis: '',
      diyet: false,
      glutensiz: false
    });
    Alert.alert('Başarılı', 'Yeni tarif başarıyla eklendi!');
  };

  const renderTarif = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.baslik}>{item.isim}</Text>
        <TouchableOpacity onPress={() => toggleFavori(item)}>
          <Text style={styles.favoriIcon}>
            {favoriler.some(f => f.isim === item.isim) ? '❤️' : '🤍'}
          </Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.kategori}>Kategori: {item.kategori}</Text>
      {item.diyet && <Text style={styles.etiket}>🥗 Diyet</Text>}
      {item.glutensiz && <Text style={styles.etiket}>🌾 Glutensiz</Text>}
      <Text style={styles.malzemeler}>
        Malzemeler: {item.malzemeler.split(", ").map((m) => `${emojiler[m.trim()] || ''} ${m.trim()}`).join(", ")}
      </Text>
      <Text style={styles.yapilis}>Yapılışı: {item.yapilis}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.ustBaslik}>🥑 Tarif Uygulaması</Text>

      <View style={styles.scrollContainer}>
        <Text style={styles.sectionTitle}>Kategoriler</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
          {kategoriler.map((kategori, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => setSeciliKategori(kategori)}
              style={[styles.kategoriBtn, seciliKategori === kategori && styles.seciliKategoriBtn]}
            >
              <Text style={styles.kategoriText}>{kategori}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <View style={styles.scrollContainer}>
        <Text style={styles.sectionTitle}>Malzeme Grupları</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
          {Object.keys(malzemeGruplari).map((grup, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => setAktifMalzemeGrubu(grup)}
              style={[styles.kategoriBtn, aktifMalzemeGrubu === grup && styles.seciliKategoriBtn]}
            >
              <Text style={styles.kategoriText}>{grup}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <View style={styles.scrollContainer}>
        <Text style={styles.sectionTitle}>Malzemeler</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
          {malzemeGruplari[aktifMalzemeGrubu].map((malzeme, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.malzemeBtn, seciliMalzemeler.includes(malzeme) && styles.seciliBtn]}
              onPress={() => toggleMalzeme(malzeme)}
            >
              <Text style={styles.malzemeText}>{malzeme}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={[styles.actionButton, styles.primaryButton]}
          onPress={tarifOner}
        >
          <Text style={styles.buttonText}>Tarif Öner</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.actionButton, styles.secondaryButton]}
          onPress={() => setModalVisible(true)}
        >
          <Text style={styles.buttonText}>Tarif Ekle</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.actionButton, favoriGoster ? styles.favoriButtonActive : styles.favoriButton]}
          onPress={() => setFavoriGoster(!favoriGoster)}
        >
          <Text style={styles.buttonText}>{favoriGoster ? 'Tüm Tarifler' : 'Favorilerim'}</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        ref={flatListRef}
        data={favoriGoster ? favoriler : filtreliTarifler}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderTarif}
        contentContainerStyle={styles.liste}
        ListEmptyComponent={
          <Text style={styles.bosListe}>
            {favoriGoster 
              ? "Henüz favori tarif eklemediniz."
              : seciliMalzemeler.length > 0 
                ? "Seçtiğiniz malzemelerle uygun tarif bulunamadı."
                : "Lütfen malzeme seçin veya yeni tarif ekleyin."}
          </Text>
        }
      />

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Yeni Tarif Ekle</Text>
            
            <Text style={styles.label}>Tarif Adı</Text>
            <TextInput
              style={styles.input}
              value={yeniTarif.isim}
              onChangeText={(text) => setYeniTarif({...yeniTarif, isim: text})}
              placeholder="Tarif adını girin"
            />
            
            <Text style={styles.label}>Kategori</Text>
            <View style={styles.categoryPicker}>
              {["Ana Yemek", "Çorba", "Tatlı", "Salata", "Kahvaltı"].map((kategori) => (
                <TouchableOpacity
                  key={kategori}
                  style={[
                    styles.categoryOption,
                    yeniTarif.kategori === kategori && styles.selectedCategory
                  ]}
                  onPress={() => setYeniTarif({...yeniTarif, kategori})}
                >
                  <Text>{kategori}</Text>
                </TouchableOpacity>
              ))}
            </View>
            
            <Text style={styles.label}>Malzemeler (virgülle ayırın)</Text>
            <TextInput
              style={[styles.input, styles.multilineInput]}
              value={yeniTarif.malzemeler}
              onChangeText={(text) => setYeniTarif({...yeniTarif, malzemeler: text})}
              placeholder="Malzemeleri girin"
              multiline
            />
            
            <Text style={styles.label}>Yapılışı</Text>
            <TextInput
              style={[styles.input, styles.multilineInput]}
              value={yeniTarif.yapilis}
              onChangeText={(text) => setYeniTarif({...yeniTarif, yapilis: text})}
              placeholder="Yapılış adımlarını girin"
              multiline
            />
            
            <View style={styles.checkboxContainer}>
              <TouchableOpacity 
                style={styles.checkbox}
                onPress={() => setYeniTarif({...yeniTarif, diyet: !yeniTarif.diyet})}
              >
                <View style={[styles.checkboxIcon, yeniTarif.diyet && styles.checked]}>
                  {yeniTarif.diyet && <Text>✓</Text>}
                </View>
                <Text style={styles.checkboxLabel}>Diyet</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.checkbox}
                onPress={() => setYeniTarif({...yeniTarif, glutensiz: !yeniTarif.glutensiz})}
              >
                <View style={[styles.checkboxIcon, yeniTarif.glutensiz && styles.checked]}>
                  {yeniTarif.glutensiz && <Text>✓</Text>}
                </View>
                <Text style={styles.checkboxLabel}>Glutensiz</Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.buttonText}>İptal</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.modalButton, styles.saveButton]}
                onPress={yeniTarifEkle}
              >
                <Text style={styles.buttonText}>Kaydet</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

// Styles kısmı aynı kalacak
const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: StatusBar.currentHeight || 40,
    backgroundColor: '#f5f5f5',
  },
  ustBaslik: {
    fontSize: 24,
    fontWeight: 'bold',
    margin: 10,
    textAlign: 'center',
    color: '#333',
  },
  scrollContainer: {
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#444',
  },
  horizontalScroll: {
    height: 50,
  },
  liste: {
    padding: 10,
  },
  bosListe: {
    textAlign: 'center',
    marginTop: 20,
    color: '#666',
    fontSize: 16,
  },
  card: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3.84,
    elevation: 5,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  baslik: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  favoriIcon: {
    fontSize: 24,
    marginLeft: 10,
  },
  kategori: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  etiket: {
    fontSize: 12,
    color: '#4CAF50',
    marginBottom: 5,
    fontWeight: 'bold',
  },
  malzemeler: {
    fontSize: 14,
    marginBottom: 5,
    color: '#444',
  },
  yapilis: {
    fontSize: 14,
    color: '#666',
  },
  kategoriBtn: {
    padding: 10,
    backgroundColor: '#e0e0e0',
    borderRadius: 20,
    marginRight: 10,
    height: 40,
    justifyContent: 'center',
  },
  seciliKategoriBtn: {
    backgroundColor: '#87cefa',
  },
  kategoriText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  malzemeBtn: {
    padding: 10,
    backgroundColor: '#e0e0e0',
    borderRadius: 20,
    marginRight: 10,
    height: 40,
    justifyContent: 'center',
  },
  seciliBtn: {
    backgroundColor: '#90ee90',
  },
  malzemeText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
    marginBottom: 10,
    flexWrap: 'wrap',
  },
  actionButton: {
    padding: 12,
    borderRadius: 25,
    width: '30%',
    alignItems: 'center',
    elevation: 3,
    marginVertical: 5,
  },
  primaryButton: {
    backgroundColor: '#4CAF50',
  },
  secondaryButton: {
    backgroundColor: '#2196F3',
  },
  favoriButton: {
    backgroundColor: '#FF6B6B',
  },
  favoriButtonActive: {
    backgroundColor: '#FF5252',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
    textAlign: 'center',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: '90%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
    backgroundColor: '#fff',
    fontSize: 16,
  },
  multilineInput: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  pickerContainer: {
    marginBottom: 15,
  },
  label: {
    marginBottom: 5,
    fontWeight: 'bold',
    fontSize: 16,
    color: '#444',
  },
  categoryPicker: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  categoryOption: {
    padding: 8,
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 15,
  },
  selectedCategory: {
    backgroundColor: '#87cefa',
    borderColor: '#2196F3',
  },
  checkboxContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  checkbox: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkboxIcon: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    marginRight: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checked: {
    backgroundColor: '#4CAF50',
    borderColor: '#4CAF50',
  },
  checkboxLabel: {
    fontSize: 16,
    color: '#444',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  modalButton: {
    padding: 12,
    borderRadius: 5,
    width: '45%',
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#f44336',
  },
  saveButton: {
    backgroundColor: '#4CAF50',
  },
});