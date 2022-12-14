
import React, { useState, useEffect } from 'react';
import { StyleSheet, Image, Text, TouchableOpacity, FlatList, View } from 'react-native';
import { Searchbar } from 'react-native-paper';
import { theme } from '../core/theme';
import Svg, { Path, Circle } from "react-native-svg"
import HomeCard from '../components/HomeCard';
import { useSelector, useDispatch } from 'react-redux';
import { fundHistoryApi,tranHistoryApi } from '../module/server/home_api';
import { transdetail } from '../redux/actions/user';
import LoadingCard from '../components/LoadingCard';

export default function TransactionhistoryScreen({ navigation, onView }) {
  cash_num= useSelector((store) => store.user.username);
  const dispatch=useDispatch();
  // const data = [
  //   { id: 1, avatar: "avatar.jpg", name: "Lisa Benson", date: '04 August, 2022', money: "25.95" },
  //   { id: 2, avatar: "avatar.jpg", name: "Cody Christian", date: '21 July, 2022', money: "40.21" },
  //   { id: 3, avatar: "avatar.jpg", name: "Abby Grahm", date: '16 July, 2022', money: "100.00" },
  //   { id: 4, avatar: "avatar.jpg", name: "Grace Jones", date: '08 July, 2022', money: "5.95" },
  // ];
  useEffect(() => {
    if(cash_num){
      fundHistory();
    }else{
      tranHistory();
    }
  }, [cash_num])
  const [data, setData] = useState([]);
  const [searchQuery, setSearchQuery] = React.useState('');
  const onChangeSearch = query => setSearchQuery(query);
  const fundHistory = async () => {
    const response = await fundHistoryApi();
    if (response.message) {
      const mid = [];
      for (let i = 0; i < response.value.length; i++) {
        mid.push({
          id: i + 1,
          avatar: "avatar.jpg",
          name: response.value[i].userName,
          type: response.value[i]['funds-transfer-type'],
          date: response.value[i]['settled-at'],
          money: response.value[i].amount,
        });
      }
      console.log(mid);
      setData(mid);
      return;
    }
    setMessage(response.value);
    handleOpenModalPress();
  }
  const tranHistory = async () => {
    const response = await tranHistoryApi();
    if (response.message) {
      const mid = [];
      for (let i = 0; i < response.value.length; i++) {
        mid.push({
          id: i + 1,
          avatar: "avatar.jpg",
          name: response.value[i].userName,
          type: response.value[i]['asset-transaction-type'],
          date: response.value[i]['settled-at'],
          money: response.value[i]['unit-count'],
        });
      }
      console.log(mid);
      setData(mid);
      return;
    }
    setMessage(response.value);
    handleOpenModalPress();
  }
  return (
    <View style={styles.container}>
      <View>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => { onView(1) }}>
            <Svg
              width={22}
              height={20}
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <Path
                d="M20.333 8.667H4.52l4.84-5.814a1.335 1.335 0 1 0-2.053-1.706l-6.667 8c-.045.063-.085.13-.12.2 0 .066 0 .106-.093.173-.06.153-.092.316-.094.48.002.164.033.327.094.48 0 .067 0 .107.093.173.035.07.075.137.12.2l6.667 8a1.333 1.333 0 0 0 1.026.48 1.333 1.333 0 0 0 1.027-2.186l-4.84-5.814h15.813a1.333 1.333 0 1 0 0-2.666Z"
                fill="#fff"
              />
            </Svg>
          </TouchableOpacity>
          <Text style={styles.text}>
            Transaction History
          </Text>
          <Svg
            width={34}
            height={34}
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <Circle cx={17} cy={17} r={17} fill="#141414" />
            <Path
              d="M20.617 23.836c.387.329 1 .329 1.387 0l3.668-3.11c.099-.08.179-.175.235-.282a.794.794 0 0 0-.187-.98 1.014 1.014 0 0 0-.327-.2 1.12 1.12 0 0 0-.78-.002 1.015 1.015 0 0 0-.328.197l-1.974 1.673V10.88a.83.83 0 0 0-.293-.622 1.073 1.073 0 0 0-.707-.258c-.265 0-.52.093-.707.258a.83.83 0 0 0-.293.622v10.252l-1.974-1.673a1.015 1.015 0 0 0-.329-.197 1.118 1.118 0 0 0-.78.003 1.014 1.014 0 0 0-.326.199.875.875 0 0 0-.214.295.786.786 0 0 0 .027.685.898.898 0 0 0 .235.282l3.668 3.11ZM13.35 10.258a1.073 1.073 0 0 0-.706-.257c-.265 0-.52.092-.707.257l-3.668 3.227a.824.824 0 0 0-.268.616c.005.228.11.445.293.607.183.161.43.253.69.257.259.004.51-.08.699-.236l1.96-1.725v10.198a.83.83 0 0 0 .293.622c.188.166.442.258.708.258.265 0 .52-.092.707-.258a.83.83 0 0 0 .293-.622V13.004l1.96 1.725c.19.156.44.24.7.236.259-.004.506-.096.69-.257a.832.832 0 0 0 .292-.607.824.824 0 0 0-.268-.616l-3.668-3.227Z"
              fill="#fff"
            />
          </Svg>
        </View>
        <Searchbar
          icon={TestIcon}
          clearIcon={ClearIcon}
          // icon={<></>}
          inputStyle={{ fontSize: theme.fontSize.smallSize }}
          style={styles.searchbar}
          elevation={0}
          placeholder="Type a name, username, or phone number "
          onChangeText={onChangeSearch}
          value={searchQuery}
        />
        {data.length?<FlatList style={styles.list}
          data={data}
          keyExtractor={(item) => {
            return item.id;
          }}
          renderItem={(list) => {
            const item = list.item;
            return (
              <TouchableOpacity onPress={()=>{
                dispatch(transdetail({
                  authToken:item.date,
                  midvalue:item.name,
                  midvalue2:item.type,
                  contactId:item.money
                }));
                navigation.navigate('TransactionDetailScreen');}}>
                <HomeCard item={item} />
              </TouchableOpacity>
            )
          }} />:<LoadingCard/>}
        <Text style={styles.subtitle}>
          no more transactions
        </Text>
      </View>
    </View>
  );
}
const ClearIcon=()=>null
const TestIcon = () => <Svg
width={20}
height={22}
fill="none"
xmlns="http://www.w3.org/2000/svg"
>
<Path
  d="m19.94 20.069-6.493-6.818A8.06 8.06 0 0 0 15 8.453c0-2.105-.783-4.08-2.198-5.568C11.387 1.397 9.502.578 7.5.578c-2.003 0-3.888.822-5.303 2.307C.78 4.371 0 6.348 0 8.453c0 2.103.782 4.082 2.197 5.568 1.415 1.488 3.298 2.307 5.303 2.307a7.212 7.212 0 0 0 4.567-1.628l6.493 6.815a.197.197 0 0 0 .29 0l1.09-1.142a.215.215 0 0 0 .06-.152.225.225 0 0 0-.06-.152Zm-8.48-7.458c-1.06 1.11-2.465 1.722-3.96 1.722s-2.9-.612-3.96-1.722A6 6 0 0 1 1.9 8.453c0-1.57.582-3.048 1.64-4.158C4.6 3.185 6.005 2.573 7.5 2.573s2.902.609 3.96 1.722a6 6 0 0 1 1.64 4.158c0 1.57-.583 3.048-1.64 4.158Z"
  fill="#000"
/>
</Svg>

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.backgroundColor,
    paddingHorizontal: 19,
    paddingVertical: 45,
  },
  header: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 50
  },
  text: {
    textAlign: 'center',
    color: theme.colors.whiteColor,
    fontSize: theme.fontSize.subtitle,
    fontWeight: theme.fontWeight.normal,
  },
  searchbar: {
    marginVertical: 40,
    shadowColor: theme.colors.whiteColor,
    borderColor: theme.colors.searchborderColor,
    borderWidth: 1,
    borderRadius: 10,
  },
  list: {

  },
  subtitle: {
    marginTop: 20,
    textAlign: 'center',
    color: theme.colors.lightgreytextColor,
    fontSize: theme.fontSize.content,
    fontWeight: theme.fontWeight.normal,
    opacity: 0.66,
    letterSpacing: 1.5
  },
});
