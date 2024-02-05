import React, { useState, useEffect, } from 'react';
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
import Navbar from './navbar';



export default function Home() {
  
  //CLEAR BUTTON
  const [text, setText] = useState(""); 

  //CURRENT PAGE
  const [items, setItems] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [allPage, setAllPage] = useState(42);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedChar, setSelectedChar] = useState(null);

  // MODAL LOGIC
  const [modalVisible, setModalVisible] = useState(false);
  const numColumns = 5;

  // FILTER LOGIC
  const [sortByABC, setSortByABC] = useState(false);
  const [sortOrder, setSortOrder] = useState("asc");

  // STATUS LOGIC
  const [isStatusDropdownVisible, setStatusDropdownVisible] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState(null);
  const openStatusDropdown = () => setStatusDropdownVisible(true);
  const closeStatusDropdown = () => setStatusDropdownVisible(false);

  // SPECIES LOGIC
  const [isSpeciesDropdownVisible, setSpeciesDropdownVisible] = useState(false);
  const [selectedSpecies, setSelectedSpecies] = useState(null);
  const openSpeciesDropdown = () => setSpeciesDropdownVisible(true);
  const closeSpeciesDropdown = () => setSpeciesDropdownVisible(false);

  // GENDER LOGIC
  const [isGenderDropdownVisible, setGenderDropdownVisible] = useState(false);
  const [selectedGender, setSelectedGender] = useState(null);
  const openGenderDropdown = () => setGenderDropdownVisible(true);
  const closeGenderDropdown = () => setGenderDropdownVisible(false);

