import { ScaledSheet } from 'react-native-size-matters';
import { colors } from '../../utils/colors';


export default ScaledSheet.create({

 datePicker:{
    marginRight:20,
    marginVertical:15,
    borderRadius:20,
    backgroundColor:colors.primary,
   
    alignSelf:'flex-end'
  },
  calenderBtns:{
    flexDirection:'row',
    justifyContent:'space-around',
    marginTop:'20@s'
  },

  calenderButton:{
    backgroundColor:colors.primary,
    alignSelf:'flex-end',
    flexDirection:'row',
    marginRight:'13@s',
    padding:'10@s',
    borderRadius:'20@s',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation:5,
  },
  calenderText:{
    color:colors.white,
    alignSelf:'center',
    marginLeft:'8@s',
    fontSize:'15@s',
    fontWeight:'bold'
  },

  resultBtn:{
    marginTop:'50@s',
    justifyContent:'center',
    alignSelf:'center',
    backgroundColor:colors.successGreen,
    marginRight:'13@s',
    padding:'10@s',
    borderRadius:'20@s',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation:5,
  }
});
