import { SafeAreaView, ScrollView, StyleSheet, TextInput, ActivityIndicator, TouchableOpacity, Text, View } from 'react-native'
import React, { useState, useEffect } from 'react'
import { Table, TableWrapper, Row, Rows, Col } from 'react-native-table-component';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';

const History = ({ route }) => {
    const navigation = useNavigation();

    const { data } = route.params;
    const historyArr = data[4].slice(1);
    const [searchText, setSearchText] = useState('');
    const [filteredHistoryData, setFilteredHistoryData] = useState([]);
    const [data2, setData] = useState([]);
    const tableHead = ['Sr No', 'Organization Name', 'Date', 'Time']
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const newData = await Promise.all(
                    historyArr.map(async (item, index) => {
                        const organizationData = await fetchOrganizationData(item[0]);
                        return { srNo: index + 1, ...organizationData, orderData: item.slice(1) };
                    })
                );

                console.log(`new data is here : ${newData}`)

                const newArray = newData.map(obj => [
                    obj.srNo,
                    obj.organizationName,
                    obj.orderData[0],
                    obj.orderData[1]
                ]);

                setData(newArray);
                setFilteredHistoryData(newArray);
                setIsLoading(false);
            } catch (error) {
                console.error('Error fetching data:', error);
                setIsLoading(false);
            }
        };

        fetchData();
    }, []); // Run the effect only once on component mount

    const fetchOrganizationData = async (organizationId) => {
        const response = await fetch(`https://ncd-api.onrender.com/orgs/${organizationId}`);
        const orgData = await response.json();
        return {
            organizationName: orgData.name,
        };
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
            setFilteredHistoryData(data2);
        } else {
            // Filter userData based on the search criteria
            const filteredData = data2.filter(item =>
                item.some(val => val && val.toString().toLowerCase().includes(searchTextLowerCase))
            );

            setFilteredHistoryData(filteredData);
        }
    };

    return (
        <SafeAreaView style={{ backgroundColor: '#ffffff', height: '100%' }}>
            {isLoading ? ( // Display loader if still loading
                <ActivityIndicator size="large" color="#5525f5" style={styles.loader} />
            ) : (
                <ScrollView>
                    <View style={styles.topStatusBar}>
                        <TouchableOpacity style={styles.backButton}>
                            {/* <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate('Issued')}> */}
                            <Ionicons name="arrow-back" size={22} color="#585C60" />
                        </TouchableOpacity>
                        <Text style={styles.heading}>Document History</Text>
                    </View>

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

                    <View style={styles.container}>
                        {filteredHistoryData.length > 0 ? (
                            <Table borderStyle={{ borderWidth: 1, borderColor: '#eeeeee' }}>
                                <Row data={tableHead} flexArr={[1, 2, 2, 2]} style={styles.head} textStyle={styles.text} />
                                <TableWrapper style={styles.wrapper}>
                                    <Rows data={filteredHistoryData} flexArr={[1, 2, 2, 2]} style={styles.row} textStyle={styles.rowText} />
                                </TableWrapper>
                            </Table>
                        ) : (
                            <Text style={{ color: '#000000', textAlign: 'center' }}>No any Document history available</Text>
                        )}
                    </View>
                </ScrollView>
            )}
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
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
        backgroundColor: '#ffffff',
        gap: 5,
        paddingHorizontal: 10,
        paddingVertical: 7
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
        height: 40,
        marginHorizontal: 15,
        marginTop: 6
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

    // tabler styling
    container: {
        flex: 1,
        padding: 16,
        paddingTop: 30,
        backgroundColor: '#fff'
    },
    head: {
        height: 50,
        backgroundColor: '#f8f7fd'
    },
    wrapper: {
        flexDirection: 'row'
    },
    title: {
        flex: 1,
        backgroundColor: '#f6f8fa'
    },
    row: {

    },
    rowText: {
        textAlign: 'center',
        color: '#000000',
        marginVertical: 5
    },
    text: {
        textAlign: 'center',
        color: '#000000',
        marginVertical: 5

    },
})

export default History
