import { StyleSheet, Text, View, SafeAreaView, ToastAndroid, ScrollView, FlatList, TextInput, ActivityIndicator, TouchableOpacity } from 'react-native'
import React, { useState, useEffect } from 'react'
import Ionicons from 'react-native-vector-icons/Ionicons';
import Item from '../components/issues/Item';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Issued = ({ route, navigation }) => {
  // const { data } = route.params;
  const [searchText, setSearchText] = useState('');
  const [userData, setUserData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filteredUserData, setFilteredUserData] = useState([]);

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
    // Set searchText based on the people prop in route
    if (route.params && route.params.people) {
      setSearchText(route.params.people);
    } else {
      setSearchText('');
    }
  }, [route.params]);

  const fetchData = async () => {
    try {
      // Get the user ID from AsyncStorage
      const userId = await AsyncStorage.getItem('userData');
      const id = JSON.parse(userId)._id
      // console.log(`user id : ${id}`)

      // Make a network request to fetch data from the API
      const response = await fetch('https://ncd-api.onrender.com/documents');
      const result = await response.json();

      // Extract the 'data' array from the response
      const data = result.data || [];

      // Filter the data based on the user ID
      const filteredData = data.filter(item => item[2] === id);

      setUserData(filteredData);
      setFilteredUserData(filteredData);
      setLoading(false); // Set loading to false when data is loaded
    } catch (error) {
      console.error('Error fetching data:', error);
      showToast('Error loading Data : Check Internet Connection');
      setLoading(false); // Set loading to false in case of an error
    }
  };



  //search fuction 
  const clearSearch = () => {
    setSearchText('');
  };

  useEffect(() => {
    handleSearch();
  }, [searchText]);

  const handleSearch = () => {
    const searchTextLowerCase = searchText.toLowerCase();

    // If search text is empty, show the original userData
    if (searchText === '') {
      setFilteredUserData(userData);
    } else {
      // Filter userData based on the search criteria
      const filteredData = userData.filter(item =>
        item.some(val => val && val.toString().toLowerCase().includes(searchTextLowerCase))
      );

      setFilteredUserData(filteredData);
    }
  };

  return (
    <SafeAreaView style={{ backgroundColor: '#ffffff', height: '100%' }}>
      {loading ? (
        <ActivityIndicator style={styles.loader} size="large" color="#5525f5" />
      ) : (
        <View>
          <View style={styles.topStatusBar}>
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            {/* <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate('Home')}> */}
              <Ionicons name="arrow-back" size={22} color="#585C60" />
            </TouchableOpacity>
            <Text style={styles.heading}>Documents</Text>
          </View>

          <View style={styles.mainContainer}>
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
              < TouchableOpacity onPress={handleSearch} style={styles.searchButton}>
                <Ionicons name="search" size={20} color="#605f63" />
              </TouchableOpacity>
            </View>

            <View style={styles.docContainer}>
              {filteredUserData.length > 0 ? (
                <FlatList
                  style={{
                    height: '90%',
                    paddingBottom: 40
                  }}
                  data={filteredUserData}
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
      )}
    </SafeAreaView >
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
  topStatusBar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
    flexDirection: 'row',
    gap: 5,
    paddingHorizontal: 10,
    paddingTop: 10
  },
  backButton: {
    // borderWidth:1,
    paddingVertical: 10,
    paddingHorizontal: 10
  },
  heading: {
    color: '#000000',
    fontSize: 16,
    fontWeight: '600'
  },
  // serach 
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 5,
    // borderWidth: 1,
    // borderColor: '#cccccc',
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

  // document
  docContainer: {
    marginVertical: 30,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 17,
    paddingBottom: 40
  }
})

export default Issued
