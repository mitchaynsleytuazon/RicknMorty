import React, { useState, useEffect } from 'react';
import { SafeAreaView, 
  FlatList,
   Text, 
   View, 
   TextInput, 
   TouchableOpacity,
   Image, 
   RefreshControl, 
   ScrollView, 
   StyleSheet,
   Modal } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import Navbar from './navbar';


export default function Home() {
  
  //CLEAR BUTTON
  const [text, setText] = useState(""); 

  //CURRENT PAGE
  const [items, setItems] = useState([]);
  const [currentPage, setCurrentPage] = useState(1); // For Current page
  const [allPage, setAllPage] = useState(42);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedChar, setSelectedChar] = useState(null);

  // NAVIGATION FUNCTION
  const navigation = useNavigation();

  // MODAL FUNCTION
  const [modalVisible, setModalVisible] = useState(false);
  const numColumns = 5;

  // FILTER FUNCTION
  
  


  const searchUser = async (text) => {
    try {
      const url = `https://rickandmortyapi.com/api/character?name=${text}`;
      let result = await fetch(url);
      result = await result.json();
      
      if (result) {
        setItems(result.results);
      } else {
        setItems([]); // If no results, clear the items
      }
    } catch (error) {
      console.error('Error searching user:', error);
    }
  };

  const fetchData = async (page) => {
    try {
      const response = await fetch(`https://rickandmortyapi.com/api/character?page=${page}`);
      const data = await response.json();
      setItems(data.results);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchData(currentPage);
    setRefreshing(false);
  };

  const handleEmpty = () => (
    <View>
      <Text>No characters available.</Text>
    </View>
  );


  const handleNextPage = (pageNumber) => {
    setCurrentPage(pageNumber);
  };
  

  useEffect(() => {
    fetchData(currentPage);
  }, [currentPage]);

  const toggleModal = (item) => {
    setSelectedChar(item);
    setModalVisible(!modalVisible);
  };
  



    const goBack = () => {
    setModalVisible(false);
    navigation.goBack(); // Navigating back using the navigation object
  };

  const renderPageButtons = () => {
    const buttons = [];
    const buttonsPerRow = 5;
  
    const startButton = Math.max(1, (Math.ceil(currentPage / buttonsPerRow) - 1) * buttonsPerRow + 1);
    const endButton = Math.min(allPage, startButton + buttonsPerRow);
  
    for (let i = startButton; i <= endButton; i++) {
      buttons.push(
        <TouchableOpacity
          key={i}
          style={{
            backgroundColor: currentPage === i ? '#8C38CB' : '#0D8399',
            padding: 10,
            margin: 5,
            borderRadius: 5,
          }}
          onPress={() => handleNextPage(i)}
        >
          <Text style={{ color: '#EAF3F5' }}>{i}</Text>
        </TouchableOpacity>
      );
    }
  
    // Add previous and next buttons
    buttons.unshift(
      <TouchableOpacity
        key="prev"
        style={{
          backgroundColor: '#0D8399',
          padding: 10,
          margin: 5,
          borderRadius: 5,
        }}
        onPress={() => handleNextPage(Math.max(1, currentPage - 1))}
      >
        <Text style={{ color: '#EAF3F5' }}>Prev</Text>
      </TouchableOpacity>
    );
  
    buttons.push(
      <TouchableOpacity
        key="next"
        style={{
          backgroundColor: '#0D8399',
          padding: 10,
          margin: 5,
          borderRadius: 5,
        }}
        onPress={() => handleNextPage(Math.min(allPage, currentPage + 1))}
      >
        <Text style={{ color: '#EAF3F5' }}>Next</Text>
      </TouchableOpacity>
    );
  
    return (
      <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
        {buttons}
      </View>
    );
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity className="bg-sky-300 border border-green-500 rounded-xl m-1 items-center justify-center w-36" onPress={() => toggleModal(item)}>
      <Image source={{ uri: item.image }} className="w-28 h-28 rounded-full my-2"/>
      <View className="items-center bg-emerald-400 w-full h-16 rounded-md justify-center">
      <Text className="text-base font-extrabold text-slate-50 text-center">{item.name}</Text>
      <Text className="text-sm font-extrabold text-sky-800">{item.status}</Text>
      </View>

    </TouchableOpacity>
  );

  
  
  


  return (
    <SafeAreaView className="flex-1 bg-slate-200">
      <ScrollView className="">

        <Navbar />
        <Text className="text-3xl font-black text-sky-500 ml-3 mt-5">Characters</Text>
        <View className="flex-row justify-between m-2 border rounded-3xl border-neutral-400 h-10">

          <TextInput className="ml-2" value={text} placeholder='Search a Character'
          onChangeText={
            (value) => {setText(value); searchUser(value);
            }} />
          <TouchableOpacity className="justify-center items-center mr-2" onPress={() => setText("")}>
            <Icon name="cancel" size={28} />
          </TouchableOpacity>
        </View>




          <View className="bg-emerald-600 w-11/12 self-center">
        <Text className=" text-lg text-center text-white font-extrabold uppercase p-1"> Filter </Text>
        </View>

        <View className="flex-row my-3 justify-evenly">

        <TouchableOpacity className="color-r "> 
        <Icon name="cancel" size={32} style={StyleSheet.create({ color:'#8C38CB' })} />
        </TouchableOpacity>

        <TouchableOpacity className=" "> 
        <Icon name="wc" size={32} style={StyleSheet.create({ color:'#8C38CB' })} />
         </TouchableOpacity>

         <TouchableOpacity className=" "> 
         <Icon name="groups" size={32} style={StyleSheet.create({ color:'#8C38CB' })} />
         </TouchableOpacity>

         <TouchableOpacity className=" "> 
         <Icon name="mood" size={32} style={StyleSheet.create({ color:'#8C38CB' })}/>
         </TouchableOpacity>

         <TouchableOpacity className=" "> 
         <Icon name="abc" size={32} style={StyleSheet.create({ color:'#8C38CB' })} />
         </TouchableOpacity>

        

        </View>

        {/* FOR API FLATLIST*/}
  
        <ScrollView horizontal>
  <FlatList
    data={items}
    renderItem={renderItem}
    keyExtractor={(item) => item.id.toString()}
    ListEmptyComponent={handleEmpty}
    refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh}/>}
    numColumns={numColumns}
  />
      </ScrollView>

      <Modal visible={modalVisible} onRequestClose={() => setModalVisible(false)}>
        <Navbar />
        {selectedChar && (
          <View className="flex-1 justify-around bg-purple-900 m-5">
            <View className="flex-row justify-between mx-2">
                  <Icon name="chevron-left" size={32} style={StyleSheet.create({ color:'#DFD2CB', })}
          onPress={() => goBack()} />
          <Text className=" text-base bg-green-500 w-24 self-center text-center  rounded-full text-slate-200 font-black uppercase">{selectedChar.status} </Text>
            </View>
          <View className="items-center mb-8">
                      <Text className="text-4xl font-extrabold text-slate-100 uppercase">{selectedChar.name} </Text>

            <Image className="w-64 h-64 my-5 rounded-full " source={{uri:selectedChar.image}} />
            

            <View className=" items-center gap-3 mt-5">

            <View className="flex-row items-center ">
            <Text className="text-lg p-1 text-center text-green-500 font-extrabold bg-slate-200 w-28 uppercase">Gender</Text>
            <Text className="text-lg p-1 text-center text-slate-50 font-black uppercase bg-green-500 w-40"> {selectedChar.gender}</Text>
            </View>

            <View className="flex-row items-center  ">
            <Text className="text-lg p-1 text-center text-green-500 font-extrabold bg-slate-200 w-28 uppercase">Species</Text>
            <Text className="text-lg p-1 text-center text-slate-50 font-black uppercase bg-green-500 w-40"> {selectedChar.species}</Text>
            </View>

            <View className="flex-row items-center  ">
            <Text className="text-lg p-1 text-center text-green-500 font-extrabold bg-slate-200 w-28 uppercase">Status</Text>
            <Text className="text-lg p-1 text-center text-slate-50 font-black uppercase bg-green-500 w-40"> {selectedChar.status}</Text>
            </View>

            <View className="flex-row items-center  ">
            <Text className="text-lg p-1 text-center text-green-500 font-extrabold bg-slate-200 w-28 uppercase">Type</Text>
            <Text className="text-lg p-1 text-center text-slate-50 font-black uppercase bg-green-500 w-40"> {selectedChar.type}</Text>
            </View>

            </View>


            </View>
          </View>
        )}
      </Modal>

{renderPageButtons()}
      </ScrollView>
    </SafeAreaView>
  );
}