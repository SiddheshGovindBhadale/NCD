import { StyleSheet, Text, View } from 'react-native'
import React, {memo} from 'react'
import Ionicons from 'react-native-vector-icons/Ionicons';

const InvoiceItem = ({ item }) => {
    const { itemName, quantity, price } = item;

    return (
        <View style={styles.item}>
            <View style={styles.icon}>
                <Ionicons name="clipboard-sharp" size={20} color="#5525f5" />
            </View>
            <View style={styles.itemDetails}>
                <Text style={styles.itemName}>{itemName}</Text>
                <Text style={styles.itemQuantity}>QTY {quantity} x ₹ {price}</Text>
            </View>
            <Text style={styles.itemPrice}>₹{price * quantity}</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    item: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        // borderWidth:1,
        paddingVertical: 10,
        borderBottomWidth: 0.2,
        borderColor: '#cccccc'
    },
    icon: {
        // borderWidth:1,
        paddingVertical: 7,
        paddingHorizontal: 7,
        borderRadius: 10,
        backgroundColor: '#f8f7fd',
    },
    itemDetails: {
        // borderWidth:1,
        width: '70%'
    },
    itemName: {
        color: '#000000',
        fontSize: 15,
        fontWeight: '700',
        textTransform: 'capitalize',
        marginBottom: 2
    },
    itemQuantity: {
        color: '#000000',
        fontSize: 12,
        fontWeight: '500',
        color: '#c0c0c0'
    },
    itemPrice: {
        color: '#000000',
        fontSize: 16,
        fontWeight: '700',
    },
})

export default memo(InvoiceItem)
