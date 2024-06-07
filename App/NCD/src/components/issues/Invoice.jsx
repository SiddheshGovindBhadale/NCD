import { SafeAreaView, ScrollView, TouchableOpacity, ActivityIndicator, Platform, StyleSheet, Text, View, Image } from 'react-native'
import React, { useState, useEffect } from 'react'
import Ionicons from 'react-native-vector-icons/Ionicons';
import InvoiceItem from './InvoiceItem';

const Invoice = ({ route, navigation }) => {
    const { item } = route.params;
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const timeout = setTimeout(() => {
            setIsLoading(false);
        }, 700);

        return () => clearTimeout(timeout); // Clear the timeout on component unmount
    }, []);

    // change date formate
    const formatDate = (inputDate) => {
        const dateObject = new Date(inputDate);
        const options = { month: 'short', day: 'numeric', year: 'numeric' };
        const formattedDate = dateObject.toLocaleDateString('en-US', options);
        return formattedDate;
    };

    // convert string to array
    const itemData = item[3][6].split(';').map(item => {
        const [itemName, quantity, price] = item.split(',');
        return { itemName: itemName, quantity: parseInt(quantity), price: parseInt(price) };
    });

    return (
        <SafeAreaView style={{ height: '100%', backgroundColor: '#f8f7fd' }}>
            {isLoading ? (
                <ActivityIndicator style={styles.loader} size="large" color="#5525f5" />
            ) : (
                <ScrollView>
                    <View style={styles.topStatusBar}>
                        <TouchableOpacity style={styles.backButton}>
                        {/* <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate('Issued')}> */}
                            <Ionicons name="arrow-back" size={22} color="#585C60" />
                        </TouchableOpacity>
                        <Text style={styles.heading}>Invoice</Text>
                    </View>
                    <View style={styles.mainContainer}>
                        {/* details */}
                        <View style={styles.detailsSection}>
                            <Text style={styles.sectionHeading}>Details</Text>
                            <View style={styles.detailsContainer}>
                                <Text style={styles.invoiceNo}>No. {item[0]}</Text>
                                <Text style={styles.date}>{formatDate(item[3][0])}</Text>
                                <Text style={styles.provider}>by {item[3][1]}</Text>
                            </View>
                        </View>

                        {/* client details */}
                        <View style={styles.clientSection}>
                            <Text style={styles.sectionHeading}>client</Text>
                            <View style={styles.clientContainer}>
                                <View style={styles.clientLeft}>
                                    <Image style={styles.clientImage} source={require('../../assets/icon/user.png')} />
                                </View>
                                <View style={styles.clientRight}>
                                    <Text style={styles.clientName}>{item[3][3]}</Text>
                                    <Text style={styles.clientEmail}>{item[3][4]}</Text>
                                </View>

                            </View>
                        </View>

                        {/* item details */}
                        <View style={styles.itemSection}>
                            <Text style={styles.sectionHeading}>items</Text>
                            <View style={styles.itemContainer}>
                                {itemData.map((item, index) => (
                                    <InvoiceItem key={index} item={item} />
                                ))}

                            </View>

                            <View style={styles.totalContainer}>
                                <Text style={styles.totalText}>Total</Text>
                                <Text style={styles.totalPrice}>₹{item[3][5]}</Text>
                            </View>
                        </View>

                        <View style={styles.buttonWrapper}>
                            {/* <TouchableOpacity style={styles.downloadButton}>
                                <Text style={styles.downloadButtonText}>History</Text>
                            </TouchableOpacity> */}
                            <View style={[styles.historyButtonContainer, { backgroundColor: '#5525f5' }]}>
                                <TouchableOpacity style={[styles.historyButton]} onPress={() => navigation.navigate('History', { data: item })}>
                                    <Text style={[styles.historyButtonText, { color: '#ffffff' }]}>History</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={[styles.historyButtonContainer, { backgroundColor: '#ffffff' }]}>
                                <TouchableOpacity style={[styles.historyButton]}>
                                    <Text style={[styles.historyButtonText, { color: '#000000' }]}>Download PDF</Text>
                                </TouchableOpacity>
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

    // section heading 
    sectionHeading: {
        fontSize: 12,
        color: 'gray',
        textTransform: 'uppercase',
        fontWeight: '500',
        marginBottom: 7,
        marginTop: 20
    },

    // details section 
    detailsContainer: {
        // borderWidth: 1,
        backgroundColor: '#ffffff',
        borderRadius: 10,
        paddingVertical: 17,
        paddingHorizontal: 15,
        ...Platform.select({
            ios: {
                shadowColor: '#f8f7fd',
                shadowOpacity: 0.8,
                shadowRadius: 2,
                shadowOffset: {
                    height: 1,
                    width: 0,
                },
            },
            android: {
                elevation: 2,
            },
        })
    },
    invoiceNo: {
        color: 'gray',
        fontSize: 13,
        fontWeight: '500'
    },
    date: {
        color: '#000000',
        fontSize: 13.5,
        fontWeight: '700',
        marginTop: 2,
        marginBottom: 1
    },
    provider: {
        color: 'gray',
        fontSize: 13,
        fontWeight: '500'
    },

    // client container 
    clientContainer: {
        backgroundColor: '#ffffff',
        flexDirection: 'row',
        borderRadius: 10,
        paddingVertical: 17,
        paddingHorizontal: 15,
        gap: 10,
        ...Platform.select({
            ios: {
                shadowColor: '#f8f7fd',
                shadowOpacity: 0.8,
                shadowRadius: 2,
                shadowOffset: {
                    height: 1,
                    width: 0,
                },
            },
            android: {
                elevation: 2,
            },
        })
    },
    clientLeft: {
        width: 40,
        height: 40,
        borderRadius: 100,
        overflow: 'hidden'
    },
    clientImage: {
        width: '100%',
        height: '100%'
    },
    clientRight: {
        // mar
    },
    clientName: {
        color: '#000000',
        fontSize: 14,
        fontWeight: '700'
    },
    clientEmail: {
        color: 'gray',
        fontSize: 12.5,
        fontWeight: '400'
    },

    // item section 
    itemContainer: {
        backgroundColor: '#ffffff',
        borderRadius: 10,
        paddingVertical: 17,
        paddingHorizontal: 15,
        ...Platform.select({
            ios: {
                shadowColor: '#f8f7fd',
                shadowOpacity: 0.8,
                shadowRadius: 2,
                shadowOffset: {
                    height: 1,
                    width: 0,
                },
            },
            android: {
                elevation: 2,
            },
        })
    },

    // total container 
    totalContainer: {
        backgroundColor: '#ffffff',
        marginVertical: 15,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderRadius: 10,
        paddingVertical: 17,
        paddingHorizontal: 15,
        ...Platform.select({
            ios: {
                shadowColor: '#f8f7fd',
                shadowOpacity: 0.8,
                shadowRadius: 2,
                shadowOffset: {
                    height: 1,
                    width: 0,
                },
            },
            android: {
                elevation: 2,
            },
        })
    },
    totalText: {
        color: '#000000',
        fontSize: 16,
        fontWeight: '600',
    },
    totalPrice: {
        color: '#000000',
        fontSize: 16,
        fontWeight: '600',
    },

    // download button 
    buttonWrapper: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 15,
        marginBottom: 20,
    },
    downloadButton: {
        borderRadius: 8,
        paddingVertical: 10,
        backgroundColor: '#5525f5',
        alignItems: 'center',
        justifyContent: 'center',
        width: '48.5%',
    },
    downloadButtonText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#ffffff'
    },
    historyButtonContainer: {
        borderRadius: 8,
        backgroundColor: '#5525f5',
        width: '48.5%',
        ...Platform.select({
            ios: {
                shadowColor: '#f8f7fd',
                shadowOpacity: 0.8,
                shadowRadius: 2,
                shadowOffset: {
                    height: 1,
                    width: 0,
                },
            },
            android: {
                elevation: 2,
            },
        })
    },
    historyButton: {
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 8,
        // borderWidth: 1,
        paddingVertical: 10,
    },
    historyButtonText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#ffffff'
    }
})

export default Invoice