const fetchData = async (page, status, species, gender) => {
  try {
    let url = `https://rickandmortyapi.com/api/character?page=${page}`;

    if (status) {
      url += `&status=${status}`;
    }

    if (species) {
      url += `&species=${species}`;
    }

    if (gender) {
      url += `&gender=${gender}`;
    }

    const response = await fetch(url);
    let data = await response.json();

    if (sortByABC) {
      data.results.sort((a, b) => {
        const nameA = a.name.toUpperCase();
        const nameB = b.name.toUpperCase();

        if (sortOrder === "asc") {
          return nameA.localeCompare(nameB);
        } else {
          return nameB.localeCompare(nameA);
        }
      });
    }

    setItems(data.results);
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

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

  const resetFilter = () => {
    setText("");
    fetchData(1);
    setSelectedStatus(null); 
    setSelectedSpecies(null); 
    setSelectedGender(null);
    setSortByABC(false); 
  };
  
  const handleNextPage = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  useEffect(() => {
    fetchData(currentPage);
  }, [sortByABC, currentPage]);

  const toggleModal = (item) => {
    setSelectedChar(item);
    setModalVisible(!modalVisible);
  };
  
  const renderPageButtons = () => {
    const buttons = [];
    const buttonsPerRow = 4;
  
    const startButton = Math.max(1, (Math.ceil(currentPage / buttonsPerRow) - 1) * buttonsPerRow + 1);
    const endButton = Math.min(allPage, startButton + buttonsPerRow);
  
    for (let i = startButton; i <= endButton; i++) {
      buttons.push(
        <TouchableOpacity
          key={i}
          style={{
            backgroundColor: currentPage === i ? '#CBC00D' : '#0D8399',
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

const handleSelectStatus = (status) => {
  setSelectedStatus(status);
  fetchData(currentPage, status);
  closeStatusDropdown();
};

const handleSelectSpecies = (species) => {
  setSelectedSpecies(species);
  fetchData(currentPage, null, species);
  closeSpeciesDropdown();
};

const handleSelectGender = (gender) => {
  setSelectedGender(gender);
  fetchData(currentPage, null, null,  gender);
  closeGenderDropdown();
};
 
// STATUS DROPDOWN MODAL COMPONENT
const StatusDropdown = ({ isVisible, onClose, onSelectStatus }) => (
  <Modal visible={isVisible} transparent={true} onRequestClose={onClose}>
    <View className="bg-slate-50 p-5 rounded-lg absolute top-16 right-2 ">
      <TouchableOpacity onPress={() => onSelectStatus('Alive')}>
        <Text className="text-lg py-3">Alive</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => onSelectStatus('Dead')}>
        <Text className="text-lg py-3">Dead</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => onSelectStatus('unknown')}>
        <Text className="text-lg py-3">Unknown</Text>
      </TouchableOpacity>
    </View>
  </Modal>
);

// SPECIES DROPDOWN MODAL COMPONENT
const SpeciesDropdown = ({ isVisible, onClose, onSelectSpecies }) => (
  <Modal visible={isVisible} transparent={true} onRequestClose={onClose}>
    <View className="bg-slate-50 p-5 rounded-lg absolute top-16 right-2 ">
      <TouchableOpacity onPress={() => onSelectSpecies('Human')}>
        <Text className="text-lg py-3">Human</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => onSelectSpecies('Alien')}>
        <Text className="text-lg py-3">Alien</Text>
      </TouchableOpacity>
    </View>
  </Modal>
);

// GENDER DROPDOWN MODAL COMPONENT
const GenderDropdown = ({ isVisible, onClose, onSelectGender }) => (
  <Modal visible={isVisible} transparent={true} onRequestClose={onClose}>
    <View className="bg-slate-50 p-5 rounded-lg absolute top-16 right-2 ">
      <TouchableOpacity onPress={() => onSelectGender('Male')}>
        <Text className="text-lg py-3">Male</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => onSelectGender('Female')}>
        <Text className="text-lg py-3">Female</Text>
      </TouchableOpacity>
    </View>
  </Modal>
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
          <TouchableOpacity className="justify-center items-center mr-2" onPress={(resetFilter)}>
            <Icon name="cancel" size={28} />
          </TouchableOpacity>
        </View>




          <View className="bg-emerald-600 w-11/12 self-center">
        <Text className=" text-lg text-center text-white font-extrabold uppercase p-1"> Filter </Text>
        </View>

        <View className="flex-row my-3 justify-evenly">

        <TouchableOpacity onPress={resetFilter}> 
        <Icon name="cancel" size={32} style={StyleSheet.create({ color:'#BCC02C' })} />
        </TouchableOpacity>

        <View className=" ">
        <Icon name="wc" size={32} style={StyleSheet.create({ color: '#BCC02C' })} onPress={openGenderDropdown} />
        <GenderDropdown
        isVisible={isGenderDropdownVisible}
        onClose={closeGenderDropdown}
        onSelectGender={handleSelectGender}
        />
        </View>

        <View className=" ">
        <Icon name="groups" size={32} style={StyleSheet.create({ color: '#BCC02C' })} onPress={openSpeciesDropdown} />
        <SpeciesDropdown
        isVisible={isSpeciesDropdownVisible}
        onClose={closeSpeciesDropdown}
        onSelectSpecies={handleSelectSpecies}
        />
        </View>

        <View className=" ">
        <Icon name="mood" size={32} style={StyleSheet.create({ color: '#BCC02C' })} onPress={openStatusDropdown} />
        <StatusDropdown
        isVisible={isStatusDropdownVisible}
        onClose={closeStatusDropdown}
        onSelectStatus={handleSelectStatus}
        />
        </View>

         <TouchableOpacity className=" " onPress={() => {setSortByABC(!sortByABC); fetchData(currentPage)}}> 
         <Icon name="abc" size={35} style={StyleSheet.create({ color: sortByABC ? "#1C93CD" : "#BCC02C" })} />
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
          onPress={() => setModalVisible(false)} />
          <Text className=" text-base bg-green-500 w-24 self-center text-center  rounded-full text-slate-200 font-black uppercase">{selectedChar.status} </Text>
            </View>
          <View className="items-center mb-8">
                      <Text className="text-4xl text-center font-extrabold text-slate-100 uppercase">{selectedChar.name} </Text>

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