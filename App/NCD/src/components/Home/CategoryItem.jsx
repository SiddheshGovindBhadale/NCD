import { StyleSheet, Text, View, Image, TouchableOpacity, Platform } from 'react-native'
import React, { memo } from 'react'
import { useNavigation } from '@react-navigation/native';

const CategoryItem = ({ type }) => {
    const navigation = useNavigation();

    return (
        <TouchableOpacity style={styles.item} onPress={() => navigation.navigate('SearchResult', { type : type == 'Invoice' ? '11' : type == 'Lab Report' ? '12' : '13' })}>
            <View style={styles.itemLeft}>
                {type == 'Invoice' ? (
                    <Image style={styles.itemImage} source={require('../../assets/icon/invoice.png')} />
                ) : type == 'Lab Report' ? (
                    <Image style={styles.itemImage} source={require('../../assets/icon/lab.png')} />
                ) : type == 'Prescription' ? (
                    <Image style={styles.itemImage} source={require('../../assets/icon/prescription.png')} />
                ) : (null)}
            </View>
            <View style={styles.itemRight}>
                <Text style={styles.itemText}>{type}</Text>
            </View>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    item: {
        borderRadius: 15,
        backgroundColor: '#ffffff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexDirection: 'row',
        paddingVertical: 10,
        paddingHorizontal: 10,
        width: 200,
        marginLeft: 2,
        marginRight: 15,
        marginVertical: 15,
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
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 15,
        width: 70,
        height: 70,
        paddingVertical: 10,
        paddingHorizontal: 10,
        backgroundColor: '#f8f7fd',
    },
    itemImage: {
        width: '100%',
        height: '100%'
    },
    itemRight: {
        // borderWidth: 1,
        width: '55%'
    },
    itemText: {
        color: '#000000',
        fontSize: 16,
        fontWeight: '600'
    }
})

export default memo(CategoryItem)
