import { View, Text, Image } from 'react-native'
import React from 'react'
import Icon from 'react-native-vector-icons/MaterialIcons';

export default function Navbar() {
  return (
    <View className="bg-sky-200 p-3 items-center">
  <Image source={require('../src/img.png')} className="w-40 h-12 " />
  </View>
  )
}

