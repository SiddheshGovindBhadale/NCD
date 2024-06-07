import { StyleSheet, Text, View, SafeAreaView, FlatList, ToastAndroid, ScrollView, TextInput, ActivityIndicator, TouchableOpacity, Image } from 'react-native'
import React, { useState, useEffect } from 'react'
import CategoryItem from '../components/Home/CategoryItem'
import Item from '../components/issues/Item'
import Ionicons from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

const Home = () => {
  const navigation = useNavigation();
  const [searchText, setSearchText] = useState('');
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [docData, setDocData] = useState([]);

  const showToast = (message) => {
    ToastAndroid.showWithGravityAndOffset(
      message,
      ToastAndroid.LONG,
      ToastAndroid.BOTTOM,
      25,
      50
    );
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Get the user ID from AsyncStorage
      const userId = await AsyncStorage.getItem('userData');
      const id = JSON.parse(userId)._id

      const response = await fetch('https://ncd-api.onrender.com/documents');
      const result = await response.json();

      const data = result.data || [];

      const filteredData = data.filter(item => item[2] === id);

      setDocData(filteredData);
      setUserData(JSON.parse(userId));
      setIsLoading(false); // Set loading to false when data is loaded
    } catch (error) {
      console.error('Error fetching data:', error);
      const userId = await AsyncStorage.getItem('userData');
      setUserData(JSON.parse(userId));
      showToast('Error loading Data : Check Internet Connection');
      setIsLoading(false); // Set loading to false in case of an error
    }
  };

  //search fuction 
  const clearSearch = () => {
    setSearchText('');
  };

  const handleSearch = () => {
    navigation.navigate('Issued', { data: searchText })
  };

  return (
    <SafeAreaView style={{ backgroundColor: '#ffffff', height: '100%' }}>
      {isLoading ? (
        <ActivityIndicator style={styles.loader} size="large" color="#5525f5" />
      ) : (
        <ScrollView>
          <View style={styles.mainContainer}>
            {/* user Details */}
            <View style={styles.userProfile}>
              <View style={styles.profileLeft}>
                <View style={styles.top}>
                  <Text style={styles.hi}>Hi</Text>
                  <Text style={styles.userName}>{userData.name}</Text>
                </View>
                <Text style={styles.welcome}>Welcome back to NCD</Text>
              </View>
              <View style={styles.profileRight}>
                <Image style={styles.profileImage} source={require('../assets/icon/user.png')} />
              </View>
            </View>

            {/* search bar  */}
            <View style={styles.searchContainer}>
              <View style={styles.searchBarLeft}>
                <TextInput
                  style={styles.searchBar}
                  placeholder="Search Documents..."
                  placeholderTextColor={'#605f63'}
                  value={searchText}
                  onChangeText={(text) => setSearchText(text)}
                />
                {searchText ? (
                  <TouchableOpacity onPress={clearSearch} style={styles.cutButton}>
                    <Ionicons name="close" size={20} color="#605f63" />
                  </TouchableOpacity>
                ) : null}
              </View>
              <TouchableOpacity onPress={handleSearch} style={styles.searchButton}>
                <Ionicons name="search" size={20} color="#605f63" />
              </TouchableOpacity>
            </View>

            {/* header section */}
            <View style={styles.headerSection}>
              <View style={styles.headerLeft}>
                <Text style={styles.headerTitle}>Document Secured by Blockchain</Text>
                <Text style={styles.headerPara}>Read & Download your Documents</Text>
              </View>
              <View style={styles.headerRight}>
                <Image style={styles.headerImage} source={require('../assets/icon/blockchain.png')} />
              </View>
            </View>

            {/* category section */}
            <View style={styles.categorySection}>
              <View style={styles.headNav}>
                <Text style={styles.headNavHeading}>Category</Text>
                <TouchableOpacity style={styles.viewAllButton}>
                  <Text style={styles.viewAllButtonText}>View All</Text>
                </TouchableOpacity>
              </View>

              <ScrollView horizontal={true} style={styles.categoryContainer}>
                <CategoryItem type={'Lab Report'} />
                <CategoryItem type={'Invoice'} />
                <CategoryItem type={'Prescription'} />
              </ScrollView>
            </View>

            {/* issued documents section */}
            <View style={styles.documentsSection}>
              <View style={styles.headNav}>
                <Text style={styles.headNavHeading}>Issued Documents</Text>
                <TouchableOpacity style={styles.viewAllButton} onPress={() => { navigation.navigate('Issued') }}>
                  <Text style={styles.viewAllButtonText}>View All</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.docContainer}>
                {docData.length > 0 ? (
                  <FlatList
                    style={{
                      height: '100%',
                      // paddingBottom: 40
                    }}
                    data={docData}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item }) => (
                      <Item item={item} />
                    )}
                  />
                ) : (
                  <Text style={{ color: '#000000' }}>No any Document Issued</Text>
                )}
              </View>
            </View>
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  mainContainer: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    height: '100%'
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // user details 
  userProfile: {
    // borderWidth: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    marginTop: 30
  },
  top: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'row',
    gap: 4
  },
  hi: {
    color: '#000000',
    fontSize: 16,
    // fontWeight: ''
  },
  userName: {
    color: '#000000',
    fontSize: 16,
    fontWeight: '800',
    color: '#5525f5',
    textTransform: 'capitalize'
  },
  welcome: {
    fontSize: 14,
    fontWeight: '400',
    color: '#c0c0c0'
  },
  profileRight: {
    width: 38,
    height: 38,
    borderRadius: 100,
    overflow: 'hidden'
    // borderWidth: 1
  },
  profileImage: {
    width: '100%',
    height: '100%',
  },
  // serach 
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 5,
    marginTop: 18,
    marginBottom: 16,
    backgroundColor: '#f8f7fd',
    height: 40
  },
  searchBarLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '86%',
  },
  searchBar: {
    display: 'flex',
    paddingVertical: 5,
    color: '#605f63',
    fontSize: 14,
    paddingHorizontal: 10,
    width: '90%'
  },
  cutButton: {
    height: '100%',
  },
  searchButton: {
    width: '12%',
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },


  // header section 
  headerSection: {
    width: '100%',
    height: 130,
    borderRadius: 20,
    backgroundColor: '#5525f5',
    marginBottom: 15,
    paddingHorizontal: 20,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  headerLeft: {
    width: '70%',
    // borderWidth: 1
  },
  headerTitle: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
    letterSpacing: 0.2,
    marginBottom: 6
  },
  headerPara: {
    fontSize: 13,
    fontWeight: '400',
  },
  headerRight: {
    width: 160,
    height: 160,
    position: 'relative',
    left: -35
    // borderWidth: 1
  },
  headerImage: {
    width: '100%',
    height: '100%'
  },

  // section Header 
  headNav: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  headNavHeading: {
    color: '#000000',
    fontSize: 15,
    fontWeight: '600'
  },
  viewAllButtonText: {
    color: '#000000',
    fontWeight: '600',
    color: '#5525f5',
    fontSize: 13
  },

  //category section
  categorySection: {
    marginTop: 10,
  },
  categoryContainer: {
    display: 'flex',
    flexDirection: 'row',
  },

  // issued documents 
  documentsSection: {
    marginTop: 10
  },
  docContainer: {
    marginVertical: 20,
    // borderWidth:1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 17
  }
})

export default Home
