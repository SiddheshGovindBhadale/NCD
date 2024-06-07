import { Image, StyleSheet, Text, View, Platform, TouchableOpacity } from 'react-native'
import React, { memo } from 'react'
import { useNavigation } from '@react-navigation/native';

const Item = ({ item }) => {
    const navigation = useNavigation();
    // console.log(item)

    // const docNumber = item[0]
    if (!item || !item[0]) {
        // console.error('Invalid item:', item);
        return null;
    }
    const docTypeNumber = item[0].slice(6, 8);

    return (
        <>
            {docTypeNumber == '11' ? (
                <TouchableOpacity style={styles.item} onPress={() => { navigation.navigate('Invoice', { item: item }) }}>
                    <View style={styles.itemLeft}>
                        <Image style={styles.itemImage} source={require('../../assets/icon/invoice.png')} />
                    </View>
                    <View style={styles.itemRight}>
                        <Text style={styles.docType}>Invoice</Text>
                        <Text style={styles.provider}>Provided by {item[3][1]}</Text>
                        <Text style={styles.time}>{item[3][0]}</Text>
                    </View>
                </TouchableOpacity>
            ) : docTypeNumber == '12' ? (
                <TouchableOpacity style={styles.item} onPress={() => { navigation.navigate('Invoice', { item: item }) }}>
                    <View style={styles.itemLeft}>
                        <Image style={styles.itemImage} source={require('../../assets/icon/lab.png')} />
                    </View>
                    <View style={styles.itemRight}>
                        <Text style={styles.docType}>lab Report</Text>
                        <Text style={styles.provider}>Provided by {item[3][1]}</Text>
                        <Text style={styles.time}>{item[3][0]}</Text>
                    </View>
                </TouchableOpacity>
            ) : docTypeNumber == '13' ? (
                <TouchableOpacity style={styles.item} onPress={() => { navigation.navigate('Invoice', { item: item }) }}>
                    <View style={styles.itemLeft}>
                        <Image style={styles.itemImage} source={require('../../assets/icon/prescription.png')} />
                    </View>
                    <View style={styles.itemRight}>
                        <Text style={styles.docType}>Prescription</Text>
                        <Text style={styles.provider}>Provided by {item[3][1]}</Text>
                        <Text style={styles.time}>{item[3][0]}</Text>
                    </View>
                </TouchableOpacity>
            ) : (null)}
        </>
    )
}

const styles = StyleSheet.create({
    item: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexDirection: 'row',
        borderRadius: 15,
        paddingVertical: 10,
        paddingHorizontal: 10,
        backgroundColor: '#ffffff',
        marginBottom: 15,
        marginTop: 2,
        marginHorizontal: 3,

        // borderWidth:1,
        gap: 10,
        // marginVertical: 20,
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
    itemLeft: {
        width: 90,
        height: 90,
        paddingVertical: 15,
        paddingHorizontal: 15,
        borderRadius: 20,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f8f7fd'
    },
    itemImage: {
        width: '100%',
        height: '100%'
    },
    itemRight: {
        // borderWidth:1,
        height: 85,
        width: '65%'
    },
    docType: {
        color: '#000000',
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 7
    },
    provider: {
        color: '#c2c2c2',
        fontSize: 14,
        fontWeight: '400',
        marginBottom: 0.5,
    },
    time: {
        color: '#c2c2c2',
        fontSize: 14,
        fontWeight: '400'
    }
})

export default memo(Item)
